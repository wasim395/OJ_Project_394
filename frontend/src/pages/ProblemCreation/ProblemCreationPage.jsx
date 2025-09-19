import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import style from './ProblemCreationPage.module.css';
import ProblemDetails from './ProblemDetails';
import TestCases from './TestCases';
import Validation from './Validation';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const STEPS = ['Problem Details', 'Test Cases', 'Validate', 'Publish'];

const ProblemCreationPage = () => {
    const { problemId } = useParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [problemData, setProblemData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            setIsLoading(true);
            setError(null);
            if (!problemId) {
                setError('No problem ID provided.');
                setIsLoading(false);
                return;
            }
            try {
                const res = await axios.get(
                    `${SERVER_URL}/admin/problems/${problemId}`,
                    { withCredentials: true }
                );
                setProblemData(res.data);
            } catch (err) {
                console.error('Failed to fetch problem', err);
                setError('Could not load the problem. It might have been deleted.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProblem();
    }, [problemId]);

    const handleNext = () => currentStep < 4 && setCurrentStep(step => step + 1);
    const handleBack = () => currentStep > 1 && setCurrentStep(step => step - 1);
    const goToValidation = () => setCurrentStep(3);

    if (isLoading) {
        return <div className={style.loadingMessage}>Loading Problem Editor...</div>;
    }
    if (error) {
        return <div className={style.errorMessage}>{error}</div>;
    }
    if (!problemData) {
        return <div className={style.errorMessage}>No problem data found.</div>;
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <ProblemDetails
                        problemData={problemData}
                        setProblemData={setProblemData}
                        handleNext={handleNext}
                    />
                );
            case 2:
                return (
                    <TestCases
                        problemData={problemData}
                        setProblemData={setProblemData}
                        handleBack={handleBack}
                        runValidation={goToValidation}
                    />
                );
            case 3:
                return (
                    <Validation
                        problemId={problemId}
                        problemData={problemData}
                        setProblemData={setProblemData}
                        setStep={setCurrentStep}
                    />
                );
            case 4:
                return (
                    <div className={style.publishedContainer}>
                        <h2>🎉 Problem Published!</h2>
                        <p>The problem is now live and available for users.</p>
                    </div>
                );
            default:
                return <div>Error: Invalid step.</div>;
        }
    };

    return (
        <div className={style['creation-page']}>
            <div className={style['creation-header']}>
                <h1>Edit Problem</h1>
            </div>
            <div className={style.stepper}>
                <div className={style.stepperLine} />
                {STEPS.map((label, i) => {
                    const idx = i + 1;
                    const cls =
                        idx === currentStep
                            ? `${style.stepperStep} ${style.active}`
                            : idx < currentStep
                                ? `${style.stepperStep} ${style.completed}`
                                : style.stepperStep;
                    return (
                        <div className={cls} key={label}>
                            <div className={style.stepperDot} />
                            <div className={style.stepperLabel}>{label.replace(' ', '\u00A0')}</div>
                        </div>
                    );
                })}
            </div>
            <div className={style['creation-content']}>{renderStepContent()}</div>
        </div>
    );
};

export default ProblemCreationPage;