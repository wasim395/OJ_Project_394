const otpRequirement = require('./otpRequirement');
const otpMap = otpRequirement.otpMap;

// Middleware to verify OTP
const verifyingOTP = async (req, res, next) => {
    try {
        console.log("Verifying OTP");

        const email = req.body.email;
        const putotp = req.body.putOtp;

        console.log("Email:", email);
        console.log("OTP received:", putotp);

        // Check if OTP exists and is valid
        const storedOTP = otpMap.get(email);

        if (storedOTP && storedOTP.otp === putotp && storedOTP.expiry > Date.now()) {
            // Valid OTP
            console.log("Valid OTP");
            otpMap.delete(email); // Remove OTP from map after verification
            next(); // Call the next middleware or route handler
        } else {
            // Invalid or expired OTP
            console.log("Invalid or expired OTP");
            res.status(401).send('Invalid or expired OTP');
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = verifyingOTP;
