
const bcrypt = require("bcryptjs") ; 
const jwt = require('jsonwebtoken') ; 
const User = require("../modols/User") ; 

const register = async ( req , res ) => {
    try{

        const {firstName , lastName , email , password } =  req.body ;

        const isUserExist = await User.findOne({email}) ;
        if( isUserExist ){
            return res.status(400).send("User already exist with the given Email") ;
        }

        //hashing/encrypt the password 
        const hashPassword = await bcrypt.hash( password , 10 ) ;

        //save user in the Data Base 
        const user = await User.create({
            firstName,
            lastName,
            email,
            password : hashPassword,
        });


        //generate the token 
        const token = jwt.sign({id: user._id , email} , process.env.SecretKey , {
            expiresIn : '1h' ,
        }) ;

        user.token = token  ;
        user.password = undefined ;
        res.status(200).json( {message : ' you have successfully registerd ' , user }) ;
    }
    catch(err){
        console.log("something wrong " , err ) ;
    }
};

const login = async ( req , res )=>{
    try{
        //getting data from the frontEnd to login 
        const {email , password } =  req.body ;

        const user = await User.findOne({email}) ;
        if( !user ){
            return res.status(400).send("User not found with the give Email") ;
        }

        //checking is the password correct or not 
        const isPasswordCorrect = await bcrypt.compare( password , user.password ) ;
        if( !isPasswordCorrect ){
            return res.status(400).send("Wrong Password") ;
        }

        const token = jwt.sign({id: user._id , email} , process.env.SecretKey , {
            expiresIn : '1h' ,
        }) ;

        user.token = token  ;
        user.password = undefined ;

        res.cookie('token', token, { 
            expires : new Date( Date.now() + 1*24*60*60*1000 ) ,
            httpOnly: true, 
            secure : false , 
            sameSite: 'Lax' }); 
        return res.json({ message: 'Login successful' });
    }
    catch( error ){
        console.log(error) ;
    } 
};

const logout = ( req , res ) => {
    // Clear the cookie
    res.clearCookie('token');
    // Respond with a success message
    res.json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    logout,
};