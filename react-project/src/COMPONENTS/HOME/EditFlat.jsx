import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const EditFlat = ({ open, onClose, flatId, onUpdate }) => {
  const [flatData, setFlatData] = useState({});

  useEffect(() => {
    const fetchFlatData = async () => {
      if (flatId) {
        const flatDoc = await getDoc(doc(db, "flats", flatId));
        if (flatDoc.exists()) {
          setFlatData(flatDoc.data());
        }
      }
    };

    fetchFlatData();
  }, [flatId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFlatData({ ...flatData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, "flats", flatId), flatData);
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating flat: ", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: (e) => {
          e.preventDefault();
          handleSave();
        },
      }}
    >
      <DialogTitle>Edit Flat</DialogTitle>
      <DialogContent>
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
            value={flatData.city || ''}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            name="streetName"
            label="Street Name"
            type="text"
            fullWidth
            variant="outlined"
            value={flatData.streetName || ''}
            onChange={handleChange}
          />
          <TextField
            required
            margin="dense"
            name="streetNumber"
            label="Street Number"
            type="number"
            fullWidth
            variant="outlined"
            value={flatData.streetNumber || ''}
            onChange={handleChange}
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
          value={flatData.areaSize || ''}
          onChange={handleChange}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={flatData.hasAc || false}
              onChange={(e) => handleChange({ target: { name: 'hasAc', value: e.target.checked } })}
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
          value={flatData.yearBuild || ''}
          onChange={handleChange}
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
          value={flatData.rentPrice || ''}
          onChange={handleChange}
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
          value={flatData.dateAvailable || ''}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFlat;