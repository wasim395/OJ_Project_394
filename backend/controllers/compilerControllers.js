
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
        return res.status(500).send(error + " this is eroor box ") ;
    }
};

const submit = async (req , res) => {

    const problemId = req.params.id ;
    const { language='cpp', code } = req.body ;
    const problem = await Problems.findOne({ _id : problemId }) ;
    const testCase = problem["testCase"] ;

    if( code === undefined ){
        return res.status(500).json( {
            success : false ,
            error : "Empty Code Box",
        })
    }

    try{
        const filePath = await generateFile( language , code ) ;

        let correct = 0 ;
        let total = testCase.length ;
        let verdict = "ACCEPTED" ;

        for( let i=0 ; i<total ; i++ ){
            const fileInputPath = await generateInputFile( testCase[i]["input"] ) ;
            const generatedOutput = await executeCpp( filePath , fileInputPath ) ;
            const correctOutput = testCase[i]["output"]  ;
            
            //check for TLE


            if( generatedOutput.trimEnd() === correctOutput.trimEnd() ){
                correct++ ;
            }
            else{
                verdict = "WRONG ANSWER"
                break ;
            }

        }

        res.json({
            verdict ,
            correct , 
            total ,
        }) ;

    }
    catch(error){
        const errorString = error.toString();

        // Extract the error message from the string
        const errorIndex = errorString.indexOf('error:');

        const errorMessage = errorString.substring(errorIndex).trim();

        res.status(500).json( errorMessage );
    }

};

module.exports = {
    run , 
    submit ,
}