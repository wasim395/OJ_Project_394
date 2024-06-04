import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import style from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setLogin] = useState(false);

  const funSetLogin = async () => {
    try {
      await axios.get('http://localhost:5000/user/isLogin', { withCredentials: true });
      setLogin(true);
    } catch (error) {
      setLogin(false);
    }
  };

  useEffect(() => {
    funSetLogin();
  }, [location]); // Runs when the location changes

  const handleLogout = async () => {

    const confirmation = window.confirm( " Are you sure you want to Logout " ) ;

    if( confirmation ){
        try {
            // Send a POST request to the logout endpoint
            await axios.get('http://localhost:5000/user/logout', { withCredentials: true });
      
            // Redirect to the login page or any other page
            navigate('/LoginRegister'); // Redirect to the login page
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
          <Link className={style.navItem} to='/LoginRegister'>Login</Link>
        </div>
      )}
    </div>
  );
}
