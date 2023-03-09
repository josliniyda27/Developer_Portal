const db = require("../../model");
const {
  companies: Companies,
  usercompanies: usercompanies,
  userOtps: UserOtp,
  users: User,
} = db;
const { Op } = require("sequelize");
const otpGenerator = require("otp-generator");
const TokenGenerator = require("uuid-token-generator");
const bcrypt = require("bcrypt");

const {
  constants,
  dbTableConstatns,
  responseHelper,
} = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const axios = require("axios");
const { BroadcastConstants: Bconstants } = constants;

// Create and Save a new User
exports.userLogin = async (req, res) => {
  // user Registration
  if (!req.body.userCredential) {
    return res.status(constants.statusCode.forbidden).json({
      message: constants.messages.credRequired,
      status: constants.statusCode.forbidden,
    });
  }
  if (!req.body.password) {
    return res.status(constants.statusCode.forbidden).json({
      message: constants.messages.passwordRequired,
      status: constants.statusCode.forbidden,
    });
  }

  // Find user from the database
  await User.findOne({
    where: {
      [Op.or]: [
        { email: req.body.userCredential },
        { mobile: req.body.userCredential.toString() },
      ],
    },
  })
    .then(async (userData) => {
      if (userData) {
        await usercompanies
          .findOne({
            include: [
              {
                model: Companies,
                attributes: ["id", "name"],
              },
            ],
            where: {
              user_id: userData.id,
            },
          })
          .then(async (companyData) => {
            if (companyData) {
              bcrypt.compare(
                req.body.password,
                userData.password,
                async (err, result) => {
                  //Comparing the hashed password
                  if (err) {
                    res.status(constants.statusCode.serverError).json({
                      message: constants.messages.contactSupport,
                      status: constants.statusCode.serverError,
                    });
                  } else if (result !== true) {
                    responseHelper(
                      res,
                      constants.statusCode.notFound,
                      constants.messages.passwordError
                    );
                  } else if (result === true) {
                    if (userData.is_sms_verified !== true) {
                      let tokgenSms = new TokenGenerator(
                        128,
                        TokenGenerator.BASE62
                      );
                      let otpSms_token = tokgenSms.generate();

                      await User.update(
                        { otp_token: otpSms_token },
                        { where: { id: userData.id } }
                      ).then(async (data) => {
                        const smsPendingResp = {
                          [tbN.userOtpToken]: otpSms_token,
                          [tbN.userCompanyName]:
                            companyData.company.dataValues.name,
                          [tbN.userMobile]: userData.mobile,
                          [tbN.userEmail]: userData.email,
                          type: "smsOtp",
                        };

                        if (data) {
                          responseHelper(
                            res,
                            constants.statusCode.notFound,
                            constants.messages.smsvPending,
                            smsPendingResp
                          );
                        }
                      });
                    } else if (userData.is_email_verified !== true) {
                      let tokgenEmail = new TokenGenerator(
                        128,
                        TokenGenerator.BASE62
                      );
                      let otpEmail_token = tokgenEmail.generate();
                      const emailPendingResp = {
                        [tbN.userOtpToken]: otpEmail_token,
                        [tbN.userCompanyName]:
                          companyData.company.dataValues.name,
                        [tbN.userMobile]: userData.mobile,
                        [tbN.userEmail]: userData.email,
                        type: "emailOtp",
                      };

                      await User.update(
                        { otp_token: otpEmail_token },
                        { where: { id: userData.id } }
                      ).then(async (data) => {
                        responseHelper(
                          res,
                          constants.statusCode.notFound,
                          constants.messages.emailvPending,
                          emailPendingResp
                        );
                      });
                    } else {
                      let tokgen = new TokenGenerator(
                        128,
                        TokenGenerator.BASE62
                      );
                      let otp_token = tokgen.generate();

                      await User.update(
                        { otp_token: otp_token },
                        { where: { id: userData.id } }
                      )
                        .then(async (data) => {
                          if (data) {
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
                            const loginResp = {
                              userOtpToken: otp_token,
                              userEmail: userData.email,
                              userMobile: userData.mobile,
                            };
                            await UserOtp.create({
                              otp: otpValue,
                              type: "isLogin",
                              expiresAt: expiresAt,
                              user_id: userData.id,
                            })
                              .then(async (data) => {
                                responseHelper(
                                  res,
                                  constants.statusCode.successCode,
                                  constants.messages.loginOtp,
                                  loginResp,
                                  { otp: otpValue }
                                );

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
                                params.append(
                                  "templateid",
                                  Bconstants.loginTemplatedId
                                );
                                params.append("short", 1 / 0);
                                params.append("async", 1 / 0);

                                const config = {
                                  headers: {
                                    "Content-Type":
                                      "application/x-www-form-urlencoded",
                                  },
                                };

                                await axios
                                  .post(Bconstants.uRL, params, config)
                                  .then((result) => {
                                    //console.log(result);
                                    // resolve here
                                  })
                                  .catch((err) => {
                                    console.log(err);
                                    // Reject here
                                  });
                              })
                              .catch((err) => {
                                responseHelper(
                                  res,
                                  constants.statusCode.notFound,
                                  err.errors[0].message
                                );
                              });
                          }
                        })
                        .catch((err) => {
                          responseHelper(
                            res,
                            constants.statusCode.notFound,
                            err
                          );
                        });
                    }
                  }
                }
              );
            }
          });
      } else {
        
        responseHelper(
          res,
          constants.statusCode.notFound,
          constants.messages.invalidCred
        );
      }
    })
    .catch((err) => {
      responseHelper(res, constants.statusCode.notFound, err);
    });
};
