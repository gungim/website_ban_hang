const { Model } = require('objection');
const knex = require('../config/db');

Model.knex(knex);

class Order extends Model {
  static get tableName() {
    return 'order';
  }

  $beforeInsert() {
    this.created_at = new Date().toLocaleString();
    this.updated_at = new Date().toLocaleString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toLocaleString();
  }

  static get relationMappings() {
    const User = require('./User');
    const OrderItem = require('./OrderItem');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'order.user_id',
          to: 'user.id',
        },
      },
      items: {
        relation: Model.HasManyRelation,
        modelClass: OrderItem,
        join: {
          from: 'order.id',
          to: 'order_item.order_id',
        },
      },
    };
  }
}

module.exports = Order;
