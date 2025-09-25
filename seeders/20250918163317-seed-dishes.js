'use strict';

const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Check existing dishes before insert
      const existingCount = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM dishes',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log('🔍 Existing dishes before insert:', existingCount[0].count);

      // Fetch categories WITH their restaurant IDs AND name
      const categories = await queryInterface.sequelize.query(
        'SELECT id, restaurantId, name FROM categories',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );

      if (!categories.length) {
        console.warn('⚠️ No categories found — skipping dish seeding');
        await transaction.rollback();
        return;
      }

      console.log(
        `📊 Found ${categories.length} categories to populate with dishes`
      );

      const dishes = [];
      const TAGS = [
        'VEGAN',
        'DELICIOUS',
        'SPICY',
        'GLUTEN-FREE',
        'ORGANIC',
        'HEALTHY',
        'FRESH',
        'VEGETARIAN',
        'SWEET',
        'HOT',
        'CRISPY',
        'HOMEMADE',
      ];

      // 🚨 FIX: Using shorter, standardized status names to avoid truncation errors.
      // Removed 'UNAVAILABLE' (13 chars) and replaced with 'SOLD_OUT' (8 chars) or 'HIDDEN' (6 chars).
      const UNAVAILABLE_STATUSES = ['SOLD_OUT', 'HIDDEN'];

      function getRandomTags() {
        return JSON.stringify(faker.helpers.shuffle(TAGS).slice(0, 2));
      }

      // Generate realistic dish names based on category
      function generateDishName(categoryName) {
        const dishNames = {
          Appetizers: [
            'Spring Rolls',
            'Chicken Wings',
            'Garlic Bread',
            'Mozzarella Sticks',
            'Samosas',
            'Bruschetta',
          ],
          'Soups & Salads': [
            'Minestrone Soup',
            'Caesar Salad',
            'Lentil Soup',
            'Greek Salad',
            'Tom Yum Soup',
            'Cobb Salad',
          ],
          'Grilled Items': [
            'Grilled Chicken Breast',
            'Steak Skewers',
            'Grilled Prawns',
            'Halloumi Skewers',
            'Lamb Kofta',
            'Grilled Vegetables',
          ],
          Seafood: [
            'Fish Curry',
            'Seafood Paella',
            'Grilled Salmon',
            'Tuna Steak',
            'Prawn Stir-fry',
            'Crab Cakes',
          ],
          Vegetarian: [
            'Vegetable Biryani',
            'Paneer Tikka Masala',
            'Mushroom Risotto',
            'Eggplant Parmesan',
            'Tofu Stir-fry',
            'Veggie Burger',
          ],
          Desserts: [
            'Chocolate Cake',
            'Ice Cream',
            'Tiramisu',
            'Cheesecake',
            'Fruit Salad',
            'Watalappan',
          ],
          Beverages: [
            'Fresh Orange Juice',
            'Coffee',
            'Green Tea',
            'Smoothie',
            'Lassi',
            'Coconut Water',
          ],
          'Kids Menu': [
            'Mini Cheeseburger',
            'Chicken Nuggets',
            'Fish Fingers',
            'Mac & Cheese',
            'Spaghetti',
            'Pancakes',
          ],
          Pizza: [
            'Margherita Pizza',
            'Pepperoni Pizza',
            'Vegetable Pizza',
            'BBQ Chicken Pizza',
            'Hawaiian Pizza',
          ],
          'Sandwiches & Wraps': [
            'Club Sandwich',
            'Chicken Wrap',
            'BLT',
            'Vegetable Panini',
            'Philly Cheesesteak',
            'Tuna Melt',
          ],
          Breakfast: [
            'Pancakes',
            'Omelette',
            'French Toast',
            'Eggs Benedict',
            'English Breakfast',
            'Avocado Toast',
          ],
          Burgers: [
            'Classic Beef Burger',
            'Chicken Burger',
            'Gourmet Cheese Burger',
            'Spicy Crispy Chicken Burger',
            'Double Patty Burger',
            'Veggie Patty Burger',
          ],
        };

        // Try to match category name with predefined dishes
        for (const [category, dishList] of Object.entries(dishNames)) {
          if (
            categoryName &&
            categoryName.toLowerCase().includes(category.toLowerCase())
          ) {
            return faker.helpers.arrayElement(dishList);
          }
        }

        // Fallback to faker generated dish name
        return faker.food.dish();
      }

      // Create dishes for each category
      for (const category of categories) {
        // Use the 'name' column fetched earlier
        const categoryName = category.name || 'General';

        // 🚨 MODIFIED: Set maximum dishes per category to 12
        const dishesPerCategory = faker.number.int({ min: 5, max: 12 });

        console.log(
          `🍽️  Creating ${dishesPerCategory} dishes for category: ${categoryName}`
        );

        for (let i = 0; i < dishesPerCategory; i++) {
          const isAvailable = faker.datatype.boolean(0.8); // 80% chance of being available
          const isPopular = faker.datatype.boolean(0.3); // 30% chance of being popular

          dishes.push({
            categoryId: category.id,
            restaurantId: category.restaurantId,
            name: generateDishName(categoryName),
            description: faker.lorem.sentences(2),
            price: parseFloat(
              faker.commerce.price({ min: 8.99, max: 65.99, dec: 2 })
            ),
            image: faker.image.urlLoremFlickr({
              category: 'food',
              width: 640,
              height: 480,
            }),
            tags: getRandomTags(),
            isAvailable: isAvailable,
            isPopular: isPopular,
            // 🚨 FIX APPLIED HERE: Use shorter status names
            status: isAvailable
              ? 'AVAILABLE' // 9 characters
              : faker.helpers.arrayElement(UNAVAILABLE_STATUSES), // Max 8 characters
            rate: faker.number.int({ min: 1, max: 5 }),
            createdAt: faker.date.past({ years: 1 }),
            updatedAt: new Date(),
          });
        }
      }

      console.log(`📊 Generated ${dishes.length} dishes total`);

      // Log sample data before insertion
      console.log('\n📋 Sample dish data:');
      dishes.slice(0, 3).forEach((dish, index) => {
        console.log(`Dish ${index + 1}:`);
        console.log(`  Name: ${dish.name}`);
        console.log(`  Category ID: ${dish.categoryId}`);
        console.log(`  Restaurant ID: ${dish.restaurantId}`);
        console.log(`  Price: $${dish.price}`);
        console.log(`  Tags: ${dish.tags}`);
        console.log(`  Status: ${dish.status}`);
        console.log('---');
      });

      // Insert dishes with transaction
      const result = await queryInterface.bulkInsert('dishes', dishes, {
        transaction,
      });
      console.log('✅ Bulk insert result:', result);
      console.log(`✅ Successfully inserted ${dishes.length} dishes`);

      // Verify insertion
      const count = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM dishes',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log('🔍 Dishes in database after insert:', count[0].count);

      // Show sample of created dishes with category and restaurant info
      const sampleDishes = await queryInterface.sequelize.query(
        `SELECT d.name, d.price, d.tags, d.status, 
                c.name as category_name, 
                r.name as restaurant_name 
         FROM dishes d 
         JOIN categories c ON d.categoryId = c.id 
         JOIN restaurants r ON d.restaurantId = r.id 
         LIMIT 8`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );

      console.log('\n🎯 Sample dishes created:');
      sampleDishes.forEach((dish, index) => {
        console.log(`${index + 1}. ${dish.name}`);
        console.log(`   Restaurant: ${dish.restaurant_name}`);
        console.log(`   Category: ${dish.category_name}`);
        console.log(`   Price: $${dish.price}`);
        console.log(`   Tags: ${dish.tags}`);
        console.log(`   Status: ${dish.status}`);
      });

      // Show summary statistics
      const stats = await queryInterface.sequelize.query(
        `SELECT 
           COUNT(*) as total_dishes,
           COUNT(DISTINCT restaurantId) as restaurants_with_dishes,
           COUNT(DISTINCT categoryId) as categories_with_dishes,
           AVG(price) as avg_price,
           SUM(CASE WHEN status = 'AVAILABLE' THEN 1 ELSE 0 END) as available_dishes
         FROM dishes`,
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );

      console.log('\n📊 Dish Statistics:');
      console.log(`Total Dishes: ${stats[0].total_dishes}`);
      console.log(
        `Restaurants with Dishes: ${stats[0].restaurants_with_dishes}`
      );
      console.log(`Categories with Dishes: ${stats[0].categories_with_dishes}`);
      console.log(
        `Average Price: $${parseFloat(stats[0].avg_price).toFixed(2)}`
      );
      console.log(`Available Dishes: ${stats[0].available_dishes}`);

      // Commit the transaction
      await transaction.commit();
      console.log('✅ Transaction committed successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error inserting dishes:', error);
      console.error('Error details:', error.message);
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const countBefore = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM dishes',
        {
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction,
        }
      );
      console.log(`🗑️  Deleting ${countBefore[0].count} dishes...`);

      await queryInterface.bulkDelete('dishes', null, { transaction });
      await transaction.commit();
      console.log('✅ Successfully deleted all dishes');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error deleting dishes:', error);
      throw error;
    }
  },
};
