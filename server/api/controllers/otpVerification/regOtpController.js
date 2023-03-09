const commonLogs = require("../../../common/logger.js");
const db = require("../../model");
const { userOtps: UserOtp, users: User, refreshToken: RefreshToken } = db;
const {
  constants,
  dataTime,
  responseHelper,
  dbTableConstatns,
} = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const auth = require("../../middlewares/auth");
const moment = require("moment");
const otpGenerator = require("otp-generator");
const TokenGenerator = require("uuid-token-generator");

const axios = require("axios");
const { BroadcastConstants: Bconstants } = constants;
const logger = commonLogs;

exports.regOtpVerification = async (req, res) => {
  let token = req.headers["otp-access-token"];
  let regOtp = req.body.otp;
  let userDetails = {};

  if (token == null) {
    responseHelper(
      res,
      constants.statusCode.notFound,
      constants.messages.otpAccessRequired
    );
  }
  if (!regOtp) {
    responseHelper(
      res,
      constants.statusCode.notFound,
      constants.messages.otpRequired
    );
  }

  let respns = {
    [tbN.userOtpToken]: token,
  };
  //find the user details by using otp token
  await User.findOne({ where: { otp_token: token } })
    .then(async (userData) => {
      if (userData) {
        let user_id = userData.id;

        if (!userData.is_sms_verified && req.body.type === "emailOtp") {
          return responseHelper(
            res,
            constants.statusCode.notFound,
            constants.messages.smsVerification,
            respns
          );
        }

        if (userData.is_sms_verified) {
          if (req.body.type === "smsOtp") {
            return responseHelper(
              res,
              constants.statusCode.notFound,
              constants.messages.smsVerificationC,
              respns
            );
          }
        }

        if (constants.otpType.includes(req.body.type) === false) {
          return responseHelper(
            res,
            constants.statusCode.notFound,
            constants.messages.invalidType,
            respns
          );
        }
        //find the ot pdetails by using otp and userid

        await UserOtp.findAll({
          where: {
            otp: regOtp,
            user_id: user_id,
            type: req.body.type,
          },
        })
          .then(async (data) => {
            if (data.length !== 0) {
              if (data[0].dataValues && data[0].dataValues.otp === regOtp) {
                let otpExpire = moment(data[0].dataValues.expiresAt).format(
                  "YYYY-MM-DD HH:mm:ss"
                );

                let currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");

                if (otpExpire < currentDateTime) {
                  responseHelper(
                    res,
                    constants.statusCode.notFound,
                    constants.messages.otpExpired,
                    respns
                  );
                  return;
                }

                //update profile completed status in usertable
                if (req.body.type === "smsOtp") {
                  const tokgen2 = new TokenGenerator(
                    128,
                    TokenGenerator.BASE62
                  );

                  let TokenGen = tokgen2.generate();

                  await User.update(
                    { otp_token: TokenGen, is_sms_verified: true },
                    { where: { id: user_id } }
                  )
                    .then(async (data) => {
                      const otpValue = otpGenerator.generate(6, {
                        upperCaseAlphabets: false,
                        specialChars: false,
                        lowerCaseAlphabets: false,
                      });
                      let expiresAtEmail = null;
                      try {
                        expiresAtEmail = await dataTime();
                      } catch (error) {}

                      const userOtpDetails = {
                        otp: otpValue,
                        user_id: user_id,
                        type: "emailOtp",
                        expiresAt: expiresAtEmail,
                      };
                      const smsOtpresp = {
                        [tbN.userOtpToken]: TokenGen,
                      };

                      await UserOtp.create(userOtpDetails)
                        .then(async (otpData) => {
                          const config = {
                            headers: {
                              "Content-Type": "application/json",
                              api_key: Bconstants.emailApiKey,
                            },
                          };

                          const bodyData = JSON.stringify({
                            from: {
                              email: Bconstants.fromEmail,
                              name: Bconstants.emailFromName,
                            },

                            subject:
                              "Your account verification to HDFC Developer Portal",
                            content: [
                              {
                                type: Bconstants.emailType,
                                value:
                                  +otpValue +
                                  " is the OTP for your account verification to HDFC Developer Portal. This OTP is valid for 3 Minutes -HDFC LTD.  ",
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
                            .post(Bconstants.emailUrl, bodyData, config)
                            .then((result) => {
                              logger.info(result.data);
                              // Do somthing
                            })
                            .catch((err) => {
                              logger.error(err);
                              // Do somthing
                            });

                          return responseHelper(
                            res,
                            constants.statusCode.successCode,
                            constants.messages.regSmsOtpVerification,
                            smsOtpresp,
                            { emailOtp: otpValue }
                          );
                        })
                        .catch((err) => {
                          responseHelper(
                            res,
                            constants.statusCode.notFound,
                            err.errors[0].message ||
                              constants.messages.regOtpVerificationErr,
                            respns
                          );
                        });
                    })
                    .catch((err) => {
                      responseHelper(
                        res,
                        constants.statusCode.notFound,
                        err.errors[0].message ||
                          constants.messages.regOtpVerificationErr,
                        respns
                      );
                    });
                } else if (req.body.type === "emailOtp") {
                  await User.update(
                    {
                      otp_token: null,
                      is_email_verified: true,
                      status: "Active",
                    },
                    { where: { id: user_id } }
                  )
                    .then(async (data) => {
                      try {
                        let token = auth.generateToken(userData.id);
                        let refreshToken = await RefreshToken.createToken({
                          id: userData.id,
                        });

                        userDetails = {
                          [tbN.userId]: userData.id,
                          [tbN.userName]: userData.username,
                          [tbN.userEmail]: userData.email,
                          [tbN.userMobile]: userData.mobile,
                          [tbN.profileStatus]: userData.status,
                          [tbN.profileCompleted]: userData.is_profile_completed,
                          [tbN.userCreatedat]: moment(data.createdAt).format(
                            "YYYY-MM-DD HH:mm:ss"
                          ),
                          [tbN.userUpdatedat]: moment(data.updatedAt).format(
                            "YYYY-MM-DD HH:mm:ss"
                          ),
                          [tbN.userDesignationId]: userData.designation_id,
                          [tbN.userRoleId]: userData.designation_id,
                          [tbN.accessToken]: token,
                          [tbN.refreshToken]: refreshToken,
                        };
                      } catch (e) {}

                      return responseHelper(
                        res,
                        constants.statusCode.successCode,
                        constants.messages.regOtpVerification,
                        userDetails
                      );
                    })
                    .catch((err) => {
                      return responseHelper(
                        res,
                        constants.statusCode.notFound,
                        err.errors[0].message ||
                          constants.messages.regOtpVerificationErr,
                        respns
                      );
                    });
                }
              } else {
                return responseHelper(
                  res,
                  constants.statusCode.notFound,
                  req.body.type === "emailOtp" ? constants.messages.otpInvalidEmail : constants.messages.otpInvalidMobile,
                  respns
                );
              }
            } else {
              return responseHelper(
                res,
                constants.statusCode.notFound,
                req.body.type === "emailOtp" ? constants.messages.otpInvalidEmail : constants.messages.otpInvalidMobile,
                respns
              );
            }
          })
          .catch((err) => {
            responseHelper(
              res,
              constants.statusCode.notFound,
              err.errors[0].message || constants.statusCode.userCreatedError,
              respns
            );
          });
      } else {
        return res.status(constants.statusCode.notFound).send({
          message: constants.messages.userNotFound,
          status: constants.statusCode.notFound,
          data: respns,
        });
      }
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.contactSupport,
        status: constants.statusCode.serverError,
      });
    });
};
