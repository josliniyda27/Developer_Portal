module.exports = (sequelize, Sequelize) => {
    const bankAccountType = sequelize.define("bank_account_types", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
        },
    },
        { timestamps: true },
        { paranoid: true }
    );

    return bankAccountType;
};