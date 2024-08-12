/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { collection, query, where, getDocs,updateDoc,doc,getDoc,documentId } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../CONTEXT/authContext";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import { Delete, Edit, Favorite, FavoriteBorder, Visibility } from "@mui/icons-material";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

function FlatsTable({tableType}) {
  const [flats, setFlats] = useState([]);
  const { currentUser} = useAuth();
  const [role, setRole] = useState("user");
  const [favorites, setFavorites] = useState([]);

  useEffect(()=>{
    if(currentUser){
      setRole(currentUser.role || "user");
    }
    const fetchFlats = async () => {
      
      let searchFlats;
      if(tableType === "all"){
        searchFlats = query(collection(db, "flats"));
      }else if (tableType === "myFlats" && currentUser) {
        searchFlats = query(collection(db, "flats"), where("uid", "==", currentUser.uid));
       
      } else if (tableType === "favorites" && currentUser) {
        // Fetch the user's document to get the list of favorite flat UIDs
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();
      if (userData?.favorites && userData.favorites.length > 0) {
        // Use the list of UIDs to fetch the favorite flats
        searchFlats = query(
          collection(db, "flats"),
          where(documentId(), "in", userData.favorites)
        );
      } else {
        searchFlats = null;
      }
      }
      const foundFlats = await getDocs(searchFlats);
      const flatsList = foundFlats.docs.map(doc => ({id: doc.id, ...doc.data()}));
      

      setFlats(flatsList);
      
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        if (userData?.favorites) {
          setFavorites(userData.favorites);
        }
      }
    }
    
    fetchFlats();
  },[tableType, currentUser, role])

  const handleView = (id) => {
    console.log(id);
    
  };

  const handleEdit = (id) => {
    console.log(id);

    
  };

  const handleDelete = async (id) => {
    console.log(id);

  
  };

  const handleToggleFavorite = async (id) => {
    const userToUpdate = doc(db, 'users', currentUser.uid);
    let updatedFavorites = [...favorites];

    if (!favorites.includes(id)) {
      updatedFavorites.push(id);
      await updateDoc(userToUpdate, { favorites: updatedFavorites });
    } else {
      updatedFavorites = updatedFavorites.filter(favId => favId !== id);
      await updateDoc(userToUpdate, { favorites: updatedFavorites });
    }

    setFavorites(updatedFavorites); 
  };
  const handleDeleteFavorite = async (id) => {
    if (!currentUser) return;
  
    try {
      const userToUpdate = doc(db, 'users', currentUser.uid);
      const data = await getDoc(userToUpdate);
      const user = data.data();
      const updatedFavorites = user.favorites.filter(favId => favId !== id);
  
      // Update favorites in database
      await updateDoc(userToUpdate, { favorites: updatedFavorites });
  
      // Update local favorites array
      setFavorites(updatedFavorites);
  
      //when show the favorites table update flats list
      if (tableType === "favorites") {
        setFlats(flats.filter(flat => flat.id !== id));
      }
    } catch (error) {
      console.error("Eroare la ștergerea favoritei: ", error);
    }
  };
  const columns = [
    { field: "city", headerName: "City" },
    { field: "streetName", headerName: "Street Name" },
    { field: "streetNumber", headerName: "Street Number" },
    { field: "areaSize", headerName: "Area Size" },
    { field: "hasAc", headerName: "Has AC" },
    { field: "yearBuild", headerName: "Year Built" },
    { field: "rentPrice", headerName: "Rent Price" },
    { field: "dateAvailable", headerName: "Date Available" },
    {
      field: "view",
      headerName: "View",
      renderCell: (params) => (
        <IconButton onClick={() => handleView(params.row.id)}>
          <Visibility />
        </IconButton>
      ),
    },
    
  ];
  if (tableType === "all"){
    columns.push({
      field: "favorite",
      headerName: "Favorite",
      renderCell: (params) => (
        <IconButton onClick={() => handleToggleFavorite(params.row.id)}>
          {favorites.includes(params.row.id) ? (
            <Favorite style={{ color: 'red' }} /> // Iconiță roșie dacă e în favorite
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      ),
    });
  }
// Conditionally add Edit and Delete columns if the table is showing the user's flats
if (tableType === "myFlats") {
  columns.push(
    {
      field: "edit",
      headerName: "Edit",
      renderCell: (params) => (
        <IconButton onClick={() => handleEdit(params.row.id)}>
          <Edit />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params) => (
        <IconButton onClick={() => handleDelete(params.row.id)}>
          <Delete />
        </IconButton>
      ),
    }
  );
}

// Conditionally add the Favorite column if the table is not "myFlats"
if (tableType == "favorites") {
  columns.push({
    field: "favorite",
    headerName: "Delete Favorite",
    renderCell: (params) => (
      <IconButton onClick={() => handleDeleteFavorite(params.row.id)}>
       <HeartBrokenIcon style={{ color: 'red' }}/>
      </IconButton>
    ),
  });
}
  return (
    <div style={{ height: 400, width: "80%", margin: "auto" }}>
      <DataGrid rows={flats} columns={columns} pageSize={5}/>
    </div>
  )
}

export default FlatsTable