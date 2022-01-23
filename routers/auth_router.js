const router = require('express').Router();
const { register, login } = require('../controllers/auth_controller');
const {
  registerValidate,
  loginValidate,
} = require('../middlewares/validateRegistor');

router.post('/register', registerValidate, register);
router.post('/login', loginValidate, login);

module.exports = router;
