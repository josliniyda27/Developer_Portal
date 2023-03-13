module.exports = (sequelize, Sequelize) => {
  const Query = sequelize.define(
    "queries",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
        //values:general, document)
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_submission_date: {
        type: Sequelize.DATE,
        allowNull: true,        
      }, 
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      case_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      priority_flag: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      raised_by: {
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

  return Query;
};
