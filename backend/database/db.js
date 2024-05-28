const mongoose = require('mongoose') ;
const dotenv = require("dotenv") ;
dotenv.config() ;

const DBConnection = async () => {

    const MONGO_URI = process.env.MONGO_URL ;
    try{
        await mongoose.connect( MONGO_URI  ) ;
        console.log( " DB connection is establised ") ;
    }
    catch ( error ){
        console.log( "Error while connecting to MONGO " , error ) ;
    }

}

module.exports = { DBConnection } ;