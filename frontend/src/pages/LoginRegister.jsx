import React, { useState , useEffect } from 'react';
import axios from 'axios';
import style from './LoginRegister.module.css';
import { useNavigate } from 'react-router-dom';

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export default function LoginRegister() {

    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false) ;
    const [isOtp , setShowOtp ] = useState(false) ;
    const [isSignIn , setSignIn ] = useState(true) ;

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "" ,
        putOtp : "" ,
    });

    useEffect(()=>{
        handleIsSignIn() ;
    } , []);

    const handleIsSignUp = () => {
        setIsSignUp(true)
        setShowOtp(false)
        setSignIn(false)
    }
    const handleIsOtp = () => {
        setIsSignUp(false)
        setShowOtp(true)
        setSignIn(false)
    }
    const handleIsSignIn = () => {
        setIsSignUp(false)
        setShowOtp(false)
        setSignIn(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };
    const toggleForm = () => {
        setIsSignUp((p) => p = !p );
        setSignIn((p) => p = !p);
        setShowOtp(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        if( isOtp ){

            const urlRegister = `${SERVER_URL}/user/register` ;

            try{
                await axios.post( urlRegister , userData , {withCredentials: true} ) ;
                navigate('/LoginRegister');
            }
            catch(error){
                console.log("error whiel registering : " , error ) ;
            }
            
        } 
        else if( isSignUp ){

            const urlGetOtp = `${SERVER_URL}/user/generate-otp` ;

            try{
                await axios.post( urlGetOtp , userData , {withCredentials : true} ) ;
                handleIsOtp() ;
            }
            catch(error){
                console.log("error while generating otp : " , error ) ;
                handleIsSignUp
            }

        }
        else{
            try{
                const url = `${SERVER_URL}/user/login` ;
                const res = await axios.post( url, userData, { withCredentials: true }) ;
                navigate("/") ;
            }
            catch(error){
                console.log( " error while login : " , error ) ;
                setShowOtp(false) ;
            }
        }
    };

    return (
        <div className={style.container}>
            <h2>{isSignUp ? 'Register' : 'Login'}</h2>
            <form className={style.form} onSubmit={handleSubmit}>
                
                <div>
                    { isOtp ? (
                        <div>
                            <h3>Enter OTP sent to your email address</h3>
                            <input
                                type="text"
                                name="putOtp"
                                placeholder="OTP"
                                value={userData.otp}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ) : (
                        <>
                            {isSignUp && (
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={userData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            )}
                            {isSignUp && (
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={userData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            )}
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={userData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={userData.password}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}
                </div>
                
                {isSignUp && <button type="submit"> Sign Up </button>}
                {isSignIn && <button type="submit"> Sign In </button>}
                {isOtp && <button type="submit"> Verify OTP </button>}
            </form>
            <p>{isSignUp ? 'Already have an account? ' : 'Don\'t have an account? '}
                <button className={style.toggleButton} onClick={toggleForm}>{isSignUp ? 'Sign In' : 'Sign Up'}</button>
            </p>
        </div>
    );
}
