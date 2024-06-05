const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const otpRequirement = require('./otpRequirement');
const otpMap = otpRequirement.otpMap;
const transporter = otpRequirement.transporter;

// Middleware to generate and send OTP
const generatingOTP = (req, res, next) => {
    try {
        console.log("Generating OTP");

        const email = req.body.email;
        console.log("Recipient Email:", email);

        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
        console.log("Generated OTP:", otp);

        // Store OTP in map with email as key
        otpMap.set(email, { otp: otp, expiry: Date.now() + 300000 }); // 5 minutes expiry
        console.log("OTP stored in map:", otpMap.get(email));

        // Send OTP via email
        transporter.sendMail({
            from: process.env.EMAIL_ID,
            to: email,
            subject: 'Your OTP for Authentication',
            text: `Your OTP is: ${otp}`
        }, (err, info) => {
            if (err) {
                console.error("Error sending OTP:", err);
                res.status(500).send('Error sending OTP');
            } else {
                console.log("OTP sent successfully");
                next();
            }
        });
    } catch (error) {
        console.error("Error generating OTP:", error);
        res.status(500).send('Error generating OTP');
    }
};

module.exports = generatingOTP;
