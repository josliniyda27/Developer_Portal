module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('pincodes', [{
      pincode: '686555',
      state_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      pincode: '686533',
      state_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      pincode: '686544',
      state_id: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pincodes', null, {});
  }
};