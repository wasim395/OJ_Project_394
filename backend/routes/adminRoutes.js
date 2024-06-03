
const express = require("express") ;
const router = express.Router();
const authenticate = require("../middlewares/authenticate") ;
const checkAdmin = require("../middlewares/checkAdmin") ;
const adminControllers = require("../controllers/adminControllers") ;


router.use(authenticate) ;
router.use(checkAdmin) ;


router.get( '/' , adminControllers.admin ) ;
router.post(`/create` , adminControllers.create ) ;
router.put(`/edit/:id` , adminControllers.edit ) ;
router.delete('/delete/:id' , adminControllers.deleteProblem ) ;


module.exports = router ;

