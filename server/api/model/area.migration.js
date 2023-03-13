module.exports = (sequelize, Sequelize) => {
    const Area = sequelize.define("areas", {
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
        city_code: {
            type: Sequelize.STRING,
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    },
        { timestamps: true },
        { paranoid: true }
    );

    return Area;
};