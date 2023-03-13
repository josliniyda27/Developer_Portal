import ExamplesService from "../../services/examples.service";
const auth = require("../../middlewares/auth");
const db = require("../../model");
const { Op } = require("sequelize");
const axios = require("axios");
const commonLogs = require("../../../common/logger.js");
const {
  users: User,
  companies: Company,
  project: Project,
  refreshToken: RefreshToken,
  userOtps: UserOtp,
  designations: Designation,
  roles: Role,
  permissions: Permission,
  cities: City,
  userProjects: UserProjects,
  usercompanies: Usercompanies,
  resetPassword: ResetPassword,
  sequelize: Sequelize,
} = db;
const TokenGenerator = require("uuid-token-generator");
const otpGenerator = require("otp-generator");
const moment = require("moment");
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const { BroadcastConstants: Bconstants } = constants;
///for example to create access and refresh token
exports.all = (req, res) => {
  ExamplesService.all().then(async (data) => {
    let token = auth.generateToken(2);
    let refreshToken = await RefreshToken.createToken({ id: 2 });
    try {
      res.send({
        message: constants.messages.userCreatedSuccess,
        status: constants.statusCode.successCode,
        data: data,
        accessToken: token,
        refreshToken: refreshToken,
      });
    } catch {}
  });
};

exports.byId = (req, res) => {
  ExamplesService.byId(req.params.id).then((r) => {
    if (r) res.json(r);
    else res.status(404).end();
  });
};

exports.create = async (req, res) => {
  const tokgen2 = new TokenGenerator(128, TokenGenerator.BASE62);
  let otpAccessToken = tokgen2.generate();
  const minutesToAdd = 5;
  const currentDate = new Date();
  const expiresAt = new Date(currentDate.getTime() + minutesToAdd * 60000);

  const userDetails = {
    username: req.body.userName,
    email: req.body.userEmail,
    mobile: req.body.userMobile,
    city_id: req.body.cityId,
    designation_id: req.body.designationId,
    role_id: req.body.roleId,
    status: "pending",
    source: "portal",
    created_by: req.userId,
    otp_token: otpAccessToken,
  };

  let transaction;
  let userData = {};
  let token = tokgen2.generate();

  try {
    transaction = await Sequelize.transaction();

    await User.create(userDetails, { transaction }).then((data) => {
      userData = data.dataValues;
    });

    const forgotPasswordTokenDetails = {
      user_id: userData.id,
      token: token,
      expiresAt: expiresAt,
    };

    const passwordToken = await ResetPassword.create(
      forgotPasswordTokenDetails,
      { transaction }
    );

    await transaction.commit();

    const userResendDetails = await {
      [tbN.userId]: userData.id,
      [tbN.userName]: userData.username,
      [tbN.userEmail]: userData.email,
      [tbN.userMobile]: userData.mobile,
      [tbN.profileStatus]: userData.status,
      [tbN.userCreatedat]: moment(userData.createdAt).format("YYYY-MM-DD"),
      [tbN.userUpdatedat]: moment(userData.updatedAt).format("YYYY-MM-DD"),
      [tbN.userDesignationId]: userData.designation_id,
      [tbN.userCityId]: userData.city_id,
      [tbN.userRoleId]: userData.role_id,
      [tbN.userRoleId]: userData.role_id,
      [tbN.userOtpToken]: userData.otp_token,
    };

    responseHelper(
      res,
      constants.statusCode.successCode,
      constants.messages.userCreatedSuccessPortal,
      userResendDetails
    );
  } catch (error) {
    console.log("error====>", error);
    const catchErrmsg1 = await sequelizeError(error);
    await transaction.rollback();
    responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
  }
};

exports.findUser = async (req, res) => {
  const id = req.params.id;

  try {
    let userData = await User.findByPk(id, {
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("companies.id")),
            "approvedCompaniesCount",
          ],
        ],
      },
      include: [
        {
          model: Role,
          attributes: ["name"],
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["name"],
              through: { attributes: [] },
            },
          ],
        },
        {
          model: Company,
          required: false,
          as: "companies",
          where: { status: "Approved" },
        },
      ],
      group: [
        "users.id",
        "role.id",
        "role->permissions.id",
        "companies.id",
        "companies->user_companies.id",
      ],
    });

    if (userData) {
      const permissionData = userData.role.permissions.map(
        (permissions) => permissions.name
      );

      const data = {
        ...userData.dataValues,
        permissions: permissionData,
        hasOneCompanyApproved:
          userData.dataValues.approvedCompaniesCount > 0 ? true : false,
      };

      res.send({
        message: constants.messages.userDetails,
        status: constants.statusCode.successCode,
        data,
        // accessToken: token,
        // refreshToken: refreshToken,
      });
    } else {
      res.status(constants.statusCode.notFound).send({
        message: constants.messages.userNotFound + id,
      });
    }
  } catch (err) {
    res.status(constants.statusCode.serverError).send({
      message: constants.messages.userDetailsError + id,
      details: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  let token = req.headers["otp-access-token"];
  let otpType = null;

  if (token == null) {
    return res.status(403).json({
      message: "Otp access token is required!",
      status: constants.statusCode.notFound,
    });
  }

  User.findOne({ where: { otp_token: token } })
    .then(async (user) => {
      if (user) {
        const tokgen2 = await new TokenGenerator(128, TokenGenerator.BASE62);
        if (req.body.email) {
          user.email = req.body.email;
          user.is_email_verified = false;

          otpType = "emailOtp";
        } else if (req.body.mobile) {
          user.mobile = req.body.mobile;
          user.is_sms_verified = false;
          otpType = "smsOtp";
        }

        user.otp_token = tokgen2.generate();
        user.status = "pending";

        const otpValue = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
          specialChars: false,
          lowerCaseAlphabets: false,
        });
        // Save user in the database
        user
          .save()
          .then(async (userData) => {
            const minutesToAdd = 3;
            const currentDate = new Date();
            const expiresAt = new Date(
              currentDate.getTime() + minutesToAdd * 60000
            );
            let userDetails = {};

            const userOtpDetails = {
              otp: otpValue,
              user_id: user.id,
              expiresAt: expiresAt,
              type: otpType,
            };

            if (userData.id) {
              await UserOtp.create(userOtpDetails)
                .then(async (otpData) => {
                  userDetails = await {
                    userOtpToken: userData.otp_token,
                    userId: userData.id,
                    userName: userData.username,
                    userEmail: userData.email,
                    userMobile: userData.mobile,
                    profileStatus: userData.status,
                    userCreatedat: moment(userData.createdAt).format(
                      "YYYY-MM-DD"
                    ),
                    userUpdatedat: moment(userData.updatedAt).format(
                      "YYYY-MM-DD"
                    ),
                    userDesignation_id: userData.designation_id,
                    userRoleId: userData.designation_id,
                  };
                })
                .catch((err) => {
                  res.status(constants.statusCode.notFound).send({
                    message: err.errors[0].message,
                  });
                });
            }

            if (otpType == "smsOtp") {
              //Otpstarted
              const params = new URLSearchParams();
              params.append("feedid", Bconstants.feedid);
              params.append("username", Bconstants.userName);
              params.append("password", Bconstants.password);
              params.append("To", userData.mobile);
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
            } else if (otpType == "emailOtp") {
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

                subject: "Your account verification to HDFC Developer Portal",
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
                  //logger.info(result.data);
                  // Do somthing
                })
                .catch((err) => {
                  // logger.error(err);
                  // Do somthing
                });
            }

            res.send({
              message: constants.messages.userUpdatedSuccess,
              status: constants.statusCode.successCode,
              data: userDetails,
              otp: otpValue,
            });
          })
          .catch((err) => {
            res.status(constants.statusCode.notFound).send({
              message:
                err.errors[0].message ||
                constants.statusCode.userUpdatedSuccess,
              data: err.errors[0].value,
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
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.userDetailsError,
        details: err.message,
      });
    });
};

exports.update = async (req, res) => {
  const userId = req.params.user;

  const userDetails = {};

  if (req.body.userName) userDetails.username = req.body.userName;

  if (req.body.userEmail) userDetails.email = req.body.userEmail;

  if (req.body.userMobile) userDetails.mobile = req.body.userMobile;

  if (req.body.cityId) userDetails.city_id = req.body.cityId;

  if (req.body.designationId)
    userDetails.designation_id = req.body.designationId;

  if (req.body.roleId) userDetails.designation_id = req.body.roleId;

  if (req.body.status) userDetails.status = req.body.status;

  const projects = req.body.projects;
  const companyIds = req.body.companies;

  await User.findOne({ where: { id: userId } })
    .then(async (user) => {
      let transaction;
      let userData = {};

      try {
        transaction = await Sequelize.transaction();

        await user.update(userDetails, { transaction });

        if (companyIds) {
          await Usercompanies.destroy({ where: { user_id: userId } });
          await user.addCompanies(companyIds, {
            through: { assigned_by: req.userId, assigned_on: new Date() },
          });
        }

        if (projects) {
          await UserProjects.destroy({ where: { user_id: userId } });
          await user.addProjects(projects, {
            through: { assigned_by: req.userId },
          });
        }

        await transaction.commit();

        userData = await User.findByPk(userId, {
          attributes: {
            include: [
              [
                Sequelize.fn("COUNT", Sequelize.col("projects.name")),
                "projectsCount",
              ],
            ],
          },
          include: [
            {
              model: Company,
            },
            {
              model: Project,
            },
            {
              model: Designation,
            },
            {
              model: City,
            },
            {
              model: Role,
            },
          ],
          group: [
            "users.id",
            "companies.id",
            "companies.user_companies.id",
            "projects.user_projects.id",
            "designation.id",
            "city.id",
            "role.id",
            "projects.id",
          ],
        });

        responseHelper(
          res,
          constants.statusCode.successCode,
          constants.messages.userCompanyUpdatedSuccess,
          userData
        );
      } catch (error) {
        console.log("if-createOrUpdate====>", error);
        const catchErrmsg1 = await sequelizeError(error);
        await transaction.rollback();
        responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
      }
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.userDetailsError,
        details: err.message,
      });
    });
};

exports.assignUserCompany = async (req, res) => {
  const userId = req.params.user;

  User.findOne({ where: { id: userId } })
    .then(async (user) => {
      // if(user.is_profile_completed == false)
      //   return res.status(403).json({
      //     message: "Sorry this user has not yet completed the profile",
      //     status: constants.statusCode.notFound,
      //    });

      // if(user.is_sms_verified == false)
      //   return res.status(403).json({
      //     message: "Sorry this user has not yet verified sms",
      //     status: constants.statusCode.notFound,
      //    });

      // if(user.is_email_verified == false)
      //   return res.status(403).json({
      //     message: "Sorry this user has not yet verified email address",
      //     status: constants.statusCode.notFound,
      //    });

      let transaction;
      let userDetails;

      try {
        transaction = await Sequelize.transaction();

        const companyId = req.body.companyId;
        const projects = req.body.projects;

        await user.addCompanies(companyId, {
          through: { assigned_by: req.userId, assigned_on: new Date() },
        });
        await user.addProjects(projects, {
          through: { assigned_by: req.userId },
        });

        await transaction.commit();

        userDetails = await User.findByPk(userId, {
          include: [
            {
              model: Company,
            },
            {
              model: Project,
            },
          ],
        });

        responseHelper(
          res,
          constants.statusCode.successCode,
          constants.messages.userCompanyUpdatedSuccess,
          userDetails
        );
      } catch (error) {
        console.log("error====>", error);
        const catchErrmsg1 = await sequelizeError(error);
        await transaction.rollback();
        responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
      }
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.userDetailsError,
        details: err.message,
      });
    });
};

exports.getUserDetails = async (req, res) => {
  const id = req.params.user;

  const tempSQL = Sequelize.getQueryInterface()
    .queryGenerator.selectQuery("user_projects", {
      attributes: ["project_id"],
      where: {
        user_id: id,
      },
    })
    .slice(0, -1);

  await User.findByPk(id, {
    attributes: {
      include: [
        [
          Sequelize.fn("COUNT", Sequelize.col("projects.name")),
          "projectsCount",
        ],
        [
          Sequelize.fn(
            "to_char",
            Sequelize.col("users.createdAt"),
            "mm-dd-YYYY"
          ),
          "createdAt",
        ],
      ],
    },
    include: [
      {
        model: Company,
        as: 'companies',
        include: [
          {
            model: Project,
            where: {
              id: {
                [Op.in]: Sequelize.literal(`(${tempSQL})`),
              },
            },
          },
        ],
      },
      {
        model: Project,
      },
      {
        model: Designation,
      },
      {
        model: City,
      },
      {
        model: Role,
      },
    ],
    group: [
      "users.id",
      "companies.id",
      "companies.user_companies.id",
      "projects.user_projects.id",
      "designation.id",
      "city.id",
      "role.id",
      "projects.id",
      "companies.projects.id",
      "companies.projects.project_company.id",
    ],
  })
    .then(async (userData) => {

      
      const approvedCompanyData = await User.findByPk(id, {
        attributes: {
          include: [
            [Sequelize.fn("COUNT", Sequelize.col("companies.id")), "approvedCompaniesCount"]
          ],
        },
        include: [
          {
            model: Company,
            required: false,
            where: { status : 'Approved' }
          },
        ],
        group: [
          "users.id",
          "companies.id",
          "companies.user_companies.id",
        ],
      })


      if (userData) {
        const data = {
          ...userData.dataValues,
          hasOneCompanyApproved : approvedCompanyData.dataValues.approvedCompaniesCount > 0 ? true : false,

        };

        res.send({
          message: constants.messages.userDetails,
          status: constants.statusCode.successCode,
          data: data,
        });
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.userNotFound + id,
        });
      }
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.userDetailsError + id,
        details: err.message,
      });
    });
};

exports.getcreatedUsers = async (req, res) => {
  const createdUser = req.userId;
  const search = req.query.search;
  const role = req.query.role;
  const city = req.query.city;
  const project = req.query.project;
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder ? req.query.sortOrder : "asc";

  //offset condition
  let offset = req.query.offsetKey;
  offset ? (offset = offset) : (offset = 0);

  let userWhereStatement = [{ created_by: createdUser }];
  let order = [];

  if (search)
    userWhereStatement.push({
      username: {
        [Op.iLike]: "%" + search + "%",
      },
    });

  if (sortField) {
    if (sortField == "city") order.push(["city", "name", sortOrder]);
    else order.push([sortField, sortOrder]);
  }

  if (role) userWhereStatement.push({ role_id: role });

  if (city) userWhereStatement.push({ city_id: city });

  if (project)
    userWhereStatement.push({
      "$projects.id$": { [Op.in]: project },
    });

  await User.findAll({
    offset: offset,
    limit: 10,
    subQuery: false,
    order: order,
    where: userWhereStatement,
    attributes: {
      include: [
        [
          Sequelize.fn("COUNT", Sequelize.col("projects.name")),
          "projectsCount",
        ],
      ],
    },
    include: [
      {
        model: Company,
      },
      {
        model: Project,
      },
      {
        model: Designation,
      },
      {
        model: City,
      },
      {
        model: Role,
      },
    ],
    group: [
      "users.id",
      "companies.id",
      "companies.user_companies.id",
      "projects.user_projects.id",
      "designation.id",
      "city.id",
      "role.id",
      "projects.id",
    ],
  })
    .then(async (data) => {
      if (data) {
        let totalRecordsCount = await User.count({
          where: userWhereStatement,
        });
        res.send({
          message: constants.messages.createdUserDetails,
          status: constants.statusCode.successCode,
          data: data,
          totalRecords: totalRecordsCount,
        });
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.userNotFound + createdUser,
        });
      }
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.userDetailsError + createdUser,
        details: err.message,
      });
    });
};

exports.makeUserAdmin = async (req, res) => {
  const userId = req.params.user;
  const currentUserId = req.userId;

  User.findOne({ where: { id: userId } })
    .then(async (user) => {
      // if(user.is_profile_completed == false)
      //   return res.status(403).json({
      //     message: "Sorry this user has not yet completed the profile",
      //     status: constants.statusCode.notFound,
      //    });

      if (user.is_sms_verified == false)
        return res.status(403).json({
          message: "Sorry this user has not yet verified sms",
          status: constants.statusCode.notFound,
        });

      if (user.is_email_verified == false)
        return res.status(403).json({
          message: "Sorry this user has not yet verified email address",
          status: constants.statusCode.notFound,
        });

      let transaction;
      let userDetails;

      try {
        transaction = await Sequelize.transaction();

        const currentUser = await User.findByPk(currentUserId, {
          include: [
            {
              model: Company,
            },
          ],
        });

        if (currentUser.companies.length == 0)
          return res.status(403).json({
            message: "Sorry you don't have any companies user you.",
            status: constants.statusCode.notFound,
          });

        const currentUserCompany = await currentUser.companies[0].id;
        await Usercompanies.destroy({ where: { user_id: currentUserId } });

        await user.update({ role_id: 1 });
        await user.addCompanies(currentUserCompany, {
          through: { assigned_by: req.userId, assigned_on: new Date() },
        });

        await currentUser.update({ role_id: null, status: "inactive" });

        await transaction.commit();

        userDetails = await User.findByPk(userId, {
          include: [
            {
              model: Company,
            },
            {
              model: Project,
            },
          ],
        });

        res.status(constants.statusCode.successCode).json({
          message: constants.messages.adminChangedSuccess,
          status: constants.statusCode.successCode,
          data: userDetails,
          forceOut: true,
        });
      } catch (error) {
        console.log("error====>", error);
        const catchErrmsg1 = await sequelizeError(error);
        await transaction.rollback();
        responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
      }
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.userDetailsError,
        details: err.message,
      });
    });
};

exports.sendEmailNotificationToNewUser = async (req, res) => {
  const userToken = req.body.userOtpToken;
  const userEmail = req.body.userEmail;
  try {
    const data = await User.findOne({
      where: { email: userEmail, otp_token: userToken },
    });

    if (data) {
      responseHelper(
        res,
        constants.statusCode.successCode,
        "New user created successfully and project linked"
      );
      const emailConfig = {
        headers: {
          "Content-Type": "application/json",
          api_key: Bconstants.emailApiKey,
        },
      };

      const bodyData = JSON.stringify({
        from: {
          email: Bconstants.fromEmail,
          name: "HDFC Developer Portal",
        },

        subject: "Your account verification to HDFC Developer Portal",
        content: [
          {
            type: Bconstants.emailType,
            value:
              "Your profile is created under the HDFC developers portal.Please use the below link to create password  [%LINK%]    ",
          },
        ],
        personalizations: [
          {
            attributes: {
              LINK: Bconstants.createPassword + data.otp_token + " ........  ",
            },
            to: [
              {
                email: data.email,
                name: data.username,
              },
            ],
          },
        ],
      });

      await axios
        .post(Bconstants.emailUrl, bodyData, emailConfig)
        .then((result) => {
          commonLogs.info(result);
          console.log(result);
          // Do somthing
        })
        .catch((err) => {
          commonLogs.error(err);
          console.log(err);
        });
    } else {
      responseHelper(res, constants.statusCode.notFound, "No user found");
      return;
    }
  } catch (err) {
    // console.log("err4==>",err);
    const catchErrmsg2 = await sequelizeError(err);
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
    return;
  }
};
