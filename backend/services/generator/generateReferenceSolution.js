const { callLLM } = require("./llmClient");

async function generateReferenceSolution(problem) {
    const prompt = `
You are a coding problem solver.
Generate a working C++ solution for this problem.

Title: ${problem.title}
Statement: ${problem.problemStatement}
Input: ${problem.expectedInput}
Output: ${problem.expectedOutput}
Constraints: ${problem.constraints.join(", ") || "None"}
Sample Test Cases: ${JSON.stringify(problem.sampleTestCases, null, 2)}

⚠️ Make sure the solution respects all constraints and passes all sample test cases.
Respond ONLY with code. No explanations.
`;

    const rawOutput = await callLLM(prompt);
    return rawOutput.replace(/```[a-z]*|```/gi, "").trim();
}

module.exports = { generateReferenceSolution };
