"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate({ Users, Roles }) {
      this.belongsTo(Users, { foreignKey: "userId", as: "user" });
      this.belongsTo(Roles, { foreignKey: "roleId", as: "role" });
    }
  }
  UserRole.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "user_roles",
      modelName: "UserRoles",
    }
  );
  return UserRole;
};
