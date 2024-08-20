import { useEffect, useState } from "react";
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

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { currentUser, userLoggedIn } = useAuth();
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

  return (
    <AppBar position="static">
      <Toolbar className="navbar__container" sx={{height:"60px"}}>
       
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
    gap: '20px', // Adaugă spațiu între butoane
  }}
>
  {/* Navigation Buttons */}
  <Button
    color="inherit"
    component={Link}
    onClick={() => {
      navigate("/");
    }}
    sx={{ flexGrow: 1 }} // Ocupă mai mult spațiu
  >
    Home
  </Button>
  <Button
    color="inherit"
    component={Link}
    onClick={() => {
      navigate("/inbox");
    }}
    sx={{ flexGrow: 1 }} // Ocupă mai mult spațiu
  >
    Inbox
  </Button>

  {/* All Users Button (Admin Only) */}
  {currentUser && role === "admin" && (
    <Button color="inherit" component={Link} to="/all-users" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
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
