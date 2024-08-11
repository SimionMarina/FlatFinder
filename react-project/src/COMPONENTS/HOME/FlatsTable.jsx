import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { collection, query, where, getDocs,updateDoc,doc,getDoc,documentId } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../CONTEXT/authContext";
import { IconButton } from "@mui/material";
import { Delete, Edit, Favorite, FavoriteBorder, Visibility } from "@mui/icons-material";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
function FlatsTable({tableType}) {
  const [flats, setFlats] = useState([]);
  const { currentUser} = useAuth();
  const [loading, setLoading] = useState(true);
  

  useEffect(()=>{
    const fetchFlats = async () => {
      setLoading(true);
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
      setLoading(false);
    }

    fetchFlats();
  },[tableType, currentUser])

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
    // console.log(id)
    
    const userCollection = doc(db,'users',currentUser.uid);
    const data = await getDoc(userCollection);
    const user = data.data();
    const favorites = user.favorites
    if(!favorites.includes(id)){
      let userToUpdate = doc(db,'users',currentUser.uid);
      await updateDoc(userToUpdate,{favorites: [...favorites,id]});
    } else {
      console.log("nu a mers")
    }
   
  };
  const handleDeleteFavorite = (e) =>{
    console.log(e)
  }
  const columns = [
    { field: "city", headerName: "City", width: 100 },
    { field: "streetName", headerName: "Street Name", width: 100 },
    { field: "streetNumber", headerName: "Street Number", width: 100 },
    { field: "areaSize", headerName: "Area Size", width: 100 },
    { field: "hasAc", headerName: "Has AC", width: 100 },
    { field: "yearBuild", headerName: "Year Built", width: 100 },
    { field: "rentPrice", headerName: "Rent Price", width: 100 },
    { field: "dateAvailable", headerName: "Date Available", width: 100 },
    {
      field: "view",
      headerName: "View",
      width: 80,
      renderCell: (params) => (
        <IconButton onClick={() => handleView(params.row.id)}>
          <Visibility />
        </IconButton>
      ),
    },
    
  ];
// Conditionally add Edit and Delete columns if the table is showing the user's flats
if (tableType === "myFlats") {
  columns.push(
    {
      field: "edit",
      headerName: "Edit",
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => handleEdit(params.row.id)}>
          <Edit />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 100,
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
    headerName: "Favorite",
    width: 100,
    renderCell: (params) => (
      <IconButton onClick={() => handleDeleteFavorite(params.row.id)}>
       <HeartBrokenIcon />
      </IconButton>
    ),
  });
}
  return (
    <div style={{ height: 400, width: "80%", margin: "auto" }}>
      <DataGrid rows={flats} columns={columns} pageSize={5} loading={loading} />
    </div>
  )
}

export default FlatsTable
