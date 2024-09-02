import React, { useEffect, useState } from 'react'
import Header from '../HEADER/Header';
import './AllUsers.css'
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { IconButton } from "@mui/material";
import '../PROFILE/UsersProfile';
import { useNavigate,Link } from 'react-router-dom';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';



function AllUsers() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
      const fetchUsers = async () => {
          const usersCollection = collection(db, "users");
          const userSnapShot = await getDocs(usersCollection);
          const usersList = await Promise.all(userSnapShot.docs.map(async (doc) => {
              const userData = doc.data();
              const flatsCollection = collection(db, "flats");
              const flatsQuery = query(flatsCollection, where("userUid", "==", doc.id));
              const flatsSnapshot = await getDocs(flatsQuery);
              const flatsCount = flatsSnapshot.size;
  
              return { id: doc.id, ...userData, flatsCount };
          }));
          setUsers(usersList);
      };
      fetchUsers();
  }, []);
  
   
  const columns = [
    { field: 'fullName', headerName: 'Name', width: 170, headerClassName: 'header-style-allUsers', cellClassName: 'cell-style-allUsers' },
    { field: 'email', headerName: 'Email', width: 170, headerClassName: 'header-style-allUsers', cellClassName: 'cell-style-allUsers' },
    { field: 'flatsCount', headerName: 'Flats', width: 90, headerClassName: 'header-style-allUsers', cellClassName: 'cell-style-allUsers'},
    { field: 'role', headerName: 'Role', width: 90, headerClassName: 'header-style-allUsers', cellClassName: 'cell-style-allUsers'},
    {
      field: "view",
      headerName: "View",
      renderCell: (params) => (
          <IconButton onClick={() => navigate(`/users-profile/${params.row.id}`)}>
              <VisibilityIcon className="view__icon__allusers" />
          </IconButton>
      ),
      headerClassName: 'header-style-allUsers',
      cellClassName: 'cell-style-allUsers'
  }
  
];

      
     
  return (
    <>
      <div className='backgroud__container'>
        <Header></Header>
        <KeyboardReturnIcon
                onClick={() => navigate("/")}
                sx={{
                 color:"gray",
                 margin:"10px 20px",
                 cursor:"pointer"
                }}></KeyboardReturnIcon>
       <div className='hero__content'> 
        <h1 className='hero__table__title'>ALL USERS</h1>

        <div style={{ height: 375, width: "625px", margin: "auto" }}>
       <DataGrid
  rows={users}
  columns={columns}
  initialState={{
    pagination: {
      paginationModel: { page: 0, pageSize: 5 },
    },
  }}
  sx={{
    '.MuiDataGrid-menuIcon': {
      visibility: 'visible !important',
      width: 'auto !important',
    },
    overflow: 'clip',
    backgroundColor: 'rgba(241,243,244,255)',
  }}
/>
    </div>

        </div>
      </div>
    </>
  )
}

export default AllUsers;
