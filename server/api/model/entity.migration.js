module.exports = (sequelize, Sequelize) => {
    const Entity = sequelize.define("entities", {
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
    );

    return Entity;
};