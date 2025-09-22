import React, { useState, useEffect } from 'react';
import { fetchProblems } from '../../api/problemService';
import Header from '../../component/Header/Header';
import FiltersPanel from '../../component/FiltersPanel/FiltersPanel';
import ProblemsGrid from '../../component/ProblemsGrid/ProblemsGrid';
import style from './Home.module.css';

export default function Home() {
    const [problems, setProblems] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState('');     
    const [tags, setTags] = useState([]);
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        fetchProblems().then(data => {
            setProblems(data);
            setFiltered(data);
        });
    }, []);

    useEffect(() => {
        let list = problems;
        if (search) list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        if (difficulty) list = list.filter(p => p.difficulty === difficulty);
        if (tags.length) list = list.filter(p => p.tags?.some(t => tags.includes(t)));
        setFiltered(list);
    }, [search, difficulty, tags, problems]);

    const allTags = [...new Set(problems.flatMap(p => p.tags || []))].sort();

    return (
        <div className={style.container}>
            <Header
                searchTerm={search}
                onSearchChange={setSearch}
                showFilters={showFilters}
                onToggleFilters={() => setShowFilters(!showFilters)}
            />

            <div className={style.content}>
                {showFilters && (
                    <FiltersPanel
                        topics={allTags}
                        selectedDifficulty={difficulty}     
                        onDifficultyChange={setDifficulty}   
                        selectedTags={tags}
                        onTagToggle={tag =>
                            setTags(prev => prev.includes(tag)
                                ? prev.filter(t => t !== tag)
                                : [...prev, tag])
                        }
                        onClearAll={() => {
                            setSearch('');
                            setDifficulty('');  
                            setTags([]);
                        }}
                    />
                )}
                <main className={style.main}>
                    <ProblemsGrid problems={filtered} />
                </main>
            </div>
        </div>
    );
}
