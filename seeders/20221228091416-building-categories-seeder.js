module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('building_categories', [{
      name: 'Residential Apartments',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Commercial',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Bungalow',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Plots',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('building_categories', null, {});
  }
};