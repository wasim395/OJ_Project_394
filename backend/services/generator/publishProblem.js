const Problem = require("../../models/Problems");

async function publishProblem(problemId, adminId) {
    const problem = await Problem.findById(problemId);
    if (!problem) throw new Error("Problem not found");

    if (problem.status !== "validated") {
        throw new Error("Only validated problems can be published");
    }

    problem.status = "published";
    problem.publishedAt = new Date();
    problem.publishedBy = adminId;

    await problem.save();
    return problem;
}

module.exports = { publishProblem };
