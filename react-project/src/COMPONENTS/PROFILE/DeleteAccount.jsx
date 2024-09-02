// import React, { useState } from 'react';
// import Modal from 'react-modal';
// import { Dialog } from '@mui/material';
// import { useAuth } from "../../CONTEXT/authContext";
// import { useNavigate } from "react-router-dom";
// import { getFirestore, doc, deleteDoc } from "firebase/firestore";

// // Modal.setAppElement('#root'); // Set the root element for accessibility

// function DeleteAccount() {
//     const { currentUser, logout } = useAuth();
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const navigate = useNavigate();  // Folosește useNavigate în loc de useHistory

//     const handleDelete = async () => {
//         try {
//             const db = getFirestore();
//             const userDoc = doc(db, "users", currentUser.uid);
            
//             // Șterge documentul utilizatorului din Firestore
//             await deleteDoc(userDoc);

//             // Deconectează utilizatorul
//             await logout();
//             setIsModalOpen(false);


//             navigate("/login");  // Folosește navigate pentru a redirecționa
//         } catch (error) {
//             console.error("Eroare la ștergerea contului:", error);
//         }
//     };

//     return (
//         <div>
//             <h1>Delete Account</h1>
//             <button onClick={() => setIsModalOpen(true)}>Delete My Account</button>

//             <Dialog
//         open={isModalOpen}
//         keepMounted
//         onClose={handleClose}
//         PaperProps={{
//           component: "form",
//           onSubmit: handleSave,
//           sx: { backgroundColor: "#f2eee9", borderRadius: "30px" }, // modal background
//         }}
//         sx={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
//       >
//           <DialogContentText
//             sx={{
//                 display:"flex",
//                 flexDirection:"column",
//                 justifyContent:"center",
//                 alignItems:"center",
//                 padding:"30px",
//                 margin: "5px",
//                 color: "#8a2be2",
//                 fontFamily: "inherit",
//                 fontSize: "20px",
//             }}
//           >
            
//             Are you sure you want to make this user admin? 
//             <div>
//                 <Button onClick={handleDelete} sx={{color:"green",fontSize:"16px"}}>Yes</Button>
//                 <Button onClick={handleClose} sx={{color:"red",fontSize:"16px"}}>Cancel</Button>
//             </div>
//           </DialogContentText>
//     </Dialog>
//         </div>
//     );
// }

// export default DeleteAccount;
