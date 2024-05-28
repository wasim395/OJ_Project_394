const mongoose = require("mongoose")

const ProblemSchema = new mongoose.Schema({
    
    id: {
        type : Number ,
        default : null , 
        require : true ,
    },

    title : {
        type : String ,
        default : null , 
        require : true ,
    },

    problemStatement : {
        type : String , 
        default : null ,
        require : true ,
    },


});

module.exports = mongoose.model( "Problem" , ProblemSchema ) ;
