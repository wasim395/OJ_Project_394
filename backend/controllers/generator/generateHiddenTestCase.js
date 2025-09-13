const { generateHiddenTestCases } = require("../../services/generator/generateHiddenTestCase");

async function addHiddenTestCasesController(req, res) {
    try {
        console.log("addHiddenTestCasesController called");
        const { problemId } = req.params;
        console.log("Received problemId:", problemId);
        const problem = await generateHiddenTestCases(problemId);
        res.status(200).json({ success: true, data: problem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { addHiddenTestCasesController };
