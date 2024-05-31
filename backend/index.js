const express = require("express") ;
const app = express() ;
const { DBConnection } = require("./database/db") ; //connecting database 

const Problems = require('./modols/Problems') ;
const User = require("./modols/User") ;
const {generateFile} = require('./generateFile.js') ;
const {executeCpp} = require('./executeCpp') ;

const bcrypt = require("bcryptjs") ;
const jwt = require('jsonwebtoken') ;

const cors = require('cors') ;
const cookieParser = require('cookie-parser');



//calling database 
DBConnection() ;


app.use(express.json()) ;
app.use(express.urlencoded({extended : true})) ;


// Define CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with the origin of your React frontend
    credentials: true // Allow credentials (cookies)
};
app.use(cors(corsOptions));
app.use(cookieParser());


const authenticate = async (req, res, next) => {
    // const token = req.header('Authorization');
    // const token = req.headers.authorization?.split(' ')[1] || req.query.token || req.cookies.token;
    const token = req.cookies.token;
    // console.log("token")

  
    // if (!token) {
    //   return res.status(401).json({ message: 'Unauthorized' });
    // }
  
    try {
        // console.log("checking token ") ;
        const decoded = jwt.verify(token, process.env.SecretKey );
        req.user = await User.findById(decoded.id)
        next();
    } catch (error) {
        // console.log(" the token is not correct ")
        return res.status(401).json({ message: 'Invalid token' });
    }
}



app.get("/" , async ( req , res ) => {
    const array = await Problems.find().limit(5) ;
    res.json(array) ;
});


app.post( "/register" , async ( req , res ) => {
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
});



app.post("/login" , async ( req , res ) => {

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

});



app.get( "/problem/:id" , authenticate , async (req , res ) => {

    try{
        const problemId = req.params.id  ;
        // console.log( problemId ) ;
        const currProblem = await Problems.findOne( {_id : problemId } ) ;
        res.json(currProblem) ; 
    }
    catch(error){
        console.log(error) ;
    }
    

});

app.get('/logout', (req, res) => {
    // Clear the cookie
    res.clearCookie('token');

    console.log("inside backend logout ") ;
    // Respond with a success message
    res.json({ message: 'Logout successful' });
});

//Admin
const checkAdmin = async (req, res, next) => {
    try {
        // console.log(req.user.role);
        if (req.user.role === "admin") {
            next();
        } else {
            res.status(403).send("Forbidden: You do not have the necessary permissions.");
        }
    } catch (error) {
        res.status(500).send("Internal Server Error: Something went wrong while checking admin.");
    }
};
app.get('/admin' , authenticate , checkAdmin , async (req , res) => {

    try{
        const adminId = req.user._id ;
        const problemList = await Problems.find( {createdBy : adminId} ) ;
        res.status(200).json( problemList )
    }
    catch(error){
        res.status(500).send("catch /admin " , error ) ;
    }


});
app.post( "/admin/create" , authenticate , checkAdmin , async ( req , res ) => {
    
    const creater = req.user._id ;
    // console.log("the creater id is : " , creater ) ;
    const {title , problemStatement , explainInput , explainOutput , testCases } = req.body ;
    const newProblem = await Problems.create({
        title : title ,
        problemStatement : problemStatement ,
        expectedInput : explainInput ,
        expectedOutput : explainOutput ,
        testCase : testCases,
        createdBy : creater ,
    });
    // console.log( newProblem ) ;
    res.send(200) ;

})
app.put('/admin/edit/:id', authenticate , checkAdmin , async (req, res) => {

    const { title, problemStatement, explainInput, explainOutput, testCases } = req.body;
  
    try {
      const problem = await Problems.findById(req.params.id);
      if (!problem) {
        return res.status(404).send({ error: 'Problem not found' });
      }
  
        problem.title = title;
        problem.problemStatement = problemStatement;
        problem.expectedInput = explainInput ;
        problem.expectedOutput = explainOutput ;
        problem.testCase = testCases ;
    
        await problem.save();
  
      res.status(200).send({ message: 'Document updated successfully' });
    } catch (error) {
      res.status(500).send({ error: 'Error updating the problem' });
    }
});
app.delete('/admin/delete/:id', async (req, res) => {
    try {
      const result = await Problems.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
        return res.status(404).send({ error: 'Problem not found' });
      }
      res.status(200).send({ message: 'Problem deleted successfully' });
    } catch (error) {
      console.error('Error deleting problem:', error);
      res.status(500).send({ error: 'Error deleting the problem' });
    }
  });


//create by admin 
//update by admin
//read by admin
//delete by admin 



app.post( "/run" , async (req , res) => {
    const { language='cpp', code } = req.body ;

    if( code === undefined ){
        return res.status(500).json( {
            success : false ,
            error : "Empty Code Box",
        })
    }

    try{
        const filePath = await generateFile( language , code ) ;
        const output = await executeCpp(filePath) ;
        res.json({filePath , output });
    }
    catch(error){
        return res.status(500).send(error + " this is eroor box ") ;
    }

    // res.json( { language , code  }) ;
});


app.listen( process.env.PORT , () => {
    console.log( `The server is lisning from ${process.env.PORT}`) ;
});