const Order = require('../models/Order');
const { v4: uuidv4 } = require('uuid');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const Voucher = require('../models/Voucher');

const findAll = async (req, res) => {
  const user_id = req.user.id;

  try {
    const orders = await Order.query().find({ user_id });

    res.status(200).json(orders);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const findById = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.query().findById(id);

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const createOrder = async (req, res) => {
  const user_id = req.user.id;
  const cart_id = req.body.cart_id;
  const { address, phone, name, email } = req.body.user;
  const shipping = req.body.shipping;
  const id = uuidv4();

  try {
    const items = await CartItem.query().where({
      active: true,
      cart_id: cart_id,
    });

    let sub_total = 0,
      grand_total = 0;

    const b = await Promise.all(
      items.map(async (item) => {
        const product = await Product.query().findById(item.product_id);
        let newQuantity = product.quantity - item.quantity;
        const voucher = await Voucher.query()
          .innerJoin('voucher', 'voucher.id', 'voucher_item.voucher_id')
          .where('voucher_item.product_id', '=', product.id);

        sub_total += item.quantity * product.price;

        const savedItem = await product
          .$query()
          .patchAndFetch({
            quantity: newQuantity,
          })
          .then((result) => {
            return {
              product_id: result.id,
              order_id: id,
              quantity: item.quantity,
            };
          });

        if (voucher) {
          sub_total -= sub_total * voucher.discount;

          const savedBundItem = await product
            .$query()
            .patchAndFetch({
              quantity: newQuantity,
            })
            .then((result) => {
              return {
                product_id: result.id,
                order_id: id,
                quantity: item.quantity,
              };
            });

          return [savedItem, bundItem];
        }

        return savedItem;
      })
    );

    if (!items || items.length === 0) res.status(400).json({ msg: 'no item' });

    if (!shipping) {
      grand_total = sub_total;
    } else {
      grand_total = sub_total + shipping;
    }

    const order = await Order.query().insertAndFetch({
      id,
      user_id,
      address,
      name,
      phone,
      email,
      sub_total,
      grand_total,
    });

    const addedItem = await order
      .$relatedQuery('items')
      .insert(b)
      .returning('*');

    res.status(200).json({ order, items: addedItem });
  } catch (e) {
    res.status(404).json({
      e,
    });
    /* handle error */
  }
};

const updateOrder = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body.order;

  try {
    const order = await Order.query();

    if (status) {
      order.patchAndFetchById(id, { status });
    }

    res.status(200).json(order);
  } catch (e) {
    res.status(404).json({
      e,
    });
    /* handle error */
  }
};

module.exports = { findAll, findById, updateOrder, createOrder };
