const Problems = require('../models/Problems');

const listProblems = async (req, res) => {
    try {
        const problemList = await Problems.find({ createdBy: req.user._id });
        res.status(200).json(problemList);
    } catch (error) {
        console.error("Error fetching problems:", error);
        res.status(500).send("Error fetching problems");
    }
};

const getProblemById = async (req, res) => {
    try {
        const problem = await Problems.findById(req.params.problemId);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.status(200).json(problem);
    } catch (error) {
        console.error("Error fetching problem details:", error);
        res.status(500).json({ message: "Error fetching problem details" });
    }
};

const createDraft = async (req, res) => {
    try {
        const adminId = req.user._id;

        const newProblem = new Problems({
            createdBy: adminId,
            status: "draft",
        });

        await newProblem.save();
        res.status(201).json(newProblem);

    } catch (error) {
        console.error("Error creating draft:", error);
        res.status(500).send("Error creating problem draft");
    }
};

const updateProblem = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { data } = req.body;

        console.log("Received problem data for update:", data);
        
        data.status = 'draft';

        console.log("Updating problem with data:", data);
        
        const updatedProblem = await Problems.findByIdAndUpdate(
            problemId,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!updatedProblem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        console.log("Updated problem:", updatedProblem);
        res.status(200).json(updatedProblem);
    } catch (error) {
        console.error("Error updating problem:", error);
        res.status(500).json({ error: 'Error updating the problem' });
    }
};

const deleteProblem = async (req, res) => {
    try {
        const { problemId } = req.params;
        const result = await Problems.deleteOne({ _id: problemId });
        if (result.deletedCount === 0) {
            return res.status(404).send({ error: 'Problem not found' });
        }
        res.status(200).send({ message: 'Problem deleted successfully' });
    } catch (error) {
        console.error("Error deleting problem:", error);
        res.status(500).send({ error: 'Error deleting the problem' });
    }
};

const deleteTestCasesBatch = async (req, res) => {
    try {
        const { problemId } = req.params;
        const { testCaseIds } = req.body; // array of test case _id strings

        if (!Array.isArray(testCaseIds) || testCaseIds.length === 0) {
            return res.status(400).json({ message: 'testCaseIds must be a non-empty array.' });
        }

        const updatedProblem = await Problems.findByIdAndUpdate(
            problemId,
            { $pull: { hiddenTestCases: { _id: { $in: testCaseIds } } } },
            { new: true }
        );

        if (!updatedProblem) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json(updatedProblem);
    } catch (error) {
        console.error("Error batch deleting test cases:", error);
        res.status(500).json({ message: 'Error deleting test cases' });
    }
};

module.exports = {
    listProblems,
    getProblemById,
    createDraft,
    updateProblem,
    deleteProblem,
    deleteTestCasesBatch,
};
