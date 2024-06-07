import React from 'react'
import axios from 'axios'
import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CompilerBox.module.css' ;

const SERVER_URL = import.meta.env.VITE_SERVER_URL

const CompilerBox = (props) => {

    const navigate = useNavigate();
    const problemId = props.problemId ;
    const code = props.code ;
    
    const [ inputBox , setInputBox ] = useState(true) ;
    const [ outputBox , setOutputBox ] = useState(false) ;
    const [ verdictBox , setVerdictBox ] = useState(false) ;

    const [activeButton , setActiveButton ] = useState("input") ;

    //for data inside the box 
    const [ input , setInput ] = useState("") ;
    const [ output , setOutput ] = useState("") ;
    

    const [correct , setcorrect ] = useState("") ;
    const [total , setTotal ] = useState("") ;
    const [verdict , setVerdict ] = useState("") ;


    const runCode = async () => {
        console.log( input ) ;
        console.log( code ) ;
        const sendData = { language: "cpp", code , input };
        console.log( input ) ;
        console.log( code ) ;
        
        try {
            const req = await axios.post(`${SERVER_URL}/compiler/run`, sendData, { withCredentials: true });
            setOutput(req.data);
            handleOutputBox() ;
        } catch (error) {
            console.log( error.response.data ); 
            setOutput(error.response.data );
            handleOutputBox() ;
        }
    }

    const submitCode = async () => {
        console.log("code : " , code);
        const tempData = { language: "cpp", code };
    
        try {
            const req = await axios.post(`${SERVER_URL}/compiler/submit/${problemId}`, tempData , { withCredentials: true });
            console.log(req.data)  ;
            console.log(req.data.correct) ;
            console.log(req.data.total) ;
            console.log(req.data.verdict) ;
            setcorrect(req.data.correct) ;
            setTotal(req.data.total) ;
            setVerdict(req.data.verdict) ;
            handleVerdictBox() ;

            
        } catch (error) {

            if( error.response.status == "401" ){
                console.log("user is not login") ;
                alert("you have to Login to Submit the code") ;
                navigate('/LoginRegister');
            }
            else if( error.response.status == "500" ){
                console.log( error.response.data ); 
                setOutput(error.response.data );
                handleOutputBox() ;
            }
            else{
                console.log(error) ;
            }
        }
    }

    const handleInputBox = () => {
        setInputBox( true ) ;
        setOutputBox( false ) ;
        setVerdictBox( false ) ;
        setActiveButton("input") ;
    };
    const handleOutputBox = () => {
        setInputBox( false ) ;
        setOutputBox( true ) ;
        setVerdictBox( false ) ;
        setActiveButton("output") ;
    };
    const handleVerdictBox = () => {
        setInputBox( false ) ;
        setOutputBox( false ) ;
        setVerdictBox( true ) ;
        setActiveButton("verdict") ;
    };


    return(
        <div className={styles.compilerBox}>
            <div className={styles.toolbar}>
                <div className={` ${styles.button}  
                                    ${activeButton == 'input' && (styles.activeButton)}` } 
                onClick={handleInputBox}>Input</div>
                <div className={` ${styles.button}  
                                    ${activeButton == 'output' && (styles.activeButton)}` }
                onClick={handleOutputBox}>Output</div>
                <div className={` ${styles.button} 
                                     ${activeButton == 'verdict' && (styles.activeButton)}` }
                onClick={handleVerdictBox}>Verdict</div>
            </div>

            <div className={styles.textAreaContainer}>
                {inputBox && (
                    <textarea
                        className={styles.textArea}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                )}

                {outputBox && (
                    <textarea
                        className={styles.textArea}
                        value={output}
                        readOnly={true}
                    />
                )}

                {verdictBox && (
                    <div
                        className={` ${styles.mdt} `}
                        readOnly={true}
                    >
                        { verdict === "ACCEPTED" ? <div className={styles.accepted}>ACCEPTED</div> :  "" }
                        { verdict === "WRONG ANSWER" ? <div className={styles.wa }>ACCEPTED</div> :  "" }
                        { verdict !== "" ? <div className={styles.result }>score : {correct}/{total}</div> :  "" }
                        
                    </div>
                )}
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.runButton} onClick={runCode} >Run</button>
                <button className={styles.submitButton} onClick={submitCode} >Submit</button>
            </div>
        </div>
        
    );

};
export default CompilerBox;
