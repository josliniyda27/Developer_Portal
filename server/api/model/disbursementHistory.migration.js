module.exports = (sequelize, Sequelize) => {
  const disbursementHistory = sequelize.define(
    "disbursement_histories",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      amount_disbursed: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      disbursed_on: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      payee_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bank_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      request_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      utr_checque_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remarks: {
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

  return disbursementHistory;
};
