import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './AuthPage.module.css'; // Import the shared CSS Module

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function AuthPage() {
    const [formState, setFormState] = useState('login'); // 'login', 'register', 'otp'
    const [userData, setUserData] = useState({
        firstName: '', lastName: '', email: '', password: '', otp: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formState === 'register') {
                await axios.post(`${SERVER_URL}/user/generate-otp`, userData);
                alert('OTP sent to your email!');
                setFormState('otp');
            } else if (formState === 'otp') {
                await axios.post(`${SERVER_URL}/user/register`, userData, { withCredentials: true });
                alert('Registration successful!');
                navigate('/');
            } else { // login
                await axios.post(`${SERVER_URL}/user/login`, userData, { withCredentials: true });
                alert('Login successful!');
                navigate('/');
            }
        } catch (error) {
            alert(error.response?.data?.message || 'An error occurred.');
        }
    };

    return (
        <div className={styles.container}>
            <h2>{formState === 'login' ? 'Login' : formState === 'register' ? 'Register' : 'Verify OTP'}</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                {formState === 'otp' && (
                    <input type="text" name="otp" placeholder="Enter OTP" value={userData.otp} onChange={handleChange} required />
                )}

                {formState !== 'otp' && (
                    <>
                        {formState === 'register' && (
                            <>
                                <input type="text" name="firstName" placeholder="First Name" value={userData.firstName} onChange={handleChange} required />
                                <input type="text" name="lastName" placeholder="Last Name" value={userData.lastName} onChange={handleChange} required />
                            </>
                        )}
                        <input type="email" name="email" placeholder="Email" value={userData.email} onChange={handleChange} required />
                        <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
                    </>
                )}

                <button type="submit">
                    {formState === 'login' ? 'Login' : formState === 'register' ? 'Get OTP' : 'Verify & Register'}
                </button>
            </form>

            {formState === 'login' && (
                <p className={styles.link}>
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>
            )}

            <p>
                {formState === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button type="button" className={styles.toggleButton} onClick={() => setFormState(formState === 'login' ? 'register' : 'login')}>
                    {formState === 'login' ? 'Register' : 'Login'}
                </button>
            </p>
        </div>
    );
}