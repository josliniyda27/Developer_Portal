module.exports = (sequelize, Sequelize) => {
  const buildingProgressDetail = sequelize.define(
    "building_pregress_details",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tower_commencement_date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Tower commencement date cannot be null'
          },
          notEmpty: {
            msg: 'Tower commencement date cannot be empty'
          }
        }
      },
      estimated_completion_date: {
        type: Sequelize.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Estimated commencement date cannot be null'
          },
          notEmpty: {
            msg: 'Estimated commencement date cannot be empty'
          }
        }
      }, 
      construction_completion_percentage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      stage_of_construction: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      submited_on: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return buildingProgressDetail;
};
