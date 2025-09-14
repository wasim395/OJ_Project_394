
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import style from './Navbar.module.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLogin, setLogin] = useState(false);

    const funSetLogin = async () => {
        try {
            console.log(" checking the isLogin ");
            const req = await axios.get(`${SERVER_URL}/user/isLogin`, { withCredentials: true });
            console.log(req.status);
            if (req.status === 200) {
                console.log(" staus is 200 and the person is login  ");
                setLogin(true);
            } else {
                console.log(" person is not login  ");
                setLogin(false);
            }
        } catch (error) {
            console.log('Error checking login status:', error);
            setLogin(false);
        }
    };

    useEffect(() => {
        console.log("Location changed:", location);
        funSetLogin();
    }, [location]); // Runs when the location changes

    const handleLogout = async () => {
        const confirmation = window.confirm("Are you sure you want to Logout?");
        if (confirmation) {
            try {
                await axios.get(`${SERVER_URL}/user/logout`, { withCredentials: true });
                navigate('/LoginRegister');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    };

    return (
        <div className={style.navbar}>
            <div className={style.navbarBrand}>
                Wasim OJ
            </div>
            {isLogin ? (
                <div className={style.navbarNav}>
                    <Link className={style.navItem} to='/'>Home</Link>
                    <Link className={style.navItem} to='/admin'>Admin</Link>
                    <Link className={style.navItem} onClick={handleLogout}>Logout</Link>
                </div>
            ) : (
                <div className={style.navbarNav}>
                    <Link className={style.navItem} to='/'>Home</Link>
                    <Link className={style.navItem} to='/LoginRegister'>Login</Link>
                </div>
            )}
        </div>
    );
}
