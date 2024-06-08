
const express = require("express") ;
const router = express.Router();
const homeControllers = require("../controllers/homeControllers") ;
const authenticate = require("../middlewares/authenticate") ;


router.get( '/home' , homeControllers.home ) ;
router.get ( '/problem/:id' , homeControllers.problem ) ;
router.get ( '/submissionHistory/:id' , authenticate , homeControllers.submissionHistory ) ;

module.exports = router ;