const express = require("express") ;
const router = express.Router();
const compilerControllers = require("../controllers/compilerControllers") ; 


const authenticate = require("../middlewares/authenticate") ;

router.post(`/run` , compilerControllers.run ) ;
router.post(`/submit/:id` , authenticate , compilerControllers.submit ) ;


module.exports = router ;