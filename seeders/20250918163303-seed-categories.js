'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // First, get all restaurant IDs to use as foreign keys
      const restaurants = await queryInterface.sequelize.query(
        'SELECT id FROM restaurants',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );

      if (!restaurants.length) {
        console.warn(
          '⚠️ No restaurants found - please run restaurants seeder first'
        );
        await transaction.rollback();
        return;
      }

      console.log(`🔍 Found ${restaurants.length} restaurants to use`);

      // Check existing categories before insert
      const existingCount = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM categories',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log(
        '🔍 Existing categories before insert:',
        existingCount[0].count
      );

      const categories = [];

      // Common food category names
      const categoryNames = [
        'Appetizers',
        'Soups & Salads',
        'Grilled Items',
        'Seafood',
        'Vegetarian',
        'Desserts',
        'Beverages',
        'Kids Menu',
        'Pizza',
        'Sandwiches & Wraps',
        'Breakfast',
        'Burgers',
      ];

      // Create categories for each restaurant
      for (const restaurant of restaurants) {
        // Each restaurant gets a maximum of 7 unique categories (min: 4, max: 7)
        const categoryCount = faker.number.int({ min: 4, max: 7 });
        const shuffledCategories = faker.helpers.shuffle(categoryNames);
        // Ensure we take at most 7 unique categories from the shuffled list
        const selectedCategories = shuffledCategories.slice(0, categoryCount);

        selectedCategories.forEach((categoryName, index) => {
          categories.push({
            restaurantId: restaurant.id,
            name: categoryName,
            position: index + 1, // Position starts from 1
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });
      }

      // Insert categories with transaction
      const result = await queryInterface.bulkInsert('categories', categories, {
        transaction,
      });
      console.log('✅ Bulk insert result:', result);
      console.log(`✅ Successfully inserted ${categories.length} categories`);

      // Verify insertion
      const count = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM categories',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log('🔍 Categories in database after insert:', count[0].count);

      // Show sample of created categories
      const sampleCategories = await queryInterface.sequelize.query(
        'SELECT c.name, c.position, r.name as restaurant_name FROM categories c JOIN restaurants r ON c.restaurantId = r.id ORDER BY r.id, c.position LIMIT 10',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log('📋 Sample categories created:', sampleCategories);

      // Commit the transaction
      await transaction.commit();
      console.log('Transaction committed successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('Error inserting categories:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkDelete('categories', null, { transaction });
      await transaction.commit();
      console.log('Successfully deleted all categories');
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting categories:', error);
      throw error;
    }
  },
};
