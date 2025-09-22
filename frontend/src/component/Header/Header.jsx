import React from 'react';
import style from './Header.module.css';

export default function Header({ searchTerm, onSearchChange, onToggleFilters, showFilters }) {
    return (
        <header className={style.header}>
            <h1 className={style.title}>Explore Coding Problems</h1>
            <div className={style.controls}>
                <input
                    type="text"
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                    className={style.searchInput}
                />
                <button onClick={onToggleFilters} className={style.toggleBtn}>
                    {showFilters ? '✕ Hide Filters' : '☰ Show Filters'}
                </button>
            </div>
        </header>
    );
}
