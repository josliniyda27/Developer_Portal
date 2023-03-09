module.exports = (sequelize, Sequelize) => {
    const City = sequelize.define("cities", {
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
        },
        state_code: {
            type: Sequelize.STRING,
        },
    },
        { timestamps: true },
    );

    return City;
};