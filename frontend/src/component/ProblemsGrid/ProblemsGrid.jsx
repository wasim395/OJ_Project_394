import React from 'react';
import { Link } from 'react-router-dom';
import ProblemCard from '../ProblemCard/ProblemCard';
import style from './ProblemsGrid.module.css';

export default function ProblemsGrid({ problems }) {
    return (
        <div className={style.grid}>
            {problems.map(p => (
                <Link key={p._id} to={`/problem/${p._id}`} className={style.link}>
                    <ProblemCard problem={p} />
                </Link>
            ))}
        </div>
    );
}
