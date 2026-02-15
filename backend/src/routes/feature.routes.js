const express = require("express");
const {
  listFeatureFlags,
  streamFeatureFlags,
} = require("../controllers/feature.controller");

const router = express.Router();

router.get("/", listFeatureFlags);
router.get("/stream", streamFeatureFlags);

module.exports = router;
