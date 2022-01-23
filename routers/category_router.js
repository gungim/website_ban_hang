const {
  create,
  remove,
  findAll,
  findOne,
  addProductTag,
  deleteProductTag,
} = require('../controllers/category_controller');
const { authMiddleware } = require('../middlewares/auth');

const router = require('express').Router();

router.get('/', findAll);
router.post('/', authMiddleware, create);
router.delete('/:id', authMiddleware, remove).get('/:id', findOne);
router.post('/:id/:productId', addProductTag);
router.delete('/:id/:productId', deleteProductTag);

module.exports = router;
