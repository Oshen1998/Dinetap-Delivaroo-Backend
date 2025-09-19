'use strict';

const { faker } = require('@faker-js/faker'); // Use require instead of import

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Check existing data before insert
      const existingOrdersCount = await queryInterface.sequelize.query(
        "SELECT COUNT(*) as count FROM orders",
        { 
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction 
        }
      );
      console.log("🔍 Existing orders before insert:", existingOrdersCount[0].count);

      // Options for cleaner query results (returns array of objects)
      const queryOpts = { 
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction 
      };

      // 1. Fetch existing user and dish data to ensure valid foreign keys
      const users = await queryInterface.sequelize.query(`SELECT id FROM users;`, queryOpts);
      const dishes = await queryInterface.sequelize.query(`SELECT id, price FROM dishes;`, queryOpts);

      const userIds = users.map(u => u.id);
      const dishList = dishes; // Array of { id, price } objects

      if (userIds.length === 0 || dishList.length === 0) {
        console.warn('⚠️ Skipping order seeding: No users or dishes found in database.');
        await transaction.rollback();
        return;
      }

      console.log(`🔍 Found ${userIds.length} users and ${dishList.length} dishes`);

      const orders = [];
      const orderItems = [];

      // 2. Generate 100 sample orders
      for (let i = 0; i < 10000; i++) {
        const userId = faker.helpers.arrayElement(userIds);
        const orderId = i + 1; // Use a sequential ID for bulkInsert tracking
        let total = 0;

        // Generate 1 to 5 random items per order
        const numItems = faker.number.int({ min: 1, max: 5 });
        for (let j = 0; j < numItems; j++) {
          const dish = faker.helpers.arrayElement(dishList);
          const quantity = faker.number.int({ min: 1, max: 3 });
          
          // Ensure price is treated as a number for calculation
          const price = parseFloat(dish.price);
          
          total += price * quantity;
          
          orderItems.push({
            orderId,
            dishId: dish.id,
            quantity,
            price,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }

        // Add the order record
        orders.push({
          id: orderId, // Manually assign ID to correctly link orderItems
          userId,
          // Randomly set status for realism
          status: faker.helpers.arrayElement(['completed', 'pending', 'cancelled']), 
          // Round the total to 2 decimal places for currency
          total: parseFloat(total.toFixed(2)),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // 3. Insert data into tables with transaction
      const ordersResult = await queryInterface.bulkInsert('orders', orders, { transaction });
      console.log("✅ Orders bulk insert result:", ordersResult);
      console.log(`✅ Successfully inserted ${orders.length} orders`);

      const orderItemsResult = await queryInterface.bulkInsert('order_items', orderItems, { transaction });
      console.log("✅ Order items bulk insert result:", orderItemsResult);
      console.log(`✅ Successfully inserted ${orderItems.length} order items`);

      // Verify insertion
      const ordersCount = await queryInterface.sequelize.query(
        "SELECT COUNT(*) as count FROM orders",
        { 
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction 
        }
      );
      const orderItemsCount = await queryInterface.sequelize.query(
        "SELECT COUNT(*) as count FROM order_items",
        { 
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction 
        }
      );
      console.log("🔍 Orders in database after insert:", ordersCount[0].count);
      console.log("🔍 Order items in database after insert:", orderItemsCount[0].count);

      // Show sample of created orders with details
      const sampleOrders = await queryInterface.sequelize.query(
        `SELECT o.id, o.status, o.total, u.email as user_email, 
                COUNT(oi.id) as item_count
         FROM orders o 
         JOIN users u ON o.userId = u.id 
         LEFT JOIN order_items oi ON o.id = oi.orderId 
         GROUP BY o.id, o.status, o.total, u.email
         LIMIT 5`,
        { 
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction 
        }
      );
      console.log("📋 Sample orders created:", sampleOrders);

      // Commit the transaction
      await transaction.commit();
      console.log("✅ Transaction committed successfully");

    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error inserting orders:", error);
      console.error("Error details:", error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 4. Clean up (delete items first due to foreign key constraints)
      await queryInterface.bulkDelete('order_items', null, { transaction });
      console.log("✅ Successfully deleted all order items");
      
      await queryInterface.bulkDelete('orders', null, { transaction });
      console.log("✅ Successfully deleted all orders");
      
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Error deleting orders:", error);
      throw error;
    }
  }
};