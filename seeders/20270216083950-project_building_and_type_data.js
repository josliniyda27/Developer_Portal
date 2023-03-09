module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('project_buildings', [{
      building_name: 'Tower 1',
      building_number: 'T-123',
      building_type: 'tower',
      total_floor: "10",
      funding_source: "Loan",
      total_units: "100",
      project_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('project_buildings', [{
      building_name: 'bungalow 1',
      building_number: 'B-123',
      building_type: 'bungalow',
      total_floor: "10",
      funding_source: "Loan",
      total_units: "100",
      issues_sales_deed: "Yes",
      project_id:1,
      estimated_date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('project_buildings', null, {});
  }
};