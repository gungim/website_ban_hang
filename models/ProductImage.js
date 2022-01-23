const { Model } = require('objection');
const knex = require('../config/db');
const Cart = require('./Cart');
const Order = require('./Order');

Model.knex(knex);

class ProductImage extends Model {
  static get tableName() {
    return 'product_img';
  }
}

module.exports = ProductImage;
