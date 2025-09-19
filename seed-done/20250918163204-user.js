"use strict";
import { faker } from "@faker-js/faker";
import { genSalt, hash } from "bcrypt";

export async function up(queryInterface) {
  const transaction = await queryInterface.sequelize.transaction();

  try {
    const salt = await genSalt(10);
    const users = [];

    for (let i = 0; i < 10; i++) {
      const password = await hash("Password123!", salt);
      users.push({
        email: faker.internet.email().toLowerCase(),
        password,
        name: faker.internet.displayName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Pass the transaction to bulkInsert
    const result = await queryInterface.bulkInsert("users", users, { transaction });
    console.log("✅ Bulk insert result:", result);
    console.log(`✅ Successfully inserted ${users.length} users`);

    // Query with transaction
    const count = await queryInterface.sequelize.query(
      "SELECT COUNT(*) as count FROM users",
      { 
        type: queryInterface.sequelize.QueryTypes.SELECT,
        transaction 
      }
    );
    console.log("🔍 Users in database after insert:", count[0].count);

    // COMMIT the transaction - this was missing!
    await transaction.commit();
    console.log("✅ Transaction committed successfully");

  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error inserting users:", error);
    throw error;
  }
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("users", null, {});
}