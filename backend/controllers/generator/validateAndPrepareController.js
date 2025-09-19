
const Problems = require("../../models/Problems");
const { analyzeProblemStatement } = require("../../services/generator/analyzeProblemStatement");
const { generateReferenceSolution } = require("../../services/generator/generateReferenceSolution");
const { validateProblem } = require("../../services/generator/validateProblem");

exports.validateAndPrepareController = async (req, res) => {
    try {
        const { problemId } = req.params;
        const problem = await Problems.findById(problemId);

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        // 1. Analyze the problem statement for warnings
        const textAnalysis = await analyzeProblemStatement(problem);

        // 2. Generate a reference solution in C++
        const solutionCode = await generateReferenceSolution(problem);

        // 3. Run the solution against all test cases
        const validationOutcome = await validateProblem(problem, solutionCode);

        // 4. Create a temporary results object to send to the frontend.
        const allTestCases = [...problem.sampleTestCases, ...problem.hiddenTestCases];
        const testCaseResults = validationOutcome.results.map((result, index) => ({
            testCaseId: allTestCases[index]._id, // The _id is available
            input: allTestCases[index].input,
            passed: result.passed,
            isSample: index < problem.sampleTestCases.length,
        }));

        // 5. Check if all hidden tests passed
        const allHiddenTestsPassed = testCaseResults
            .filter(result => !result.isSample)
            .every(result => result.passed);

        // 6. Only update the database if validation is a complete success
        if (allHiddenTestsPassed) {
            problem.status = "validated";
            await problem.save();
        }

        // 7. Always return the temporary validation results for the UI to display
        res.status(200).json({
            success: true,
            message: "Validation check complete.",
            problem, 
            validationResults: { 
                textAnalysis,
                testCaseResults,
                allHiddenTestsPassed,
            }
        });

    } catch (err) {
        console.error("Error during problem validation check:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};