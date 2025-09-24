const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminControllers');
const authenticate = require('../middlewares/authenticate');
const verifySuperAdmin = require('../middlewares/verifySuperAdmin');


router.use(authenticate);
router.use(verifySuperAdmin);

router.get('/users', superAdminController.getAllUsers);
router.patch('/users/:userId/toggle-role', superAdminController.toggleUserRole);
router.delete('/users/:userId', superAdminController.deleteUser);

module.exports = router;