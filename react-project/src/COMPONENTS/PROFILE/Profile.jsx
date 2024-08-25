import Header from '../HEADER/Header';
import { Button, Container, Typography } from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { useAuth } from '../../CONTEXT/authContext';

function Profile() {
  const { currentUser } = useAuth();


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
            <Button variant="contained">
              Update data
            </Button>
          </Container>
        </Container>
      </Container>
   
    </>
  );
}

export default Profile;
