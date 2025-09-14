const { publishProblem } = require("../../services/generator/publishProblem");

async function publishProblemController(req, res) {
    try {
        const { problemId } = req.params;
        const adminId = req.user._id;

        const problem = await publishProblem(problemId, adminId);
        res.json({ success: true, problem });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = { publishProblemController };
