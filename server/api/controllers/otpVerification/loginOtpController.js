const db = require("../../model");
const {
  userOtps: UserOtp,
  users: User,
  refreshToken: RefreshToken,
  sequelize: Sequelize,
  roles: Roles,
  permissions: Permissions,
} = db;
const {
  constants,
  dbTableConstatns,
  responseHelper,
} = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const auth = require("../../middlewares/auth");
const moment = require("moment");


exports.loginOtpVerification = async (req, res) => {
  let token = req.headers["otp-access-token"];
  let loginOtp = req.body.otp;

  if (token == null) {
    return responseHelper(
      res,
      constants.statusCode.forbidden,
      constants.messages.otpTokeRequired
    );
  }
  let returnData = {
    [tbN.userOtpToken]: token,
  };
  if (!loginOtp) {
    return responseHelper(
      res,
      constants.statusCode.forbidden,
      constants.messages.otpTokeRequired,
      returnData
    );
  }

  //find the user details by using otp token
  await User.findOne({
    where: { otp_token: token },
    //include:[Role]
  })
    .then(async (userData) => {
      let company_id = "";
      let company_name = "";

      if (userData) {
        if (userData.is_profile_completed === false) {
          await Sequelize.query(
            "Select * from users  left join user_companies on user_companies.user_id=users.id left join companies on companies.id=user_companies.company_id where users.id=" +
              userData.id
          ).then(async (data) => {
            company_id = data[0][0].company_id;
            company_name = data[0][0].name;
          });
        }
        let user_id = userData.dataValues.id;
        //find the ot pdetails by using otp and userid

        if (userData.dataValues.is_sms_verified !== true) {
          return responseHelper(
            res,
            constants.statusCode.forbidden,
            constants.messages.smsvPending,
            returnData
          );
        }

        if (userData.dataValues.is_email_verified !== true) {
          return responseHelper(
            res,
            constants.statusCode.forbidden,
            constants.messages.emailvPending,
            returnData
          );
        }

        await UserOtp.findAll({
          where: {
            otp: loginOtp,
            user_id: userData.dataValues.id,
            type: "isLogin",
          },
        })
          .then(async (data) => {
            if (data[0].dataValues && data[0].dataValues.otp === loginOtp) {
              let otpExpire = moment(data[0].dataValues.expiresAt).format(
                "YYYY-MM-DD HH:mm:ss"
              );
              
              let currentDateTime = moment().format("YYYY-MM-DD HH:mm:ss");
              if (otpExpire < currentDateTime) {
                return responseHelper(
                  res,
                  constants.statusCode.forbidden,
                  constants.messages.otpExpired,
                  returnData
                );
              }

              //update profile completed status in usertable
              await User.update({ otp_token: null }, { where: { id: user_id } })
                .then(async (data) => {
                  await User.findAll({
                    where: { id: user_id },
                    plain: true,

                    include: {
                      model: Roles,
                      attributes: ["name", "description"],
                      include: {
                        attributes: ["name", "description"],
                        model: Permissions,
                      },
                    },
                  })
                    .then(async (data) => {
                      try {
                        let token = auth.generateToken(userData.id);
                        let refreshToken = await RefreshToken.createToken({
                          id: userData.id,
                        });

                        let roleData = data.role.dataValues;
                        let permissionsData =
                          data.role.dataValues.permissions.dataValues;
                        //delete roleData.permissions;

                        const userDetails = {
                          [tbN.userOtpToken]: data.otp_token,
                          [tbN.userId]: data.id,
                          [tbN.userName]: data.username,
                          [tbN.userEmail]: data.email,
                          [tbN.userMobile]: data.mobile,
                          [tbN.profileStatus]: data.status,
                          [tbN.profileCompleted]: data.is_profile_completed,
                          [tbN.userCreatedat]: moment(data.createdAt).format(
                            "YYYY-MM-DD"
                          ),
                          [tbN.userUpdatedat]: moment(data.updatedAt).format(
                            "YYYY-MM-DD"
                          ),
                          [tbN.userDesignationId]: data.designation_id,
                          [tbN.userRoleId]: data.designation_id,
                          [tbN.accessToken]: token,
                          [tbN.refreshToken]: refreshToken,
                          role: roleData,
                         // permissionsData: permissionsData,
                        };
                        if (userData.is_profile_completed === false) {
                          userDetails.company_id = company_id;
                          userDetails.company_name = company_name;
                        }
                        return responseHelper(
                          res,
                          constants.statusCode.successCode,
                          constants.messages.loginOtpVerification,
                          userDetails
                        );
                      } catch (e) {}
                    })
                    .catch((err) => {
                      console.log("errr=====>", err);
                      return responseHelper(
                        res,
                        constants.statusCode.forbidden,
                        constants.messages.regOtpVerificationErr
                      );
                    });
                })
                .catch((err) => {
                  return responseHelper(
                    res,
                    constants.statusCode.forbidden,
                    constants.messages.regOtpVerificationErr
                  );
                });
            } else {
              return responseHelper(
                res,
                constants.statusCode.forbidden,
                constants.messages.regOtpVerificationErr,
                returnData
              );
            }
          })
          .catch((err) => {
            return responseHelper(
              res,
              constants.statusCode.forbidden,
              constants.messages.otpInvalidMobile,
              returnData
            );
          });
      } else {
        return responseHelper(
          res,
          constants.statusCode.notFound,
          constants.messages.userNotFound +
            "/" +
            constants.messages.otpTokenExpired
        );
      }
    })
    .catch((err) => {
      return responseHelper(
        res,
        constants.statusCode.notFound,
        constants.messages.otpInvalid
      );
    });
};
