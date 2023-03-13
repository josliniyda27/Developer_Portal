const db = require("../../model");
const { userOtps: UserOtp, users: User, refreshToken: RefreshToken } = db;
const { constants, dbTableConstatns } = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const otpGenerator = require("otp-generator");
const axios = require("axios");
const { BroadcastConstants: Bconstants } = constants;
import commonLogs from "../../../common/logger.js";
const logger = commonLogs;

//const bcrypt = require("bcryptjs");

exports.resendOtp = async (req, res) => {
  let token = req.headers["otp-access-token"];
  if (token == null) {
    return res.status(constants.messages.otpTokeRequired).json({
      message: constants.messages.otpTokeRequired,
      status: constants.statusCode.forbidden,
    });
  }
  //find the user details by using otp token
  await User.findOne({ where: { otp_token: token } })
    .then(async (userData) => {
      if (userData) {
        const otpValue = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
          lowerCaseAlphabets: false,
        });
        const minutesToAdd = 3;
        const currentDate = new Date();
        const expiresAt = new Date(
          currentDate.getTime() + minutesToAdd * 60000
        );
        let user_id = userData.id;
        //find the ot pdetails by using otp and userid
        await UserOtp.destroy({ where: { user_id: user_id, type: "isLogin" } })
          .then(async (data) => {
            await UserOtp.create({
              otp: otpValue,
              expiresAt: expiresAt,
              user_id: user_id,
              type: "isLogin",
            })
              .then(async (data) => {
                let resendData = {
                  [tbN.userOtpToken]: token,
                };

                res.send({
                  message: constants.messages.resendOtp,
                  status: constants.statusCode.successCode,
                  data: resendData,
                  otp: otpValue,
                });

                ///Otpstart

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
                    logger.info(result.data);
                    // resolve here
                  })
                  .catch((err) => {
                    logger.error(err);
                    // Reject here
                  });

                ///Otp end

              })
              .catch((err) => {
                res.status(constants.statusCode.notFound).send({
                  message: err,
                  status: constants.statusCode.notFound,
                  data: resendData,
                });
              });
          })
          .catch((err) => {
            res.status(constants.statusCode.serverError).send({
              message: constants.messages.contactSupport,
              status: constants.statusCode.serverError,
              data: "",
            });
          });
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.userNotFound,
          status: constants.statusCode.notFound,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: constants.messages.contactSupport,
        status: constants.statusCode.serverError,
        data: "",
      });
    });
};
