'use strict';
const bcrypt = require('bcrypt')
let users = require('./data-user.json')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const salt = await bcrypt.genSalt(10)

    users = await Promise.all(users.map(async (user) => {
      const password = await bcrypt.hash(user.password, salt)
      return { ...user, password }
    }))

    await queryInterface.bulkInsert('users', users, {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
