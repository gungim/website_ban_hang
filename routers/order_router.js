const { createOrder } = require('../controllers/order_controller');
const { authMiddleware } = require('../middlewares/auth');

const router = require('express').Router();

router.get('/', authMiddleware, createOrder);

module.exports = router;
