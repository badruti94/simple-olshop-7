'use strict';

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
    const orders = []
    for (let i = 1; i <= 100; i++) {
      orders.push({
        total: 1000,
        user_id: 2,
        createdAt: new Date(new Date().getTime() + parseInt(`${i}000`)),
        updatedAt: new Date(),
      })
    }

    await queryInterface.bulkInsert('orders', orders)
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('orders', null, {});
  }
};
