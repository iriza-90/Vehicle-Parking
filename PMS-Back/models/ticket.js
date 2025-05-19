'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Ticket.belongsTo(models.Vehicle, { foreignKey: 'VehicleId' });
        
    }
  }
  Ticket.init({
    duration: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    timeIn: DataTypes.DATE,
    timeOut: DataTypes.DATE,
    VehicleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};