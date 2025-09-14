
const express = require("express") ;
const router = express.Router();
const userControllers = require("../controllers/userControllers") ;
const generateOtpController = require("../controllers/generateOtpController") ;
const jwt = require('jsonwebtoken') ; 


const verifyingOTP  = require("../middlewares/verifyingOTP") ;
const generatingOTP = require("../middlewares/generatingOTP") ;
const validData = require("../middlewares/validData") ;
const authenticate = require("../middlewares/authenticate");

router.get( "/isLogin"  , authenticate , ( req , res ) => { res.status(200).send(200) } ) ;
router.post( "/generate-otp" , validData , generatingOTP , generateOtpController.isGenerated ) ;
router.post( `/register` , validData ,  verifyingOTP , userControllers.register  ) ;
router.post( `/login`  , userControllers.login ) ;
router.get( `/logout` , userControllers.logout ) ;


module.exports = router;
