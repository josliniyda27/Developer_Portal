module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('bank_account_types', [{
      name: 'Savings',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Fixed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Current',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('bank_account_types', null, {});
  }
};