const { generateProblem } = require("../../services/generator/generateProblem");

async function createProblemController(req, res) {
    try {
        // adminId comes from req.user (auth middleware)
        const adminId = req.user._id;

        const problem = await generateProblem(req.body, adminId);
        console.log("Generated problem:", problem);
        res.status(201).json({ success: true, data: problem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { createProblemController };
