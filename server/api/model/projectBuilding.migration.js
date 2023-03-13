module.exports = (sequelize, Sequelize) => {
  const projectBuilding = sequelize.define(
    "project_buildings",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      building_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Building name cannot be null",
          },
          notEmpty: {
            msg: "Building name cannot be empty",
          },
        },
      },
      building_number: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Building number cannot be null",
          },
          notEmpty: {
            msg: "Building number cannot be empty",
          },
        },
      },
      building_type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Building type cannot be null",
          },
          notEmpty: {
            msg: "Building type cannot be empty",
          },
          isIn: {
            args: [["tower","bungalow"]],
            msg: "Building Type must be one of: tower, bungalow",
          },
        },
        //values: tower,bungalow
      },
      total_floor: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      funding_source: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_units: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      issues_sales_deed: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isIn: {
            args: [["Yes","No"]],
            msg: "Issues sales deed must be one of: Yes, No",
          },
        },
      },
      estimated_date: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
          isRequiredIfissues_sales_deed(value) {
            if (this.issues_sales_deed === "No" && !value) {
              throw new Error(
                "Estimated date is required if issues sales deed is No"
              );
            } else if (this.issues_sales_deed === "Yes") {
              if (this.estimated_date) {
                throw new Error(
                  "Estimated date is not required if issues sales deed is Yes"
                );
              }
            }
          },
          isDate: {
            args: true,
            msg: "Estimated date should be in the date format",
          },
        },
      },
      total_completion_percentage: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return projectBuilding;
};
