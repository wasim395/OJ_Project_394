import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const STATUS_OPTIONS = ['Draft', 'Validated', 'Published'];

export default function Admin() {
    const [problemList, setProblemList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [problemToDelete, setProblemToDelete] = useState(null);
    const [selectedStatuses, setSelectedStatuses] = useState(new Set(['all']));

    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${SERVER_URL}/admin`, { withCredentials: true });
            setProblemList(res.data);
        } catch (err) {
            setError("Failed to fetch problems. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (selectedStatuses.has('all')) {
            setFilteredList(problemList);
        } else {
            const filtered = problemList.filter(problem =>
                selectedStatuses.has(problem.status?.toLowerCase())
            );
            setFilteredList(filtered);
        }
    }, [problemList, selectedStatuses]);

    const handleCreateProblem = async () => {
        try {
            const res = await axios.post(`${SERVER_URL}/admin/problems/draft`, {}, { withCredentials: true });
            // On success, navigate to the edit page for the new draft
            console.log("New draft created with ID:", res.data._id);
            navigate(`/admin/edit/${res.data._id}`);
        } catch (err) {
            setError("Failed to create a new problem draft.");
        }
    };


    const handleStatusChange = (status) => {
        const newStatuses = new Set(selectedStatuses);
        if (status === 'all') {
            newStatuses.clear();
            newStatuses.add('all');
        } else {
            newStatuses.delete('all');
            if (newStatuses.has(status)) {
                newStatuses.delete(status);
            } else {
                newStatuses.add(status);
            }
        }
        if (newStatuses.size === 0) {
            newStatuses.add('all');
        }
        setSelectedStatuses(newStatuses);
    };

    const handlePublish = async (problemId) => {
        try {
            console.log("Publishing problem with ID:", problemId);

            await axios.post(
                `${SERVER_URL}/automate/problems/${problemId}/publish`,
                {}, // no body needed
                { withCredentials: true }
            );

            fetchData();

        } catch (err) {
            setError("Failed to publish the problem.");
        }
    };

    const handleDeleteClick = (problem) => {
        setProblemToDelete(problem);
        setIsModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!problemToDelete) return;
        try {
            await axios.delete(`${SERVER_URL}/admin/delete/${problemToDelete._id}`, { withCredentials: true });
            fetchData();
        } catch (err) {
            setError("Failed to delete the problem.");
        } finally {
            closeModal();
        }
    };


    const closeModal = () => {
        setIsModalOpen(false);
        setProblemToDelete(null);
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.round((now - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);

        if (seconds < 60) return "just now";
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hr ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    const getDynamicClass = (value) => {
        if (!value) return '';
        const formattedValue = value.toLowerCase().replace(' ', '');
        return styles[formattedValue] || '';
    };

    const renderActionButtons = (problem) => {
        const status = problem.status?.toLowerCase();
        const deleteButton = (
            <Link
                to="#"
                onClick={(e) => { e.preventDefault(); handleDeleteClick(problem); }}
                className={`${styles.actionButton} ${styles.deleteButton}`}
            >
                Delete
            </Link>
        );

        switch (status) {
            case 'draft':
                return (
                    <>
                        <Link to={`/admin/edit/${problem._id}`} className={`${styles.actionButton} ${styles.continueButton}`}>
                            Continue Editing
                        </Link>
                        {deleteButton}
                    </>
                );
            case 'validated':
                return (
                    <>
                        <Link
                            to="#"
                            onClick={(e) => { e.preventDefault(); handlePublish(problem._id); }}
                            className={`${styles.actionButton} ${styles.publishButton}`}
                        >
                            Publish
                        </Link>
                        <Link to={`/admin/edit/${problem._id}`} className={`${styles.actionButton} ${styles.editButton}`}>Edit</Link>
                        {deleteButton}
                    </>
                );
            case 'published':
                return (
                    <>
                        <Link to={`/problem/${problem._id}`} className={`${styles.actionButton} ${styles.viewButton}`}>View</Link>
                        <Link to={`/admin/edit/${problem._id}`} className={`${styles.actionButton} ${styles.editButton}`}>Edit</Link>
                        {deleteButton}
                    </>
                );
            default:
                return null;
        }
    };

    if (isLoading) {
        return <div className={styles.centeredMessage}>Loading problems...</div>;
    }

    if (error) {
        return <div className={`${styles.centeredMessage} ${styles.errorMessage}`}>{error}</div>;
    }

    return (
        <div className={styles.container}>
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Delete Problem</h2>
                        <p>Are you sure you want to delete "{problemToDelete?.title}"? This action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button onClick={closeModal} className={`${styles.modalButton} ${styles.cancelButton}`}>Cancel</button>
                            <button onClick={confirmDelete} className={`${styles.modalButton} ${styles.confirmButton}`}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <header className={styles.header}>
                <h1>Manage Your Problems</h1>
                <div className={styles.headerActions}>
                    <div className={styles.filterGroup}>
                        <button
                            onClick={() => handleStatusChange('all')}
                            className={`${styles.filterButton} ${selectedStatuses.has('all') ? styles.activeFilter : ''}`}
                        >
                            All
                        </button>
                        {STATUS_OPTIONS.map(status => (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status.toLowerCase())}
                                className={`${styles.filterButton} ${selectedStatuses.has(status.toLowerCase()) ? styles.activeFilter : ''}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                    {/* <Link to="/admin/create" className={styles.createButton}>
                        + Create New Problem
                    </Link> */}
                    <button onClick={handleCreateProblem} className={styles.createButton}>
                        + Create New Problem
                    </button>
                </div>
            </header>

            <div className={styles.tableContainer}>
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredList.length > 0 ? filteredList.map((problem) => (
                            <tr key={problem._id}>
                                <td className={styles.titleCell}>{problem.title}</td>
                                <td><span className={`${styles.pill} ${getDynamicClass(problem.difficulty)}`}>{problem.difficulty}</span></td>
                                <td><span className={`${styles.pill} ${getDynamicClass(problem.status)}`}>{problem.status}</span></td>
                                <td>{formatRelativeTime(problem.updatedAt)}</td>
                                <td className={styles.actionsCell}>{renderActionButtons(problem)}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className={styles.noResults}>No problems found for the selected status.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}