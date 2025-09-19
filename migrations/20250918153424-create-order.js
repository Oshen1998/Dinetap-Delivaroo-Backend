'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      restaurantId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: "restaurants", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "confirmed", "completed", "cancelled"),
        defaultValue: "pending",
      },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('orders');
  }
};
