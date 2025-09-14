const { validateProblem } = require("../../services/generator/validateProblem");
const { markProblemValidated } = require("../../services/generator/markProblemValidated");
const { generateReferenceSolution } = require("../../services/generator/generateReferenceSolution");
const { analyzeValidationError } = require("../../services/generator/errorAnalysis");
const Problem = require("../../models/Problems");

async function validateAndPrepareController(req, res) {
    try {
        const { problemId } = req.params;
        const problem = await Problem.findById(problemId);
        if (!problem) throw new Error("Problem not found");

        if (!problem.hiddenTestCases?.length) {
            return res.status(400).json({ success: false, message: "Problem must have hidden test cases before validation" });
        }

        // Generate reference solution
        const referenceSolution = await generateReferenceSolution(problem);

        // Validate problem
        const validationResults = await validateProblem(problem, referenceSolution);

        if (!validationResults.allPassed) {
            // Run error analysis
            const errorAnalysis = await analyzeValidationError(problem, validationResults, referenceSolution);
            return res.status(400).json({ 
                success: false, 
                validationResults, 
                errorAnalysis 
            });
        }

        // Mark as validated
        const validatedProblem = await markProblemValidated(problem._id, validationResults, referenceSolution);

        res.json({ success: true, problem: validatedProblem, validationResults });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { validateAndPrepareController };
