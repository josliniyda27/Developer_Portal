module.exports = (sequelize, Sequelize) => {
  const companyGroups = sequelize.define(
    "company_groups",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      linked_by : {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return companyGroups;
};
