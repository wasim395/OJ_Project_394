import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './Admin.module.css'; // Import the CSS module

export default function Admin() {

    const [problemList, setProblemList] = useState([]);

    const fetchData = async () => {
        try {
            const req = await axios.get("http://localhost:5000/admin", { withCredentials: true });
            setProblemList(req.data);
        } catch (error) {
            console.log("error while fetching ProblemList ", error);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const deleteProblem = async (problemId) => {
        await axios.delete(`http://localhost:5000/admin/delete/${problemId}`, { withCredentials: true });
        fetchData();
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
                            <button onClick={() => deleteProblem(problem._id)} className={styles.deleteButton}>Delete</button>
                            <Link to={`/problem/${problem._id}`} className={styles.actionLink}>Read</Link>
                            <Link to={`/admin/edit/${problem._id}`} className={`${styles.actionLink} ${styles.editButton}`}>Edit</Link>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    )
}
