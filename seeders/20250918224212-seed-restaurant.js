'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const restaurants = [];

      // Available tags for restaurants
      const availableTags = [
        'FLAVOURED',
        'MEAL',
        'FAST_FOOD',
        'FINE_DINING',
        'FAMILY_FRIENDLY',
        'TAKEAWAY',
        'DELIVERY',
        'VEGETARIAN',
        'HALAL',
        'SEAFOOD',
        'PIZZA',
        'ITALIAN',
        'CHINESE',
        'INDIAN',
        'THAI',
        'MEXICAN',
      ];

      // Restaurant types for more realistic names
      const restaurantTypes = [
        'Restaurant',
        'Bistro',
        'Cafe',
        'Kitchen',
        'Grill',
        'Palace',
        'House',
        'Corner',
        'Express',
        'Delight',
      ];

      // Colombo area coordinates (Sri Lanka)
      const colomboArea = {
        latMin: 6.85, // Southern boundary
        latMax: 6.98, // Northern boundary
        longMin: 79.82, // Western boundary
        longMax: 79.92, // Eastern boundary
      };

      // 🚨 MODIFIED: Loop runs only 10 times to create 10 restaurants
      const MAX_RESTAURANTS = 10;
      for (let i = 0; i < MAX_RESTAURANTS; i++) {
        // Generate random tags (2 elements)
        const selectedTags = faker.helpers.arrayElements(availableTags, 2);

        // Generate restaurant name
        const restaurantType = faker.helpers.arrayElement(restaurantTypes);
        const restaurantName = `${faker.company.name()} ${restaurantType}`;

        // Generate coordinates within Colombo area
        const lat = faker.number.float({
          min: colomboArea.latMin,
          max: colomboArea.latMax,
          fractionDigits: 6,
        });

        const long = faker.number.float({
          min: colomboArea.longMin,
          max: colomboArea.longMax,
          fractionDigits: 6,
        });

        restaurants.push({
          name: restaurantName,
          description: faker.lorem.sentences(2),
          address: faker.location.streetAddress({ useFullAddress: true }),
          currencyCode: 'LKR',
          status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
          tags: JSON.stringify(selectedTags), // Convert array to JSON string
          rate: faker.number.int({ min: 1, max: 5 }), // Random rating 1-5
          long: long, // Longitude (X coordinate)
          lat: lat, // Latitude (Y coordinate)
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: new Date(),
        });
      }
      // END MODIFIED SECTION

      // Check existing restaurants before insert
      const existingCount = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM restaurants',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log(
        '🔍 Existing restaurants before insert:',
        existingCount[0].count
      );

      // Log sample data for verification
      console.log('\n📋 Sample restaurant data:');
      restaurants.slice(0, 3).forEach((restaurant, index) => {
        console.log(`Restaurant ${index + 1}:`);
        console.log(`  Name: ${restaurant.name}`);
        console.log(`  Tags: ${restaurant.tags}`);
        console.log(`  Rate: ${restaurant.rate}`);
        console.log(`  Coordinates: ${restaurant.lat}, ${restaurant.long}`);
        console.log(`  Status: ${restaurant.status}`);
        console.log('---');
      });

      // Insert with transaction
      const result = await queryInterface.bulkInsert(
        'restaurants',
        restaurants,
        { transaction }
      );
      console.log('✅ Bulk insert result:', result);
      console.log(`✅ Successfully inserted ${restaurants.length} restaurants`);

      // Verify insertion
      const count = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM restaurants',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log('🔍 Restaurants in database after insert:', count[0].count);

      // Show some sample inserted data
      const sampleData = await queryInterface.sequelize.query(
        'SELECT name, tags, rate, lat, `long` FROM restaurants LIMIT 3',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );

      console.log('\n🎯 Sample inserted restaurants:');
      sampleData.forEach((restaurant, index) => {
        console.log(`${index + 1}. ${restaurant.name}`);
        console.log(`   Tags: ${restaurant.tags}`);
        console.log(`   Rate: ${restaurant.rate}/5`);
        console.log(`   Location: ${restaurant.lat}, ${restaurant.long}`);
      });

      // Commit the transaction
      await transaction.commit();
      console.log('✅ Transaction committed successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error inserting restaurants:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const countBefore = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM restaurants',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log(`🗑️  Deleting ${countBefore[0].count} restaurants...`);

      await queryInterface.bulkDelete('restaurants', null, { transaction });

      await transaction.commit();
      console.log('✅ Successfully deleted all restaurants');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error deleting restaurants:', error);
      throw error;
    }
  },
};
