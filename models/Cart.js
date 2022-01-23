const { Model } = require('objection');
const knex = require('../config/db');

Model.knex(knex);

class Cart extends Model {
  static get tableName() {
    return 'cart';
  }

  $beforeInsert() {
    this.created_at = new Date().toLocaleString();
    this.updated_at = new Date().toLocaleString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toLocaleString();
  }

  static get jsonSchema() {
    return {
      type: 'object',

      properties: {
        id: { type: 'string' },
        user_id: { type: 'string' },
        status: { type: 'integer' },
      },
    };
  }

  static get relationMappings() {
    const CartItem = require('./CartItem');
    const User = require('./User');

    return {
      items: {
        relation: Model.HasManyRelation,
        modelClass: CartItem,
        join: {
          from: 'cart.id',
          to: 'cart_item.cart_id',
        },
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'cart.user_id',
          to: 'user.id',
        },
      },
    };
  }
}

module.exports = Cart;
