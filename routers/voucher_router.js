const router = require("express").Router();
const { getAllVoucher, createVoucher, updateVoucher, addProduct, removeProduct, addBundProduct, removeBundProduct } = require("../controllers/voucher_controller");
const { authMiddleware } = require('../middlewares/auth');

router.get("/", getAllVoucher);
router.post("/", authMiddleware, createVoucher)
router.post("/:id",authMiddleware, updateVoucher)
router.post("/:id/:pid", authMiddleware, addProduct)
router.delete("/:id", authMiddleware, removeProduct)
router.post("/:id", authMiddleware, addBundProduct)
router.delete("/:id/:bundledId", authMiddleware, removeBundProduct)

module.exports = router
