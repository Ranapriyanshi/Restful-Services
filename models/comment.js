"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ Video, Image }) {
      // define association here
      this.belongsTo(Video, {
        foreignKey: "commentableId",
        constraints: false,
        scope: {
          commentableType: "video",
        },
      });
      this.belongsTo(Image, {
        foreignKey: "commentableId",
        constraints: false,
        scope: {
          commentableType: "image",
        },
      });
    }
  }
  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commentableType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commentableId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "comments",
      modelName: "Comment",
    }
  );
  return Comment;
};
