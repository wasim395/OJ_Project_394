const { generateHiddenTestCases } = require("../../services/generator/generateHiddenTestCase");

async function addHiddenTestCasesController(req, res) {
    try {
        const { problemId } = req.params;
        const { n } = req.body; // number of hidden test cases to generate

        const problem = await generateHiddenTestCases(problemId, n);
        res.status(200).json({ success: true, data: problem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { addHiddenTestCasesController };

