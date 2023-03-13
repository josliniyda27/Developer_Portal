module.exports = (sequelize, Sequelize) => {
  const resetPassword = sequelize.define(
    "reset_password",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: Sequelize.STRING,
      },
      expiresAt: {
        type: Sequelize.DATE,
      }
    },
    { timestamps: true },
  );

  return resetPassword;
};
