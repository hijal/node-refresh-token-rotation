const express = require("express");
const router = express.Router();
const wrapper = require("../../utils/wrapper");
const userController = require("../../controllers/user");

router.get("/", wrapper(userController.fetchAll));
router.get("/:id", wrapper(userController.findById));
router.put("/:id", wrapper(userController.update));
router.delete("/:id", wrapper(userController.delete));

module.exports = router;
