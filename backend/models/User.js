const mangoose = require('mongoose') ;

const userSchema = new mangoose.Schema({

    firstName : {
        type : String ,
        defalut : null ,
        require : true ,
    },
    lastName : {
        type : String ,
        defalut : null ,
        require : true ,
    },
    email : {
        type : String ,
        defalut : null ,
        require : true ,
        unique : true ,
    },
    password : {
        type : String ,
        require : true ,
    },

    role : {
        type : String ,
        default : "user" ,
        require : true ,
    },

    submissionHistory : [
        {
            problemId : {type : String } ,
            verdict : { type : String } ,
            score : { type : String } ,
            submissionTime : { type : String } ,
            code : { type : String } ,
        }
    ],

}); 

// The last will create a table name as <User> through userSchema 
module.exports = mangoose.model( "User" , userSchema ) ;