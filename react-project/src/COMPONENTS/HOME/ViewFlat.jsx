import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../CONTEXT/authContext";
import {
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
} from "@mui/material";
import Header from "./Header";
function ViewFlat() {
  const { flatId } = useParams();
  const [flat, setFlat] = useState(null);
  const [message, setMessage] = useState("");
  const {currentUser} = useAuth();

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

    try {
      await updateDoc(ownerDocRef, {
        messages: arrayUnion(newMessage),
      });
      setMessage("");
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!flat) return <Typography>Loading flat details...</Typography>;

  return (
    <>
    <Header />
   
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      
      <Card sx={{ minWidth: 275, maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {flat.city}, {flat.streetName} {flat.streetNumber}
          </Typography>
          <Typography variant="body1">
            Area Size: {flat.areaSize}
          </Typography>
          <Typography variant="body1">
            Has AC: {flat.hasAc ? "Yes" : "No"}
          </Typography>
          <Typography variant="body1">
            Year Built: {flat.yearBuild}
          </Typography>
          <Typography variant="body1">
            Rent Price: ${flat.rentPrice}
          </Typography>
          <Typography variant="body1">
          Date Available:
            {/* Date Available: {flat.dateAvailable.toDateString()} */}
          </Typography>
        </CardContent>
        {flat.uid !== currentUser.uid && (
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Send a message to the owner
            </Typography>
            <TextField
              label="Your Message"
              fullWidth
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ marginBottom: "16px" }}
            />
            <CardActions>
              <Button
                variant="contained"
                onClick={handleSendMessage}
                fullWidth
              >
                Send Message
              </Button>
            </CardActions>
          </CardContent>
        )}
      </Card>
    </Container>
    </>
  );
 
}

export default ViewFlat;
