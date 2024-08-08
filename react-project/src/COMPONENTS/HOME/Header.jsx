import { useEffect, useState } from "react";
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
import { getAuth, signOut } from "firebase/auth";
import { useAuth } from "../../CONTEXT/authContext";
import "boxicons/css/boxicons.min.css";

export default function Header() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, userLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Company Logo */}
        <Typography variant="h6">
        <i className='bx bxs-home-heart'></i>
        </Typography>
        <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block", margin: "10px"} }}
          >
            FlatFinder
          </Typography>
        {/* Greetings */}
        {user && (
          <Typography variant="h6" sx={{ marginRight: 2,flexGrow: 1 }}>
            <div>
              {userLoggedIn ? (
                <>
                  <div>Hello, {currentUser ? currentUser.fullName : "User"}</div>
                </>
              ) : (
                <></>
              )}
            </div>
          </Typography>
        )}

        {/* Navigation Buttons */}
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/inbox">
          Inbox
        </Button>

        {/* All Users Button (Admin Only) */}
        {user && user.isAdmin && (
          <Button color="inherit" component={Link} to="/all-users">
            All Users
          </Button>
        )}

        {/* User Account Menu */}
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          sx={{marginRight: "30px"}}
        >
          <AccountCircle />
        </IconButton>
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
          sx={{marginTop: "40px"}}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/profile-update");
            }}
          >
            My Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          <MenuItem
            onClick={() => {
              handleClose();
              navigate("/delete-account");
            }}
          >
            Delete Account
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
