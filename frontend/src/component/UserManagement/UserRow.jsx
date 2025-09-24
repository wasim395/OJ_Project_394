import React from 'react';
import styles from './UserRow.module.css';

export default function UserRow({ user, onToggleRole, onDeleteUser }) {
    const handleDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
            onDeleteUser(user._id);
        }
    };

    return (
        <tr>
            <td className={styles.nameCell}>{user.firstName} {user.lastName}</td>
            <td>{user.email}</td>
            <td>
                <span className={`${styles.pill} ${styles[user.role]}`}>
                    {user.role}
                </span>
            </td>
            <td className={styles.actionsCell}>
                <button
                    onClick={() => onToggleRole(user._id)}
                    className={`${styles.actionButton} ${styles.toggle}`}
                >
                    {user.role === 'user' ? 'Promote' : 'Demote'}
                </button>
                <button
                    onClick={handleDeleteClick}
                    className={`${styles.actionButton} ${styles.delete}`}
                >
                    Delete
                </button>
            </td>
        </tr>
    );
}
