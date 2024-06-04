
const User = require("../modols/User") ; 
const { object, string } = require('zod');


const userSchema = object({
    firstName: string().min(1).max(50), 
    lastName: string().min(1).max(50), 
    email: string().email(), 
    password: string().min(6), 
});

const validData  = async ( req , res , next ) => {

    const {firstName , lastName , email , password } =  req.body ;
    const userData = {
        firstName ,
        lastName ,
        email ,
        password ,
    }
    try {
        userSchema.parse(userData);
    } 
    catch (error){
        res.send( 200 , `Validation error:`, error);
    }

    try {
        const user = await User.findOne({ email: email });
        if( user != null ){
            res.status(409).send("Email already Exist") ;
        }
        next() ;
    }
    catch (error) {
        console.error('Error finding user by email: ', error);
    }

};

module.exports = validData ;