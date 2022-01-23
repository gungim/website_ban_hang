const {
  create,
  findById,
  update,
  findAll,
  addImage,
  deleteImage,
} = require('../controllers/product_controller');
const { authMiddleware } = require('../middlewares/auth');
const { uploadImages } = require('../middlewares/uploadMiddleware');
const { resize } = require('../helpers/resize');
const router = require('express').Router();

router.post('/', authMiddleware, uploadImages, resize, create);
router.get('/', findAll);
router.get('/:id', findById);
router.patch('/:id', authMiddleware, uploadImages, update);
router.post('/:id/img', authMiddleware, uploadImages, resize, addImage);
router.post('/:id/img?id', authMiddleware, deleteImage);

module.exports = router;
