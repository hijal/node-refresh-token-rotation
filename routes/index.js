const express = require("express");
const router = express.Router();

router.use("/", require("./open"));
router.use("/", require("./protected"));

module.exports = router;
