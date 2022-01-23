const {
  updateCartItem,
  addCartItem,
  findCart,
} = require('../controllers/cart_controller');
const { authMiddleware } = require('../middlewares/auth');
const router = require('express').Router();

router.post('/add_to_cart', authMiddleware, addCartItem);
router.patch('/update', authMiddleware, updateCartItem);
router.get('/', authMiddleware, findCart);

module.exports = router;
