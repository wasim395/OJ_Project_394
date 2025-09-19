// pages/Validation.jsx

import React, { useState, useMemo } from 'react';
import axios from 'axios';
import style from './Validation.module.css'; 

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Validation({ problemId, problemData, setProblemData, setStep }) {
    const [isRunning, setIsRunning] = useState(false);
    const [apiError, setApiError] = useState('');
    // This state will hold the temporary validation results returned by the API
    const [validationResults, setValidationResults] = useState(null);

    // Derive UI-relevant information from the temporary results
    const textWarnings = validationResults?.textAnalysis?.suggestions || [];

    const failedTestResults = useMemo(() =>
        (validationResults?.testCaseResults || []).filter(r => !r.passed),
        [validationResults]
    );

    const hasFailedHiddenCases = useMemo(() =>
        failedTestResults.some(r => !r.isSample),
        [validationResults]
    );

    const runValidation = async () => {
        setIsRunning(true);
        setApiError('');
        setValidationResults(null); // Clear previous results
        try {
            const res = await axios.post(
                `${SERVER_URL}/automate/problems/${problemId}/validate`,
                {}, { withCredentials: true }
            );
            setProblemData(res.data.problem); // Update problem data (status may have changed)
            setValidationResults(res.data.validationResults); // Store temporary results in state
        } catch (err) {
            setApiError(err.response?.data?.message || 'The validation process failed to run.');
        } finally {
            setIsRunning(false);
        }
    };

    const deleteFailedHiddenCases = async () => {
        // Get the _id's from the temporary results stored in our local state
        const failedHiddenIds = (validationResults?.testCaseResults || [])
            .filter(r => !r.passed && !r.isSample)
            .map(r => r.testCaseId);

        if (failedHiddenIds.length === 0) return;

        setIsRunning(true);
        setApiError('');
        try {
            const res = await axios.post(
                `${SERVER_URL}/admin/problems/${problemId}/delete-test-cases`,
                { testCaseIds: failedHiddenIds },
                { withCredentials: true }
            );
            setProblemData(res.data); // Update with the pruned problem
            setValidationResults(null); // Clear old results, encouraging a re-run
        } catch (err) {
            setApiError(err.response?.data?.message || 'Could not delete test cases.');
        } finally {
            setIsRunning(false);
        }
    };

    const publishProblem = async () => {
        try {
            await axios.post(
                `${SERVER_URL}/automate/problems/${problemId}/publish`,
                {}, { withCredentials: true }
            );
            setStep(4);
        } catch (err) {
            setApiError(err.response?.data?.message || 'This problem must be validated before it can be published.');
        }
    };

    const renderResults = () => {
        if (!validationResults) return null; // Only render if a validation has been run

        const { allHiddenTestsPassed } = validationResults;
        return (
            <div className={style.resultsContainer}>
                {allHiddenTestsPassed ? (
                    <h3 className={style.success}>✅ Validation Passed</h3>
                ) : (
                    <h3 className={style.failure}>❌ Validation Failed</h3>
                )}

                {textWarnings.length > 0 && (
                    <div className={style.warningsSection}>
                        <h4>Statement Warnings</h4>
                        <ul>{textWarnings.map((w, i) => <li key={i}><strong>{w.type}:</strong> "{w.originalText}" → {w.suggestion}</li>)}</ul>
                    </div>
                )}

                {failedTestResults.length > 0 && (
                    <div className={style.failuresSection}>
                        <h4>Failed Test Cases ({failedTestResults.length})</h4>
                        <ul>{failedTestResults.map((result, i) => <li key={result.testCaseId}>Test Case ({result.isSample ? 'Sample' : 'Hidden'}) with input `"{result.input.substring(0, 50)}..."` failed.</li>)}</ul>
                    </div>
                )}

                <div className={style.actions}>
                    {hasFailedHiddenCases && <button onClick={deleteFailedHiddenCases} className={style.actionButton} disabled={isRunning}>Delete Failed Hidden Cases</button>}
                    {problemData.status === 'validated' && <button onClick={publishProblem} className={`${style.actionButton} ${style.publishButton}`} disabled={isRunning}>Publish Problem</button>}
                </div>
            </div>
        );
    };

    return (
        <div className={style.validationContainer}>
            <h2>Validate & Publish</h2>
            <p>This will run a generated solution against all test cases to check for correctness.</p>

            <div className={style.controls}>
                <button onClick={runValidation} disabled={isRunning}>
                    {isRunning ? 'Running...' : (validationResults ? 'Re-run Validation' : 'Run Validation')}
                </button>
            </div>

            {apiError && <p className={style.errorMessage}>{apiError}</p>}

            {renderResults()}

            <button onClick={() => setStep(2)} className={style.backButton} disabled={isRunning}>
                ← Back to Test Cases
            </button>
        </div>
    );
}