import React from 'react';
import style from './FiltersPanel.module.css';

export default function FiltersPanel({
    topics,
    selectedDifficulty,
    onDifficultyChange,
    selectedTags,
    onTagToggle,
    onClearAll
}) {
    const difficulties = [
        { label: 'All', value: '' },
        { label: 'Easy', value: 'easy' },
        { label: 'Medium', value: 'medium' },
        { label: 'Hard', value: 'hard' }
    ];

    return (
        <aside className={style.panel}>
            <h3 className={style.heading}>Filters</h3>

            <div className={style.section}>
                <h4 className={style.subheading}>Difficulty</h4>
                <div className={style.pillsRow}>
                    {difficulties.map(d => (
                        <span
                            key={d.value}
                            className={`${style.pill} ${selectedDifficulty === d.value ? style.pillActive : ''}`}
                            onClick={() => onDifficultyChange(d.value)}
                        >
                            {d.label}
                        </span>
                    ))}
                </div>
            </div>

            <div className={style.section}>
                <h4 className={style.subheading}>Topics</h4>
                <div className={style.pillsGrid}>
                    {topics.map(tag => (
                        <span
                            key={tag}
                            className={`${style.pill} ${selectedTags.includes(tag) ? style.pillActive : ''}`}
                            onClick={() => onTagToggle(tag)}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className={style.clearContainer}>
                <span className={style.clearLink} onClick={onClearAll}>
                    Clear All Filters
                </span>
            </div>
        </aside>
    );
}
