const { createOrder, findAll, findById, updateOrder } = require('../controllers/order_controller');
const { authMiddleware } = require('../middlewares/auth');

const router = require('express').Router();

router.post('/', authMiddleware, createOrder);
router.get("/", authMiddleware, findAll)
router.get("/:id", authMiddleware, findById)
router.post("/:id", authMiddleware, updateOrder)

module.exports = router;
