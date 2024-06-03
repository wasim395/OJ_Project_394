
const jwt = require('jsonwebtoken') ; 
const User = require("../modols/User") ; 

const authenticate = async (req, res, next) => {

    const token = req.cookies.token;
    try {
        // console.log("checking token ") ;
        
        const decoded = jwt.verify(token, process.env.SecretKey );
        console.log("token checked") ;
        req.user = await User.findById(decoded.id)
        console.log(" user : " , req.user)
        next();
    } catch (error) {
        // console.log(" the token is not correct ")
        console.log("invalid token ") ;
        console.log( error ) ;
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authenticate ;