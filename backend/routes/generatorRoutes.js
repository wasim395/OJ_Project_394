const express = require("express");
const { createDraft } = require("../controllers/generatorController");
const router = express.Router();

router.post("/admin/generate", createDraft);

module.exports = router;
