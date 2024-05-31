import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './create.module.css';

export default function Edit() {
  const { id: problemId } = useParams();

  const [title, setTitle] = useState('');
  const [problemStatement, setStatement] = useState('');
  const [explainInput, setExpectedInput] = useState('');
  const [explainOutput, setExpectedOutput] = useState('');
  const [testCases, setTestCases] = useState([]);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetching problem
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const req = await axios.get(`http://localhost:5000/problem/${problemId}`, { withCredentials: true });
        const data = req.data;
        console.log(data) ;
        setTitle(data.title);
        setStatement(data.problemStatement);
        setExpectedInput(data.expectedInput);
        setExpectedOutput(data.expectedOutput);
        setTestCases(data.testCase);
        setLoading(false);
      } catch (error) {
        console.error("Error while fetching problem:", error);
        setError('Failed to fetch problem data');
        setLoading(false);
      }
    };
    fetchProblem();
  }, []);

  function addTestCase() {
    if (input.trim() !== '' && output.trim() !== '') {
      setTestCases((prev) => [...prev, { input, output }]);
      setInput('');
      setOutput('');
    } else {
      alert('Please fill both input and output of Test Case');
    }
  }

  function deleteTestCase(index) {
    const newTestCase = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCase);
  }

  const updateProblem = async () => {
    if (title.trim() === '' || problemStatement.trim() === '' || explainInput.trim() === '' || explainOutput.trim() === '') {
      alert('Please fill all the details');
      return;
    }

    try {
      const dataToSend = { title, problemStatement, explainInput, explainOutput, testCases };
      const res = await axios.put(`http://localhost:5000/admin/edit/${problemId}`, dataToSend, { withCredentials: true });

      if (res.status === 200) {
        alert('Problem updated successfully');
      } else {
        alert('Failed to update the problem');
      }
    } catch (error) {
      console.error('Error while sending data:', error);
      alert('Error while updating the problem');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Edit Problem</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles['form-group']}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="description">Statement:</label>
            <textarea
              id="description"
              value={problemStatement}
              onChange={(e) => setStatement(e.target.value)}
              required
            ></textarea>
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="explainInput">Explain Input:</label>
            <textarea
              id="explainInput"
              value={explainInput}
              onChange={(e) => setExpectedInput(e.target.value)}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <label htmlFor="explainOutput">Explain Output:</label>
            <textarea
              id="explainOutput"
              value={explainOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              required
            />
          </div>
          <div className={styles.testCaseContainer}>
            <h1>Add Test Case</h1>
            <div className={styles.testCaseForm}>
              <div className={styles.testCaseForm1}>
                <label className={styles.testCaseFormDiv}>Input</label>
                <textarea
                  id="testcaseInput"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                  className={styles.testCaseFormTextarea}
                />
              </div>
              <div className={styles.testCaseForm1}>
                <label className={styles.testCaseFormDiv}>Output</label>
                <textarea
                  id="testcaseOutput"
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  required
                  className={styles.testCaseFormTextarea}
                />
              </div>
              <div>
                <div className={styles.addButton} onClick={addTestCase}>Add</div>
              </div>
            </div>
            <ol className={styles.testCaseList}>
              {testCases.map((value, key) => (
                <li key={key} className={styles.testCaseListLi}>
                  <div className={styles.testCaseListLiC}>{value.input}</div>
                  <div className={styles.testCaseListLiC}>{value.output}</div>
                  <div className={styles.deleteButton} onClick={() => deleteTestCase(key)}>Delete</div>
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.formSubitContainer}>
            <div className={styles.formSubmit} onClick={updateProblem}>
              Update Problem
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
