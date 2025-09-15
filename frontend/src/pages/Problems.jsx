import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AceEditor from "react-ace";
import styles from "./Problems.module.css";
import CompilerBox from "./CompilerBox";
import CodePopup from "../component/CodePopup";

// Ace imports
import "ace-builds/src-min-noconflict/ace";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-min-noconflict/snippets/c_cpp";

// Theme imports
import "ace-builds/src-min-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/theme-github";
import "ace-builds/src-min-noconflict/theme-tomorrow";
import "ace-builds/src-min-noconflict/theme-twilight";

// Mode import
import "ace-builds/src-min-noconflict/mode-c_cpp";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function Problem() {
    const { id: problemId } = useParams();
    const editorRef = useRef(null);
    const [problemData, setProblemData] = useState({});
    const [code, setCode] = useState(
        `#include <bits/stdc++.h>
using namespace std;

int main() {
    // Fast I/O
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Your code here
    cout << "Ready to code!" << endl;

    return 0;
}`
    );
    const [showProblem, setShowProblem] = useState(true);
    const [showSubmission, setShowSubmission] = useState(false);
    const [submissionList, setSubmissionList] = useState([]);
    const [editorTheme, setEditorTheme] = useState("monokai");
    const [fontSize, setFontSize] = useState(14);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/problem/${problemId}`, {
                    withCredentials: true,
                });
                setProblemData(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProblem();
    }, [problemId]);

    useEffect(() => {
        if (showSubmission) {
            const fetchSubs = async () => {
                try {
                    const res = await axios.get(
                        `${SERVER_URL}/submissionHistory/${problemId}`,
                        { withCredentials: true }
                    );
                    setSubmissionList(res.data);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchSubs();
        }
    }, [showSubmission, problemId]);

    const handleEditorLoad = (editor) => {
        setTimeout(() => {
            editor.gotoLine(1, 0, false);
            editor.renderer.scrollToY(0);
            editor.focus();
        }, 50);
    };

    const handleCodeChange = (newVal) => setCode(newVal);

    const getTime = (t) => {
        const diff = Math.floor(Date.now() / 1000) - t;
        if (diff < 60) return `${diff} sec`;
        const m = Math.floor(diff / 60);
        if (m < 60) return `${m} min`;
        const h = Math.floor(m / 60);
        if (h < 24) return `${h} hour`;
        return `${Math.floor(h / 24)} day`;
    };

    return (
        <div className={styles.container}>
            {/* Left Panel */}
            <div className={styles.leftPanel}>
                <div className={styles.tabContainer}>
                    <div
                        onClick={() => {
                            setShowProblem(true);
                            setShowSubmission(false);
                        }}
                        className={`${styles.tab} ${showProblem ? styles.activeTab : styles.nonActiveTab
                            }`}
                    >
                        Problem
                    </div>
                    <div
                        onClick={() => {
                            setShowProblem(false);
                            setShowSubmission(true);
                        }}
                        className={`${styles.tab} ${showSubmission ? styles.activeTab : styles.nonActiveTab
                            }`}
                    >
                        My Submission
                    </div>
                </div>
                <div className={styles.contentPanel}>
                    {showProblem && (
                        <div className={styles.problem}>
                            <div className={styles.problemHeader}>
                                <div className={styles.title}>{problemData.title}</div>
                                {problemData.difficulty && (
                                    <div className={styles.difficulty}>
                                        <strong>Difficulty:</strong> {problemData.difficulty}
                                    </div>
                                )}
                            </div>
                            <div className={styles.problemStatement}>
                                {problemData.problemStatement}
                            </div>
                            <div className={styles.inputOutput}>
                                <div>
                                    <span>Input</span>
                                    <pre>{problemData.expectedInput}</pre>
                                </div>
                                <div>
                                    <span>Output</span>
                                    <pre>{problemData.expectedOutput}</pre>
                                </div>
                            </div>
                            {problemData.constraints?.length > 0 && (
                                <div className={styles.constraints}>
                                    <h4>Constraints:</h4>
                                    <ul>
                                        {problemData.constraints.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {problemData.sampleTestCases?.length > 0 && (
                                <div className={styles.sampleTestCases}>
                                    <h4>Sample Test Cases:</h4>
                                    {problemData.sampleTestCases.map((test, i) => (
                                        <div key={i} className={styles.testCase}>
                                            <strong>Input:</strong>
                                            <pre>{test.input}</pre>
                                            <strong>Output:</strong>
                                            <pre>{test.output}</pre>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {problemData.tags?.length > 0 && (
                                <div className={styles.tags}>
                                    <strong>Tags:</strong> {problemData.tags.join(", ")}
                                </div>
                            )}
                        </div>
                    )}
                    {showSubmission && (
                        <div className={styles.submissionListContainer}>
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
                                    {submissionList.map((s, i) => (
                                        <tr
                                            key={i}
                                            className={
                                                s.verdict.trim().toUpperCase() === "ACCEPTED"
                                                    ? styles.acceptedRow
                                                    : styles.rejectedRow
                                            }
                                        >
                                            <td>{s.verdict}</td>
                                            <td>{s.score}</td>
                                            <td>{getTime(s.submissionTime)}</td>
                                            <td>
                                                <CodePopup code={s.code} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel */}
            <div className={styles.codeEditorPanel}>
                <div className={styles.editorHeader}>
                    <div className={styles.editorLabel}>Code</div>
                    <div className={styles.editorControls}>
                        <label>
                            Theme:
                            <select
                                value={editorTheme}
                                onChange={(e) => setEditorTheme(e.target.value)}
                            >
                                <option value="monokai">Monokai</option>
                                <option value="github">GitHub</option>
                                <option value="tomorrow">Tomorrow</option>
                                <option value="twilight">Twilight</option>
                            </select>
                        </label>
                        <label>
                            Font Size:
                            <select
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                            >
                                {[12, 14, 16, 18, 20, 22].map((sz) => (
                                    <option key={sz} value={sz}>
                                        {sz}px
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>

                <div className={styles.editorContainer}>
                    <div className={styles.aceEditorWrapper}>
                        <AceEditor
                            ref={editorRef}
                            mode="c_cpp"
                            theme={editorTheme}
                            name="cpp-editor"
                            value={code}
                            onChange={handleCodeChange}
                            onLoad={handleEditorLoad}
                            editorProps={{ $blockScrolling: Infinity }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: true,
                                showLineNumbers: true,
                                showGutter: true,
                                highlightActiveLine: true,
                                tabSize: 4,
                                useSoftTabs: true,
                                wrap: false,
                                fontSize,
                                scrollPastEnd: 0.1,
                                showPrintMargin: false, // Removes the vertical line in the editor
                            }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    </div>
                    <div className={styles.compilerBoxContainer}>
                        <CompilerBox problemId={problemId} code={code} />
                    </div>
                </div>
            </div>
        </div>
    );
}