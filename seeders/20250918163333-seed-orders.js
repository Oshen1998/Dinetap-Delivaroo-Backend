'use strict';
const { faker } = require('@faker-js/faker');

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Fetch valid users, dishes, and restaurants
      const users = await queryInterface.sequelize.query(
        'SELECT id FROM users;',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      );
      const dishes = await queryInterface.sequelize.query(
        'SELECT id, price, categoryId FROM dishes;',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      );
      const restaurants = await queryInterface.sequelize.query(
        'SELECT id FROM restaurants;',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      );

      if (!users.length || !dishes.length || !restaurants.length) {
        console.warn('⚠️ Skipping: No users, dishes, or restaurants found.');
        await transaction.rollback();
        return;
      }

      const userIds = users.map(u => u.id);
      const restaurantIds = restaurants.map(r => r.id);

      const TOTAL_ORDERS = 10000;
      const BATCH_SIZE = 1000;

      let orderCount = 0;
      let orderItemCount = 0;

      for (let batch = 0; batch < TOTAL_ORDERS / BATCH_SIZE; batch++) {
        const orders = [];

        // 1. Create batch of orders
        for (let i = 0; i < BATCH_SIZE; i++) {
          const userId = faker.helpers.arrayElement(userIds);
          const restaurantId = faker.helpers.arrayElement(restaurantIds);
          const status = faker.helpers.arrayElement([
            'completed',
            'pending',
            'cancelled',
          ]);

          orders.push({
            userId,
            restaurantId,
            status,
            price: 0, // update later
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        // Insert this batch of orders
        await queryInterface.bulkInsert('orders', orders, { transaction });

        // Fetch back the inserted orders (latest N)
        const insertedOrders = await queryInterface.sequelize.query(
          'SELECT id, restaurantId FROM orders ORDER BY id DESC LIMIT ?',
          {
            replacements: [BATCH_SIZE],
            type: queryInterface.sequelize.QueryTypes.SELECT,
            transaction,
          }
        );

        const orderItems = [];

        // 2. Create order_items for each order
        for (const order of insertedOrders) {
          let total = 0;

          const numItems = faker.number.int({ min: 1, max: 5 });
          for (let j = 0; j < numItems; j++) {
            const dish = faker.helpers.arrayElement(dishes);
            const quantity = faker.number.int({ min: 1, max: 3 });
            const price = parseFloat(dish.price);

            total += price * quantity;

            orderItems.push({
              orderId: order.id,
              dishId: dish.id,
              quantity,
              price,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }

          // Update total price for this order
          await queryInterface.sequelize.query(
            `UPDATE orders SET price = ? WHERE id = ?`,
            {
              replacements: [parseFloat(total.toFixed(2)), order.id],
              transaction,
            }
          );
        }

        // Insert batch of items
        await queryInterface.bulkInsert('order_items', orderItems, {
          transaction,
        });

        orderCount += orders.length;
        orderItemCount += orderItems.length;

        console.log(
          `✅ Inserted batch ${batch + 1}: ${orders.length} orders, ${orderItems.length} items`
        );
      }

      await transaction.commit();
      console.log(
        `🎉 Successfully seeded ${orderCount} orders and ${orderItemCount} order items`
      );
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Seeder failed:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('order_items', null, { transaction });
      await queryInterface.bulkDelete('orders', null, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
