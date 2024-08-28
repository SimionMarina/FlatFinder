import React, { useState, useEffect } from "react";
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
import Header from "../HEADER/Header";

const Inbox = () => {
  const [groupedMessages, setGroupedMessages] = useState({});
  const [flatDetails, setFlatDetails] = useState({});
  const [reply, setReply] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const messages = userData.messages || [];

          // Group messages by senderUid
          const grouped = messages.reduce((acc, message) => {
            const senderUid = message.senderUid;
            if (!acc[senderUid]) {
              acc[senderUid] = [];
            }
            acc[senderUid].push(message);
            return acc;
          }, {});

          setGroupedMessages(grouped);

          // Fetch flat details
          const flatIds = [...new Set(messages.map((msg) => msg.flatId))];
          const flatDetailsPromises = flatIds.map(async (flatId) => {
            const flatDocRef = doc(db, "flats", flatId);
            const flatDocSnap = await getDoc(flatDocRef);
            return { flatId, ...flatDocSnap.data() };
          });

          const flatDetailsArray = await Promise.all(flatDetailsPromises);
          const flatDetailsObj = flatDetailsArray.reduce((acc, flat) => {
            acc[flat.flatId] = flat;
            return acc;
          }, {});

          setFlatDetails(flatDetailsObj);
        }
      }
    };

    fetchMessages();
  }, [currentUser]);

  const handleReplyChange = (senderUid, value) => {
    setReply({ ...reply, [senderUid]: value });
  };

  const handleSendReply = async (senderUid) => {
    if (!currentUser || !reply[senderUid]) return;

    const replyMessage = {
      content: reply[senderUid],
      senderUid: currentUser.uid,
      senderName: currentUser.fullName,
      senderEmail: currentUser.email,
      createdAt: new Date(),
    };

    try {
      const senderDocRef = doc(db, "users", senderUid);
      await updateDoc(senderDocRef, {
        messages: arrayUnion(replyMessage),
      });
      setReply({ ...reply, [senderUid]: "" }); // Clear the reply input
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
          {Object.keys(groupedMessages).length === 0 ? (
            <Typography>No messages found.</Typography>
          ) : (
            Object.keys(groupedMessages).map((senderUid) => (
              <Card key={senderUid}>
                <CardContent>
                  <Typography variant="h6">
                    From: {groupedMessages[senderUid][0].senderName}
                  </Typography>
                  {groupedMessages[senderUid].map((message, index) => {
                    const flat = flatDetails[message.flatId];
                    return (
                      <div key={index} style={{ marginBottom: "10px" }}>
                        <Typography variant="body1">{message.content}</Typography>
                        {flat && (
                          <Typography variant="caption" color="textSecondary">
                            Location: {flat.city}, {flat.streetName} {flat.streetNumber}
                          </Typography>
                        )}
                        <br />
                        <Typography variant="caption" color="textSecondary">
                          Sent on:{" "}
                          {new Date(
                            message.createdAt.seconds * 1000
                          ).toLocaleString()}
                        </Typography>
                      </div>
                    );
                  })}
                </CardContent>
                <CardActions>
                  <TextField
                    label="Reply"
                    variant="outlined"
                    fullWidth
                    value={reply[senderUid] || ""}
                    onChange={(e) => handleReplyChange(senderUid, e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSendReply(senderUid)}
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