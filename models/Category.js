const { Model } = require('objection');
const knex = require('../config/db');
const Product = require('./Product');

Model.knex(knex);

class Category extends Model {
  static get tableName() {
    return 'category';
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
        title: { type: 'string' },
        description: { type: 'string' },
      },
      required: ['id', 'title'],
    };
  }

  static get relationMappings() {
    return {
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: Product,
        join: {
          from: 'category.id',
          through: {
            from: 'product_category.category_id',
            to: 'product_category.product_id',
          },
          to: 'product.id',
        },
      },
    };
  }
}

module.exports = Category;
