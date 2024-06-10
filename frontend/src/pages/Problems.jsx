import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './Problems.module.css';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/c_cpp';
import { useNavigate } from 'react-router-dom';

import CompilerBox from './CompilerBox';
import CodePopup from '../component/CodePopup';
const SERVER_URL = import.meta.env.VITE_SERVER_URL



export default function Problem() {
    const params = useParams();
    const problemId = params.id;
    const navigate = useNavigate();

    const [problemData, setProblem] = useState({});
    const [code, setCode] = useState(`
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`);

    const [showProblem , setShowProblem ] = useState(true) ;
    const [showSubmission, setShowSubmission ] = useState(false) ;
    const [sumbmissionList , setSubmissionList ] = useState([]) ;



    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const req = await axios.get( `${SERVER_URL}/problem/${problemId}`, { withCredentials: true });
                setProblem(req.data);
            } catch (error) {
                console.log("Error while problem fetching in problem route ", error);
            }
        }
        fetchProblem();
    }, [problemId]);

    const handleCodeChange = (newCode) => {
        setCode(newCode);
    };



    useEffect( () => {
        
        const fetchProblem = async () => {
            try {
                const req = await axios.get( `${SERVER_URL}/submissionHistory/${problemId}`, { withCredentials: true });
                setSubmissionList(req.data);
            } catch (error) {
                console.log("Error while problem fetching in problem route ", error);
            }
        }
        fetchProblem();

    } , [showSubmission]);

    const sumbmissionClicked = () => {
        setShowProblem(false) ;
        setShowSubmission(true) ;
    }
    const problemClicked = () => {
        setShowProblem(true) ;
        setShowSubmission(false) ;
    }

    const getTime = ( subTime ) => {
        const currTime = Math.floor(Date.now() / 1000) ;
        const diff = currTime - subTime ;

        if( diff < 60 ){
            return `${diff} sec` ;
        }
        const min = Math.floor(diff / 60) ;
        if( min < 60 ){
            return `${min} min` ;
        }
        const hour = Math.floor(min / 60) ;
        if( hour < 24 ){
            return `${hour} hour` ;
        }

        const day = Math.floor(min / 24) ;
        return `${day} day` ;
    }

    return (

            <div className={styles.container}>
                
                <div>
                    {/* <div>
                        <div onClick={problemClicked} > Problem </div>
                        <div onClick={sumbmissionClicked} > My Submission </div>
                    </div> */}
                    <div className={styles.tabContainer}>
                        <div 
                            onClick={problemClicked} 
                            className={`${styles.tab} ${showProblem ? styles.activeTab : styles.nonActiveTab}`}
                        >
                            Problem
                        </div>
                        <div 
                            onClick={sumbmissionClicked} 
                            className={`${styles.tab} ${showSubmission ? styles.activeTab : styles.nonActiveTab}`}
                        >
                            My Submission
                        </div>
                    </div>

                    {(showProblem && 
                        <div className={styles.problem}>
                            <div className={styles.title}>{problemData.title}</div>
                            <div className={styles.problemStatement}>{problemData.problemStatement}</div>
                            <div className={styles.inputOutput1}>
                                <span>Input</span>
                                <div>{problemData.expectedInput}</div>
                                <span>Output</span>
                                <div>{problemData.expectedOutput}</div>
                            </div>
                        </div>
                    )}

                    {(showSubmission && 
                        <div className={`${styles.problem} ${styles.submissionListContainer}`}>
                            <table className={styles.submissionTable}>
                                <thead>
                                <tr>
                                    <th>Verdict</th>
                                    <th>Score</th>
                                    <th>Submission Time</th>
                                    <th>Code</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sumbmissionList.map((submission, index) => (
                                    <tr key={index} className={submission.verdict.trim().toUpperCase() === "ACCEPTED" ? styles.acceptedRow : styles.rejectedRow}>
                                    <td>{submission.verdict}</td>
                                    <td>{submission.score}</td>
                                    <td>{getTime(submission.submissionTime)}</td>
                                    <td><CodePopup code={submission.code} /></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                    )}

                </div>



                <div className={styles.codeEditor}>
                    <div>Code</div> 
                    <AceEditor
                    mode="c_cpp"
                    theme="monokai"
                    name="cpp-editor"
                    value={code}
                    onChange={handleCodeChange}
                    editorProps={{ $blockScrolling: true }}
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                    }}
                    style={{
                        width: '100%',
                        minHeight: '300px',
                        borderRadius: '4px',
                        border: '1px solid #ccc', // You can override border styles here if needed
                        fontSize: '14px', // You can adjust font size here if needed
                        /* Add any additional styles you need */
                      }}
                    />

                    <CompilerBox problemId={problemId}  code={code}/> 

                </div>

                

            </div>
    );
}