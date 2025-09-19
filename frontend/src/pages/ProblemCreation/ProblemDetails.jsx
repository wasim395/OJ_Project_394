import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import styles from './ProblemDetails.module.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ProblemDetails = ({ problemData, setProblemData, handleNext }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const problemId = problemData._id;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProblemData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateWithAI = async () => {
        if (!problemId) return alert("Draft is still being created. Please wait a moment.");

        setIsGenerating(true);
        try {
            const suggestionRes = await axios.post(
                `${SERVER_URL}/automate/problems/create`,
                problemData,
                { withCredentials: true }
            );

            const aiSuggestedData = suggestionRes.data;

            console.log("AI Suggested Data:", aiSuggestedData);

            const updateRes = await axios.put(
                `${SERVER_URL}/admin/problems/${problemId}`,
                aiSuggestedData,
                { withCredentials: true }
            );

            setProblemData(updateRes.data);
            alert("Problem generated and saved!");
        } catch (err) {
            console.error("Error during AI generation:", err);
            alert("Failed to generate or save the problem. Check the server logs.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = async () => {
        if (!problemId) return;
        try {
            const res = await axios.put(`${SERVER_URL}/admin/problems/${problemId}`, { data: problemData }, { withCredentials: true });
            setProblemData(res.data);
            alert("Draft saved successfully!");
            return res.data;
        } catch (err) {
            console.error("Failed to save draft:", err);
            alert("Error: Could not save draft.");
            return null;
        }
    };

    const handleSaveAndProceed = async () => {
        const savedData = await handleSave();
        if (savedData) {
            handleNext();
        }
    };

    const handleSampleCaseChange = (index, field, value) => {
        const newSampleCases = [...(problemData.sampleTestCases || [])];
        newSampleCases[index][field] = value;
        setProblemData(prev => ({ ...prev, sampleTestCases: newSampleCases }));
    };

    const addSampleCase = () => {
        const currentCases = problemData.sampleTestCases || [];
        if (currentCases.length < 3) {
            setProblemData(prev => ({ ...prev, sampleTestCases: [...currentCases, { input: '', output: '' }] }));
        }
    };

    const removeSampleCase = (index) => {
        const newSampleCases = problemData.sampleTestCases.filter((_, i) => i !== index);
        setProblemData(prev => ({ ...prev, sampleTestCases: newSampleCases }));
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <button className={styles.btnAi} onClick={handleGenerateWithAI} disabled={isGenerating || !problemId}>
                    {isGenerating ? 'Generating...' : 'Generate with AI & Save'}
                </button>
                <p className={styles.aiHint}>Fill in any fields as hints. The problem will be generated and saved.</p>
            </div>

            <div className={styles.card}>
                <div className={styles.formGroup}>
                    <label>Problem Title</label>
                    <input type="text" name="title" value={problemData.title || ''} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                    <label>Difficulty</label>
                    <select name="difficulty" value={problemData.difficulty || 'easy'} onChange={handleChange}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label>Tags</label>
                    <input type="text" name="tags" value={Array.isArray(problemData.tags) ? problemData.tags.join(', ') : problemData.tags || ''} onChange={handleChange} placeholder="e.g., arrays, sorting" />
                </div>
                <div className={styles.formGroup}>
                    <label>Problem Statement</label>
                    <textarea name="problemStatement" value={problemData.problemStatement || ''} onChange={handleChange} rows="6" />
                </div>
                <div className={styles.formGroup}>
                    <label>Input Format</label>
                    <textarea name="expectedInput" value={problemData.expectedInput || ''} onChange={handleChange} rows="4" />
                </div>
                <div className={styles.formGroup}>
                    <label>Output Format</label>
                    <textarea name="expectedOutput" value={problemData.expectedOutput || ''} onChange={handleChange} rows="4" />
                </div>
                <div className={styles.formGroup}>
                    <label>Constraints</label>
                    <textarea name="constraints" value={Array.isArray(problemData.constraints) ? problemData.constraints.join('\n') : problemData.constraints || ''} onChange={handleChange} rows="5" />
                </div>
            </div>

            <div className={styles.card}>
                <div className={styles.formGroup}>
                    <label>Sample Test Cases</label>
                    {(problemData.sampleTestCases || []).map((sample, index) => (
                        <div className={styles.sampleCaseInput} key={index}>
                            <div className={styles.sampleCaseHeader}>
                                <span>Sample Case #{index + 1}</span>
                                {(problemData.sampleTestCases.length > 1) && (
                                    <button onClick={() => removeSampleCase(index)} className={styles.removeBtn}><FaTrash /> Remove</button>
                                )}
                            </div>
                            <textarea placeholder="Input" value={sample.input || ''} onChange={(e) => handleSampleCaseChange(index, 'input', e.target.value)} />
                            <textarea placeholder="Output" value={sample.output || ''} onChange={(e) => handleSampleCaseChange(index, 'output', e.g.target.value)} />
                        </div>
                    ))}
                    {(!problemData.sampleTestCases || problemData.sampleTestCases.length < 3) && (
                        <button onClick={addSampleCase} className={styles.addBtn}>+ Add Sample Case</button>
                    )}
                </div>
            </div>

            <div className={styles.formActions}>
                <button onClick={handleSave} className={`${styles.btn} ${styles.btnDraft}`}>Save Draft</button>
                <button onClick={handleSaveAndProceed} className={styles.btn}>Proceed to Test Cases →</button>
            </div>
        </div>
    );
};

export default ProblemDetails;