const { callLLM } = require("./llmClient");
const Problem = require("../../models/Problems.js");

// Batch size for LLM requests
const BATCH_SIZE = 3;

async function generateHiddenTestCases(problemId, n = 0) {
    if (n <= 0) return null; // nothing to do

    const problem = await Problem.findById(problemId);
    if (!problem) throw new Error("Problem not found");

    console.log(`Generating ${n} hidden test cases for problem ${problemId}...`);

    const newHiddenCases = [];

    while (newHiddenCases.length < n) {
        const batchSize = Math.min(BATCH_SIZE, n - newHiddenCases.length);

        const prompt = `
You are a coding test case generator.
Generate ${batchSize} hidden test cases (not trivial) for the following problem.
Each test case must be an object with "input" and "output".
Return ONLY a valid JSON array (no explanation, no extra text).

Problem:
${JSON.stringify(
            {
                title: problem.title,
                problemStatement: problem.problemStatement,
                expectedInput: problem.expectedInput,
                expectedOutput: problem.expectedOutput,
                constraints: problem.constraints,
            },
            null,
            2
        )}
`;

        const rawOutput = await callLLM(prompt);

        let batchCases;
        try {
            const jsonMatch = rawOutput.match(/\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error("No valid JSON array found in LLM response");

            batchCases = JSON.parse(jsonMatch[0]);
        } catch (e) {
            console.error("Error parsing LLM output:", e);
            throw new Error("LLM hidden test output could not be parsed as JSON");
        }

        if (!Array.isArray(batchCases) || batchCases.length === 0) {
            throw new Error("LLM did not return any hidden test cases");
        }

        newHiddenCases.push(...batchCases);
    }

    // Keep existing hidden test cases as well
    problem.hiddenTestCases = [...(problem.hiddenTestCases || []), ...newHiddenCases];
    problem.status = "draft"; // validated separately
    await problem.save();

    console.log(`Generated ${newHiddenCases.length} new hidden test cases successfully.`);
    return problem;
}

module.exports = { generateHiddenTestCases };
