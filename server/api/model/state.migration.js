module.exports = (sequelize, Sequelize) => {
    const State = sequelize.define("states", {
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
    },
        { timestamps: true },
    );

    return State;
};