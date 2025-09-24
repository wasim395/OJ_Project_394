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
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/user/isLogin`, { withCredentials: true });
                if (res.status === 200 && res.data?.isLogin) {
                    setLogin(true);
                    setIsAdmin(res.data.role === 'admin' || res.data.role === 'superAdmin');
                    setIsSuperAdmin(res.data.role === 'superAdmin');
                } else {
                    setLogin(false);
                    setIsAdmin(false);
                    setIsSuperAdmin(false);
                }
            } catch {
                setLogin(false);
                setIsAdmin(false);
                setIsSuperAdmin(false);
            }
        };
        checkLoginStatus();
    }, [location]);

    const handleLogout = async () => {
        if (window.confirm("Are you sure you want to Logout?")) {
            try {
                await axios.get(`${SERVER_URL}/user/logout`, { withCredentials: true });
                setLogin(false);
                setIsAdmin(false);
                setIsSuperAdmin(false);
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

                {isLogin && isAdmin && (
                    <Link
                        className={`${style.navItem} ${pathname === '/admin' ? style.active : ''}`}
                        to='/admin'
                    >
                        Admin
                    </Link>
                )}

                {isLogin && isSuperAdmin && (
                    <Link
                        className={`${style.navItem} ${pathname === '/super-admin' ? style.active : ''}`}
                        to='/super-admin'
                    >
                        Super Admin
                    </Link>
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
                    <Link
                        className={`${style.navItem} ${pathname === '/auth' ? style.active : ''}`}
                        to='/auth'
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
