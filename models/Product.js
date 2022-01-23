const { Model } = require('objection');
const knex = require('../config/db');
const Category = require('./Category');
const Cart = require('./Cart');

Model.knex(knex);

class Product extends Model {
  static get tableName() {
    return 'product';
  }

  $beforeInsert() {
    this.created_at = new Date().toLocaleString();
    this.updated_at = new Date().toLocaleString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toLocaleString();
  }

  static get modifiers() {
    return {
      searchByName(query, name) {
        query.where((query) => {
          for (const namePart of name.trim().split(/\s+/)) {
            for (const column of ['firstName', 'lastName']) {
              query.orWhereRaw('lower(??) like ?', [
                column,
                namePart.toLowerCase() + '%',
              ]);
            }
          }
        });
      },
    };
  }

  static get relationMappings() {
    return {
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: Category,
        join: {
          from: 'product.id',
          through: {
            from: 'product_category.product_id',
            to: 'product_category.category_id',
          },
          to: 'category.id',
        },
      },
    };
  }
}
module.exports = Product;
