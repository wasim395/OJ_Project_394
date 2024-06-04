
const Problems = require('../modols/Problems') ;
const {generateFile} = require('../generateFile.js') ;
const {executeCpp} = require('../executeCpp.js') ;
const {generateInputFile} = require("../generateInputFile.js");

const run = async (req , res) => {
    const { language='cpp', code , input } = req.body ;

    if( code === undefined ){
        return res.status(500).json( {
            success : false ,
            error : "Empty Code Box",
        })
    }

    try{
        const filePath = await generateFile( language , code ) ;
        const fileInputPath = await generateInputFile(input) ;
        const output = await executeCpp( filePath , fileInputPath ) ;
        res.json(output);
    }
    catch(error){
        
        const errorMessage = error.message ;
        const errorIndex = errorMessage.indexOf("error:");
        const finalError = errorMessage.substring(errorIndex);
        res.status(500) .send(finalError);
    }
};

const submit = async (req, res) => {
    try {
        const problemId = req.params.id;
        const { language = 'cpp', code } = req.body;

        // Validate inputs
        if (!code) {
            return res.status(400).json({
                success: false,
                error: "Empty Code Box",
            });
        }

        const problem = await Problems.findOne({ _id: problemId });
        if (!problem) {
            return res.status(404).json({
                success: false,
                error: "Problem not found",
            });
        }

        const testCase = problem.testCase || [];

        const filePath = await generateFile(language, code);

        let correct = 0;
        let total = testCase.length;
        let verdict = "ACCEPTED";

        for (const test of testCase) {
            const fileInputPath = await generateInputFile(test.input);
            const generatedOutput = await executeCpp(filePath, fileInputPath);
            const correctOutput = test.output;

            if (generatedOutput.trim() !== correctOutput.trim()) {
                verdict = "WRONG ANSWER";
                break;
            }
            correct++;
        }

        res.json({
            verdict,
            correct,
            total,
        });
    } catch (error) {
        const errorMessage = error.message ;
        const errorIndex = errorMessage.indexOf("error:");
        const finalError = errorMessage.substring(errorIndex);
        res.status(500).send(finalError) ;
    }
};

module.exports = {
    run , 
    submit ,
}