const router = require('express').Router();
const authController = require('../../controllers/auth');
const wrapper = require('../../utils/wrapper');

router.post('/login', wrapper(authController.login));
router.post('/create', wrapper(authController.create));

module.exports = router;