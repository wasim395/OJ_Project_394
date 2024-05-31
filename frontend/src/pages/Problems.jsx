import React from "react";
import {useState , useEffect } from 'react' ;
import axios from 'axios' ;
import { useParams } from 'react-router-dom';
import styles from './Problems.module.css' ;


export default function problem(){

    const params = useParams();
    const problemId = params.id ;

    const [ problemData , setProblem ] = useState({}) ;

    useEffect( () => {

        const fetchProblem = async () => {

            console.log( problemId ) ;

            try{
                const req = await axios.get(`http://localhost:5000/problem/${problemId}`, { withCredentials: true });

                console.log("hellow world  ")
                console.log( req.data ) ;
                const newProblem = req.data ;
                setProblem( newProblem ) ;
                console.log("hellow world  ")
            }
            catch(error){
                console.log( "Error while problem fetching in problem route " , error ) ; 
            }

        } 

        fetchProblem() ;

    } , [] );


    return(
        <>

            <div className={styles.problemPageContainer}>
            <div className={styles.problemSection}>
               
                <div className={styles.problemDescription}>
                <h2>{problemData.title}</h2>
                {problemData.problemStatement}
                </div>
            </div>
            <div className={styles.problemSection}>
                <div className={styles.codeEditor}>
                <h2>Code Editor</h2>
                {/* Render code editor here */}
                </div>
            </div>
            </div>
        </>

    );

}