'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Datatypes) {
    await queryInterface.createTable('addresses', {
      uuid: {
        primaryKey: true,
        type: Datatypes.UUID,
        allowNull: false,
        defaultValue: Datatypes.UUIDV4
      },
      name: {
        type: Datatypes.STRING,
        allowNull: false
      },
      street: {
        type: Datatypes.STRING,
        allowNull: false
      },
      city: {
        type: Datatypes.STRING,
        allowNull: false
      },
      country: {
        type: Datatypes.STRING,
        allowNull: false
      },
      userId: {
        type: Datatypes.UUID,
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
    await queryInterface.dropTable('addresses');
  }
};