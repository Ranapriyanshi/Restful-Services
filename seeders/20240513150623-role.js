"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          uuid: "123e4567-e89b-12d3-a456-426614174000",
          name: "Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: "123e4567-e89b-12d3-a456-426614174001",
          name: "User",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: "123e4567-e89b-12d3-a456-426614174002",
          name: "Manager",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          uuid: "123e4567-e89b-12d3-a456-426614174003",
          name: "Super Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
