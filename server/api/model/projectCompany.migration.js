module.exports = (sequelize, Sequelize) => {
  const projectCompany = sequelize.define(
    "project_company",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      project_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      builder_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return projectCompany;
};
