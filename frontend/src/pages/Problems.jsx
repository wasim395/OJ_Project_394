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
const SERVER_URL = import.meta.env.VITE_SERVER_URL



export default function Problem() {
    const params = useParams();
    const problemId = params.id;
    const navigate = useNavigate();

    const [problemData, setProblem] = useState({});
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [code, setCode] = useState(`
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`);

    const [correct , setCorrect ] = useState("") ;
    const [total , setTotal ] = useState("") ;
    const [verdict , setVerdict ] = useState("") ;


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

    const runCode = async () => {

        const sendData = { language: "cpp", code, input };
        
        try {
            const req = await axios.post(`${SERVER_URL}/compiler/run`, sendData, { withCredentials: true });
            setOutput(req.data);
        } catch (error) {
            console.log(error); 
        }
    }

    const submitCode = async () => {
        console.log("code : " , code);
        const tempData = { language: "cpp", code };
    
        try {
            const req = await axios.post(`${SERVER_URL}/compiler/submit/${problemId}`, tempData , { withCredentials: true });
            console.log(req.data)  ;
            console.log(req.data) ;
            setCorrect(req.data.correct) ;
            setTotal(req.data.total) ;
            setVerdict(req.data.verdict) ;
            
        } catch (error) {

            if( error.response.status == "401" ){
                console.log("user is not login") ;
                navigate('/LoginRegister');
            }
            console.log("Error while submitting");
            console.log(error, " this is error box while submitting");
        }
    }
    

    return (

            <div className={styles.container}>
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
                    
                    {/* <div className={styles.inputOutput}>
                        <div>
                        <h3>Input</h3>
                        <textarea
                            className={styles.textarea}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        </div>
                        <div>
                        <h3>Output</h3>
                        <textarea
                            className={styles.textarea}
                            value={output}
                            readOnly={true}
                        />
                        </div>
                    </div>
                    <div className={styles.buttonDiv}>
                        <button className={styles.button} onClick={runCode}>Run</button>
                        <div className={styles.verdict}>Verdict: {verdict}</div>
                        <div className={styles.result}>Result: {`${correct}/${total}`}</div>
                        <div className={styles.submit} onClick={submitCode}>Submit</div>
                    </div> */}

                    <CompilerBox problemId={problemId}  code={code}/> 

                </div>

                

            </div>
    );
}
