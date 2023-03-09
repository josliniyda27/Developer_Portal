module.exports = (sequelize, Sequelize) => {
    const Permission = sequelize.define("permissions", {
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

    return Permission;
};