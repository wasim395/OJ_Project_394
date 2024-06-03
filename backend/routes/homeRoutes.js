
const express = require("express") ;
const router = express.Router();
const homeControllers = require("../controllers/homeControllers") ;

router.get( '/home' , homeControllers.home ) ;
router.get ( '/problem/:id' , homeControllers.problem ) ;

module.exports = router ;