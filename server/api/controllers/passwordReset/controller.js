const db = require("../../model");
const { resetPassword: ResetPassword, sequelize: Sequelize, users: User } = db;
const TokenGenerator = require("uuid-token-generator");
const bcrypt = require("bcrypt");
const moment = require("moment");
const { constants, dbTableConstatns } = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const axios = require("axios");
//const commonLogs = require("../../../common/logger.js");
const { BroadcastConstants: Bconstants } = constants;

exports.forgotPassword = async (req, res) => {
  const tokgen2 = new TokenGenerator(128, TokenGenerator.BASE62);
  const emailConfig = {
    headers: {
      "Content-Type": "application/json",
      api_key: Bconstants.emailApiKey,
    },
  };

  if (!req.body.userEmail) {
    return res.status(403).json({
      message: "User email  is required",
      status: constants.statusCode.notFound,
    });
  }

  let token = tokgen2.generate();
  let passwordToken;

  //find the user details by using email
  await User.findOne({
    where: { email: req.body.userEmail },
  })
    .then(async (userData) => {
      if (userData) {
        const minutesToAdd = 5;
        const currentDate = new Date();
        const expiresAt = new Date(
          currentDate.getTime() + minutesToAdd * 60000
        );

        const forgotPasswordTokenDetails = {
          user_id: userData.id,
          token: token,
          expiresAt: expiresAt,
        };

        await ResetPassword.create(forgotPasswordTokenDetails)
          .then((data) => {
            passwordToken = data;
          })
          .catch((err) => {
        if (err.errors) {
              res.status(constants.statusCode.notFound).send({
                message: err.errors[0].message,
                data: err.errors[0].value,
                status: constants.statusCode.notFound,
              });
            } else {
              res.status(constants.statusCode.notFound).send({
                message: err.name.replace("Sequelize", ""),
                data: err.parent.detail,
                status: constants.statusCode.notFound,
              });
            }
          });

        const bodyData = JSON.stringify({
          from: {
            email: Bconstants.fromEmail,
            name:  Bconstants.fromName,
          },
          subject: "Reset password",
          content: [
            {
              type: Bconstants.emailType,
              value:
                "Please reset your HDFC developers portal account by using below link   [%LINK%] ",
            },
          ],
          personalizations: [
            {
              attributes: {
                LINK: Bconstants.resetPasswordUrl+passwordToken.token,
              },
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
            //logger.info(result.data);
            // Do somthing
          })
          .catch((err) => {
            //logger.error(err);
            // Do somthing
          });

        res.send({
          message: constants.messages.userPasswordKLinkSuccess,
          status: constants.statusCode.successCode,
          data: userData.email,
          token: passwordToken.token,
        });
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.invalidEmail,
          status: constants.statusCode.notFound,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

exports.resetPassword = async (req, res) => {
  if (!req.body.token) {
    return res.status(403).json({
      message: "Forgot password token is required",
      status: constants.statusCode.notFound,
    });
  }

  if (!req.body.password) {
    return res.status(403).json({
      message: "New password is required",
      status: constants.statusCode.notFound,
    });
  }

  //find the user details by token
  await ResetPassword.findOne({
    where: { token: req.body.token },
    include: [User],
  })
    .then(async (tokenData) => {
      if (tokenData) {
        let userData = tokenData.user;
        let tokenExpire = moment(tokenData.expiresAt).format(
          "YYYY-MM-DD HH:mm:ss"
        );

        let currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");

        if (tokenExpire < currentDateTime) {
          res.status(403).json({
            status: constants.statusCode.forbidden,
            message: "Password reset token was expired",
          });
          return;
        }

        const saltRounds = 10;
        let hashPassword = "";
        await bcrypt
          .hash(req.body.password, saltRounds)
          .then((hash) => {
            hashPassword = hash;
          })
          .catch((err) => console.error(err.message));

        await userData
          .update({ password: hashPassword })
          .then((data) => {
            tokenData.destroy();
          })
          .catch((err) => {
            if (err.errors) {
              res.status(constants.statusCode.notFound).send({
                message: err.errors[0].message,
                data: err.errors[0].value,
                status: constants.statusCode.notFound,
              });
            } else {
              res.status(constants.statusCode.notFound).send({
                message: err.name.replace("Sequelize", ""),
                data: err.parent.detail,
                status: constants.statusCode.notFound,
              });
            }
          });

        const userDetails = await {
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

        res.send({
          message: constants.messages.userPasswordResetSuccess,
          status: constants.statusCode.successCode,
          data: userDetails,
        });
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.invalidPasswordToken,
          status: constants.statusCode.notFound,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};
