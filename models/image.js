"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate({ Comment }) {
      this.hasMany(Comment, {
        foreignKey: "commentableId",
        constraints: false,
        scope: {
          commentableType: "image",
        },
      });
    }
  }
  Image.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "images",
      modelName: "Image",
    }
  );
  return Image;
};
