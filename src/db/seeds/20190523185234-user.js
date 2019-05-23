'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [{
        username: 'John',
        email: "john@gmail.com",
        password: "11223344",
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'Anna',
        email: "anna@gmail.com",
        password: "11223344",
        role: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Users', null, {});
  }
};
