import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Admin.module.css'; // Import the CSS module

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export default function Admin() {

    const [problemList, setProblemList] = useState([]);

    const fetchData = async () => {
        try {
            const req = await axios.get( `${SERVER_URL}/admin` , { withCredentials: true });
            setProblemList(req.data);
        } catch (error) {
            console.log("error while fetching ProblemList ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const deleteProblem = async (problemId) => {

        const confirmation = window.confirm(" Are you sure you want to permanently delete a problem ? ")

        if( confirmation ){
            await axios.delete(`${SERVER_URL}/admin/delete/${problemId}`, { withCredentials: true });
            fetchData();
        }

    }

    return (
        <div className={styles.container}>
            <div className={styles.createLinkContainer}>
                <Link to={`/admin/create`} className={styles.createLink}>Create New Problem</Link>
            </div>
            <ol className={styles.problemList}>
                {problemList.map((problem, index) => (
                    <li key={index} className={styles.problemItem}>
                        <div className={styles.problemTitle}>{problem.title}</div>
                        <div className={styles.problemActions}>

                        <div onClick={() => deleteProblem(problem._id)} className={`${styles.actionButton} ${styles.deleteButton}`}>Delete</div>

                        <Link to={`/problem/${problem._id}`} className={`${styles.actionButton} ${styles.readButton}`}>Read</Link>

                        <Link to={`/admin/edit/${problem._id}`} className={`${styles.actionButton} ${styles.editButton}`}>Edit</Link>

                        </div>
                    </li>
                ))}
            </ol>
        </div>
    )
}
