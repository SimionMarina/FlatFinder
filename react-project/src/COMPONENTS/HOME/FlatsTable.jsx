/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
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
import { IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Stack, Checkbox, FormControlLabel } from "@mui/material";
import { Delete, Edit, Favorite, FavoriteBorder, Visibility } from "@mui/icons-material";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { useNavigate } from "react-router-dom";
import './FlatsTable.css'


function FlatsTable({ tableType }) {
  const [flats, setFlats] = useState([]);
  const { currentUser } = useAuth();
  const [role, setRole] = useState("user");
  const [favorites, setFavorites] = useState([]);
  const [editFlatId, setEditFlatId] = useState(null);
  const [editFlatData, setEditFlatData] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role || "user");
    }
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
        setFlats(null);
      }

      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();
        if (userData?.favorites.length > 0) {
          setFavorites(userData.favorites);
        }
      }
    };

    fetchFlats();
  }, [tableType, currentUser, role]);

  const handleEdit = async (id) => {
    const flatDoc = await getDoc(doc(db, "flats", id));
    if (flatDoc.exists()) {
      setEditFlatData(flatDoc.data());
      setEditFlatId(id);
      setIsEditModalOpen(true);
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditFlatData({});
  };

  const handleChangeEdit = (event) => {
    const { name, value } = event.target;
    setEditFlatData({ ...editFlatData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    setEditFlatData({ ...editFlatData, hasAc: event.target.checked });
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "flats", editFlatId), editFlatData);
      setFlats(flats.map((flat) => (flat.id === editFlatId ? { ...flat, ...editFlatData } : flat)));
      handleCloseEditModal();
    } catch (error) {
      console.error("Error updating flat: ", error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id);
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
    { field: "city", headerName: "City",  headerClassName: 'header-style', cellClassName: 'cell-style',width:130 },
    { field: "streetName", headerName: "Street Name", width: 150, headerClassName: 'header-style', cellClassName: 'cell-style' },
    { field: "streetNumber", headerName: "Street Number" , headerClassName: 'header-style', cellClassName: 'cell-style',width:130},
    { field: "areaSize", headerName: "Area Size", headerClassName: 'header-style', cellClassName: 'cell-style' },
    { field: "hasAc", headerName: "Has AC", headerClassName: 'header-style', cellClassName: 'cell-style' },
    { field: "yearBuild", headerName: "Year Built", headerClassName: 'header-style', cellClassName: 'cell-style'},
    { field: "rentPrice", headerName: "Rent Price", headerClassName: 'header-style', cellClassName: 'cell-style', width:100 },
    { field: "dateAvailable", headerName: "Date Available", headerClassName: 'header-style', cellClassName: 'cell-style',width:130 },
    {
      field: "view",
      headerName: "View",
      
      renderCell: (params) => (
        <IconButton 
          onClick={() => {
            navigate(`/flats/${params.row.id}`);
          }}
        >
          <Visibility className="action__icon" />
        </IconButton>
      ),
      headerClassName: 'header-style',
    cellClassName: 'cell-style'
    },
  ];

  if (tableType === "all") {
    columns.push({
      field: "favorite",
      headerName: "Favorite",
       headerClassName: 'header-style',
    cellClassName: 'cell-style',
    width:170,
      renderCell: (params) => {
        const isOwner = params.row.userUid === currentUser.uid;
        if (!isOwner) {
          return (
            <IconButton onClick={() => handleToggleFavorite(params.row.id)}>
              {favorites.includes(params.row.id) ? (
                <Favorite style={{ color: "red" }} />
              ) : (
                <FavoriteBorder className="action__icon" />
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
         headerClassName: 'header-style',
    cellClassName: 'cell-style',
        renderCell: (params) => (
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <Edit className="action__icon" />
          </IconButton>
        ),
      },
      {
        field: "delete",
        headerName: "Delete",
         headerClassName: 'header-style',
    cellClassName: 'cell-style',
        renderCell: (params) => (
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete className="action__icon"/>
          </IconButton>
        ),
      }
    );
  }

  if (tableType === "favorites") {
    columns.push({
      field: "favorite",
      headerName: "Delete Favorite",
      headerClassName: 'header-style',
      cellClassName: 'cell-style',
      width:186,
      renderCell: (params) => (
        <IconButton onClick={() => handleDeleteFavorite(params.row.id)}>
          <HeartBrokenIcon style={{ color: "red" }} />
        </IconButton>
      ),
    });
  }

  return (
    <div style={{ height: 360, width: "80%", margin: "auto" }}>
      <DataGrid
        rows={flats}
        columns={columns}
        pageSize={5}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 6,
            },
          },
        }}
        pageSizeOptions={[5]}
      />

      {/* Modal for Editing Flat */}
      <Dialog
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        PaperProps={{
          component: "form",
          onSubmit: (e) => {
            e.preventDefault();
            handleSave();
          },
        }}
      >
        <DialogTitle>Edit Flat</DialogTitle>
        <DialogContent>
          <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
            <TextField
              autoFocus
              required
              margin="dense"
              name="city"
              label="City"
              type="text"
              fullWidth
              variant="outlined"
              value={editFlatData.city || ''}
              onChange={handleChangeEdit}
            />
            <TextField
              required
              margin="dense"
              name="streetName"
              label="Street Name"
              type="text"
              fullWidth
              variant="outlined"
              value={editFlatData.streetName || ''}
              onChange={handleChangeEdit}
            />
            <TextField
              required
              margin="dense"
              name="streetNumber"
              label="Street Number"
              type="number"
              fullWidth
              variant="outlined"
              value={editFlatData.streetNumber || ''}
              onChange={handleChangeEdit}
            />
          </Stack>

          <TextField
            required
            margin="dense"
            name="areaSize"
            label="Area Size"
            type="number"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
            value={editFlatData.areaSize || ''}
            onChange={handleChangeEdit}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={editFlatData.hasAc || false}
                onChange={handleCheckboxChange}
                name="hasAc"
                color="primary"
              />
            }
            label="Has AC"
            sx={{ marginTop: 2 }}
          />

          <TextField
            required
            margin="dense"
            name="yearBuild"
            label="Year Built"
            type="number"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
            value={editFlatData.yearBuild || ''}
            onChange={handleChangeEdit}
          />
          <TextField
            required
            margin="dense"
            name="rentPrice"
            label="Rent Price"
            type="number"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
            value={editFlatData.rentPrice || ''}
            onChange={handleChangeEdit}
          />
          <TextField
            required
            margin="dense"
            name="dateAvailable"
            label="Date Available"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginTop: 2 }}
            value={editFlatData.dateAvailable || ''}
            onChange={handleChangeEdit}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FlatsTable;
