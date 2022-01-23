const { Model } = require('objection');
const knex = require('../config/db');

Model.knex(knex);

class BundProduct extends Model {
  static get tableName() {
    return 'bund_product';
  }

  $beforeInsert() {
    this.created_at = new Date().toLocaleString();
    this.updated_at = new Date().toLocaleString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toLocaleString();
  }
}

module.exports = BundProduct;
