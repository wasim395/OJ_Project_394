const Problem = require("../../models/Problems");

async function markProblemValidated(problemId, validationResults, referenceSolution) {
    const problem = await Problem.findById(problemId);
    if (!problem) throw new Error("Problem not found");

    problem.status = "validated"; // mark as validated
    problem.validationResults = validationResults;
    problem.referenceSolution = referenceSolution;
    problem.validatedAt = new Date();

    await problem.save();
    return problem;
}

module.exports = { markProblemValidated };
