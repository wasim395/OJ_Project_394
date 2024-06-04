const express = require("express") ;
const router = express.Router();
const authenticate = require("../middlewares/authenticate") ;
const compilerControllers = require("../controllers/compilerControllers") ; 


router.use(authenticate) ;

router.post(`/run` , compilerControllers.run ) ;
router.post(`/submit/:id` , compilerControllers.submit ) ;


module.exports = router ;