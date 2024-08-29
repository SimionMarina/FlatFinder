import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, query, where, getDocs, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase'; // Importă configurarea Firestore
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Box, Button, Snackbar, Alert } from '@mui/material';
import Header from '../HEADER/Header';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

function UsersProfile() {
    const { userUId } = useParams(); // Obține `userUId` din URL
    const [userData, setUserData] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate(); // Initializează funcția de navigare

    useEffect(() => {
        const fetchUserData = async () => {
            if (userUId) {
                console.log(userUId);
                try {
                    // Referință la documentul utilizatorului
                    const userDocRef = doc(db, "users", userUId);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = { uid: userUId, ...userDoc.data() };
                        const flatsQuery = query(collection(db, "flats"), where("userUid", "==", userUId));
                        const flatsSnapshot = await getDocs(flatsQuery);
                        // Include ID-ul documentului în datele utilizatorului
                        const flatsData = flatsSnapshot.docs.map(doc => ({
                            id: doc.id, // Adaugă ID-ul documentului
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

    // Funcția pentru actualizarea rolului utilizatorului
    const handleMakeAdmin = async () => {
        try {
            const userDocRef = doc(db, "users", userUId);
            await updateDoc(userDocRef, { role: 'admin' });
            setUserData(prevState => ({ ...prevState, role: 'admin' }));
            setSnackbarMessage('User role updated to admin');
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error updating user role:", error);
            setSnackbarMessage('Failed to update user role');
            setOpenSnackbar(true);
        }
    };

    // Funcția pentru ștergerea utilizatorului
    const handleRemoveUser = async () => {
        try {
            const userDocRef = doc(db, "users", userUId);
            
            // Crează un batch de operații
            const batch = writeBatch(db);
            
            // Șterge documentul utilizatorului
            batch.delete(userDocRef);

            // Șterge apartamentele asociate cu utilizatorul
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

            // Navighează înapoi la pagina cu toți utilizatorii
            navigate('/all-users'); // Înlocuiește cu ruta reală pentru lista de utilizatori
        } catch (error) {
            console.error("Error removing user:", error);
            setSnackbarMessage('Failed to remove user');
            setOpenSnackbar(true);
        }
    };

    // Returnează un loader până când datele sunt preluate
    if (!userData) {
        return <Typography variant="h6">Loading user data...</Typography>;
    }

    // Definirea coloanelor pentru DataGrid
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 , headerClassName: "header-style", cellClassName: "cell-style", },
        { field: 'city', headerName: 'City', width: 150,headerClassName: "header-style", cellClassName: "cell-style", },
        { field: 'streetName', headerName: 'Street Name', width: 180,headerClassName: "header-style", cellClassName: "cell-style", },
        { field: 'streetNumber', headerName: 'Street Number', width: 130,headerClassName: "header-style", cellClassName: "cell-style", },
        { field: 'areaSize', headerName: 'Area Size', width: 130,headerClassName: "header-style", cellClassName: "cell-style", },
        { field: 'rentPrice', headerName: 'Rent Price', width: 130,headerClassName: "header-style", cellClassName: "cell-style", },
        { field: 'yearBuild', headerName: 'Year Built', width: 130,headerClassName: "header-style", cellClassName: "cell-style", },
        { field: 'dateAvailable', headerName: 'Date Available', width: 180,headerClassName: "header-style", cellClassName: "cell-style", },
        { field: 'hasAc', headerName: 'Has AC',headerClassName: "header-style", cellClassName: "cell-style" ,width: 130, renderCell: (params) => (params.value ? 'Yes' : 'No') },
    ];

    return (
        <div>
            <div className='background__container'>
                <Header></Header>
                <Typography variant="h4" sx={{color:"red",  margin:"50px 150px 0px 150px", fontFamily:"Times New Roman", backdropFilter:"blur(8px)",padding:"10px", textAlign:"center"}}>Profile of {userData.fullName}</Typography>
                <div style={{display:"flex", flexDirection:"column", backdropFilter:"blur(8px)", margin:"0 135px", }}>
                    <div className='users__details' 
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        color:"white",
                        backdropFilter: "blur(8px)",
                        margin: "0 140px 0 130px",
                        }}>
                        <div>
                            <PersonOutlineIcon sx={{ fontSize:"160px", color:"wheat"}}></PersonOutlineIcon>
                        </div>
                            <div>
                                <Typography variant="h6" sx={{fontFamily:"inherit", mt:"15px"}}>UID: {userData.uid}</Typography>
                                <Typography variant="h6" sx={{fontFamily:"inherit"}}>Email: {userData.email}</Typography>
                                <Typography variant="h6" sx={{fontFamily:"inherit"}}>Birth Date: {userData.birthDate}</Typography>
                                <Typography variant="h6" sx={{fontFamily:"inherit"}}>Role: {userData.role}</Typography>
                            </div>
                       
    {/* Butoane de acțiune */}
    <Box sx={{ display: 'flex', gap: 2, textAlign:"center", height:"50px", marginTop:"100px" }}>
                    {userData.role === 'user' && (
                        <>
                            <Button 
                                variant="contained" 
                                sx={{backgroundColor:"green", fontFamily:"inherit"}}                                onClick={handleMakeAdmin}
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
                    <Typography variant="h5" sx={{color:"white", fontFamily:"inherit", padding:"10px"}}>User Flats:</Typography>
                </div>
                
                <Box sx={{ height: 300, width: '82.2%', margin: "auto", color:"white" }}>
                    <DataGrid
                        rows={userData.flats}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5, 10]}
                        disableSelectionOnClick
                        sx={{ overflow: 'clip', }}
                    />
                </Box>
    
                
    
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
