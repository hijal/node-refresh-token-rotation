const router = require("express").Router();
const authController = require("../../controllers/auth");
const wrapper = require("../../utils/wrapper");

router.post("/create", wrapper(authController.create));
router.post("/login", wrapper(authController.login));
router.get("/refresh", wrapper(authController.refresh));
router.get("/logout", wrapper(authController.logout));

module.exports = router;
