module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('districts', [{
      name: 'East Godavari',
      state_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Wast Godavari',
      state_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Eluru',
      state_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('districts', null, {});
  }
};