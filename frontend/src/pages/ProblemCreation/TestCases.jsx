import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import styles from './TestCases.module.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const TestCases = ({ problemData, setProblemData, handleBack, runValidation }) => {
    const [manualInput, setManualInput] = useState('');
    const [manualOutput, setManualOutput] = useState('');
    const [numToGenerate, setNumToGenerate] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    if (!problemData) return <div>Loading...</div>;

    const saveHiddenCases = async () => {
        setIsSaving(true);
        try {
            const res = await axios.put(
                `${SERVER_URL}/admin/problems/${problemData._id}`,
                { data: { hiddenTestCases: problemData.hiddenTestCases } },
                { withCredentials: true }
            );
            setProblemData(res.data);
            alert('Hidden test cases saved.');
        } catch (err) {
            console.error('Save failed', err);
            alert('Failed to save hidden test cases.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveNext = async () => {
        await saveHiddenCases();
        runValidation(); // advance to validation
    };

    const addManualTestCase = () => {
        if (!manualInput.trim() || !manualOutput.trim()) {
            alert('Please provide both input and expected output.');
            return;
        }
        const newTestCase = { input: manualInput, output: manualOutput };
        setProblemData(prev => ({
            ...prev,
            hiddenTestCases: [...(prev.hiddenTestCases || []), newTestCase],
        }));
        setManualInput('');
        setManualOutput('');
    };

    const handleGenerateWithAI = async () => {
        if (!numToGenerate || numToGenerate <= 0) {
            alert('Enter a valid number.');
            return;
        }
        setIsGenerating(true);
        try {
            const res = await axios.post(
                `${SERVER_URL}/automate/problems/${problemData._id}/hidden`,
                { n: numToGenerate },
                { withCredentials: true }
            );
            if (res.data.success) {
                setProblemData(res.data.data);
            } else {
                alert(`Error: ${res.data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('AI generation failed.');
        } finally {
            setIsGenerating(false);
        }
    };

    const removeTestCase = idx => {
        const arr = problemData.hiddenTestCases || [];
        setProblemData(prev => ({
            ...prev,
            hiddenTestCases: arr.filter((_, i) => i !== idx),
        }));
    };

    const testCases = problemData.hiddenTestCases || [];
    const totalCount = testCases.length;

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <div className={styles.card}>
                    <h3>AI Hidden Test Case Generation</h3>
                    <div className={styles.aiGenerateForm}>
                        <input
                            type="number"
                            value={numToGenerate}
                            onChange={e => setNumToGenerate(Number(e.target.value))}
                            min="1"
                            max="20"
                            disabled={isGenerating}
                        />
                        <button
                            className={styles.btnAi}
                            onClick={handleGenerateWithAI}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </button>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3>Manual Hidden Test Case Input</h3>
                    <div className={styles.formGroup}>
                        <label>Input</label>
                        <textarea
                            value={manualInput}
                            onChange={e => setManualInput(e.target.value)}
                            rows="3"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Expected Output</label>
                        <textarea
                            value={manualOutput}
                            onChange={e => setManualOutput(e.target.value)}
                            rows="3"
                        />
                    </div>
                    <button className={styles.addBtn} onClick={addManualTestCase}>
                        + Add Hidden Test Case
                    </button>
                </div>

                <div className={styles.card}>
                    <h3>Current Hidden Test Cases ({totalCount})</h3>
                    <div className={styles.testCaseList}>
                        {testCases.length === 0 ? (
                            <p className={styles.emptyState}>No hidden test cases added yet.</p>
                        ) : (
                            testCases.map((tc, idx) => (
                                <div className={styles.testCaseItem} key={idx}>
                                    <div className={styles.testCaseHeader}>
                                        <strong>Test Case #{idx + 1}</strong>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeTestCase(idx)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <div className={styles.testCaseBody}>
                                        <div>
                                            <strong>Input:</strong>
                                            <pre>{tc.input}</pre>
                                        </div>
                                        <div>
                                            <strong>Output:</strong>
                                            <pre>{tc.output}</pre>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.sidebar}>
                <div className={styles.formActions}>
                    <button
                        onClick={handleBack}
                        className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                        ← Back
                    </button>
                    <button
                        onClick={saveHiddenCases}
                        className={styles.btn}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                        onClick={handleSaveNext}
                        className={styles.btn}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving…' : 'Save & Next →'}
                    </button>
                </div>
                <div className={styles.card}>
                    <h3>Test Case Summary</h3>
                    <div className={styles.progressItem}>
                        <span>Total Hidden Cases</span>
                        <span className={styles.count}>{totalCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestCases;
