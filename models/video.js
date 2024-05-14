"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    static associate({ Comment }) {
      this.hasMany(Comment, {
        foreignKey: "commentableId",
        constraints: false,
        scope: {
          commentableType: "video",
        },
      });
    }
  }
  Video.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "videos",
      modelName: "Video",
    }
  );
  return Video;
};
