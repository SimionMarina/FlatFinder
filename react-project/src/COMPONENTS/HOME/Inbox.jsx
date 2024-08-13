import { useState, useEffect } from "react";
import { useAuth } from "../../CONTEXT/authContext";
import { db } from "../../firebase"; // Firebase configuration and initialization
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Stack,
  Container,
} from "@mui/material";
import Header from "./Header";
const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setMessages(userData.messages || []);
        }
      }
    };

    fetchMessages();
  }, [currentUser]);

  const handleReplyChange = (index, value) => {
    setReply({ ...reply, [index]: value });
  };

  const handleSendReply = async (message, index) => {
    if (!currentUser || !message) return;

    const senderDocRef = doc(db, "users", message.senderUid);
    const replyMessage = {
      content: reply[index],
      senderUid: currentUser.uid,
      senderName: currentUser.fullName,
      senderEmail: currentUser.email,
      createdAt: new Date(),
      replyToMessageId: message.createdAt, // Optional: link reply to the original message
      flatId: message.flatId,
    };

    try {
      await updateDoc(senderDocRef, {
        messages: arrayUnion(replyMessage),
      });
      setReply({ ...reply, [index]: "" }); // Clear the reply input
      alert("Reply sent successfully!");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return (
    <>
      <Header />

      <Container sx={{ marginTop: "10px" }}>
        <Typography variant="h4" gutterBottom>
          Inbox
        </Typography>
        <Stack spacing={2}>
          {messages.length === 0 ? (
            <Typography>No messages found.</Typography>
          ) : (
            messages.map((message, index) => (
              <Card key={index}>
                <CardContent>
                  <Typography variant="h6">
                    From: {message.senderName}
                  </Typography>
                  <Typography variant="body1">{message.content}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Sent on:{" "}
                    {new Date(
                      message.createdAt.seconds * 1000
                    ).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <TextField
                    label="Reply"
                    variant="outlined"
                    fullWidth
                    value={reply[index] || ""}
                    onChange={(e) => handleReplyChange(index, e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSendReply(message, index)}
                  >
                    Send Reply
                  </Button>
                </CardActions>
              </Card>
            ))
          )}
        </Stack>
      </Container>
    </>
  );
};

export default Inbox;
