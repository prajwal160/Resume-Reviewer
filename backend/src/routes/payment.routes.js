const express = require("express");
const auth = require("../middleware/auth.middleware");
const { initPayU, verifyPayU, payuCallback } = require("../controllers/payment.controller");

const router = express.Router();

router.post("/payu/init", auth, initPayU);
router.post("/payu/verify", verifyPayU);
router.post("/payu/callback", payuCallback);

module.exports = router;
