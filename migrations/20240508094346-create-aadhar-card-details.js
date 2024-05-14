'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Datatypes) {
    await queryInterface.createTable('aadhar_card_details', {
      uuid: {
        type: Datatypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Datatypes.UUIDV4
      },
      aadharNumber: {
        type: Datatypes.BIGINT,
        allowNull: false,
      },
      name: {
        type: Datatypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Datatypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Datatypes.DATE
      }
    });
  },
  async down(queryInterface, Datatypes) {
    await queryInterface.dropTable('aadhar_card_details');
  }
};