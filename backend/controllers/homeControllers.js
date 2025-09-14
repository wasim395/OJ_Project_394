const Problems = require('../models/Problems');
const User = require("../models/User");


const home = async (req, res) => {
    console.log("Home route called");
    try {
        const array = await Problems.find();
        console.log("Found problems:", array);
        res.json(array);
    } catch (error) {
        console.error("Error in home route:", error);
        res.status(500).send(error);
    }
};

const problem = async (req, res) => {
    try {
        const problemId = req.params.id;
        console.log("Problem route called with ID:", problemId);
        const currProblem = await Problems.findOne({ _id: problemId });
        console.log("Found problem:", currProblem);
        res.json(currProblem);
    } catch (error) {
        console.error("Error in problem route:", error);
        res.status(404).send(error);
    }
};

const submissionHistory = async (req , res) => {

    const problemId = req.params.id; // Assuming the problemId is passed in the URL parameters

    // Handle the result...
    const allSubmission = req.user.submissionHistory ;
    const currProblemSubmission = allSubmission.filter( submission => submission.problemId === problemId );
    const reversedFirstTen = currProblemSubmission.reverse().slice(0, 10);
    res.json(reversedFirstTen);


}

module.exports = {
    home,
    problem,
    submissionHistory,
};
