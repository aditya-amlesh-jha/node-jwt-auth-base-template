const { Router } = require('express')
const { UserController } = require('../controller')

const router = Router();

router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.post('/token', UserController.refresh_token);

module.exports = router;