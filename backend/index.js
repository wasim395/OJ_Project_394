
const express = require("express") ;
const app = express() ;
const { DBConnection } = require("./database/db") ; //connecting database 
const cors = require('cors') ; 
const cookieParser = require('cookie-parser');  

//calling database 
DBConnection() ;

// Configure CORS middleware
app.use(cors({  
    origin: function (origin, callback) {
      // Allow requests from any origin
      callback(null, true);
    },
    credentials: true // Enable credentials (cookies, authorization headers, TLS client certificates)
  }));
app.use(express.json()) ;
app.use(express.urlencoded({extended : true})) ;
app.use(cookieParser());


const homeRoutes = require("./routes/homeRoutes") ;
const userRoutes = require("./routes/userRoutes") ;
const adminRoutes = require("./routes/adminRoutes") ;
const compilerRoutes = require("./routes/compilerRoutes") ;
const generateRoutes = require("./routes/generatorRoutes.js") ;


app.use( "/" , homeRoutes ) ;
app.use( "/user"  , userRoutes ) ;
app.use( "/admin" , adminRoutes ) ;
app.use( "/compiler" , compilerRoutes ) ;
app.use( "/api" , generateRoutes ) ;


app.listen( process.env.PORT , () => {
    console.log( `The server is lisning from ${process.env.PORT}`) ;
});