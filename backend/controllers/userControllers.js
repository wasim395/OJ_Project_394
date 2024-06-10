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
            return res.status(401).send("Wrong Password");
        }

        console.log("Generating token");
        const token = jwt.sign({ id: user._id, email }, process.env.SecretKey, {
            expiresIn: '24h',
        });

        user.token = token ;
        user.password = undefined;

        console.log("Setting token in cookie");
        res.cookie('token', token, {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 24 hours
            httpOnly: true, // Cookie accessible only via HTTP(S) requests, not JavaScript
            secure: true, // Cookie transmitted over both secure (HTTPS) and non-secure (HTTP) connections
            sameSite: 'None', // Allows cross-origin requests when sent securely
        });
        console.log("Login successful");
        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send("Something went wrong");
    }
};

const logout = (req, res) => {
    try {
        // Log a message indicating the logout route has been accessed
        console.log("Logout route called");

        // Clear the authentication token cookie from the response with the same attributes
        res.clearCookie('token',  {
            httpOnly: true, // Cookie accessible only via HTTP(S) requests, not JavaScript
            secure: true, // Cookie transmitted over both secure (HTTPS) and non-secure (HTTP) connections
            sameSite: 'None', // Allows cross-origin requests when sent securely
        });


        // Send a JSON response to the client confirming successful logout
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        // If an error occurs during logout process, send a 500 status code
        res.status(500).json({ message: 'An error occurred during logout' });
        console.error('Error during logout:', error);
    }
};


module.exports = {
    register,
    login,
    logout,
};
