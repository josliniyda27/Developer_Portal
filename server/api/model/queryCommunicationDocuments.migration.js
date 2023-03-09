module.exports = (sequelize, Sequelize) => {
  const QueryCommunicationDocuments = sequelize.define(
    "query_communication_documents",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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

  return QueryCommunicationDocuments;
};
