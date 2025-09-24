import React from 'react';
import UserRow from './UserRow';
import styles from './UserList.module.css';

export default function UserList({ users, isLoading, error, onToggleRole, onDeleteUser }) {
    const renderContent = () => {
        if (isLoading) {
            return <tr><td colSpan="4" className={styles.statusMessage}>Loading...</td></tr>;
        }
        if (error) {
            return <tr><td colSpan="4" className={`${styles.statusMessage} ${styles.errorMessage}`}>{error}</td></tr>;
        }
        if (!Array.isArray(users)) {
            console.error('UserList received non-array:', users);
            return <tr><td colSpan="4" className={`${styles.statusMessage} ${styles.errorMessage}`}>
                Invalid users data
            </td></tr>;
        }
        if (users.length === 0) {
            return <tr><td colSpan="4" className={styles.statusMessage}>No users found for the selected criteria.</td></tr>;
        }
        return users.map(user => (
            <UserRow
                key={user._id}
                user={user}
                onToggleRole={onToggleRole}
                onDeleteUser={onDeleteUser}
            />
        ));
    };

    return (
        <div className={styles.tableContainer}>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {renderContent()}
                </tbody>
            </table>
        </div>
    );
}
