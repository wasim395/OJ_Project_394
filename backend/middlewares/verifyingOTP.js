const otpRequirement = require('./otpRequirement');
const otpMap = otpRequirement.otpMap ;

// Middleware to verify OTP
const verifyingOTP = async (req, res, next) => {

    console.log( " inside verification part ") ;
    const email = req.body.email;
    const putotp = req.body.putOtp;

    // Check if OTP exists and is valid
    const storedOTP = otpMap.get(email);

    if (storedOTP && storedOTP.otp === putotp && storedOTP.expiry > Date.now()) {
        // Valid OTP
        otpMap.delete(email); // Remove OTP from map after verification
        next(); // Call the next middleware or route handler
    
    } else {
        // Invalid or expired OTP
        res.status(401).send('Invalid or expired OTP');
    }
};

module.exports = verifyingOTP;
