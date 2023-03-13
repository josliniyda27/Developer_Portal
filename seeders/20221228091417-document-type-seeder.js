module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('document_types', [{
      type: 'Sale deed',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'Broucher',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'Document1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      type: 'Document2',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('document_types', null, {});
  }
};