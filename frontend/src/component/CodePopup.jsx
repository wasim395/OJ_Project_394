import React, { useState } from 'react';
import Modal from 'react-modal';
import styles from './CodePopup.module.css';

// Set app element for accessibility
if (typeof window !== 'undefined') {
    Modal.setAppElement('#root');
}

const CodePopup = ({ code }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setCopySuccess(''); // Reset copy message when closing
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopySuccess('Copied!');
                setTimeout(() => setCopySuccess(''), 2000);
            } catch (fallbackErr) {
                setCopySuccess('Copy failed');
                setTimeout(() => setCopySuccess(''), 2000);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <div>
            <button className={styles.viewCodeButton} onClick={openModal}>
                View Code
            </button>

            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className={styles.modal}
                overlayClassName={styles.overlay}
                contentLabel="Code Preview"
                ariaHideApp={false}
            >
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Your Code</h2>
                    <div className={styles.modalActions}>
                        <button
                            className={styles.copyButton}
                            onClick={copyToClipboard}
                            disabled={copySuccess === 'Copied!'}
                        >
                            {copySuccess || 'Copy Code'}
                        </button>
                        <button className={styles.closeButton} onClick={closeModal}>
                            ✕
                        </button>
                    </div>
                </div>

                <div className={styles.codeContainer}>
                    <pre className={styles.codeBlock}>
                        <code>{code}</code>
                    </pre>
                </div>
            </Modal>
        </div>
    );
};

export default CodePopup;
