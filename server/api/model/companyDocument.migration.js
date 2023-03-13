module.exports = (sequelize, Sequelize) => {
  const CompanyDocument = sequelize.define(
    "company_documents",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "File name is required" },
        },
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "File url is required" },
        },
      },
      document_type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Document type is required" },
        },
        //values = panCard,addressProof
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return CompanyDocument;
};
