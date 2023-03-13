module.exports = (sequelize, Sequelize) => {
  const CompanyKeyMemeber = sequelize.define(
    "company_key_members",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
        },
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      director_pancard_document_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      director_pancard_document_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      director_pancard_document_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      builder_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      designation_name: {
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

  return CompanyKeyMemeber;
};
