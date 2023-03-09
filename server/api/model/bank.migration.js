module.exports = (sequelize, Sequelize) => {
    const bank = sequelize.define("banks", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
        },
        code: {
            type: Sequelize.STRING,
        }
    },
        { timestamps: true },
        { paranoid: true }
    );

    return bank;
};