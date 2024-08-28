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
                    <div>
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
            <Typography variant="h6">
              <i className="bx bxs-home-heart"></i>
            </Typography>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block", margin: "10px" } }}
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
            className="navbar__home__button"
            color="inherit"
            component={Link}
            onClick={() => {
              navigate("/");
            }}
            sx={{ flexGrow: 1 }}
          >
            Home
          </Button>
          <Button
            className="navbar__inbox__button"
            color="inherit"
            component={Link}
            onClick={() => {
              navigate("/inbox");
            }}
            sx={{ flexGrow: 1 }}
          >
            Inbox
          </Button>

          {/* All Users Button (Admin Only) */}
          {currentUser && role === "admin" && (
            <Button className="navbar__allUsers__button" color="inherit" component={Link} to="/all-users" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
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
            onClick={() => {
              handleClose();
              navigate("/profile-update");
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
          >
            Logout
          </MenuItem>
          <MenuItem
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