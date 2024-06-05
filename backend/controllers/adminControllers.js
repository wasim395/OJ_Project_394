const Problems = require('../models/Problems');
const User = require("../models/User");

const admin = async (req, res) => {
    try {
        const adminId = req.user._id;
        console.log("Admin ID:", adminId);
        
        const problemList = await Problems.find({ createdBy: adminId });
        console.log("Problem Listing completed ");

        res.status(200).json(problemList);
    } catch (error) {
        console.log("Error in /admin:", error);
        res.status(500).send("Error fetching problems");
    }
};

const create = async (req, res) => {
    const creater = req.user._id;
    console.log("admin create");
    const { title, problemStatement, explainInput, explainOutput, testCases } = req.body;

    try {
        const newProblem = await Problems.create({
            title: title,
            problemStatement: problemStatement,
            expectedInput: explainInput,
            expectedOutput: explainOutput,
            testCase: testCases,
            createdBy: creater,
        });

        console.log("New Problem Created ");
        res.status(200).send({ message: 'Problem created successfully' });
    } catch (error) {
        console.log("Error in /create:", error);
        res.status(500).send("Error creating problem");
    }
};

const edit = async (req, res) => {
    const { title, problemStatement, explainInput, explainOutput, testCases } = req.body;
    console.log("Edit request body ");

    try {
        const problem = await Problems.findById(req.params.id);
        if (!problem) {
            console.log("Problem not found:", req.params.id);
            return res.status(404).send({ error: 'Problem not found' });
        }

        problem.title = title;
        problem.problemStatement = problemStatement;
        problem.expectedInput = explainInput;
        problem.expectedOutput = explainOutput;
        problem.testCase = testCases;

        await problem.save();
        console.log("Problem updated:", problem);

        res.status(200).send({ message: 'Document updated successfully' });
    } catch (error) {
        console.error("Error in /edit:", error);
        res.status(500).send({ error: 'Error updating the problem' });
    }
};

const deleteProblem = async (req, res) => {
    console.log("Delete request for problem ID:", req.params.id);

    try {
        const result = await Problems.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            console.log("Problem not found:", req.params.id);
            return res.status(404).send({ error: 'Problem not found' });
        }

        console.log("Problem deleted:", req.params.id);
        res.status(200).send({ message: 'Problem deleted successfully' });
    } catch (error) {
        console.error('Error deleting problem:', error);
        res.status(500).send({ error: 'Error deleting the problem' });
    }
};

module.exports = {
    admin,
    create,
    edit,
    deleteProblem,
};
