const express = require("express");
const authMiddleware = require("../middlewares/authenticate");
const { createProblemController } = require("../controllers/generator/generateProblem");
const { addHiddenTestCasesController } = require("../controllers/generator/generateHiddenTestCase");

const router = express.Router();

router.post("/automate/problems/create", authMiddleware, createProblemController);
router.post("/automate/problems/:problemId/hidden", authMiddleware, addHiddenTestCasesController);

module.exports = router;

