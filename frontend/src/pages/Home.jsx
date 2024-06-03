import React from 'react'
import axios from 'axios'
import { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import style from './Home.module.css' ;

export default function Home() {

  const [Problem , setProblem ] = useState([]) ;

  useEffect(() => {
    const fetchProblems = async () => {
      try {

        const req = await axios.get('http://localhost:5000/home' , { withCredentials : true } ) ;
        console.log(" listing problems ")
        setProblem(req.data);
        
      } catch (error) {
        console.log( " the problem list not fetched  ")
        console.error('Error fetching problems:', error);

      }
    };

    fetchProblems();

  },[]);

  return (
    <div className={style.problemListContainer} >
      <h2> Problem List </h2>
      <div className={style.problemList}>
        {
          Problem.map( (problem) => {
            return(     
              <div className={style.problemItem}>
    
                <Link to={`/problem/${problem._id}`} className={style.link}> 
                {problem.title} </Link>

              </div>                 
            )
          }) 
        }
      </div>
    </div>
  )
}
