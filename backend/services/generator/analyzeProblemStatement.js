const { callLLM } = require("./llmClient");

async function analyzeProblemStatement(problem) {
    const prompt = `
You are a helpful assistant for a coding platform. Your task is to review a coding problem's text for quality.
Analyze the following problem's title and statement for any spelling mistakes, grammatical errors, or areas where clarity could be improved.
Provide feedback as a list of suggestions. These are warnings, not errors.

Problem Title: ${problem.title}
Problem Statement: ${problem.problemStatement}

Respond ONLY with a JSON object in the following format. If there are no issues, return an empty "suggestions" array.
{
  "suggestions": [
    {
      "type": "Spelling" | "Grammar" | "Clarity",
      "originalText": "The text with the issue.",
      "suggestion": "Your suggestion for how to fix or improve the text.",
      "explanation": "A brief explanation of why the change is recommended."
    }
  ]
}
`;

    try {
        const rawOutput = await callLLM(prompt);
        const match = rawOutput.match(/\{[\s\S]*\}/);
        if (!match) {
            console.error("No JSON object found in LLM output for problem analysis.");
            return { suggestions: [] };
        }
        return JSON.parse(match[0]);
    } catch (err) {
        console.error("Failed to parse LLM output for problem analysis:", err);
        // Return a default object on failure so the process doesn't crash
        return {
            suggestions: [{
                type: "Clarity",
                originalText: "N/A",
                suggestion: "Could not be automatically analyzed.",
                explanation: "The AI analysis service failed to process the problem statement."
            }]
        };
    }
}

module.exports = { analyzeProblemStatement };