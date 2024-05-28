import React from 'react'
import { useState , useEffect } from 'react'
import axios from 'axios' 
import style from './Login.module.css'

export default function Register() {

    const [ userData , setUserData ] = useState({ firstName : "" ,
                                                  lastName : "" ,
                                                  email : "" ,
                                                  password : "" ,
     })

    const registerUser = async (event) => {
        event.preventDefault() ;

        try{
          const res = await axios.post('http://localhost:5000/register' , userData ) ;
          console.log( "Response" , res.data ) ;
        }
        catch(error){
          console.log("ERROR" , error) ;
        }
    }

    const setFirstName = (e) =>{
        setUserData( {...userData , firstName : e.target.value } ) ;
    }
    const setLastName = (e) =>{
        setUserData( {...userData , lastName : e.target.value } ) ;
    }
    const setEmail = (e) =>{
        setUserData( {...userData , email : e.target.value } ) ;
    }
    const setPasssword = (e) =>{
        setUserData( {...userData , password : e.target.value } ) ;
    }

    


  return (
    <div className={style.loginContainer}>

      <h2> Register </h2>

        <form className={style.loginForm} onSubmit={ registerUser } >
    
        <div className={style.inputField}>
          <label className={style.inputLable}>First Name</label>
          <input type='text' placeholder=' First Name ' 
          value={userData.firstName} onChange={setFirstName}  />
        </div>

        <div className={style.inputField}>
          <label className={style.inputLable}>Last Name</label>
          <input type='text' placeholder=' Last Name '
          value={userData.lastName} onChange={setLastName} /> 
        </div>

        <div className={style.inputField}>
          <label className={style.inputLable}>Email</label>
          <input type='email' placeholder=' Email '
          value={userData.email} onChange={setEmail} />
        </div>

        <div className={style.inputField}>
          <label className={style.inputLable}>Password</label>
          <input type='password' placeholder=' Password '
          value={userData.password} onChange={setPasssword} />
        </div>
        
        <button className={style.loginButton} type='submit' > Register </button>

        </form>

    </div>
  )
    
  
}
