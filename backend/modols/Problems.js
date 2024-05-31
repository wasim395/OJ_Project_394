const mongoose = require("mongoose")

const ProblemSchema = new mongoose.Schema({

    title : {
        type : String ,
        default : null , 
    },

    problemStatement : {
        type : String , 
        default : null ,
    },

    expectedInput : {
        type : String ,
        default : null ,
    }, 

    expectedOutput : {
        type : String ,
        default : null ,
    },

    testCase : [{
        input: { type: String },
        output: { type: String },
    }],

    createdBy : {
        type : String , 
        default : null ,
    }

});

module.exports = mongoose.model( "Problem" , ProblemSchema ) ;
