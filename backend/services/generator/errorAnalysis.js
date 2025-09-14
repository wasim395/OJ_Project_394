const { callLLM } = require("./llmClient");

async function analyzeValidationError(problem, validationResults, referenceSolution) {
    const prompt = `
You are an expert coding platform assistant.
A problem has failed automated validation.
Classify the reason into one of the following categories:
- Statement Error
- Hidden Test Error
- Solution Error

Problem:
${JSON.stringify({
        title: problem.title,
        problemStatement: problem.problemStatement,
        expectedInput: problem.expectedInput,
        expectedOutput: problem.expectedOutput,
        constraints: problem.constraints,
        sampleTestCases: problem.sampleTestCases,
        hiddenTestCases: problem.hiddenTestCases
    }, null, 2)}

Reference Solution:
${referenceSolution}

Validation Results:
${JSON.stringify(validationResults, null, 2)}

Respond ONLY with JSON:
{ "errorType": "Statement Error|Hidden Test Error|Solution Error", "message": "explanation" }
`;

    const rawOutput = await callLLM(prompt);

    let result;
    try {
        const match = rawOutput.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("No JSON found in LLM output");
        result = JSON.parse(match[0]);
    } catch (err) {
        throw new Error("Failed to parse LLM error analysis output");
    }

    return result;
}

module.exports = { analyzeValidationError };
