module.exports = (sequelize, Sequelize) => {
  const userCompanies = sequelize.define(
    "user_companies",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      assigned_on: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return userCompanies;
};
