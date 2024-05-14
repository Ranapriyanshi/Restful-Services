'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('addresses', 'state', {
      type: Sequelize.STRING,
      comment: 'State of the address',
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('addresses', 'state',{
      type: Sequelize.STRING,
    });
  }
};