module.exports = (sequelize, Sequelize) => {
  const projectBuildingUnit = sequelize.define(
    "project_building_units",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      unit_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unit_category: {
        type: Sequelize.STRING,
        allowNull: true,
      }, 
      unit_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      floor_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unit_configuration: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      approval_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      approved_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      approval_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return projectBuildingUnit;
};
