// This is main file
// This means it is strating point of the backend 
// It is similar to the main() funtion of the c++ 


//creating Express Server
const express = require("express") ;
const app = express() ;
const { DBConnection } = require("./database/db") ; //connecting database 
const User = require("./modols/User") ;
const bcrypt = require("bcryptjs") ;
const jwt = require('jsonwebtoken') ;

//calling database 
DBConnection() ;

app.use(express.json()) ;
app.use(express.urlencoded({extended : true})) ;

app.get("/" , ( request , response ) => {
    response.send("Wasim wellCome to the world of develoopment") ;
});

app.post( "/registration" , async ( request , response ) => {

    try{
        //getting the data required for registration
        //front the User by frontend 
        const {firstName , lastName , email , password } =  await request.body ;


        //checking all the provided 
        //hence every required data is filld by the user
        // if( !(firstName && lastName && email && password ) ){
        //     return response.status(400).send("please fill all the required data") ;
        // }


        //checking all the data provided is in valid form 

        //checking if the userdId ( email ) already exist 
        const isUserExist = await User.findOne({email}) ;
        if( isUserExist ){
            return response.status(400).send("User already exist with the given Email") ;
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
        response.status(200).json( {message : ' you have successfully registerd ' , user }) ;
    }
    catch(err){
        console.log("something wrong " , err ) ;
    }


} );

app.listen( process.env.PORT , () => {
    console.log( `The server is lisning from ${process.env.PORT}`) ;
});