const User = require("../models/User");
const { object, string } = require('zod');

const userSchema = object({
    firstName: string().min(1).max(50),
    lastName: string().min(1).max(50),
    email: string().email(),
    password: string().min(6),
});

const validData = async (req, res, next) => {
    try {
        console.log("Validating user data");
        const { firstName, lastName, email, password } = req.body;
        const userData = {
            firstName,
            lastName,
            email,
            password,
        };
        userSchema.parse(userData);
        console.log("User data validated successfully");
    } catch (error) {
        console.error("Validation error:", error);
        return res.status(400).send(`Validation error: ${error}`);
    }

    try {
        console.log("Checking if email already exists");
        const user = await User.findOne({ email: req.body.email });
        if (user !== null) {
            console.log("Email already exists");
            return res.status(409).send("Email already exists");
        }
        console.log("Email is unique");
        next();
    } catch (error) {
        console.error('Error finding user by email: ', error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = validData;
