import React from 'react';
import styles from './Header.module.css';

const ROLE_OPTIONS = ['all', 'user', 'admin'];

export default function Header({ searchTerm, onSearchChange, selectedRole, onRoleChange }) {
    return (
        <header className={styles.headerLayout}>
            <h1>User Management</h1>
            <div className={styles.headerActions}>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <div className={styles.filterGroup}>
                    {ROLE_OPTIONS.map(role => (
                        <button
                            key={role}
                            onClick={() => onRoleChange(role)}
                            className={`${styles.filterButton} ${selectedRole === role ? styles.active : ''}`}
                        >
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}
