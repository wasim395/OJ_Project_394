import React from "react";
import { useState ,useEffect } from "react";
import axios from 'axios' ;


export default function Admin( ){

    const [permit , setPermit] = useState(false) ;

    useEffect(() => {
        // Define the async function inside useEffect
        const fetchData = async () => {
          try {
            const req = await axios.get( 'http://localhost:5000/admin' , {withCredentials : true} ) ;
            setPermit(req.data);
          } catch (error) {
                console.log(error)
          }
        };
    
        // Call the async function
        fetchData();
      }, []);
    
    //create

    //edit 

    //delete

    //read 

    return (
    <>
    { permit ? 
        <div>
            <h1> create </h1>
            <h1> update </h1>
            <h1> delete </h1>
        </div>
        :
        <div>
            <h3> YOU ARE NOT ADMIN</h3>
        </div>
        
    }
    </>
    ) 
}