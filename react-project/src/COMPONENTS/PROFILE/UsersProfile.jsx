import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, query, where, getDocs, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase'; 
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, Button, Snackbar, Alert,Dialog,DialogContentText } from '@mui/material';
import Header from '../HEADER/Header';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
function UsersProfile() {
    const { userUId } = useParams(); 
    const [userData, setUserData] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate(); 



    useEffect(() => {
        const fetchUserData = async () => {
            if (userUId) {
                console.log(userUId);
                try {
                    const userDocRef = doc(db, "users", userUId);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = { uid: userUId, ...userDoc.data() };
                        const flatsQuery = query(collection(db, "flats"), where("userUid", "==", userUId));
                        const flatsSnapshot = await getDocs(flatsQuery);
                        const flatsData = flatsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));

                        setUserData({ ...userData, flats: flatsData });
                    } else {
                        console.error("No such user!");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };

        fetchUserData();
    }, [userUId]);


    const handleMakeAdmin = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    }

    const handleSave = async () => {
        try {
            const userDocRef = doc(db, "users", userUId);
            await updateDoc(userDocRef, { role: 'admin' });
            setUserData(prevState => ({ ...prevState, role: 'admin' }));
            setSnackbarMessage('User role updated to admin');
            setOpenSnackbar(true);
            handleClose();
        } catch (error) {
            console.error("Error updating user role:", error);
            setSnackbarMessage('Failed to update user role');
            setOpenSnackbar(true);
        }
    }

    const handleRemoveUser = async () => {
        setIsRemoveDialogOpen(true);
    };

    const handleCloseRemoveDialog = () => {
        setIsRemoveDialogOpen(false);
    }

    const handleSaveRemoveUser = async () => {
        try {
            const userDocRef = doc(db, "users", userUId);
            
            const batch = writeBatch(db);
            
            batch.delete(userDocRef);

            const flatsQuery = query(collection(db, "flats"), where("userUid", "==", userUId));
            const flatsSnapshot = await getDocs(flatsQuery);

            flatsSnapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            // Execute batch
            await batch.commit();

            setSnackbarMessage('User and associated flats removed successfully');
            setOpenSnackbar(true);
            setUserData(null); // Reset userData after deletion

            navigate('/all-users');
        } catch (error) {
            console.error("Error removing user:", error);
            setSnackbarMessage('Failed to remove user');
            setOpenSnackbar(true);
        }
    }

    if (!userData) {
        return <Typography variant="h6">Loading user data...</Typography>;
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 , headerClassName: "header-style-allUsers header-style-table", cellClassName: "cell-style-allUsers cell-style-table", },
        { field: 'city', headerName: 'City', width: 100,headerClassName: "header-style-allUsers header-style-table", cellClassName: "cell-style-allUsers cell-style-table", },
        { field: 'streetName', headerName: 'Street Name', width: 130,headerClassName: "header-style-allUsers header-style-table", cellClassName: "cell-style-allUsers cell-style-table", },
        { field: 'streetNumber', headerName: 'Street No.', width: 120,headerClassName: "header-style-allUsers header-style-table", cellClassName: "cell-style-allUsers cell-style-table", },
        { field: 'areaSize', headerName: 'Area Size', width: 110,headerClassName: "header-style-allUsers header-style-table", cellClassName: "cell-style-allUsers cell-style-table", },
        { field: 'rentPrice', headerName: 'Rent Price', width: 125,headerClassName: "header-style-allUsers header-style-table", cellClassName: "cell-style-allUsers cell-style-table", },
        { field: 'yearBuild', headerName: 'Year Built', width: 130,headerClassName: "header-style-allUsers header-style-table", cellClassName: "cell-style-allUsers cell-style-table", },
        { field: 'dateAvailable', headerName: 'Date Available', width: 180,headerClassName: "header-style-allUsers header-style-table", cellClassName: "cell-style-allUsers cell-style-table", },
        { field: 'hasAc', headerName: 'Has AC',headerClassName: "header-style-allUsers header-style-table", cellClassName: "cell-style-allUsers cell-style-table" ,width: 130, renderCell: (params) => (params.value ? 'Yes' : 'No') },
    ];

    return (
        <div>
            <div className='background__container__home'>
                <Header></Header>
                <KeyboardReturnIcon
                onClick={() => navigate("/all-users")}
                sx={{
                 color:"gray",
                 margin:"10px 20px",
                 cursor:"pointer"
                }}></KeyboardReturnIcon>

                <Typography variant="h4" sx={{color: "rgb(82, 22, 139)",  margin:"0 135px 0", fontFamily:"inherit", backgroundColor:"#f1f3f4", borderTopLeftRadius: "40px", borderTopRightRadius: "40px",padding:"10px", textAlign:"center"}}>PROFILE OF {userData.fullName}</Typography>
                <div style={{display:"flex", flexDirection:"column", backgroundColor:"#f1f3f4", margin:"0 135px", }}>
                    <div className='users__details' 
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        color:"black",
                        }}>
                        <div>
                            <PersonOutlineIcon sx={{ fontSize:"160px", color:"rgb(82, 22, 139)"}}></PersonOutlineIcon>
                        </div>
                            <div>
                                <Typography variant="h6" sx={{fontFamily:"inherit", mt:"15px"}}>UID: {userData.uid}</Typography>
                                <Typography variant="h6" sx={{fontFamily:"inherit"}}>Email: {userData.email}</Typography>
                                <Typography variant="h6" sx={{fontFamily:"inherit"}}>Birth Date: {userData.birthDate}</Typography>
                                <Typography variant="h6" sx={{fontFamily:"inherit"}}>Role: {userData.role}</Typography>
                            </div>
                       
    <Box sx={{ display: 'flex', gap: 2, textAlign:"center", height:"50px", marginTop:"100px" }}>
                    {userData.role === 'user' && (
                        <>
                            <Button 
                                variant="contained" 
                                sx={{backgroundColor:"green", fontFamily:"inherit"}} 
                                onClick={handleMakeAdmin}
                            >
                                Make Admin
                            </Button>
                            <Button 
                                variant="contained" 
                                sx={{backgroundColor:"red",fontFamily:"inherit"}}
                                onClick={handleRemoveUser}
                            >
                                Remove User
                            </Button>
                        </>
                    )}
                </Box>
                            </div>
                    <Typography variant="h5" sx={{color:"rgb(82, 22, 139)", fontFamily:"inherit", padding:"10px"}}>USER FLATS:</Typography>
                </div>
                
                <Box sx={{ height: 300, width: '82.5%', margin: "auto", }}>
                    <DataGrid
                        rows={userData.flats}
                        columns={columns}
                        pageSize={5}
                        density='compact'
                        hideFooterPagination
                        rowsPerPageOptions={[5, 10]}
                        disableSelectionOnClick
                        sx={{
                            '.MuiDataGrid-menuIcon': {
                              visibility: 'visible !important',
                              width: 'auto !important',
                            }, overflow: 'clip', backgroundColor: 'white',
                        }}
                    />
                </Box>

                <Dialog
        open={isDialogOpen}
        keepMounted
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSave,
          sx: { backgroundColor: "#f2eee9", borderRadius: "30px" }, // modal background
        }}
        sx={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
          <DialogContentText
            sx={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                padding:"30px",
                margin: "5px",
                color: "#8a2be2",
                fontFamily: "inherit",
                fontSize: "20px",
            }}
          >
            
            Are you sure you want to make this user admin? 
            <div>
                <Button onClick={handleSave} sx={{color:"green",fontSize:"16px"}}>Yes</Button>
                <Button onClick={handleClose} sx={{color:"red",fontSize:"16px"}}>Cancel</Button>
            </div>
          </DialogContentText>
    </Dialog>

    <Dialog
        open={isRemoveDialogOpen}
        keepMounted
        onClose={handleCloseRemoveDialog}
        PaperProps={{
          component: "form",
          onSubmit: handleSave,
          sx: { backgroundColor: "#f2eee9", borderRadius: "30px" }, // modal background
        }}
        sx={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
          <DialogContentText
            sx={{
                display:"flex",
                flexDirection:"column",
                justifyContent:"center",
                alignItems:"center",
                padding:"30px",
                margin: "5px",
                color: "#8a2be2",
                fontFamily: "inherit",
                fontSize: "20px",
            }}
          >
            
            Are you sure you want to remove this user? 
            <div>
                <Button onClick={handleSaveRemoveUser} sx={{color:"green",fontSize:"16px"}}>Yes</Button>
                <Button onClick={handleCloseRemoveDialog} sx={{color:"red",fontSize:"16px"}}>Cancel</Button>
            </div>
          </DialogContentText>
    </Dialog>
                
    
                {/* Snackbar pentru mesaje */}
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

            </div>
        </div>
    );
}

export default UsersProfile;
