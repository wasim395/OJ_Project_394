const otpMap = new Map();

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
    }
});

console.log("OTP Map and Transporter initialized.");

module.exports = { transporter, otpMap };
