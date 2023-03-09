module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('talukas', [{
      name: 'taluk1',
      district_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'taluk2',
      district_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'taluk3',
      district_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('areas', null, {});
  }
};