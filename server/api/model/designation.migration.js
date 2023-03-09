module.exports = (sequelize, Sequelize) => {
    const Designation = sequelize.define("designations", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
    },
        { timestamps: true },
        { paranoid: true }
    );

    return Designation;
};