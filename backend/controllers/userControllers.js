const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const User = require('../models/User');
const otpStore = require('../utils/otpStore');
const sendEmail = require('../utils/email');

const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 24 hours
        httpOnly: true, // Cookie accessible only via HTTP(S) requests, not JavaScript
        secure: true, // Cookie transmitted over both secure (HTTPS) and non-secure (HTTP) connections
        sameSite: 'None', // Allows cross-origin requests when sent securely
    });
    console.log("Generated token:", token);
};

const generateRegistrationOtp = async (req, res) => {
    const { firstName, email, password } = req.body;
    try {
        if (!firstName || !email || !password) return res.status(400).json({ message: 'Please provide all required fields' });
        if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(409).json({ message: 'User with this email already exists' });

        const otp = otpGenerator.generate(6, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
        otpStore.set(email, otp);

        await sendEmail({
            to: email,
            subject: 'Your OJ Project Verification Code',
            text: `Your OTP for registration is: ${otp}. It is valid for 5 minutes.`,
        });

        res.status(200).json({ message: 'OTP has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while generating OTP' });
    }
};

const verifyOtpAndRegister = async (req, res) => {
    const { firstName, lastName, email, password, otp } = req.body;
    try {
        if (!otpStore.getAndVerify(email, otp)) return res.status(400).json({ message: 'Invalid or expired OTP.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, email, password: hashedPassword });

        otpStore.delete(email);

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({ _id: user._id, firstName: user.firstName, email: user.email });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            generateToken(res, user._id);
            res.status(200).json({ _id: user._id, firstName: user.firstName, email: user.email });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};

const logoutUser = (req, res) => {
    console.log("Logout route called");
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

const getLoginStatus = (req, res) => {
    res.status(200).json(req.user);
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '15m' });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail({
            to: email, subject: 'Password Reset Request',
            text: `Click this link to reset your password: ${resetUrl}. The link is valid for 15 minutes.`,
            html: `<p>Please click the link below to reset your password.</p><a href="${resetUrl}">Reset Password</a><p>The link is valid for 15 minutes.</p>`,
        });

        res.status(200).json({ message: 'If a user with that email exists, a reset link has been sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = {
    generateRegistrationOtp,
    verifyOtpAndRegister,
    loginUser,
    logoutUser,
    getLoginStatus ,
    forgotPassword,
    resetPassword,
};