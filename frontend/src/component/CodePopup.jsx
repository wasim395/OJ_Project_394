import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './ModalStyles.module.css'; // Import the CSS module

const CodePopup = ({ code }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <div>
            <button onClick={openModal}>View Code</button>
            <Modal isOpen={isOpen} onRequestClose={closeModal} className={styles.modal} overlayClassName={styles.overlay}>
                <div>
                    <h2>Your Code</h2>
                    <pre>{code}</pre>
                    <button onClick={closeModal}>Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default CodePopup;
