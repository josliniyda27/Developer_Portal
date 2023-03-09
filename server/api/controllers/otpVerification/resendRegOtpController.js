const db = require("../../model");
const { userOtps: UserOtp, users: User, refreshToken: RefreshToken } = db;
const { constants, dbTableConstatns } = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const otpGenerator = require("otp-generator");
import commonLogs from "../../../common/logger.js";
const logger = commonLogs;
const { BroadcastConstants: Bconstants } = constants;

const axios = require("axios");

//const bcrypt = require("bcryptjs");

exports.resendOtp = async (req, res) => {
  let token = req.headers["otp-access-token"];

  if (token == null) {
    return res.status(constants.statusCode.forbidden).json({
      message: constants.messages.otpTokeRequired,
      status: constants.statusCode.forbidden,
    });
  }
  if (!req.body.type) {
    return res.status(constants.statusCode.forbidden).json({
      message: constants.messages.typeRequired,
      status: constants.statusCode.forbidden,
    });
  }
  if (constants.otpType.includes(req.body.type) === false) {
    return res.status(constants.statusCode.forbidden).json({
      message: constants.statusCode.otpInvalide,
      status: constants.statusCode.forbidden,
    });
  }
  //find the user details by using otp token
  let returnData = {
    [tbN.userOtpToken]: token,
  };
  await User.findOne({ where: { otp_token: token } })
    .then(async (userData) => {
      if (userData.dataValues.id) {
        if (
          !userData.dataValues.is_sms_verified &&
          req.body.type === "emailOtp"
        ) {
          return res.status(constants.statusCode.notFound).json({
            message: constants.messages.smsvPending,
            status: constants.statusCode.notFound,
            data: returnData,
          });
        }

        if (req.body.type !== "smsOtp" && req.body.type !== "emailOtp") {
          return res.status(403).json({
            message: constants.messages.otpInvalid,
            status: constants.statusCode.notFound,
            data: returnData,
          });
        } else if (req.body.type === "smsOtp") {
          if (userData.dataValues.is_sms_verified !== true) {
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
            const userOtpDetails = {
              otp: otpValue,
              user_id: userData.id,
              type: "smsOtp",
              expiresAt: expiresAt,
            };
            const smsOtpresp = {
              type: "smsOtp",
              [tbN.userOtpToken]: token,
            };

            await UserOtp.destroy({
              where: { user_id: userOtpDetails.user_id, type: "smsOtp" },
            })
              .then(async (data) => {
                await UserOtp.create(userOtpDetails)
                  .then(async (data) => {
                    res.send({
                      message: constants.messages.resendSmsOtp,
                      status: constants.statusCode.successCode,
                      data: smsOtpresp,
                      otp: otpValue,
                    });

                    ///Otp start

                    const params = new URLSearchParams();
                    params.append("feedid", 389288);
                    params.append("username", "8086705707");
                    params.append("password", "December@2022");
                    params.append("To", userData.mobile);
                    params.append(
                      "Text",
                      otpValue +
                        " is the OTP for your account verification to HDFC Developer Portal. This OTP is valid for 3 Minutes -HDFC LTD."
                    );
                    params.append("templateid", "1107167332495788016");
                    params.append("short", 1 / 0);
                    params.append("async", 1 / 0);

                    const config = {
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                      },
                    };

                    await axios
                      .post(
                        "https://test1bulksms.mytoday.com/BulkSms/SingleMsgApi",
                        params,
                        config
                      )
                      .then((result) => {
                        logger.info(result.data);
                        // Do somthing
                      })
                      .catch((err) => {
                       logger.error(err);
                        // Do somthing
                      });

                    ///Otp end
                  })
                  .catch((err) => {
                    res.status(constants.statusCode.notFound).send({
                      message:
                        err.errors[0].message ||
                        constants.statusCode.regOtpResendErr,
                    });
                  });
              })
              .catch((err) => {
                res.status(500).send({
                  message: err,
                  status: 500,
                  data: "",
                });
              });
          } else {
            return res.status(constants.statusCode.notFound).json({
              message: constants.messages.smsvCompleted,
              status: constants.statusCode.notFound,
            });
          }
        } else if (req.body.type === "emailOtp") {
          const otpValueEmail = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            specialChars: false,
            lowerCaseAlphabets: false,
          });

          const minutesToAdd1 = 3;
          const currentDate1 = new Date();
          const expiresAtEmail = new Date(
            currentDate1.getTime() + minutesToAdd1 * 60000
          );

          let user_id = userData.id;
          //find the ot pdetails by using otp and userid
          const userOtpDetails = {
            otp: otpValueEmail,
            user_id: userData.id,
            type: "emailOtp",
            expiresAt: expiresAtEmail,
          };
          const userOtpresp = {
            type: "emailOtp",
            [tbN.userOtpToken]: req.headers["otp-access-token"],
          };
          await UserOtp.destroy({
            where: { user_id: userOtpDetails.user_id, type: "emailOtp" },
          })
            .then(async (data) => {
              await UserOtp.create(userOtpDetails)
                .then(async (data) => {
                  res.send({
                    message: constants.messages.resendOtp,
                    status: constants.statusCode.successCode,
                    data: userOtpresp,
                    otp: otpValueEmail,
                  });

                  
                  const emailConfig = {
                    headers: {
                      "Content-Type": "application/json",
                      api_key: Bconstants.emailApiKey,
                    },
                  };

                  const bodyData = JSON.stringify({
                    from: {
                      email: Bconstants.fromEmail,
                      name: Bconstants.fromName,
                    },

                    subject:
                      "Your account verification to HDFC Developer Portal",
                    content: [
                      {
                        type: Bconstants.emailType,
                        value:
                          +otpValueEmail +
                          " is the OTP for your account verification to HDFC Developer Portal. This OTP is valid for 3 Minutes -HDFC LTD.    ",
                      },
                    ],
                    personalizations: [
                      {
                        to: [
                          {
                            email: userData.email,
                            name: userData.username,
                          },
                        ],
                      },
                    ],
                  });
                  
                  await axios
                    .post(
                      Bconstants.emailUrl,
                      bodyData,
                      emailConfig
                    )
                    .then((result) => {
                      logger.info(result.data);
                      // Do somthing
                    })
                    .catch((err) => {
                      logger.error(err);
                      // Do somthing
                    });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(constants.statusCode.notFound).send({
                    message: err,
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.status(constants.statusCode.serverError).send({
                message: constants.messages.contactSupport,
                status: constants.statusCode.serverError,
                data: "",
              });
            });
        }
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.userNotFound,
          status: constants.statusCode.notFound,
        });
      }
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.userNotFound || err,
        status: constants.statusCode.notFound,
      });
    });
};
