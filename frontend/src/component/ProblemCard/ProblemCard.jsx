import React from 'react';
import style from './ProblemCard.module.css';

export default function ProblemCard({ problem }) {
    return (
        <div className={style.card}>
            <div className={style.header}>
                <h3 className={style.title}>{problem.title}</h3>
                {problem.difficulty && (
                    <span className={`${style.badge} ${style[problem.difficulty]}`}>
                        {problem.difficulty}
                    </span>
                )}
            </div>
            {problem.tags?.length > 0 && (
                <div className={style.tags}>
                    {problem.tags.slice(0, 4).map((t, i) => (
                        <span key={i} className={style.tag}>{t}</span>
                    ))}
                    {problem.tags.length > 4 && (
                        <span className={style.more}>+{problem.tags.length - 4}</span>
                    )}
                </div>
            )}
        </div>
    );
}
