const { generateHiddenTestCases } = require("../../services/generator/generateHiddenTestCase");

async function addHiddenTestCasesController(req, res) {
    try {
        console.log("generateHiddenTestCase.js called");
        console.log("Request body:", req.body);
        console.log("Request params:", req.params);

        const { problemId } = req.params;
        const { n } = req.body;

        if (!problemId) {
            return res.status(400).json({
                success: false,
                message: "Problem ID is required"
            });
        }

        if (!n || n <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid number of test cases. Must be greater than 0."
            });
        }

        if (n > 20) {
            return res.status(400).json({
                success: false,
                message: "Cannot generate more than 20 test cases at once."
            });
        }

        const problem = await generateHiddenTestCases(problemId, n);

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: "Problem not found"
            });
        }

        res.status(200).json({ success: true, data: problem });
    } catch (error) {
        console.error("Error generating hidden test cases:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

module.exports = { addHiddenTestCasesController };
