const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');

const otpRequirement = require('./otpRequirement');
const otpMap = otpRequirement.otpMap ;
const transporter = otpRequirement.transporter ;

// Middleware to generate and send OTP
const generatingOTP = (req, res, next) => {
    const email = req.body.email;

    const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

    // Store OTP in map with email as key
    otpMap.set(email, { otp : otp , expiry: Date.now() + 300000 }); // 5 minutes expiry


    // Send OTP via email
    transporter.sendMail({
        from: process.env.EMAIL_ID ,
        to: email,
        subject: 'Your OTP for Authentication',
        text: `Your OTP is: ${otp}`
    }, (err, info) => {
        if (err) {
            res.status(500).send('Error sending OTP');
        } else {
            next() ;

        }
    });
};

module.exports = generatingOTP ;