module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('designations', [{
      name: 'Director',
      description: 'Director of operation',
      type: 'company',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Manager',
      description: 'Manager of operation',
      type: 'company',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Accountant',
      description: 'Accountant',
      type: 'company',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('designations', null, {});
  }
};