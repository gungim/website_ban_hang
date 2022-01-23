const { Model } = require('objection');
const knex = require('../config/db');
const Password = require('objection-password')();
const Cart = require('./Cart');
const Order = require('./Order');

Model.knex(knex);

class User extends Password(Model) {
  static get tableName() {
    return 'user';
  }

  static get relationMappings() {
    return {
      cart: {
        relation: Model.HasOneRelation,
        modelClass: Cart,
        join: {
          from: 'user.id',
          to: 'cart.user_id',
        },
      },
      orders: {
        relation: Model.HasManyRelation,
        modelClass: Order,
        join: {
          from: 'user.id',
          to: 'order.user_id',
        },
      },
    };
  }
}

module.exports = User;
