import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompilerBox.module.css';

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const CompilerBox = (props) => {

    const navigate = useNavigate();
    const problemId = props.problemId;
    const code = props.code;

    const [inputBox, setInputBox] = useState(true);
    const [outputBox, setOutputBox] = useState(false);
    const [verdictBox, setVerdictBox] = useState(false);

    const [activeButton, setActiveButton] = useState("input");

    //for data inside the box 
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");

    const [correct, setcorrect] = useState("");
    const [total, setTotal] = useState("");
    const [verdict, setVerdict] = useState("");

    // Loading states
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const runCode = async () => {
        console.log(input);
        console.log(code);

        // Check if code is empty
        if (!code.trim()) {
            setOutput('Error: Please write some code first.');
            handleOutputBox();
            return;
        }

        setIsRunning(true);
        setOutput('Running...');
        handleOutputBox();

        const sendData = { language: "cpp", code, input };
        console.log(input);
        console.log(code);

        try {
            const req = await axios.post(`${SERVER_URL}/compiler/run`, sendData, { withCredentials: true });
            console.log('Response data:', req.data); // Debug log

            // Handle different response formats
            let outputText = '';
            if (typeof req.data === 'string') {
                outputText = req.data;
            } else if (req.data && typeof req.data === 'object') {
                // If response is an object, try to get the output property
                if (req.data.output !== undefined) {
                    outputText = req.data.output;
                } else if (req.data.result !== undefined) {
                    outputText = req.data.result;
                } else if (req.data.stdout !== undefined) {
                    outputText = req.data.stdout;
                } else {
                    // If no known property, stringify the object
                    outputText = JSON.stringify(req.data, null, 2);
                }
            } else {
                outputText = String(req.data);
            }

            setOutput(outputText || 'No output');
            handleOutputBox();
        } catch (error) {
            console.log('Error response:', error.response); // Debug log
            let errorMessage = '';

            if (error.response && error.response.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else {
                    errorMessage = JSON.stringify(error.response.data, null, 2);
                }
            } else {
                errorMessage = error.message || 'Runtime Error';
            }

            if (errorMessage === "TLE" || errorMessage.includes("TLE")) {
                setOutput("Time Limit Exceeded");
            } else {
                setOutput(errorMessage);
            }
            handleOutputBox();
        } finally {
            setIsRunning(false);
        }
    }

    const submitCode = async () => {
        console.log("code : ", code);

        // Check if code is empty
        if (!code.trim()) {
            alert('Please write some code first.');
            return;
        }

        setIsSubmitting(true);
        setVerdict('Judging...');
        setcorrect('');
        setTotal('');
        handleVerdictBox();

        const tempData = { language: "cpp", code };

        try {
            const req = await axios.post(`${SERVER_URL}/compiler/submit/${problemId}`, tempData, { withCredentials: true });
            console.log('Submit response:', req.data); // Debug log
            console.log(req.data.correct);
            console.log(req.data.total);
            console.log(req.data.verdict);
            setcorrect(req.data.correct);
            setTotal(req.data.total);
            setVerdict(req.data.verdict);
            handleVerdictBox();

        } catch (error) {
            console.log('Submit error:', error.response); // Debug log

            if (error.response && error.response.status == "401") {
                console.log("user is not login");
                alert("you have to Login to Submit the code");
                navigate('/LoginRegister');
            }
            else if (error.response && error.response.status == "500") {
                let errorMessage = '';
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = 'Server Error';
                }
                setOutput(errorMessage);
                handleOutputBox();
            }
            else {
                console.log(error);
                setOutput('Submission Error: ' + (error.message || 'Unknown error'));
                handleOutputBox();
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleInputBox = () => {
        setInputBox(true);
        setOutputBox(false);
        setVerdictBox(false);
        setActiveButton("input");
    };
    const handleOutputBox = () => {
        setInputBox(false);
        setOutputBox(true);
        setVerdictBox(false);
        setActiveButton("output");
    };
    const handleVerdictBox = () => {
        setInputBox(false);
        setOutputBox(false);
        setVerdictBox(true);
        setActiveButton("verdict");
    };

    return (
        <div className={styles.compilerBox}>
            <div className={styles.toolbar}>
                <div className={` ${styles.button}  
                                    ${activeButton == 'input' && (styles.activeButton)}`}
                    onClick={handleInputBox}>Input</div>
                <div className={` ${styles.button}  
                                    ${activeButton == 'output' && (styles.activeButton)}`}
                    onClick={handleOutputBox}>Output</div>
                <div className={` ${styles.button} 
                                     ${activeButton == 'verdict' && (styles.activeButton)}`}
                    onClick={handleVerdictBox}>Verdict</div>
            </div>

            <div className={styles.textAreaContainer}>
                {inputBox && (
                    <textarea
                        className={styles.textArea}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Enter your input here..."
                    />
                )}

                {outputBox && (
                    <textarea
                        className={styles.textArea}
                        value={output}
                        readOnly={true}
                        placeholder="Output will appear here..."
                    />
                )}

                {verdictBox && (
                    <div className={` ${styles.mdt} `}>
                        {isSubmitting ? (
                            <div className={styles.judging}>
                                <div className={styles.spinner}></div>
                                <div>Judging your solution...</div>
                            </div>
                        ) : (
                            <>
                                {verdict === "ACCEPTED" ? <div className={styles.accepted}>✅ ACCEPTED</div> : ""}
                                {verdict === "WRONG ANSWER" ? <div className={styles.wa}>❌ WRONG ANSWER</div> : ""}
                                {verdict === "TLE" ? <div className={styles.wa}>⏰ Time Limit Exceeded</div> : ""}
                                {verdict === "Error" ? <div className={styles.wa}>⚠️ Error</div> : ""}
                                {verdict !== "" && verdict !== "Judging..." ? <div className={styles.result}>Score: {correct}/{total}</div> : ""}
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.buttonContainer}>
                <button
                    className={`${styles.runButton} ${isRunning ? styles.loading : ''}`}
                    onClick={runCode}
                    disabled={isRunning || isSubmitting}
                >
                    {isRunning ? (
                        <>
                            <span className={styles.buttonSpinner}></span>
                            Running...
                        </>
                    ) : (
                        'Run'
                    )}
                </button>
                <button
                    className={`${styles.submitButton} ${isSubmitting ? styles.loading : ''}`}
                    onClick={submitCode}
                    disabled={isRunning || isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className={styles.buttonSpinner}></span>
                            Submitting...
                        </>
                    ) : (
                        'Submit'
                    )}
                </button>
            </div>
        </div>
    );
};

export default CompilerBox;
