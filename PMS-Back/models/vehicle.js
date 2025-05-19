'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Vehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Vehicle.belongsTo(models.User, { foreignKey: 'UserId' });
    }
  }
  Vehicle.init({
    owner: DataTypes.STRING,
    plate: DataTypes.STRING,
    vehicleType: DataTypes.STRING,
    color: DataTypes.STRING,
    timeIn: {
  type: DataTypes.DATE,
  allowNull: false,
},
    timeOut: {
  type: DataTypes.DATE,
  allowNull: true, 
},
    slotAssigned: DataTypes.STRING,
    status: DataTypes.STRING,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Vehicle',
  });
  return Vehicle;
};