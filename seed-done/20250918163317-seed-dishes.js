"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Check existing dishes before insert
      const existingCount = await queryInterface.sequelize.query(
        "SELECT COUNT(*) as count FROM dishes",
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log("🔍 Existing dishes before insert:", existingCount[0].count);

      // Fetch categories with proper destructuring
      const categories = await queryInterface.sequelize.query(
        "SELECT id FROM categories",
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );

      if (!categories.length) {
        console.warn("⚠️ No categories found — skipping dish seeding");
        await transaction.rollback();
        return;
      }

      const dishes = [];
      const TAGS = [
        "VEGAN",
        "DELICIOUS",
        "SPICY",
        "GLUTEN-FREE",
        "ORGANIC",
        "HEALTHY",
        "FRESH",
        "VEGETARIAN",
        "SWEET",
        "HOT",
        "CRISPY",
        "HOMEMADE",
      ];

      function getRandomTags() {
        return JSON.stringify(faker.helpers.shuffle(TAGS).slice(0, 2));
      }

      // Create dishes for each category
      categories.forEach((category) => {
        for (let i = 0; i < 8; i++) {
          dishes.push({
            categoryId: category.id,
            name: faker.food.dish(),
            description: faker.lorem.sentence(),
            price: parseFloat(
              faker.commerce.price({ min: 5, max: 50, dec: 2 })
            ),
            image: faker.image.url({
              width: 640,
              height: 480,
              category: "food",
            }),
            isAvailable: false,
            tags: getRandomTags(),
            isPopular: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      });

      // Insert dishes with transaction
      const result = await queryInterface.bulkInsert("dishes", dishes, {
        transaction,
      });
      console.log("✅ Bulk insert result:", result);
      console.log(`✅ Successfully inserted ${dishes.length} dishes`);

      // Verify insertion
      const count = await queryInterface.sequelize.query(
        "SELECT COUNT(*) as count FROM dishes",
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log("🔍 Dishes in database after insert:", count[0].count);

      // Show sample of created dishes with category info
      const sampleDishes = await queryInterface.sequelize.query(
        `SELECT d.name, d.price, c.name as category_name, r.name as restaurant_name 
         FROM dishes d 
         JOIN categories c ON d.categoryId = c.id 
         JOIN restaurants r ON c.restaurantId = r.id 
         LIMIT 5`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log("📋 Sample dishes created:", sampleDishes);

      // Commit the transaction
      await transaction.commit();
      console.log("✅ Transaction committed successfully");
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error inserting dishes:", error);
      console.error("Error details:", error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete("dishes", null, { transaction });
      await transaction.commit();
      console.log("✅ Successfully deleted all dishes");
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error deleting dishes:", error);
      throw error;
    }
  },
};
