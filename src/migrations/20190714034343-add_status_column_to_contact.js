'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Contacts',
      'status',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Contacts',
      'status'
    );
  }
};
