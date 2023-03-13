module.exports = (sequelize, Sequelize) => {
  const projectDocumentType = sequelize.define(
    "project_document_type",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      }, 
    },
    { timestamps: true },
    { paranoid: true }
  );

  return projectDocumentType;
};
