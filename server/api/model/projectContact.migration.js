module.exports = (sequelize, Sequelize) => {
    const ProjectContact = sequelize.define("project_contacts", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        project_number : {
            type: Sequelize.STRING,
            allowNull: true,
        },
        contact_person_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        contact_person_email: {
            type: Sequelize.STRING,
            allowNull: true,
        }, 
        contact_person_mobile: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        contact_person_designation: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        builder_id: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    },
        { timestamps: true },
        { paranoid: true }
    );

    return ProjectContact;
};