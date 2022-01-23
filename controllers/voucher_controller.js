const Voucher = require('../models/Voucher');
const BundProduct = require('../models/BundProduct');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');
const VoucherItem = require('../models/VoucherItem');

const getAllVoucher = async (req, res) => {
  const type_sort = req.query.t || 'discount';
  const sort = req.query.s || 'DESC';
  const name = req.query.name;

  try {
    const query = Voucher.query();

    if (name) {
      query.where('name', 'ILIKE', `%${name}`);
    }

    query.page(page, pageSize).orderBy(type_sort, sort);
    const voucher = await query;

    res.status(200).json(voucher);
  } catch (e) {
    res.status(404).json(e);
    /* handle error */
  }
};

const createVoucher = async (req, res) => {
  const voucher = req.body.voucher;
  const id = uuidv4();

  try {
    const voucherAdded = await Voucher.query().insertAndFetch({ id, voucher });

    res.status(200).json(voucherAdded);
  } catch (e) {
    res.status(404).json(e);
    /* handle error */
  }
};

const updateVoucher = async (req, res) => {
  const voucher = req.body.voucher;
  const id = req.params.id;

  try {
    const updatedVoucher = await Voucher.query().patchAndFetchById(id, voucher);
    res.status(200).json(updatedVoucher);
  } catch (e) {
    /* handle error */
    res.status(404).json(e);
  }
};

const addProduct = async (req, res) => {
  const voucher_id = req.params.id;
  const product_id = req.params.pid;

  try {
    const addedProduct = await VoucherItem.query().insert({
      voucher_id,
      product_id,
    });

    res.status(200).json(addedProduct);
  } catch (e) {
    res.status(404).json(e);
    /* handle error */
  }
};

const removeProduct = async (req, res) => {
  const voucher_id = req.params.id;
  const product_id = req.params.pid;

  try {
    const removedProduct = await VoucherItem.query()
      .delete()
      .where('voucher_id', '=', voucher_id)
      .andWhere('product_id', '=', product_id);

    res.status(200).json(removedProduct);
  } catch (e) {
    res.status(404).json(e);
    /* handle error */
  }
};

const addBundProduct = async (req, res) => {
  const id = req.params.id;
  const bundItem = req.body.bundledItem;

  try {
    const product = await Product.query().findById(bundItem.id);
    if (product.quantity < bundItem.quantity) {
      res
        .status(400)
        .json({ message: 'quantity in stock is less than quantity ' });
    }

    const addedBundItem = await BundProduct.query().insertAndFetch({
      product_id: product.id,
      bund_product_id: bundItem.id,
      quantity: bundItem.quantity,
      voucher_id: id,
    });

    res.status(200).json(addedBundItem);
  } catch (e) {
    res.status(404).json(e);
    /* handle error */
  }
};

const removeBundProduct = async (req, res) => {
  const id = req.params.id;
  const bundId = req.params.bundledId;

  try {
    const removedBundProduct = await BundProduct.query()
      .delete()
      .where('bund_product_id', '=', bundId)
      .andWhere('voucher_id', '=', id);

    res.status(200).json(removedBundProduct);
  } catch (e) {
    res.status(404).json(e);
    /* handle error */
  }
};

module.exports = {
  getAllVoucher,
  createVoucher,
  updateVoucher,
  addBundProduct,
  removeBundProduct,
  addProduct,
  removeProduct,
};
