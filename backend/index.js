
const express = require("express") ;
const app = express() ;
const { DBConnection } = require("./database/db") ; //connecting database 
const cors = require('cors') ; 
const cookieParser = require('cookie-parser');  

//calling database 
DBConnection() ;

// Define CORS options
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with the origin of your React frontend
    credentials: true // Allow credentials (cookies)
};
app.use(express.json()) ;
app.use(express.urlencoded({extended : true})) ;
app.use(cors(corsOptions));
app.use(cookieParser());


const homeRoutes = require("./routes/homeRoutes") ;
const userRoutes = require("./routes/userRoutes") ;
const adminRoutes = require("./routes/adminRoutes") ;
const compilerRoutes = require("./routes/compilerRoutes") ;


app.use( "/" , homeRoutes ) ;
app.use( "/user"  , userRoutes ) ;
app.use( "/admin" , adminRoutes ) ;
app.use( "/compiler" , compilerRoutes ) ;


app.listen( process.env.PORT , () => {
    console.log( `The server is lisning from ${process.env.PORT}`) ;
});