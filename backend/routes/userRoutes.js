const express = require('express');
const router = express.Router();
const {
    generateRegistrationOtp, 
    verifyOtpAndRegister, 
    loginUser, 
    logoutUser,
    getLoginStatus, 
    forgotPassword, 
    resetPassword,
} = require('../controllers/userControllers');
const authenticate = require('../middlewares/authenticate');

router.post('/generate-otp', generateRegistrationOtp);
router.post('/register', verifyOtpAndRegister);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/logout', authenticate, logoutUser);
router.get('/isLogin', authenticate, getLoginStatus);

module.exports = router;