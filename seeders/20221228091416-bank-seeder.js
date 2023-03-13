module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('banks', [{
      name: 'SBI',
      code: 'SBI',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'HDFC',
      code: 'HDFC',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Axis Bank',
      code: 'AXIS',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('banks', null, {});
  }
};