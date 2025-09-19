import { sequelize, models } from '../models';
import { faker } from '@faker-js/faker';

async function seed() {
  await sequelize.sync();
  const users = await models.User.findAll({ limit: 50 });
  const dishes = await models.Dish.findAll();
  if (users.length === 0 || dishes.length === 0) {
    console.log('Need seed users and dishes first');
    process.exit(1);
  }

  const chunkSize = 500;
  const total = 10000;
  for (let i = 0; i < total; i += chunkSize) {
    const items = [];
    for (let j = 0; j < Math.min(chunkSize, total - i); j++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const numItems = faker.number.int({ min: 1, max: 5 });
      let totalPrice = 0;
      const order = await models.Order.create({
        userId: user.id,
        status: 'completed',
        total: 0
      });
      for (let k = 0; k < numItems; k++) {
        const dish = dishes[Math.floor(Math.random() * dishes.length)];
        const quantity = faker.number.int({ min: 1, max: 3 });
        const price = Number(dish.price) || faker.number.int({ min: 200, max: 2000 })/100;
        totalPrice += price * quantity;
        await models.OrderItem.create({
          orderId: order.id,
          dishId: dish.id,
          quantity,
          price
        });
      }
      order.total = totalPrice;
      await order.save();
    }
    console.log(`Seeded ${Math.min(i + chunkSize, total)} orders`);
  }
  console.log('Done');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
