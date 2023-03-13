module.exports = (sequelize, Sequelize) => {
    const Pincode = sequelize.define("pincodes", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        pincode: {
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

    return Pincode;
};