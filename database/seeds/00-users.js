
const bcrypt = require('bcryptjs');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'James', password: 'password1'},
        {username: 'Logan', password: 'password2'},
        {username: 'Hanna', password: 'password3'},
      ]);
    });
};
