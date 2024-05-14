'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({Addresses, AadharCardDetails}) {
      this.hasMany(Addresses,{foreignKey:'userId',as : 'addresses'})
      this.belongsTo(AadharCardDetails,{foreignKey:'aadharId',as : 'aadhar_card_details'})
    }
  }
  User.init({
    uuid:{
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country_code:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    aadharId:{
      type: DataTypes.STRING,
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'Users',
  });
  return User;
};