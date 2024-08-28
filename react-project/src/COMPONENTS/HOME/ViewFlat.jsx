import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../CONTEXT/authContext";
import { Typography, TextField, Button, Container, Grid } from "@mui/material";
import "./Home.css";
import Header from "../HEADER/Header";
import EditFlat from "./EditFlat";

function ViewFlat() {
  const { flatId } = useParams();
  const [flat, setFlat] = useState(null);
  const [message, setMessage] = useState("");
  const [owner, setOwner] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFlatId, setEditFlatId] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchFlatAndOwner = async () => {
      try {
        const flatDoc = await getDoc(doc(db, "flats", flatId));
        if (flatDoc.exists()) {
          const flatData = flatDoc.data();
          setFlat(flatData);

          // Fetch the owner's information
          const ownerDoc = await getDoc(doc(db, "users", flatData.userUid));
          if (ownerDoc.exists()) {
            setOwner(ownerDoc.data());
          } else {
            console.error("Owner not found");
          }
        } else {
          console.error("Flat not found");
        }
      } catch (error) {
        console.error("Error fetching flat or owner:", error);
      }
    };

    fetchFlatAndOwner();
  }, [flatId]);

  const handleEdit = () => {
    setEditFlatId(flatId);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditFlatId(null);
  };

  const handleUpdateFlat = async () => {
    const flatDoc = await getDoc(doc(db, "flats", flatId));
    if (flatDoc.exists()) {
      setFlat(flatDoc.data()); // Refresh flat details
    }

    handleCloseEditModal();
  };

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

    if (message !== "") {
      try {
        await updateDoc(ownerDocRef, {
          messages: arrayUnion(newMessage),
        });
        setMessage("");
        alert("Message sent successfully!");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      alert("Can't send a message without content!");
    }
  };

  if (!flat || !owner) return <Typography>Loading flat details...</Typography>;

  return (
    <>
      <div className="background__container">
        <Header />

        <Container
          sx={{
            marginTop: "50px",
            color: "white",
            backdropFilter: "blur(5px)",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ marginBottom: 0 }}>
            Flat Owner: {owner.fullName} {/*Display the owner's name*/}
          </Typography>
        </Container>
        <Container
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            color: "white",
            backdropFilter: "blur(5px)",
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
        <Container sx={{ padding: 0 }}>
          {flat.userUid !== currentUser.uid ? (
            <Container
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                color: "white",
                backdropFilter: "blur(5px)",
                padding: 0,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "red", paddingTop: "10px" }}
              >
                Send a message to the owner
              </Typography>
              <TextField
                className="send__message__textfield"
                label="Your Message"
                fullWidth
                multiline
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  marginBottom: "16px",
                  border: "2px solid black",
                  borderRadius: "7px",
                }}
              />
              <Button
                variant="contained"
                onClick={handleSendMessage}
                fullWidth
                style={{ height: "45px" }}
              >
                Send Message
              </Button>
            </Container>
          ) : (
            <Container
              sx={{
                width: "40%",
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                color: "white",
                backdropFilter: "blur(5px)",
                padding: 0,
              }}
            >
              <Button
                variant="contained"
                onClick={handleEdit}
                fullWidth
                style={{ height: "45px" }}
              >
                Edit Flat
              </Button>
            </Container>
          )}
        </Container>
        {/* Modal for Editing Flat */}
        <EditFlat
          open={isEditModalOpen}
          onClose={handleCloseEditModal}
          flatId={editFlatId}
          onUpdate={handleUpdateFlat}
        />
      </div>
    </>
  );
}

export default ViewFlat;
