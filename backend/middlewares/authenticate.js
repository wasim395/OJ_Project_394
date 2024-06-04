
const jwt = require('jsonwebtoken') ; 
const User = require("../modols/User") ; 

const authenticate = async (req, res, next) => {

    const token = req.cookies.token;

    if( token === undefined || token === null ){
        return res.status(409).send("token not found") ;
    }


    try {
        // console.log("checking token ") ;
        
        const decoded = jwt.verify(token, process.env.SecretKey );
        req.user = await User.findById(decoded.id)
        next();
    } catch (error) {
        // console.log(" the token is not correct ")
        console.log( error ) ;
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authenticate ;