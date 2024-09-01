import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Container,
  Typography,
} from "@mui/material";
import { useAuth } from "../../CONTEXT/authContext";
import { doSignOut } from "../../auth";
import Header from "../HEADER/Header";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import Modal from "react-modal";
import { doc, setDoc, getFirestore, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import showToastr from "../../SERVICES/toaster-service";
import { ToastContainer } from "react-toastify";

function Profile() {
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(userDocRef, formData, { merge: true });

      handleClose();
      window.location.reload();
    } catch (error) {
      console.log(`ERROR IS:${error}`);
    }
  };

  const handleDelete = async () => {
    try {
      const db = getFirestore();
      const userDoc = doc(db, "users", currentUser.uid);

      // Șterge documentul utilizatorului din Firestore
      await deleteDoc(userDoc);

      // Deconectează utilizatorul
      await doSignOut();
      setIsModalOpen(false);

      showToastr("success", "account deleted");
      setTimeout(() => {
        navigate("/register");
      }, 2000);
    } catch (error) {
      console.error("Eroare la ștergerea contului:", error);
    }
  };
  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="background__container">
        <Header></Header>
        <Container
          sx={{
            width: "60vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "140px",
            backgroundColor: "rgb(220, 222, 224, 255)",
            borderRadius: "50px",
            color: "black",
            padding: "20px",
          }}
        >
          <h2>Account data</h2>
          <Container
            sx={{
              display: "flex",
              color: "black",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PermIdentityIcon
              sx={{
                fontSize: "200px",
                color: "blueviolet",
              }}
            />
            <Container>
              <Typography sx={{ fontSize: "18px" }}>
                Name: {currentUser.fullName}
              </Typography>
              <Typography sx={{ fontSize: "18px" }}>
                Email: {currentUser.email}
              </Typography>
              <Typography sx={{ fontSize: "18px" }}>
                Birth date: {currentUser.birthDate}
              </Typography>
              <Button
                variant="contained"
                onClick={handleUpdateMyProfile}
                style={{
                  marginTop: "30px",
                  color: "white",
                  backgroundColor: "blueviolet",
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
                className="update__profile__button"
              >
                Update data
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  setIsModalOpen(true); // Deschide modalul
                }}
                style={{
                  marginTop: "30px",
                  marginLeft: "20px",
                  color: "white",
                  backgroundColor: "red",
                  fontSize: "14px",
                  fontFamily: "inherit",
                }}
              >
                Delete Account
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
      </div>
      {/* Modal pentru confirmarea ștergerii contului */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirm Delete Account"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <h2>Are you sure you want to delete your account?</h2>
        <div>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={() => setIsModalOpen(false)}>No</Button>
        </div>
      </Modal>
    </>
  );
}

export default Profile;
