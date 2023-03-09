module.exports = (sequelize, Sequelize) => {
    const DocumentType = sequelize.define("document_types", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        type: {
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

    return DocumentType;
};