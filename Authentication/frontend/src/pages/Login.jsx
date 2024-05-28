import React from 'react'
import { useState } from 'react';
import axios from 'axios' ;
import style from './Login.module.css'


export default function Login() {

    const [ userData , setUserData ] = useState({ email : "" ,
                                                  password : "" ,
     })

    const loginUser = async (e) => {
        e.preventDefault() ;
        try{
            const res = await axios.post('http://localhost:5000/login' , userData , { withCredentials: true } ) ; 
            console.log(res.data) ;
        }
        catch(error) {
            console.log( error ) ;
        }
        
    }

    const setEmail = (e) =>{
        setUserData( {...userData , email : e.target.value } ) ;
    }
    const setPasssword = (e) =>{
        setUserData( {...userData , password : e.target.value } ) ;
    }

  return (
    <div className={style.loginContainer}>

        <h2> Login </h2>

        <form className={style.loginForm} onSubmit={loginUser} >

            <div className={style.inputField}>
                <label className={style.inputLabel}  >Email</label>
                <input type='email' placeholder=' Email '
                    value={userData.email} onChange={setEmail} />
            </div>           

            <div className={style.inputField}>
                <label className={style.inputLabel}>Password</label>
                <input type='password' placeholder=' Password '
                    value={userData.password} onChange={setPasssword} />
            </div>

            <button className={style.loginButton}  type='submit'> Login </button>
        </form>
    
    </div>
  )
}
