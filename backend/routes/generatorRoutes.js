const express = require("express");
const authMiddleware = require("../middlewares/authenticate");
const { createProblemController } = require("../controllers/generator/generateProblem");
const { addHiddenTestCasesController } = require("../controllers/generator/generateHiddenTestCase");
const { validateAndPrepareController } = require("../controllers/generator/validateAndPrepareController");
const { publishProblemController } = require("../controllers/generator/publishProblemController");

const router = express.Router();

router.post("/problems/create", authMiddleware, createProblemController);
router.post("/problems/:problemId/hidden", authMiddleware, addHiddenTestCasesController);
router.post("/problems/:problemId/validate", authMiddleware, validateAndPrepareController);
router.post("/problems/:problemId/publish", authMiddleware, publishProblemController);

module.exports = router;

