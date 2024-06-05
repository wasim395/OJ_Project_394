const Problems = require('../models/Problems');

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

module.exports = {
    home,
    problem,
};
