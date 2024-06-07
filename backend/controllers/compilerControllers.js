const Problems = require('../models/Problems.js');
const { generateFile } = require('../generateFile.js');
const { executeCpp } = require('../executeCpp.js');
const { generateInputFile } = require("../generateInputFile.js");

const run = async (req, res) => {
    const { language = 'cpp', code, input } = req.body;

    console.log("Received run request with language:", language);
    console.log(code) ;

    if (code === undefined) {
        console.log("Empty code box detected");
        return res.status(500).json({
            success: false,
            error: "Empty Code Box",
        });
    }

    try {
        console.log("Generating file for language:", language);
        const filePath = await generateFile(language, code);
    
        console.log("Generating input file");
        const fileInputPath = await generateInputFile(input);
    
        console.log("Executing code:", filePath);
        const output = await executeCpp(filePath, fileInputPath);
    
        console.log("Run completed successfully");
        
        console.log(output);
    
        // Send both stdout and stderr in the response
        res.json(output);
    } catch (error) {
        console.log("Runtime error:", error);
        res.status(500).json(error);
    }
};


const submit = async (req, res) => {
    try {
        const problemId = req.params.id;
        const { language = 'cpp', code } = req.body;

        console.log("Received submit request for problem:", problemId);

        // Validate inputs
        if (!code) {
            console.log("Empty code box detected");
            return res.status(400).json({
                success: false,
                error: "Empty Code Box",
            });
        }

        console.log("Finding problem by ID:", problemId);
        const problem = await Problems.findOne({ _id: problemId });

        if (!problem) {
            console.log("Problem not found:", problemId);
            return res.status(404).json({
                success: false,
                error: "Problem not found",
            });
        }

        const testCase = problem.testCase || [];

        console.log("Generating file for language:", language);
        const filePath = await generateFile(language, code);

        let correct = 0;
        let total = testCase.length;
        let verdict = "ACCEPTED";

        console.log("Starting test cases execution");
        for (const test of testCase) {
            console.log("Executing test case:", test);
            const fileInputPath = await generateInputFile(test.input);
            const generatedOutput = await executeCpp(filePath, fileInputPath);
            const correctOutput = test.output;

            if (generatedOutput.trim() !== correctOutput.trim()) {
                console.log("Test case failed");
                verdict = "WRONG ANSWER";
                break;
            }
            correct++;
        }

        console.log("Submit completed successfully");
        res.json({
            verdict,
            correct,
            total,
        });
    } catch (error) {
        console.log("error while submitting the code" , error ) ;
        res.status(500).send(error);
    }
};

module.exports = {
    run,
    submit,
};
