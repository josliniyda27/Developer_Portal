module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('project_inventory_histories', [{
      total_units: '211',
      units_for_sales: '121',
      sold_units: '88',
      avg_rate_per_square_feet: "1980",
      total_unsold_inventory: "876",
      total_value_of_unsold_inventory: "100",
      unsold_units: "987",
      is_send_to_sf: true,
      project_id:11,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      total_units: '211',
      units_for_sales: '121',
      sold_units: '88',
      avg_rate_per_square_feet: "1980",
      total_unsold_inventory: "876",
      total_value_of_unsold_inventory: "100",
      unsold_units: "987",
      is_send_to_sf: true,
      project_id:11,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('project_inventory_histories', null, {});
  }
};