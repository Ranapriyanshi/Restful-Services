'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AadharCardDetails extends Model {
    static associate(models) {
    }
  }
  AadharCardDetails.init({
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    aadharNumber: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'aadhar_card_details',
    modelName: 'AadharCardDetails',
  });
  return AadharCardDetails;
};