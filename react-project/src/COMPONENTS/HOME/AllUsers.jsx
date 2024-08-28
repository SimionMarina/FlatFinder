import React, { useEffect, useState } from 'react'
import Header from '../HEADER/Header';
import './AllUsers.css'
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { IconButton } from "@mui/material";





function AllUsers() {
    const [users, setUsers] = useState([]);


useEffect(()=> {
    const fetchUsers = async () => {
        const usersCollection = collection(db, "users");
        const userSnapShot = await getDocs(usersCollection)
        const usersList = userSnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList)
    };
    fetchUsers();
},[])
   
    const columns = [
        { field: 'fullName', headerName: 'Name', width: 170, headerClassName: 'header-style', cellClassName: 'cell-style' },
        { field: 'email', headerName: 'Email', width: 170, headerClassName: 'header-style', cellClassName: 'cell-style' },
        { field: 'flats', headerName: 'Flats', width: 90, headerClassName: 'header-style', cellClassName: 'cell-style'},
        { field: 'role', headerName: 'Role', width: 90, headerClassName: 'header-style', cellClassName: 'cell-style'},
        {
            field: "view",
            headerName: "View",
            renderCell: (params) => (
              <IconButton
                onClick={() => navigate(`/flats/${params.row.id}`)}
              >
                <VisibilityIcon className="action__icon" />
              </IconButton>
            ),
            headerClassName: 'header-style',
            cellClassName: 'cell-style'
          },        
      ];
      
     
  return (
    <>
      <div className='backgroud__container'>
        <Header></Header>
       <div className='hero__content'> 
        <h1 className='hero__table__title'>All Users</h1>

        <div style={{ height: 375, width: "40%", margin: "auto" }}>
        <DataGrid
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        sx={{ overflow: 'clip' }}
      />
    </div>

        </div>
      </div>
    </>
  )
}

export default AllUsers;
