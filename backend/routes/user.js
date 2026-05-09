const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const userCtrl = require('../controllers/user');

const validEmail = require('../middleware/valid-email');
const validPass = require('../middleware/valid-pass');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
});

router.post('/signup', validEmail, validPass, userCtrl.signup);
router.post('/login', loginLimiter, userCtrl.login);

module.exports = router;