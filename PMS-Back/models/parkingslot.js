module.exports = (sequelize, DataTypes) => {
  const ParkingSlot = sequelize.define('ParkingSlot', {
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    parkingName: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    availableSpaces: { type: DataTypes.INTEGER, defaultValue: 0 },
    chargingFeePerHour: { type: DataTypes.FLOAT, allowNull: false },
  });

  return ParkingSlot;
};