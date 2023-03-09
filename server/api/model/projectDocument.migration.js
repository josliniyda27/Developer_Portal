module.exports = (sequelize, Sequelize) => {
  const projectDocument = sequelize.define(
    "project_document",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      document_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      document_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_send_to_sf:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return projectDocument;
};
