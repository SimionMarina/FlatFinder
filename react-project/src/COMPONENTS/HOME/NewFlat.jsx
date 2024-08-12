import * as React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Stack,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useAuth } from "../../CONTEXT/authContext";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firebase configuration and initialization
import "./Home.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewFlat() {
  const [open, setOpen] = React.useState(false);
  const [hasAc, setHasAc] = React.useState(false);
  const { currentUser, userLoggedIn } = useAuth();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCheckboxChange = (event) => {
    setHasAc(event.target.checked);
  };
  console.log(currentUser)

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Add the hasAc checkbox value to formJson
    formJson.hasAc = hasAc;

    console.log(currentUser)

    if (currentUser) {
      const flatData = {
        ...formJson,
        uid: currentUser.uid, // Save the currentUser's uid
        createdAt: new Date(), // Add a timestamp
      };

      try {
        // Save the flat data to Firestore
        await addDoc(collection(db, "flats"), flatData);
        console.log("Flat added successfully:", flatData);
        handleClose();
      } catch (error) {
        console.error("Error adding flat:", error);
      }
    } else {
      console.error("No currentUser is signed in.");
    }
  };

  return (
    <React.Fragment>
      <Box className="add_flat_box">
        <Button variant="outlined" className="add_flat_button" onClick={handleClickOpen}>
          +
        </Button>
      </Box>
     
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add New Flat</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new flat, please complete all fields.
          </DialogContentText>
          <Stack spacing={2} direction="row" sx={{ marginTop: 2 }}>
            <TextField
              autoFocus
              required
              margin="dense"
              name="city"
              label="City"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              required
              margin="dense"
              name="streetName"
              label="Street Name"
              type="text" 
              fullWidth
              variant="outlined"
            />
            <TextField
              required
              margin="dense"
              name="streetNumber"
              label="Street Number"
              type="number" 
              fullWidth
              variant="outlined"
            />
          </Stack>

          <TextField
            required
            margin="dense"
            name="areaSize"
            label="Area Size"
            type="number" 
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />

          {/* Checkbox for Has AC */}
          <FormControlLabel
            control={
              <Checkbox
                checked={hasAc}
                onChange={handleCheckboxChange}
                name="hasAc"
                color="primary"
              />
            }
            label="Has AC"
            sx={{ marginTop: 2 }}
          />

          <TextField
            required
            margin="dense"
            name="yearBuild"
            label="Year Built"
            type="number" 
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <TextField
            required
            margin="dense"
            name="rentPrice"
            label="Rent Price"
            type="number" 
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <TextField
            required
            margin="dense"
            name="dateAvailable"
            label="Date Available"
            type="date" 
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add Flat</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
