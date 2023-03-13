module.exports = (sequelize, Sequelize) => {
    const UserOtp = sequelize.define("user_otps", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        otp: {
            type: Sequelize.STRING,
        },
        type: {
            type: Sequelize.STRING,
        },
        expiresAt: {
            type: Sequelize.DATE,
        }
    },
        { timestamps: true },
    );

    return UserOtp;
};