import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './AuthPage.module.css'; // Import the shared CSS Module

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${SERVER_URL}/user/forgot-password`, { email });
            setMessage(data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a password reset link.</p>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
             <p className={styles.link}>
                <Link to="/auth">Back to Login</Link>
            </p>
        </div>
    );
}