module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('project_buildings', [{
      building_name: 'Tower 21',
      building_number: 'T-212',
      building_type: 'TOWER',
      total_floor: "10",
      funding_source: "HDFC",
      total_units: "100",
      issues_sales_deed: "Yes",
      estimated_date: new Date(),
      project_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      building_name: 'Tower 34',
      building_number: 'T-342',
      building_type: 'TOWER',
      total_floor: "10",
      funding_source: "HDFC",
      total_units: "100",
      issues_sales_deed: "Yes",
      estimated_date: new Date(),
      project_id:1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('project_building_units', [{
      project_building_id: 1,
      unit_number: '12',
      unit_category: 'FLAT',
      unit_address: 'Flat23, tower 2',
      floor_number: '1',
      unit_configuration: 'Final',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      project_building_id: 1,
      unit_number: '13',
      unit_category: 'FLAT',
      unit_address: 'Flat123, tower 2',
      floor_number: '2',
      unit_configuration: 'Final',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      project_building_id: 1,
      unit_number: '14',
      unit_category: 'FLAT',
      unit_address: 'Flat23, tower 2',
      floor_number: '2',
      unit_configuration: 'Final',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      project_building_id: 1,
      unit_number: '15',
      unit_category: 'FLAT',
      unit_address: 'Flat23, tower 2',
      floor_number: '1',
      unit_configuration: 'Final',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    await queryInterface.bulkInsert('project_buildings', [{
      building_name: 'bungalow 1',
      building_number: 'B-123',
      building_type: 'BUNGALOW',
      funding_source: "HDFC",
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