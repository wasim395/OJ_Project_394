import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import Header from '../../component/UserManagement/Header';
import UserList from '../../component/UserManagement/UserList';
import styles from './SuperAdminDashboard.module.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function SuperAdminDashboard() {
    const [masterUserList, setMasterUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filters
    const [selectedRole, setSelectedRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${SERVER_URL}/super-admin/users`, { withCredentials: true });
            console.log('Fetched users:', res.data);
            setMasterUserList(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError("Failed to fetch users. You may not have the required permissions.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        let list = masterUserList;
        if (selectedRole !== 'all') {
            list = list.filter(user => user.role === selectedRole);
        }
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            list = list.filter(user =>
                (user.firstName?.toLowerCase() || '').includes(lower) ||
                (user.lastName?.toLowerCase() || '').includes(lower) ||
                (user.email?.toLowerCase() || '').includes(lower)
            );
        }
        setFilteredUserList(list);
    }, [searchTerm, selectedRole, masterUserList]);

    const handleToggleRole = async (userId) => {
        try {
            await axios.patch(`${SERVER_URL}/super-admin/users/${userId}/toggle-role`, {}, { withCredentials: true });
            fetchData();
        } catch {
            setError("Failed to toggle user role.");
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${SERVER_URL}/super-admin/users/${userId}`, { withCredentials: true });
            fetchData();
        } catch {
            setError("Failed to delete the user.");
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <Header
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
            />
            <UserList
                users={filteredUserList}
                isLoading={isLoading}
                error={error}
                onToggleRole={handleToggleRole}
                onDeleteUser={handleDeleteUser}
            />
        </div>
    );
}
