
const bcrypt = require("bcryptjs") ; 
const jwt = require('jsonwebtoken') ; 
const User = require("../modols/User") ; 

const register = async ( req , res ) => {
    try{
        //getting the data required for registration
        //front the User by frontend 
        const {firstName , lastName , email , password } =  req.body ;


        //checking all the provided 
        //hence every required data is filld by the user

        // if( firstName == "" || lastNmae == "" || password == "" ){
        //     return res.status(400).send("please fill all the required data") ;
        // }


        //checking all the data provided is in valid form 

        //checking if the userdId ( email ) already exist 
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

        //checking validation 
        //first checking all the data should be provided 
        // if( !( email && password )){
        //     return res.status(400).send("Please fill all the required Data") ;
        // }

        //checking , is there any user the the given Email or not 
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

        //cookies
        const option = {
            expires : new Date( Date.now() + 1*24*60*60*1000 ) ,
            httpOnly: true ,
        }

        //sending cookies
        // res.status(200).cookie("OJ_token" , token , option ).json({
        //     message : "You have successfully Login" , 
        //     success : true ,
        //     token ,
        // });

        res.cookie('token', token, { httpOnly: true, secure : false , sameSite: 'Lax' }); 
        return res.json({ message: 'Login successful' });
    }
    catch( error ){
        console.log(error) ;
    } 
};

const logout = ( req , res ) => {
    // Clear the cookie
    res.clearCookie('token');

    console.log("inside backend logout ") ;
    // Respond with a success message
    res.json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    logout,
};