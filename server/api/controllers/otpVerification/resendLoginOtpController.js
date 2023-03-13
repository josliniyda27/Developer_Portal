const db = require("../../model");
const { userOtps: UserOtp, users: User } = db;
const { constants, dbTableConstatns } = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const otpGenerator = require("otp-generator");

const axios = require("axios");
const { BroadcastConstants: Bconstants } = constants;
//const commonLogs = require("../../../common/logger.js");
//const logger = commonLogs;

//const bcrypt = require("bcryptjs");

exports.resendOtp = async (req, res) => {
  let token = req.headers["otp-access-token"];
  if (token == null) {
    return res.status(constants.messages.otpTokeRequired).json({
      message: constants.messages.otpTokeRequired,
      status: constants.statusCode.forbidden,
    });
  }
  let findUserDetails = {};
  await User.findOne({ where: { otp_token: token } })
    .then(async (userData) => {
      findUserDetails = userData;

      if (userData) {
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.userNotFound,
          status: constants.statusCode.notFound,
          data: "",
        });
      }
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.contactSupport,
        status: constants.statusCode.serverError,
        data: "",
      });
    });

  let deleteQueryOk = false;
  if (findUserDetails.dataValues.id) {
    let user_id = findUserDetails.dataValues.id;
    await UserOtp.destroy({ where: { user_id: user_id, type: "isLogin" } })
      .then(async (data) => {
        deleteQueryOk = true;
      })
      .catch((err) => {
        res.status(constants.statusCode.serverError).send({
          message: constants.messages.contactSupport,
          status: constants.statusCode.serverError,
          data: "",
        });
      });
  } else {
    res.status(constants.statusCode.serverError).send({
      message: constants.messages.contactSupport,
      status: constants.statusCode.serverError,
      data: "",
    });
  }

  if (deleteQueryOk) {
    let user_id = findUserDetails.dataValues.id;
    const otpValue = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    const minutesToAdd = 3;
    const currentDate = new Date();
    const expiresAt = new Date(currentDate.getTime() + minutesToAdd * 60000);

    await UserOtp.create({
      otp: otpValue,
      expiresAt: expiresAt,
      user_id: user_id,
      type: "isLogin",
    })
      .then(async (data) => {
        const resednData = {
          [tbN.userOtpToken]: token,
        };

        const params = new URLSearchParams();
        params.append("feedid", Bconstants.feedid);
        params.append("username", Bconstants.userName);
        params.append("password", Bconstants.password);
        params.append("To", userData.mobile);
        params.append(
          "Text",
          otpValue +
            " is the OTP to login to HDFC Developer Portal. This OTP is valid for 3 Minutes -HDFC LTD."
        );
        params.append("templateid", Bconstants.loginTemplatedId);
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
            // resolve here
          })
          .catch((err) => {
            console.log(err);
            // Reject here
          });

        res.send({
          message: constants.messages.resendOtp,
          status: constants.statusCode.successCode,
          data: resednData,
          otp: otpValue,
        });
      })
      .catch((err) => {
        res.status(constants.statusCode.notFound).send({
          message: err,
          status: constants.statusCode.notFound,
          data: "",
        });
      });
  } else {
    res.status(constants.statusCode.serverError).send({
      message: constants.messages.contactSupport,
      status: constants.statusCode.serverError,
      data: "",
    });
  }
};
