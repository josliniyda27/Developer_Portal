module.exports = (sequelize, Sequelize) => {
  const QueryCommunications = sequelize.define(
    "query_communications",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true,
        isIn: {
          args: [["hdfc", "portal"]],
          msg: "Destination must be one of: hdfc, portal",
        },
        //values:hdfc, portal)
      },
      destination: {
        type: Sequelize.STRING,
        allowNull: true,
        isIn: {
          args: [["hdfc", "portal"]],
          msg: "Destination must be one of: hdfc, portal",
        },
        //values:hdfc, portal)
      },
      document_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      document_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      task_id: {
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

  return QueryCommunications;
};
