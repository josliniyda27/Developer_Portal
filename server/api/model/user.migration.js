module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,

        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: {
            arg: true,
            msg: "Name is required",
          },
          validateStringOnly: function (value) {
            if (
              !/^[a-zA-Z ]*$/i.test(value)
            ) {
              throw new Error("Name can be only characters!");
            }
          },
          len: {
            args: [3, 100],
            msg: "Name should have minimum of three letters.",
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email address already in use!",
        },
        validate: {
          isEmail: {
            args: true,
            msg: "Email format is incorrect",
          },
          notNull: { msg: "Email is required" },
        },
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Mobile number already in use!",
        },
        validate: {
          validatePhone: function (value) {
            console.log(value, "=============================value");
            if (
              !/^[6-9]\d{9}$/i.test(value)
            ) {
              throw new Error("Invalid Mobile Number");
            }
          },
          len: {
            args: [10, 10],
            msg: "Mobile number should be of 10 digits. Please enter the mobile number correctly",
          },
          notNull: { msg: "Mobile is required" },
        },
      },
      status: {
        type: Sequelize.STRING,
        //values:pending,active,inactive
      },
      otp_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_profile_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_sms_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      last_logged_in_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      profile_pic_url : {
        type: Sequelize.STRING,
        allowNull: true,
      },
      source : {
        type: Sequelize.STRING,
        allowNull: true,
        //values : portal, SF
      },
      profile_pic_name : {
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

  return User;
};
