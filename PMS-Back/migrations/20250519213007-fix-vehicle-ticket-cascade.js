'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove the existing foreign key constraint
    await queryInterface.removeConstraint('Tickets', 'Tickets_VehicleId_fkey');

    // 2. Add the new foreign key constraint with ON DELETE CASCADE
    await queryInterface.addConstraint('Tickets', {
      fields: ['VehicleId'],
      type: 'foreign key',
      name: 'Tickets_VehicleId_fkey',
      references: {
        table: 'Vehicles',
        field: 'id',
      },
      onDelete: 'CASCADE',   // 👈 This is the magic
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Optional rollback: remove cascade and revert to restrict
    await queryInterface.removeConstraint('Tickets', 'Tickets_VehicleId_fkey');

    await queryInterface.addConstraint('Tickets', {
      fields: ['VehicleId'],
      type: 'foreign key',
      name: 'Tickets_VehicleId_fkey',
      references: {
        table: 'Vehicles',
        field: 'id',
      },
      onDelete: 'RESTRICT',  // or 'NO ACTION'
      onUpdate: 'CASCADE',
    });
  }
};
