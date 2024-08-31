import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  documentId,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../CONTEXT/authContext";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton } from "@mui/material";
import {
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  Visibility,
} from "@mui/icons-material";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { useNavigate } from "react-router-dom";
import EditFlat from "./EditFlat";
import "./Home.css";

function FlatsTable({ tableType, refetchFlag }) {
  const [flats, setFlats] = useState([]);
  const { currentUser } = useAuth();
  const [role, setRole] = useState("user");
  const [favorites, setFavorites] = useState([]);
  const [editFlatId, setEditFlatId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const fetchFlats = async () => {
    let foundFlats;
    let searchFlats;
    if (tableType === "all") {
      searchFlats = query(collection(db, "flats"));
      foundFlats = await getDocs(searchFlats);
    } else if (tableType === "myFlats" && currentUser) {
      searchFlats = query(
        collection(db, "flats"),
        where("userUid", "==", currentUser.uid)
      );
      foundFlats = await getDocs(searchFlats);
    } else if (tableType === "favorites" && currentUser) {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();
      if (userData.favorites && userData.favorites.length > 0) {
        searchFlats = query(
          collection(db, "flats"),
          where(documentId(), "in", userData.favorites)
        );
        foundFlats = await getDocs(searchFlats);
      } else {
        searchFlats = null;
        foundFlats = null;
      }
    }

    if (foundFlats) {
      const flatsList = foundFlats.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFlats(flatsList);
    } else {
      setFlats([]);
    }

    if (currentUser) {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const userData = userDoc.data();
      if (userData?.favorites.length > 0) {
        setFavorites(userData.favorites);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role || "user");
    }
   

    fetchFlats();
  }, [tableType, currentUser, role, refetchFlag]);
  
  const handleEdit = (id) => {
    setEditFlatId(id);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    fetchFlats();
    setIsEditModalOpen(false);
    setEditFlatId(null);
  };

  const handleUpdateFlat = async (updatedFlat) => {
    try {
      const flatDocRef = doc(db, "flats", updatedFlat.id);
      await updateDoc(flatDocRef, updatedFlat);
  
      // Actualizează starea flats imediat după ce flat-ul a fost actualizat în Firestore
      setFlats((prevFlats) =>
        prevFlats.map((flat) => (flat.id === updatedFlat.id ? updatedFlat : flat))
      );
  
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating flat: ", error);
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "flats", id));
      setFlats(flats.filter((flat) => flat.id !== id));
    } catch (error) {
      console.error("Error deleting flat: ", error);
    }
  };

  const handleToggleFavorite = async (id) => {
    const userToUpdate = doc(db, "users", currentUser.uid);
    let updatedFavorites = [...favorites];

    if (!favorites.includes(id)) {
      updatedFavorites.push(id);
      await updateDoc(userToUpdate, { favorites: updatedFavorites });
    } else {
      updatedFavorites = updatedFavorites.filter((favId) => favId !== id);
      await updateDoc(userToUpdate, { favorites: updatedFavorites });
    }

    setFavorites(updatedFavorites);

    if (tableType === "favorites") {
      setFlats(flats.filter((flat) => flat.id !== id));
    }
  };

  const handleDeleteFavorite = async (id) => {
    if (!currentUser) return;

    try {
      const userToUpdate = doc(db, "users", currentUser.uid);
      const data = await getDoc(userToUpdate);
      const user = data.data();
      const updatedFavorites = user.favorites.filter((favId) => favId !== id);

      await updateDoc(userToUpdate, { favorites: updatedFavorites });

      setFavorites(updatedFavorites);

      if (tableType === "favorites") {
        setFlats(flats.filter((flat) => flat.id !== id));
      }
    } catch (error) {
      console.error("Error deleting favorite: ", error);
    }
  };

  const columns = [
    {
      field: "city",
      headerName: "City",
      headerClassName: "header-style",
      cellClassName: "cell-style",
      width: 130,
    },
    {
      field: "streetName",
      headerName: "St. Name",
      width: 130,
      headerClassName: "header-style",
      cellClassName: "cell-style",
    },
    {
      field: "streetNumber",
      headerName: "St. No.",
      headerClassName: "header-style",
      cellClassName: "cell-style",
      width: 100,
    },
    {
      field: "areaSize",
      headerName: "Area Size",
      headerClassName: "header-style",
      cellClassName: "cell-style",
      width: 108,

    },
    {
      field: "hasAc",
      headerName: "Has AC",
      headerClassName: "header-style",
      cellClassName: "cell-style",
    },
    {
      field: "yearBuild",
      headerName: "Year Built",
      headerClassName: "header-style",
      cellClassName: "cell-style",
      width: 112,

    },
    {
      field: "rentPrice",
      headerName: "Rent Price",
      headerClassName: "header-style",
      cellClassName: "cell-style",
      width: 113,
    },
    {
      field: "dateAvailable",
      headerName: "Date Available",
      headerClassName: "header-style",
      cellClassName: "cell-style",
      width: 140,
    },
    {
      field: "view",
      headerName: "View",
      renderCell: (params) => (
        <IconButton onClick={() => navigate(`/flats/${params.row.id}`)}>
          <Visibility className="action__icon__view" />
        </IconButton>
      ),
      headerClassName: "header-style",
      cellClassName: "cell-style",
      width: 80,

    },
  ];

  if (tableType === "all") {
    columns.push({
      field: "favorite",
      headerName: "Favorite",
      headerClassName: "header-style",
      cellClassName: "cell-style",
      width: 100,
      renderCell: (params) => {
        const isOwner = params.row.userUid === currentUser.uid;
        if (!isOwner) {
          return (
            <IconButton onClick={() => handleToggleFavorite(params.row.id)}>
              {favorites.includes(params.row.id) ? (
                <Favorite style={{ color: "red" }} />
              ) : (
                <FavoriteBorder className="action__icon__favorite" />
              )}
            </IconButton>
          );
        }
        return null;
      },
    });
  }

  if (tableType === "myFlats") {
    columns.push(
      {
        field: "edit",
        headerName: "Edit",
        headerClassName: "header-style",
        cellClassName: "cell-style",
        width: 80,
        renderCell: (params) => (
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <Edit className="action__icon__edit" />
          </IconButton>
        ),
      },
      {
        field: "delete",
        headerName: "Delete",
        headerClassName: "header-style",
        cellClassName: "cell-style",
        width: 90,
        renderCell: (params) => (
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete className="action__icon__delete" />
          </IconButton>
        ),
      }
    );
  }

  if (tableType === "favorites") {
    columns.push({
      field: "favorite",
      headerName: "Delete Favorite",
      headerClassName: "header-style",
      cellClassName: "cell-style",
      width: 140,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteFavorite(params.row.id)}>
          <HeartBrokenIcon style={{ color: "red" }} />
        </IconButton>
      ),
    });
  }

  return (
    <div style={{ height: 375, width: "80%", margin: "auto" }}>
      <DataGrid
      sx={{
        '.MuiDataGrid-menuIcon': {
          visibility: 'visible !important',
          width: "auto !important"
        },
       overflow: 'clip', backgroundColor: "rgba(242, 238, 233, 0.4)"

      }}
        rows={flats}
        columns={columns}
        pageSize={5}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
      />

      {/* Modal for Editing Flat */}
      {editFlatId && (
        <EditFlat
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        flatId={editFlatId}
        onUpdate={handleUpdateFlat}
      />
      
      )}
    </div>
  );
}

export default FlatsTable;
