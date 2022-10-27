const express = require("express");
const router = express.Router();
const wrapper = require("../../utils/wrapper");
const employeeController = require("../../controllers/employee");

router.get("/", wrapper(employeeController.fetchAll));
router.post("/", wrapper(employeeController.create));
router.get("/:id", wrapper(employeeController.findById));
router.put("/:id", wrapper(employeeController.update));
router.delete("/:id", wrapper(employeeController.delete));

module.exports = router;
