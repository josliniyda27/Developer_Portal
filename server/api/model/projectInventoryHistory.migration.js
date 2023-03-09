module.exports = (sequelize, Sequelize) => {
  const projectInventoryHistory = sequelize.define(
    "project_inventory_history",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      total_units: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      units_for_sales: {
        type: Sequelize.STRING,
        allowNull: true,
      }, 
      sold_units: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      avg_rate_per_square_feet: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_unsold_inventory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_value_of_unsold_inventory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unsold_units: {
        type: Sequelize.STRING,
        allowNull: true,
      },  
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_send_to_sf: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },   
    },
    { timestamps: true },
    { paranoid: true }
  );

  return projectInventoryHistory;
};
