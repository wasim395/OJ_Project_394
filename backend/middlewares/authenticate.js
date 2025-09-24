const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    console.log("Authenticate middleware called");
    const token = req.cookies.token;
    if (!token) {
        console.log("No token provided in cookies");
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        // console.log("Authenticated user:", req.user);
        if (!req.user) {
            console.log("User not found for ID:", decoded.id);
             return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token is invalid' });
    }
};

module.exports = authenticate ;