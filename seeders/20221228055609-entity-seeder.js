module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('entities');
    return queryInterface.bulkInsert('entities', [{
      name: 'Partnership',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Proprietorship',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Private LTD',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'LLP',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Public LTD',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('entities', null, {});
  }
};