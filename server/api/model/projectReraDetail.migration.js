module.exports = (sequelize, Sequelize) => {
  const ProjectReraDetail = sequelize.define(
    "project_rera_details",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      registration_status: {
        type: Sequelize.ENUM,
        values: ["approved", "applied", "notApplied"],
        allowNull: false,
        validate: {
          notNull: { msg: "Registration status is required" },
        },
      },
      registration_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: {
          args: true,
          msg: "This RERA number is already linked to a project. Please enter another RERA Number!",
        },
      },
      autofill_enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      application_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: {
          args: true,
          msg: "This RERA application number is already added to a project. Please check and update application number!",
        },
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

  return ProjectReraDetail;
};
