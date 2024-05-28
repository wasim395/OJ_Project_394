const mongoose = require("mongoose")

const ProblemSchema = new mongoose.Schema({
    
    id: {
        type : Number ,
        default : null , 
        require : true ,
    },

    input : {
        type : String ,
        default : null , 
        require : true ,
    },

    output : {
        type : String , 
        default : null ,
        require : true ,
    },


});

module.exports = mongoose.model( "Problem" , ProblemSchema ) ;
