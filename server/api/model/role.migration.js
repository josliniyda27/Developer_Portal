module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    },
        { timestamps: true },
    );

    return Role;
};