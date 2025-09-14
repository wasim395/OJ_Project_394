const jwt = require('jsonwebtoken');
const User = require("../models/User");

const authenticate = async (req, res, next) => {
    
    console.log("Start authentication");

    const token = req.cookies.token;
    console.log("Token:", token);

    if (!token) {
        console.log("Token not found");
        return res.status(401).send("Token not found");
    }

    try {
        const decoded = jwt.verify(token, process.env.SecretKey);
        console.log("Decoded token:", decoded);

        req.user = await User.findById(decoded.id);
        if (!req.user) {
            console.log("User not found");
            return res.status(401).send("User not found");
        }

        next();
    } catch (error) {
        console.log("Token verification error:", error);
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = authenticate;
