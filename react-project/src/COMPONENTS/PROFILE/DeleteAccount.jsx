import React, { useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from "../../CONTEXT/authContext";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

Modal.setAppElement('#root'); // Set the root element for accessibility

function DeleteAccount() {
    const { currentUser, logout } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();  // Folosește useNavigate în loc de useHistory

    const handleDelete = async () => {
        try {
            const db = getFirestore();
            const userDoc = doc(db, "users", currentUser.uid);
            
            // Șterge documentul utilizatorului din Firestore
            await deleteDoc(userDoc);

            // Deconectează utilizatorul
            await logout();
            setIsModalOpen(false);


            navigate("/login");  // Folosește navigate pentru a redirecționa
        } catch (error) {
            console.error("Eroare la ștergerea contului:", error);
        }
    };

    return (
        <div>
            <h1>Delete Account</h1>
            <button onClick={() => setIsModalOpen(true)}>Delete My Account</button>

            <Modal 
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Confirm Delete Account"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                    },
                }}
            >
                <h2>Are you sure you want to delete your account?</h2>
                <div>
                    <button onClick={handleDelete}>Yes</button>
                    <button onClick={() => setIsModalOpen(false)}>No</button>
                </div>
            </Modal>
        </div>
    );
}

export default DeleteAccount;
