module.exports = (sequelize, Sequelize) => {
  const buildingProgressDetailDocument = sequelize.define(
    "project_building_detail_documents",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:false,
        validate: {
          notNull: {
            msg: 'File name cannot be null'
          },
          notEmpty: {
            msg: 'File name cannot be empty'
          }
        }
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
        unique:false,
        validate: {
          notNull: {
            msg: 'File url cannot be null'
          },  
          notEmpty: {
            msg: 'File url cannot be empty'
          }
        }
        
      }, 
    },
    { timestamps: true },
    { paranoid: true }
  );

  return buildingProgressDetailDocument;
};
