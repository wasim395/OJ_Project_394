import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import style from './Home.module.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL; // Ensure the variable name matches your .env file

export default function Home() {
    const [Problem, setProblem] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const req = await axios.get(`${SERVER_URL}/home`, { withCredentials: true });
                console.log("Listing problems:", req.data);

                // Ensure the response data is an array, if not convert it to an array
                const problemsData = Array.isArray(req.data) ? req.data : [req.data];
                setProblem(problemsData);
            } catch (error) {
                console.error("Error fetching problems:", error);
                setProblem([]);
            }
        };

        fetchProblems();
    }, []);

    return (
        <div className={style.problemListContainer}>
            <h2> Problem List </h2>
            <div className={style.problemList}>
                {Problem.map((problem, index) => {
                    return (
                        <div key={index} className={style.problemItem}>
                            <Link to={`/problem/${problem._id}`} className={style.link}>
                                {problem.title}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
