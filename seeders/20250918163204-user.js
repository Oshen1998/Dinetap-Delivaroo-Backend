'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];

    const generateSriLankanPhone = () => {
      const prefixes = ['070', '071', '072', '075', '076', '077', '078'];
      const prefix = faker.helpers.arrayElement(prefixes);
      const number = faker.string.numeric(7);
      return `+94${prefix}${number}`;
    };

    const superAdminPassword = await bcrypt.hash('superadmin123', 10);
    users.push({
      email: 'superadmin@foodapp.com',
      password: superAdminPassword,
      name: 'Super Administrator',
      phoneNumber: '+94771234567',
      status: 'ACTIVE',
      role: 'SUPER_ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    for (let i = 0; i < 3; i++) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      users.push({
        email: faker.internet.email(),
        password: adminPassword,
        name: faker.person.fullName(),
        phoneNumber: generateSriLankanPhone(),
        status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
        role: 'ADMIN',
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    for (let i = 0; i < 50; i++) {
      const customerPassword = await bcrypt.hash('customer123', 10);
      users.push({
        email: faker.internet.email(),
        password: customerPassword,
        name: faker.person.fullName(),
        phoneNumber: generateSriLankanPhone(),
        status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
        role: 'CUSTOMER',
        createdAt: faker.date.past(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
