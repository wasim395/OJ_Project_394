import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import style from './Navbar.module.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;
    const [isLogin, setLogin] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/user/isLogin`, { withCredentials: true });
                setLogin(res.status === 200);
            } catch (error) {
                setLogin(false);
            }
        };
        checkLoginStatus();
    }, [location]);

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to Logout?")) {
            try {
                await axios.get(`${SERVER_URL}/user/logout`, { withCredentials: true });
                setLogin(false);
                navigate('/auth');
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }
    };

    return (
        <nav className={style.navbar}>
            <div className={style.navbarLeft}>
                <div className={style.navbarBrand}>
                    <Link to="/">Wasim OJ</Link>
                </div>
                <Link className={`${style.navItem} ${pathname === '/' ? style.active : ''}`} to='/'>Home</Link>
                {isLogin && (
                    <Link className={`${style.navItem} ${pathname === '/admin' ? style.active : ''}`} to='/admin'>Admin</Link>
                )}
            </div>
            <div className={style.navbarRight}>
                {isLogin ? (
                    <button
                        className={`${style.navItem} ${style.navButton}`}
                        onClick={handleLogout}
                        aria-label="Logout"
                    >
                        Logout
                    </button>
                ) : (
                    <Link className={`${style.navItem} ${pathname === '/auth' ? style.active : ''}`} to='/auth'>Login</Link>
                )}
            </div>
        </nav>
    );
}