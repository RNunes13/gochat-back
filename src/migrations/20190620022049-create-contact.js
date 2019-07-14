'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Contacts', {
      ownerId: {
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contactId: {
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Contacts');
  }
};
