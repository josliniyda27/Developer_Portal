module.exports = (sequelize, Sequelize) => {
  const builderAccount = sequelize.define(
    "builder_accounts",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      payee_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Payee Name cannot be empty'
          },
          notNull: {
            msg: 'Please provide a Payee Name'
          }
        }
      },
      account_number: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Account number cannot be empty'
          },
          notNull: {
            msg: 'Please provide a Account Number'
          }
        }
      }, 
      account_type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Account type cannot be empty'
          },
          notNull: {
            msg: 'Please provide a Account Type'
          }
        }
      },
      bank: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Bank cannot be empty'
          },
          notNull: {
            msg: 'Please provide a Bank'
          }
        }
      },
      ifsc_code: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Ifsc code cannot be empty'
          },
          notNull: {
            msg: 'Please provide a Ifsc code'
          }
        }
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'File name cannot be empty'
          },
          notNull: {
            msg: 'Please provide a File name'
          }
        }
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'File url cannot be empty'
          },
          notNull: {
            msg: 'Please provide a File url'
          }
        }
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { timestamps: true },
    { paranoid: true }
  );

  return builderAccount;
};
