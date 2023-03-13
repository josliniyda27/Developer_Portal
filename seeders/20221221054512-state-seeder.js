module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('states', [{
      name: 'Andhra Pradesh',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Arunachal Pradesh',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Assam',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('states', null, {});
  }
};