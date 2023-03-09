module.exports = (sequelize, Sequelize) => {
  const userProjects = sequelize.define(
    "user_projects",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return userProjects;
};
