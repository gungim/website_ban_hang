const { v4: uuidv4 } = require('uuid');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user')
    .del()
    .then(function () {
      //password 123456789

      return knex('user').insert([
        {
          id: uuidv4(),
          name: 'admin',
          username: 'admin',
          password:
            '$2b$12$bwxSh4uU7WlIvBs4dH18ouPn9Xha3xnaydh9XvtyD5Vg47Lj.l10.',
          email: 'admin@gmail.com',
          isAdmin: true,
        },
      ]);
    });
};
