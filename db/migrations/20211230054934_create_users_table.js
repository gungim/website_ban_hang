exports.up = function (knex) {
  return knex.schema
    .createTable('user', function (table) {
      table.uuid('id').primary().notNullable();
      table.string('name').notNullable();
      table.string('username').unique().notNullable();
      table.string('password').notNullable();
      table.string('email').notNullable();
      table.string('address');
      table.string('phone');
      table.text('profile');
      table.boolean('isAdmin').default(0);
      table.string('avatar');
      table.timestamps(true, true);
    })
    .createTable('category', function (table) {
      table.uuid('id').primary().notNullable();
      table.string('title').notNullable();
      table.text('description');
      table.timestamps(true, true);
    })
    .createTable('product', function (table) {
      table.uuid('id').primary().notNullable();
      table.string('title').notNullable();
      table.float('price').default(0);
      table.float('discount').default(0);
      table.integer('quantity').default(0);
      table.integer('sold').default(0);
      table.text('description');
      table.datetime('published_at');
      table.datetime('start_at');
      table.datetime('end_at');
      table.timestamps(true, true);
    })
    .createTable('product_img', function (table) {
      table.string('title').notNullable();
      table.uuid('product_id').notNullable().references('product.id');
    })
    .createTable('product_category', function (table) {
      table
        .uuid('product_id')
        .references('product.id')
        .onDelete('CASCADE')
        .notNullable();
      table
        .uuid('category_id')
        .references('category.id')
        .onDelete('CASCADE')
        .notNullable();

      table.primary(['product_id', 'category_id']);
    })
    .createTable('cart', function (table) {
      table.uuid('id').primary().notNullable();
      table
        .uuid('user_id')
        .references('user.id')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('status').default(0);
      table.timestamps(true, true);
    })
    .createTable('cart_item', function (table) {
      table
        .uuid('cart_id')
        .references('cart.id')
        .onDelete('CASCADE')
        .notNullable();
      table
        .uuid('product_id')
        .references('product.id')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('quantity');
      table.boolean('active').default(0);
      table.timestamps(true, true);
      table.primary(['cart_id', 'product_id']);
    })
    .createTable('order', function (table) {
      table.uuid('id').primary().notNullable();
      table
        .uuid('user_id')
        .references('user.id')
        .notNullable()
        .onDelete('CASCADE');
      table.integer('status').defaultTo(0);
      table.float('sub_total');
      table.float('grand_total');
      table.float('shipping');
      table.string('name');
      table.string('address');
      table.string('email');
      table.string('phone');
      table.timestamps(true, true);
    })
    .createTable('order_item', function (table) {
      table
        .uuid('product_id')
        .references('product.id')
        .onDelete('CASCADE')
        .notNullable();
      table
        .uuid('order_id')
        .references('order.id')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('quantity');
      table.timestamps(true, true);
      table.primary(['product_id', 'order_id']);
    })
    .createTable('voucher', function (table) {
      table.uuid('id').primary().notNullable();
      table.string('name');
      table.float('discount').default(0);
      table.datetime('start_at').default(knex.fn.now());
      table.datetime('end_at').default(knex.fn.now());
    })
    .createTable('voucher_item', function (table) {
      table
        .uuid('product_id')
        .references('product.id')
        .onDelete('CASCADE')
        .notNullable();
      table
        .uuid('voucher_id')
        .references('voucher.id')
        .onDelete('CASCADE')
        .notNullable();
    })
    .createTable('bund_product', function (table) {
      table
        .uuid('product_id')
        .references('product.id')
        .onDelete('CASCADE')
        .notNullable();
      table
        .uuid('bund_product_id')
        .references('product.id')
        .onDelete('CASCADE')
        .notNullable();
      table
        .uuid('voucher_id')
        .references('voucher.id')
        .onDelete('CASCADE')
        .notNullable();
      table.integer('quantity').default(0);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('voucher_item')
    .dropTable('bund_product')
    .dropTable('voucher')
    .dropTable('product_img')
    .dropTable('order_item')
    .dropTable('order')
    .dropTable('product_category')
    .dropTable('cart_item')
    .dropTable('cart')
    .dropTable('product')
    .dropTable('category')
    .dropTable('user');
};
