module.exports = (sequelize, Sequelize) => {
  const ProjectBuildingCategory = sequelize.define(
    "project_building_categories",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      total_units: {
        type: Sequelize.STRING,
        allowNull: false,
        // validate: {
        //     notNull: { msg: "Total units is required" },
        //     notEmpty: {
        //       arg:true,
        //       msg:"Total units is required",
        //     },
        //   },
      },
      sold_units: {
        type: Sequelize.STRING,
        allowNull: false,
        // validate: {
        //     notNull: { msg: "Solid units is required" },
        //     notEmpty: {
        //       arg:true,
        //       msg:"Solid units is required",
        //     },
        //   },
      },
      rate_per_square_feet: {
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
      is_send_to_sf:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      }
    },
    { timestamps: true },
    { paranoid: true }
  );

  return ProjectBuildingCategory;
};
