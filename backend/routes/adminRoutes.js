const express = require("express");
const router = express.Router();
const authenticate = require("../middlewares/authenticate");
const verifyAdmin = require("../middlewares/verifyAdmin");
const adminControllers = require("../controllers/adminControllers");

router.use(authenticate);
router.use(verifyAdmin);

router.get('/', adminControllers.listProblems);
router.post('/problems/draft', adminControllers.createDraft);
router.get('/problems/:problemId', adminControllers.getProblemById);
router.put('/problems/:problemId', adminControllers.updateProblem);
router.delete('/delete/:problemId', adminControllers.deleteProblem);
router.post('/problems/:problemId/delete-test-cases', adminControllers.deleteTestCasesBatch);

module.exports = router;