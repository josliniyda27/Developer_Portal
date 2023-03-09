module.exports = (sequelize, Sequelize) => {
  const projectPurchaser = sequelize.define(
    "project_purchasers",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          validateName: function (value) {
            if (!/^[A-Za-z0-9.@&() ]+$/i.test(value)) {
              throw new Error(
                "Company name should have only alphabets and numbers."
              );
            }
          },
          notNull: {
            msg: "Name cannot be null",
          },
          notEmpty: {
            msg: "Name cannot be empty",
          },
        },
      },
      file_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      mobile_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      co_purchaser_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      co_purchaser_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      co_pruchaser_mobile_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lead_shared_with_hdfc: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      noc_status: {
        type: Sequelize.STRING,
        allowNull: true,
        //pending, issued, cancelled)
      },
      loan_status: {
        type: Sequelize.STRING,
        allowNull: true,
        //values:under process, sanctioned, partially disbursed, fully disbursed
      },
      disbursement_request_status: {
        type: Sequelize.STRING,
        allowNull: true,
        //values:onfirmed, denied
      },
      institution: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      issued_on: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      unit_type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Building type cannot be null",
          },
          isIn: {
            args: [["tower", "bungalow"]],
            msg: "Building type must be one of: tower, bungalow",
          },
        },

      },
      unit_type_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      unit_number: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isUnique: function (value, next) {
            if (value) {
              projectPurchaser
                .findOne({
                  where: {
                    unit_number: value.toString(),
                  },
                })
                .then(function (result) {
                  if (result === null) {
                    return next();
                  } else {
                    return next("unit number already use");
                  }
                })
                .catch((err) => {
                  return next();
                });
            } else {
              return next();
            }
          },
        },
      },
      booking_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      carpet_area: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      rate_per_sqfeet: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      agreement_value: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sanctioned_loan_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      balance_recievable: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      noc_file: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requested_date: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requested_amount: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_disbursed_date: {
        type: Sequelize.DATE,
        allowNull: true,
        isDate: {
          args: true,
          msg: "Last disbursed date in the date format",
        },
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return projectPurchaser;
};
