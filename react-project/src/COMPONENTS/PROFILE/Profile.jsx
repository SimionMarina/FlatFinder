import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button,Container, Typography } from '@mui/material';
import { useAuth } from '../../CONTEXT/authContext';
import Header from '../HEADER/Header';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { doc, setDoc} from 'firebase/firestore';
import { db } from '../../firebase';

function Profile() {
  const { currentUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName,
    email: currentUser.email,
    birthDate: currentUser.birthDate,
  });

  const handleUpdateMyProfile = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
  
    try{
      const userDocRef = doc(db,"users", currentUser.uid)
      await setDoc(userDocRef, formData, { merge:true })
      
      handleClose();
      window.location.reload();
  
     } catch(error) {
      console.log(`ERROR IS:${error}`)
     }
  };

  return (
    <>
      <Header></Header>
      <Container
        sx={{
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: '30px',
        }}
      >
        <h3>Account data</h3>
        <Container
          sx={{
            display: 'flex',
          }}
        >
          <PermIdentityIcon sx={{ fontSize: '200px', fontWeight: '100' }} />
          <Container>
            <Typography>Name: {currentUser.fullName}</Typography>
            <Typography>Email: {currentUser.email}</Typography>
            <Typography>Birth date: {currentUser.birthDate}</Typography>
            <Button variant="contained" onClick={handleUpdateMyProfile}>
              Update data
            </Button>
          </Container>
        </Container>
      </Container>

      {/* Modalul pentru actualizarea datelor */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            type="email"
          />
          <TextField
            margin="dense"
            label="Birth Date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            fullWidth
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Profile;
