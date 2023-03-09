module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('companies', [{
      name: 'Asset homes',
      city_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'DLF',
      city_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Gold Group',
      city_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('companies', null, {});
  }
};