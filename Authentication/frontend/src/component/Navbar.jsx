import React from 'react'
import { Link } from 'react-router-dom'
import style from './Navbar.module.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios' ;

export default function Navbar() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Send a POST request to the logout endpoint
      await axios.get('http://localhost:5000/logout' , { withCredentials: true } );

      // Redirect to the login page or any other page
      console.log( " inside hadle logout " )
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <div className={style.navbar} >
      <div className={style.navbarBrand}>
        Wasim OJ
      </div>

      <div className={style.navbarNav}>
        <Link className={style.navItem} to='/'> home </Link>
        <Link className={style.navItem} to='/register'> Register </Link>
        <Link className={style.navItem} to='/login'> Login </Link>
        <Link className={style.navItem} to='/admin'> Admin </Link>
         <Link className={style.navItem} onClick={handleLogout}> Logout </Link>
      </div>

    </div>
  )  
}

