'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      id: { type: Sequelize.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      hashedToken: { type: Sequelize.STRING(512), allowNull: false },
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      revokedAt: { type: Sequelize.DATE },
      replacedByToken: { type: Sequelize.STRING(512) },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      fingerprint: { type: Sequelize.STRING(255) },
      createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('refresh_tokens');
  }
};
