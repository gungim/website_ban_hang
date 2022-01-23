const Cart = require('../models/Cart');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Product');
const CartItem = require('../models/CartItem');

const findCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    let cart = await Cart.query().findOne({ user_id: user_id });
    if (!cart) {
      cart = await Cart.query().insertAndFetch({ id: user_id, user_id });
    }

    const items = await Cart.relatedQuery('items').for(cart.id);

    res.status(200).json({ cart, items });
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const addCartItem = async (req, res) => {
  const user_id = req.user.id;
  let { product_id, quantity, active } = req.body.product;

  try {
    let cart = await Cart.query().findOne({ user_id: user_id });
    const product = await Product.query().findById(product_id);

    if (!cart) {
      cart = await Cart.query().insertAndFetch({ id: user_id, user_id });
    }

    const quantityInStock = product.quantity;

    if (quantityInStock.quantity < quantity) {
      res.status(400).json('Quantity in stock is less than quantity purchased');
    }

    const cartItem = await CartItem.query().findOne({
      cart_id: cart.id,
      product_id,
    });

    if (cartItem) {
      updateCartItem(req, res);
    }
    const productAdded = await CartItem.query()
      .insert({
        cart_id: cart.id,
        product_id: product_id,
        quantity,
      })
      .returning('*');

    res.status(200).json(productAdded);
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

const updateCartItem = async (req, res) => {
  const user_id = req.user.id;
  const { quantity, product_id, active } = req.body.product;

  try {
    const cart = await Cart.query().findOne({ user_id: user_id });
    const product = await Product.query().findById(product_id);

    const quantityInStock = product.quantity;

    if (quantityInStock.quantity < quantity) {
      res.status(400).json('Quantity in stock is less than quantity purchased');
    }
    if (quantity === 0) {
      const deletedItem = await CartItem.query().deleteById(product_id);
      res.status(200).json(deletedItem);
    }
    if (quantity) {
      const cartItem = await CartItem.query().findOne({
        cart_id: cart.id,
        product_id,
      });

      const updatedCartItem = await CartItem.query().patchAndFetchById(
        cartItem.id,
        { quantity }
      );

      res.status(200).json(updatedCartItem);
    }
  } catch (e) {
    res.status(404).json({
      e,
    });
  }
};

module.exports = {
  addCartItem,
  updateCartItem,
  findCart,
};
