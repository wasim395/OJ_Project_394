const { callLLM } = require("./llmClient");
const Problem = require("../../models/Problems.js");

async function generateHiddenTestCases(problemId) {
  const problem = await Problem.findById(problemId);
  if (!problem) throw new Error("Problem not found");

  const prompt = `
You are a coding test case generator.
Generate 2-3 hidden test cases (not trivial) for the following problem.
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

  let hiddenCases;
  try {
    // Extract JSON array using regex in case LLM wraps it in text
    const jsonMatch = rawOutput.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in LLM response");
    }

    hiddenCases = JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error("LLM hidden test output could not be parsed as JSON");
  }

  if (!Array.isArray(hiddenCases) || hiddenCases.length === 0) {
    throw new Error("Hidden test cases must be at least one");
  }

  problem.hiddenTestCases = hiddenCases;
  problem.status = "published";
  await problem.save();

  return problem;
}

module.exports = { generateHiddenTestCases };
