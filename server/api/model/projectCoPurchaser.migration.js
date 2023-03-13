module.exports = (sequelize, Sequelize) => {
  const projectCoPurchaser = sequelize.define(
    "project_copurchasers",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      co_purchaser_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      co_purchaser_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      co_purchaser_mobile_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },  
    },
    { timestamps: true },
    { paranoid: true }
  );

  return projectCoPurchaser;
};
