'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('restaurants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING(512),
        allowNull: true,
      },
      currencyCode: {
        type: Sequelize.STRING(3),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: true,
        defaultValue: 'ACTIVE',
      },
      tags: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: '[]',
      },
      rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      long: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      lat: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
        ),
      },
    });

    await queryInterface.addIndex('restaurants', ['name']);
    await queryInterface.addIndex('restaurants', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('restaurants');
  },
};
