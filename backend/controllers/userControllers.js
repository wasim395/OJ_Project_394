const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const User = require("../models/User");

const register = async (req, res) => {
    try {
        console.log("Register route called");
        const { firstName, lastName, email, password } = req.body;

        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            console.log("User already exists with the given Email:", email);
            return res.status(400).send("User already exists with the given Email");
        }

        console.log("Hashing password");
        const hashPassword = await bcrypt.hash(password, 10);

        console.log("Creating user in the database");
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
        });

        console.log("Generating token");
        const token = jwt.sign({ id: user._id, email }, process.env.SecretKey, {
            expiresIn: '1h',
        });

        user.token = token;
        user.password = undefined;

        console.log("Registration successful");
        res.status(200).json({ message: 'You have successfully registered', user });
    } catch (err) {
        console.error("Error in registration:", err);
        res.status(500).send("Something went wrong");
    }
};

const login = async (req, res) => {
    try {
        console.log("Login route called");
        const { email, password } = req.body;

        console.log("Finding user with email:", email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found with the given Email:", email);
            return res.status(400).send("User not found with the given Email");
        }

        console.log("Comparing passwords");
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            console.log("Wrong Password");
            return res.status(400).send("Wrong Password");
        }

        console.log("Generating token");
        const token = jwt.sign({ id: user._id, email }, process.env.SecretKey, {
            expiresIn: '1h',
        });

        user.token = token;
        user.password = undefined;

        console.log("Setting token in cookie");
        res.cookie('token', token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
        });
        console.log("Login successful");
        return res.json({ message: 'Login successful' });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send("Something went wrong");
    }
};

const logout = (req, res) => {
    // Clear the cookie
    console.log("Logout route called");
    res.clearCookie('token');
    // Respond with a success message
    res.json({ message: 'Logout successful' });
};

module.exports = {
    register,
    login,
    logout,
};
