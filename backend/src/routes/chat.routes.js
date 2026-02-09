const express = require("express");
const auth = require("../middleware/auth.middleware");
const { chatWithClaude } = require("../controllers/chat.controller");

const router = express.Router();

router.post("/", auth, chatWithClaude);

module.exports = router;
