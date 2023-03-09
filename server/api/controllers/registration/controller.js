"use strict";
const db = require("../../model");
const passwordValidator = require("password-validator");
const passwordSchema = new passwordValidator();
const axios = require("axios");
const {
  usercompanies: usercompanies,
  sequelize: Sequelize,
  companies: Companies,
  userOtps: UserOtp,
  users: User,
} = db;

const TokenGenerator = require("uuid-token-generator");
const otpGenerator = require("otp-generator");
const moment = require("moment");
const bcrypt = require("bcrypt");
const {
  constants,
  dbTableConstatns,
  responseHelper,
  dataTime,
  sequelizeError,
} = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const { BroadcastConstants: Bconstants } = constants;

passwordSchema
  .is()
  .min(8) // Minimum length 8
  .is()
  .max(16) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(1) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .is()
  .symbols(); // Blacklist these values

// Create and Save a new User
exports.userRegistration = async (req, res) => {
  // user Registration
  const tokgen2 = new TokenGenerator(128, TokenGenerator.BASE62);

  let hashPassword = "";

  if (!passwordSchema.validate(req.body.password)) {
    let passworErr = passwordSchema.validate(req.body.password, {
      details: true,
    });

    let messageString = "";

    passworErr.map(function (err) {
      //console.log("err=======>", err.message);

      messageString += ",".concat(...err.message);
    });

    return responseHelper(res, constants.statusCode.notFound, messageString);
  }
  await bcrypt
    .hash(req.body.password, constants.tokenConstans.saltRounds)
    .then((hash) => {
      hashPassword = hash;
    })
    .catch((err) => console.error(err.message));

  let otpAccessToken = tokgen2.generate();

  const userDetails = {
    username: req.body.userName,
    email: req.body.userEmail,
    mobile: req.body.userMobile,
    otp_token: otpAccessToken,
    status: "pending",
    password: hashPassword,
    designation_id: req.body.designationId,
    role_id: 1,
    source: constants.dbConst.userSourcePortal,
  };

  // Save company in the database
  const companyDetails = {
    name: req.body.companyName.toLowerCase(),
  };

  const otpValue = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  let transaction;

  try {
    transaction = await Sequelize.transaction();
    let companyData = {};
    let userData = {};

    await Companies.create(companyDetails, { transaction }).then((data) => {
      companyData = data.dataValues;
    });

    await User.create(userDetails, { transaction }).then((data) => {
      userData = data.dataValues;
    });

    const userCompanyInsertDetails = {
      user_id: userData.id,
      company_id: companyData.id,
    };

    await usercompanies
      .create(userCompanyInsertDetails, {
        transaction,
      })
      .then((data) => {});

    const expiredAt = await dataTime();
    const userOtpDetails = {
      otp: otpValue,
      user_id: userData.id,
      type: "smsOtp",
      expiresAt: expiredAt,
    };
    await UserOtp.create(userOtpDetails, { transaction }).then((otpData) => {});

    await transaction.commit();

    const userResendDetails = await {
      [tbN.userOtpToken]: userData.otp_token,
      [tbN.userId]: userData.id,
      [tbN.userName]: userData.username,
      [tbN.userEmail]: userData.email,
      [tbN.userMobile]: userData.mobile,
      [tbN.profileStatus]: userData.status,
      [tbN.profileCompleted]: userData.is_profile_completed,
      [tbN.userCreatedat]: moment(userData.createdAt).format("YYYY-MM-DD"),
      [tbN.userUpdatedat]: moment(userData.updatedAt).format("YYYY-MM-DD"),
      [tbN.userDesignationId]: userData.designation_id,
      [tbN.userRoleId]: userData.designation_id,
    };

    responseHelper(
      res,
      constants.statusCode.successCode,
      constants.messages.userCreatedSuccess,
      userResendDetails,
      { otp: otpValue }
    );
    ///Otpstarted
    const params = new URLSearchParams();
    params.append("feedid", Bconstants.feedid);
    params.append("username", Bconstants.userName);
    params.append("password", Bconstants.password);
    params.append("To", userDetails.mobile);
    params.append(
      "Text",
      otpValue +
        " is the OTP for your account verification to HDFC Developer Portal. This OTP is valid for 3 Minutes -HDFC LTD."
    );
    params.append("templateid", Bconstants.regTemplateId);
    params.append("short", 1 / 0);
    params.append("async", 1 / 0);

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    await axios
      .post(Bconstants.uRL, params, config)
      .then((result) => {
        console.log(result);
        // Do somthing
      })
      .catch((err) => {
        console.log(err);
        // Do somthing
      });

    //end
  } catch (error) {
    console.log("error====>", error);
    const catchErrmsg1 = await sequelizeError(error);
    await transaction.rollback();
    responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
  }
};
