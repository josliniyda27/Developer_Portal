module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('cities', [{
      name: 'Visakhapatnam',
      district_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Vijayawada',
      district_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Tirupati',
      district_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('cities', null, {});
  }
};