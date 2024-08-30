import React, { useEffect, useState } from "react";
import './Header.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../CONTEXT/authContext";
import { doSignOut } from "../../auth";
import "boxicons/css/boxicons.min.css";
import Modal from "react-modal";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import showToastr from "../../SERVICES/toaster-service";
import { ToastContainer } from "react-toastify";

Modal.setAppElement('#root'); // Set the root element for accessibility

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, userLoggedIn, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState("user");

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role || "user");
    }
  }, [currentUser, role]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

      showToastr(
        "success",
        "account deleted"
      );
      setTimeout(() => {
        navigate("/register");
    }, 2000);
    } catch (error) {
      console.error("Eroare la ștergerea contului:", error);
    }
  };

  return (
    <AppBar position="static" style={{ background: "linear-gradient(rgba(44, 44, 44, 0.1), transparent)", border:"none" }}>
            <ToastContainer></ToastContainer>

      <Toolbar className="navbar__container" >
        <div className="header__logo__and__greetings"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Greetings */}
          {currentUser && (
            <Typography variant="h6" sx={{ marginRight: 2, flexGrow: 1 }}>
              <div>
                {userLoggedIn ? (
                  <>
                    <div className="greetings__users">
                      Hello, {currentUser ? currentUser.fullName : "User"}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </Typography>
          )}
          {/* Company Logo */}
          <div className="logo__content" style={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" className="color-fade">
              <i className="bx bxs-home-heart"></i>
            </Typography>
            <Typography
              variant="h6"
              noWrap
              component="div"
              className="color-fade"
              sx={{ display: { xs: "none", sm: "block", margin: "10px",   fontFamily: "Baskervville SC",
                fontWeight: 400,
                fontStyle: "normal", fontSize:26 } }}
            >
              FlatFinder
            </Typography>
          </div>



        </div>

        <div className="navigation__buttons"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexGrow: 1,
            gap: '20px',
          }}
        >
          {/* Navigation Buttons */}
          <Button
            className="navbar__home__button navbar__button__text"
            color="inherit"
            component={Link}
            onClick={() => {
              navigate("/");
            }}
            sx={{ flexGrow: 1,fontFamily: "Cormorant Upright", fontSize:"16px"           ,fontWeight: 300,
              fontStyle: "normal" }}
          >
            Home
          </Button>
          <Button
            className="navbar__inbox__button navbar__button__text"
            color="inherit"
            component={Link}
            onClick={() => {
              navigate("/inbox");
            }}
            sx={{ flexGrow: 1,fontFamily: "Cormorant Upright", fontSize:"16px"           ,fontWeight: 300,
              fontStyle: "normal" }}
          >
            Inbox
          </Button>

          {/* All Users Button (Admin Only) */}
          {currentUser && role === "admin" && (
            <Button className="navbar__allUsers__button navbar__button__text" color="inherit" component={Link} to="/all-users" sx={{ flexGrow: 1, whiteSpace: 'nowrap', fontFamily: "Cormorant Upright", fontSize:"16px"           ,fontWeight: 300,
              fontStyle: "normal" }}>
              All Users
            </Button>
          )}

          {/* User Account Menu */}
          <IconButton
            className="navbar__profile__button"
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </div>

        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          sx={{ marginTop: "40px" }}
        >
          <MenuItem
          sx={{ fontFamily: "inherit", fontSize:"18px" }}
            onClick={() => {
              handleClose();
              navigate("/profile-update");
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem
          sx={{ fontFamily: "inherit", fontSize:"18px" }}
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
          >
            Logout
          </MenuItem>
          <MenuItem
          sx={{ fontFamily: "inherit", fontSize:"18px" }}
            onClick={() => {
              handleClose();
              setIsModalOpen(true); // Deschide modalul
            }}
          >
            Delete Account
          </MenuItem>
        </Menu>
      </Toolbar>

      {/* Modal pentru confirmarea ștergerii contului */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirm Delete Account"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <h2>Are you sure you want to delete your account?</h2>
        <div>
          <Button onClick={handleDelete}>Yes</Button>
          <Button onClick={() => setIsModalOpen(false)}>No</Button>
        </div>
      </Modal>
    </AppBar>
  );
}