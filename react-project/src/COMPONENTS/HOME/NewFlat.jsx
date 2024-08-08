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
} from "@mui/material";
// import { getAuth } from "firebase/auth";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "./firebase";
import "./Home.css"
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NewFlat() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Fetch the current user from Firebase Auth
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const flatData = {
        ...formJson,
        uid: user.uid, // Save the user's uid
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
      console.error("No user is signed in.");
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
            To add a new flat you have to complete all fields.
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
              autoFocus
              required
              margin="dense"
              name="streetName"
              label="Street Name"
              type="text"
              fullWidth
              variant="outlined"
            />
            <TextField
              autoFocus
              required
              margin="dense"
              name="streetNumber"
              label="Street Number"
              type="text"
              fullWidth
              variant="outlined"
            />
          </Stack>

          <TextField
            autoFocus
            required
            margin="dense"
            name="areaSize"
            label="Area Size"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="hasAc"
            label="Has AC"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="yearBuild"
            label="Year Build"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="rentPrice"
            label="Rent Price"
            type="text"
            fullWidth
            variant="outlined"
            sx={{ marginTop: 2 }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            name="dateAvailable"
            label="DateAvailable"
            type="text"
            fullWidth
            variant="outlined"
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
