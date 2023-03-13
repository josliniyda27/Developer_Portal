module.exports = (sequelize, Sequelize) => {
    const ProjectAddressDetail = sequelize.define("project_address_details", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sale_deed_no: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        address_line_1: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
              notNull: { msg: "Address line 1 is required" },
              notEmpty: {
                arg: true,
                msg: "Address line 1 is required",
              },
            },
        },
        address_line_2: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        address_line_3: {
            type: Sequelize.TEXT,
            allowNull: true,
        }, 
        landmark: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        project_number: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        city_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        state_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        pincode_value: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        area_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        taluka_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        district_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    },
        { timestamps: true },
        { paranoid: true }
    );

    return ProjectAddressDetail;
};