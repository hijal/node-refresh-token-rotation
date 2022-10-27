const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/jwtVerify");

router.use("/", require("./open"));
router.use("/", authenticate, require("./protected"));

module.exports = router;
