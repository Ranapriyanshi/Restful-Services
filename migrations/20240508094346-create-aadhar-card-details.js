'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Datatypes) {
    await queryInterface.createTable('aadhar_card_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: Datatypes.INTEGER
      },
      uuid: {
        type: Datatypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Datatypes.UUIDV4
      },
      aadharNumber: {
        type: Datatypes.INTEGER,
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