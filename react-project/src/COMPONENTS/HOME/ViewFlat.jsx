import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../CONTEXT/authContext";
import {
  Typography,
  TextField,
  Button,
  Container,
  Grid,
} from "@mui/material";
import './ViewFlat.css';
import Header from "../HEADER/Header";
function ViewFlat() {
  const { flatId } = useParams();
  const [flat, setFlat] = useState(null);
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchFlat = async () => {
      const flatDoc = await getDoc(doc(db, "flats", flatId));
      if (flatDoc.exists()) {
        setFlat(flatDoc.data());
      } else {
        console.error("Flat not found");
      }
    };

    fetchFlat();
  }, [flatId]);

  const handleSendMessage = async () => {
    if (!currentUser || !flat) {
      console.error("User not signed in or flat data not loaded");
      return;
    }
    const ownerDocRef = doc(db, "users", flat.userUid);
    const newMessage = {
      content: message,
      senderUid: currentUser.uid,
      senderName: currentUser.fullName,
      senderEmail: currentUser.email,
      createdAt: new Date(),
      flatId: flatId,
    };
    if(message !== ""){
      try {
        await updateDoc(ownerDocRef, {
          messages: arrayUnion(newMessage),
        });
        setMessage("");
        alert("Message sent successfully!");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else{
      alert("Can't send a message without content!");
    }
    
  };

  if (!flat) return <Typography>Loading flat details...</Typography>;

  return (
    <>
      <Header />

      <Container sx={{marginTop: "20px"}}>
        <Typography variant="h6" gutterBottom>
          Flat Owner: {currentUser.fullName}
        </Typography>
      </Container>
      <Container
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Flat Details:
        </Typography>
        <Grid container width={"60%"}>
          <Grid item xs={4}>
            <Typography variant="body1" className="flat_details">
              Address:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" className="flat_details">
              {flat.city}, {flat.streetName} {flat.streetNumber}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1" className="flat_details">
              Area Size:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" className="flat_details">
              {flat.areaSize}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1" className="flat_details">
              Has AC:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" className="flat_details">
              {flat.hasAc ? "Yes" : "No"}{" "}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1" className="flat_details">
              Year Built:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" className="flat_details">
              {flat.yearBuild}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1" className="flat_details">
              Rent Price:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" className="flat_details">
              ${flat.rentPrice}
            </Typography>
          </Grid>

          <Grid item xs={4}>
            <Typography variant="body1" className="flat_details">
              Date Available:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1" className="flat_details">
              {flat.dateAvailable}
            </Typography>
          </Grid>
        </Grid>
      </Container>
      <Container>
        {flat.uid !== currentUser.uid && (
          <Container
            sx={{
              width: "60%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "20px"
            }}
          >
            <Typography variant="h5" gutterBottom>
              Send a message to the owner
            </Typography>
            <TextField
              label="Your Message"
              fullWidth
              multiline
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ marginBottom: "16px" }}
            />

            <Button variant="contained" onClick={handleSendMessage} fullWidth>
              Send Message
            </Button>
          </Container>
        )}
      </Container>
    </>
  );
}

export default ViewFlat;
