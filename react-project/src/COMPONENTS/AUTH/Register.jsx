import React from "react";
import "boxicons/css/boxicons.min.css";
import Box from "@mui/material/Box";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import GoogleIcon from "../../assets/GOOGLE-ICON.svg";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

function Register() {
  const label = [];
  return (
    <div>
      <div className="background__division">
        <div className="image__section">
          <h2 className="hero__title">Turn Your Ideas into Reality</h2>
          <p className="hero__paragraph">
            Start for free and get attractive offers from the community
          </p>
        </div>

        <div className="form__section">
          <div className="form__details">
            <div className="logo__section">
              <i className="bx bxs-home-heart"></i>
              <h4 className="company__title">FlatFinder</h4>
            </div>

            <div className="form__header">
              <h1 className="form__title">Sign Up</h1>
              <p className="form__info">
                Welcome! Please fill in the details to create your account.
              </p>
            </div>

            <div>
              <Box
                sx={{ "& > :not(style)": { m: 0 } }}
                className="inputs__side"
              >
                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    sx={{ color: "black" }}
                  >
                    First Name & Last Name
                  </InputLabel>
                  <Input
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <AccountCircleIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    sx={{ color: "black" }}
                  >
                    Email
                  </InputLabel>
                  <Input
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    sx={{ color: "black" }}
                  >
                    BirthDate
                  </InputLabel>
                  <Input
                    type="date"
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <CalendarMonthIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    sx={{ color: "black" }}
                  >
                    Password
                  </InputLabel>
                  <Input
                    type="password"
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormControl variant="standard" sx={{ width: "100%" }}>
                  <InputLabel
                    htmlFor="input-with-icon-adornment"
                    sx={{ color: "black" }}
                  >
                    Confirm Password
                  </InputLabel>
                  <Input
                    type="password"
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "black" }} />
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </Box>
              <div className="remember__forgot">
                <p className="checkbox__text">
                  <Checkbox {...label} className="checkbox" />
                  Remember me
                </p>
                <p className="forgot__password">Forgot Password?</p>
              </div>

              <Stack direction="row" spacing={2}>
                <Button
                  className="login__button"
                  variant="contained"
                  sx={{
                    backgroundColor: "black",
                    width: "100%",
                    height: "50px",
                  }}
                >
                  LogIn
                </Button>
              </Stack>

              <div className="separator">
                <div className="line"></div>
                <p className="text">or</p>
              </div>

              <div className="icon-container">
                <img src={GoogleIcon} className="icon" alt="Google Icon" />
                Sign In With Google
              </div>

              <div className="navigate">
                <p className="no__account"> Don't have an account?</p>
                <a href="#">Sign Up here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
