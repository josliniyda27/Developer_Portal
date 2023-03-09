module.exports = (sequelize, Sequelize) => {
  const Project = sequelize.define(
    "projects",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reference_no: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rera_applicable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        validate: {
          notNull: { msg: "Rera applicable is required" },
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          validateName: function (value) {
            if (!/^[A-Za-z0-9.@&() ]+$/i.test(value)) {
              throw new Error("Name should have only alphabets and numbers.");
            }
          },
        },
      },
      total_towers: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_units: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      units_for_sales: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sold_units: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      avg_rate_per_square_feet: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_unsold_inventory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_value_of_unsold_inventory: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_number_of_loans: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_loan_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      total_number_of_floors: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact_person_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact_person_designation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      contact_person_mobile: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          validatePhone: function (value) {
            if(value){
            if (!/^[6-9]\d{9}$/i.test(value)) {
              throw new Error("Invalid Mobile Number");
            }
          }},
          len: {
            args: [10, 10],
            msg: "Mobile number should be of 10 digits. Please enter the mobile number correctly",
          },

        },
      },
      contact_person_email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Email format is incorrect",
          },
        },
      },
      cover_image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cover_image_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      project_mortaged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      mortaged_institution: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cf_loan_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: {
          args: true,
          msg: "This CF loan number is already linked to a project. Please enter another Valid Number!",
        },
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        isIn: {
          args: [["DRAFT", "PENDING", "APPROVED", "REJECTED"]],
          msg: "Building Type must be one of: DRAFT, PENDING,APPROVED,REJECTED",
        },
        // value = DRAFT, PENDING, APPROVED,REJECTED
      },
      completed_step: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      submitted_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true,
        //values = PORTAL,SALESFORCE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      is_send_to_sf: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      project_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sf_unique_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unsold_units: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return Project;
};
