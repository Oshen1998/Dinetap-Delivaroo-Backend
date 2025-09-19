'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const restaurants = [];

      for (let i = 0; i < 5; i++) {
        restaurants.push({
          name: faker.company.name(),
          description: faker.company.catchPhrase(),
          address: faker.location.streetAddress({ useFullAddress: true }),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // Check existing restaurants before insert
      const existingCount = await queryInterface.sequelize.query(
        "SELECT COUNT(*) as count FROM restaurants",
        { 
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction 
        }
      );
      console.log("🔍 Existing restaurants before insert:", existingCount[0].count);

      // Insert with transaction
      const result = await queryInterface.bulkInsert('restaurants', restaurants, { transaction });
      console.log("✅ Bulk insert result:", result);
      console.log(`✅ Successfully inserted ${restaurants.length} restaurants`);

      // Verify insertion
      const count = await queryInterface.sequelize.query(
        "SELECT COUNT(*) as count FROM restaurants",
        { 
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction 
        }
      );
      console.log("🔍 Restaurants in database after insert:", count[0].count);

      // Commit the transaction
      await transaction.commit();
      console.log("✅ Transaction committed successfully");

    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error inserting restaurants:", error);
      console.error("Error details:", error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('restaurants', null, { transaction });
      await transaction.commit();
      console.log("✅ Successfully deleted all restaurants");
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error deleting restaurants:", error);
      throw error;
    }
  }
};