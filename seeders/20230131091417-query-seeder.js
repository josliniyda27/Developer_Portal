module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('queries', [{
      name: 'General Query',
      description: 'General Query',
      type: 'general',
      project_id:1,
      company_id:1,
      user_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Document Query',
      description: 'General Query',
      type: 'document',
      project_id:1,
      company_id:1,
      user_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('queries', null, {});
  }
};