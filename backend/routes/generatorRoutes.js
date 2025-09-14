const express = require("express");
const authMiddleware = require("../middlewares/authenticate");
const { createProblemController } = require("../controllers/generator/generateProblem");
const { addHiddenTestCasesController } = require("../controllers/generator/generateHiddenTestCase");
const { validateAndPrepareController } = require("../controllers/generator/validateAndPrepareController");
const { publishProblemController } = require("../controllers/generator/publishProblemController");

const router = express.Router();

router.post("/automate/problems/create", authMiddleware, createProblemController);
router.post("/automate/problems/:problemId/hidden", authMiddleware, addHiddenTestCasesController);
router.post("/automate/problems/:problemId/validate", authMiddleware, validateAndPrepareController);
router.post("/automate/problems/:problemId/publish", authMiddleware, publishProblemController);

module.exports = router;

