import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css'; // Import the shared CSS Module

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }
        try {
            const { data } = await axios.put(`${SERVER_URL}/user/reset-password/${token}`, { password });
            setMessage(data.message + ' Redirecting to login...');
            setTimeout(() => navigate('/auth'), 3000);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Reset Your Password</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="password" placeholder="Enter new password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
        </div>
    );
}