"use strict";
const db = require("../../model");
const {
  companies: Company,
  project: Project,
  usercompanies: usercompanies,
  users: Users,
  entity: Entity,
  pincode: Pincode,
  cities: City,
  states: State,
  district: District,
  companyDocument: CompanyDocument,
  companyKeyMember,
  companySupportingMember,
  projectCompany: ProjectCompany,
  designations: Designation,
  sequelize: Sequelize,
  companies: Companies,
  companyKeyMember: CompanyKeyMember,
  companySupportingMember: CompanySupportingMember,
  designations: Designations,
  states: States,
} = db;
const { Op } = require("sequelize");
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const { check, validationResult } = require("express-validator");

exports.getById = (req, res) => {
  const companyId = req.params.company;

  Company.findByPk(companyId)
    .then(async (companyDBDetails) => {
      if (companyDBDetails) {
        const companyData = await {
          [tbN.name]: companyDBDetails.name,
          [tbN.panNumber]: companyDBDetails.pan_number,
          [tbN.cinNumber]: companyDBDetails.cin_number,
          [tbN.addressLine1]: companyDBDetails.address_line_1,
          [tbN.addressLine2]: companyDBDetails.address_line_2,
          [tbN.addressLine3]: companyDBDetails.address_line_3,
          [tbN.pincodeId]: companyDBDetails.pincode_id,
          [tbN.cityId]: companyDBDetails.city_id,
          [tbN.stateId]: companyDBDetails.state_id,
          [tbN.districtId]: companyDBDetails.district_id,
          [tbN.groupCompanyName]: companyDBDetails.group_company_name,
          [tbN.completedProjectCount]: companyDBDetails.completed_project_count,
          [tbN.completedProjectNames]: companyDBDetails.completed_project_names,
          files: companyDBDetails.company_documents,
          company_key_members: companyDBDetails.company_key_members,
          company_supporting_members:
            companyDBDetails.company_supporting_members,
        };
        return responseHelper(
          res,
          constants.statusCode.successCode,
          constants.messages.companyDetailsSuccess,
          companyData
        );
      } else {
        return res.status(constants.statusCode.notFound).send({
          message: constants.messages.companyNotFound,
          status: constants.messages.notFound,
        });
      }
    })
    .catch((err) => {
      console.log("companyDBDetails-error====>", error);
      const catchErrmsg1 = sequelizeError(error);
      responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
    });
};

// Save a company details
exports.createOrUpdate = async (req, res) => {
  let companyId = req.body.company;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(constants.statusCode.notFound).json({
      message: errors.array()[0].msg,
      status: constants.statusCode.notFound,
    });
  }

  const companyDetails = {
    name: req.body.name,
    pan_number: req.body.pan_number,
    cin_number: req.body.cin_number,
    address_line_1: req.body.address_line_1,
    address_line_2: req.body.address_line_2,
    address_line_3: req.body.address_line_3,
    pincode_id: req.body.pincode_id,
    entity_id: req.body.entity_id,
    city_id: req.body.city_id,
    state_id: req.body.state_id,
    district_id: req.body.district_id,
    source: "PORTAL",
    group_company_name: req.body.group_company_name,
    completed_project_count: req.body.completed_project_count,
    completed_project_names: req.body.completed_project_names,
    created_by: req.userId,
  };

  let transaction;
  let finalMessage = constants.messages.companyDetailsSaveSuccess;

  if (companyId) {
    try {
      transaction = await Sequelize.transaction();
      await Company.update(
        companyDetails,
        { where: { id: companyId }, returning: true, plain: true },
        { transaction }
      ).then((data) => {});

      if (req.body.files && Array.isArray(req.body.files)) {
        const fileDetails = req.body.files.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await CompanyDocument.bulkCreate(
          fileDetails,
          {
            updateOnDuplicate: ["id"],
          },
          { validate: true },
          { transaction }
        );
      }

      if (req.body.key_members && Array.isArray(req.body.key_members)) {
        const keyMemberDetails = req.body.key_members.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await companyKeyMember.bulkCreate(
          keyMemberDetails,
          {
            updateOnDuplicate: ["id"],
          },
          { validate: true },
          { transaction }
        );
      }

      if (req.body.contact_persons && Array.isArray(req.body.contact_persons)) {
        const contactPersonsDetails = req.body.contact_persons.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await companySupportingMember.bulkCreate(
          contactPersonsDetails,
          {
            updateOnDuplicate: ["id"],
          },
          { validate: true },
          { transaction }
        );
      }

      await transaction.commit();
      finalMessage = constants.messages.companyDetailsUpdatedSuccess;
    } catch (error) {
      console.log("if-createOrUpdate====>", error);
      const catchErrmsg1 = await sequelizeError(error);
      await transaction.rollback();
      responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
    }
  } else {
    try {
      companyDetails.name = req.body.name;

      transaction = await Sequelize.transaction();

      await Company.create(companyDetails, { transaction }).then(
        (companyData) => {
          companyId = companyData.dataValues.id;
        }
      );

      const userCompanyInsertDetails = await {
        user_id: req.userId,
        company_id: companyId,
      };

      await usercompanies
        .create(userCompanyInsertDetails, {
          transaction,
        })
        .then((data) => {});

      if (req.body.files && Array.isArray(req.body.files)) {
        const fileDetails = req.body.files.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await CompanyDocument.bulkCreate(fileDetails, { transaction });
      }

      if (req.body.key_members && Array.isArray(req.body.key_members)) {
        const keyMemberDetails = req.body.key_members.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await companyKeyMember.bulkCreate(keyMemberDetails, { transaction });
      }

      if (req.body.contact_persons && Array.isArray(req.body.contact_persons)) {
        const contactPersonsDetails = req.body.contact_persons.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await companySupportingMember.bulkCreate(contactPersonsDetails, {
          transaction,
        });
      }

      await transaction.commit();
      finalMessage = constants.messages.companyDetailsSaveSuccess;
    } catch (error) {
      console.log("else-createOrUpdate====>", error);
      const catchErrmsg1 = await sequelizeError(error);
      await transaction.rollback();
      responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
    }
  }

  try {
    const companyDBDetails = await Company.findByPk(companyId, {
      include: [CompanyDocument, companyKeyMember, companySupportingMember],
    });
    if (companyDBDetails) {
      const companyData = await {
        id: companyDBDetails.id,
        [tbN.name]: companyDBDetails.name,
        [tbN.panNumber]: companyDBDetails.pan_number,
        [tbN.cinNumber]: companyDBDetails.cin_number,
        [tbN.addressLine1]: companyDBDetails.address_line_1,
        [tbN.addressLine2]: companyDBDetails.address_line_2,
        [tbN.addressLine3]: companyDBDetails.address_line_3,
        [tbN.pincodeId]: companyDBDetails.pincode_id,
        [tbN.cityId]: companyDBDetails.city_id,
        [tbN.stateId]: companyDBDetails.state_id,
        [tbN.districtId]: companyDBDetails.district_id,
        [tbN.groupCompanyName]: companyDBDetails.group_company_name,
        [tbN.completedProjectCount]: companyDBDetails.completed_project_count,
        [tbN.completedProjectNames]: companyDBDetails.completed_project_names,
        files: companyDBDetails.company_documents,
        company_key_members: companyDBDetails.company_key_members,
        company_supporting_members: companyDBDetails.company_supporting_members,
      };
      responseHelper(
        res,
        constants.statusCode.successCode,
        finalMessage,
        companyData
      );
    } 
  } catch (error) {
    console.log("error====>", error);
    const catchErrmsg1 = await sequelizeError(error);
    responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
  }
};

// Save a company project details
exports.createCompanyProject = async (req, res) => {
  let companyId = req.body.company;
  let projectId = req.body.project;
  const errors = validationResult(req);
  if (!errors.isEmpty() && !req.body.company) {
    return res.status(constants.statusCode.notFound).json({
      message: errors.array()[0].msg,
      status: constants.statusCode.notFound,
    });
  }
  if (!projectId) {
    return res.status(constants.statusCode.notFound).json({
      message: "Please provide a project Id",
      status: constants.statusCode.notFound,
    });
  }
  let transaction;
  if (companyId) {
    transaction = await Sequelize.transaction();
    try {
      const companyProjectInsertDetails = {
        project_id: projectId,
        company_id: companyId,
      };

      await ProjectCompany.findOne({ where: { project_id: projectId } }).then(
        function (obj) {
          if (obj) return obj.update(companyProjectInsertDetails);
          return ProjectCompany.create(companyProjectInsertDetails);
        }
      );
    } catch (error) {
      console.log("if-createCompanyProject====>", error);
      const catchErrmsg1 = await sequelizeError(error);
      responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
    }
  } else {
    //let transaction;

    try {
      transaction = await Sequelize.transaction();
      const companyDetails = {
        name: req.body.name,
        pan_number: req.body.pan_number,
        cin_number: req.body.cin_number,
        address_line_1: req.body.address_line_1,
        address_line_2: req.body.address_line_2,
        address_line_3: req.body.address_line_3,
        pincode_id: req.body.pincode_id,
        entity_id: req.body.entity_id,
        city_id: req.body.city_id,
        state_id: req.body.state_id,
        district_id: req.body.district_id,
        source: "PORTAL",
        group_company_name: req.body.group_company_name,
        completed_project_count: req.body.completed_project_count,
        completed_project_names: req.body.completed_project_names,
        created_by: req.userId,
      };

      await Company.create(companyDetails, { transaction }).then(
        (companyData) => {
          companyId = companyData.dataValues.id;
        }
      );

      const userCompanyInsertDetails = {
        user_id: req.userId,
        company_id: companyId,
      };

      await usercompanies
        .create(userCompanyInsertDetails, {
          transaction,
        })
        .then((data) => {});

      const companyProjectInsertDetails = {
        project_id: projectId,
        company_id: companyId,
      };

      await ProjectCompany.findOne({ where: { project_id: projectId } }).then(
        function (obj) {
          if (obj)
            return obj.update(companyProjectInsertDetails, { transaction });
          return ProjectCompany.create(companyProjectInsertDetails, {
            transaction,
          });
        }
      );

      if (req.body.files && Array.isArray(req.body.files)) {
        const fileDetails = req.body.files.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await CompanyDocument.bulkCreate(fileDetails, { transaction });
      }

      if (req.body.key_members && Array.isArray(req.body.key_members)) {
        const keyMemberDetails = req.body.key_members.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await companyKeyMember.bulkCreate(keyMemberDetails, { transaction });
      }

      if (req.body.contact_persons && Array.isArray(req.body.contact_persons)) {
        const contactPersonsDetails = req.body.contact_persons.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await companySupportingMember.bulkCreate(contactPersonsDetails, {
          transaction,
        });
      }

      await transaction.commit();
    } catch (error) {
      console.log("else-createCompanyProject====>", error);
      const catchErrmsg1 = await sequelizeError(error);
      await transaction.rollback();
      responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
    }
  }

  try {
    const companyDBDetails = await Company.findByPk(companyId, {
      include: [CompanyDocument, companyKeyMember, companySupportingMember],
    });

    if (companyDBDetails) {
      const companyData = await {
        id: companyDBDetails.id,
        [tbN.name]: companyDBDetails.name,
        [tbN.panNumber]: companyDBDetails.pan_number,
        [tbN.cinNumber]: companyDBDetails.cin_number,
        [tbN.addressLine1]: companyDBDetails.address_line_1,
        [tbN.addressLine2]: companyDBDetails.address_line_2,
        [tbN.addressLine3]: companyDBDetails.address_line_3,
        [tbN.pincodeId]: companyDBDetails.pincode_id,
        [tbN.cityId]: companyDBDetails.city_id,
        [tbN.stateId]: companyDBDetails.state_id,
        [tbN.districtId]: companyDBDetails.district_id,
        [tbN.groupCompanyName]: companyDBDetails.group_company_name,
        [tbN.completedProjectCount]: companyDBDetails.completed_project_count,
        [tbN.completedProjectNames]: companyDBDetails.completed_project_names,
        project_id: projectId,
        files: companyDBDetails.company_documents,
        company_key_members: companyDBDetails.company_key_members,
        company_supporting_members: companyDBDetails.company_supporting_members,
      };

      await responseHelper(
        res,
        constants.statusCode.successCode,
        constants.messages.companyDetailsUpdatedSuccess,
        companyData
      );
    }
  } catch (error) {
    console.log("companyDBDetails-createCompanyProject====>", error);
    const catchErrmsg1 = await sequelizeError(error);
    responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
  }
};

exports.getAllUserCompanyInfo = async (req, res) => {
  const userId = req.userId;

  try {
    Users.findByPk(userId, {
      include: [
        {
          model: usercompanies,
          as: "userCompanies",
          separate: true,
          attributes: {
            exclude: ["createdAt", "updatedAt","id"]
          },
          include: [
            {
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "city_id",
                  "state_id",
                  "entity_id",
                  "entity_id",
                  "deletedAt",
                  "pincode_id",
                ],
              },
              model: Company,
              include: [
                State,
                Pincode,
                City,
                { model: CompanyDocument },
                {
                  model: companySupportingMember,
                  attributes: {
                    exclude: [
                      "company_id",
                      "designation_id",
                      "deletedAt",
                      "createdAt",
                    ],
                  },
                  separate: true,
                  include: [
                    { attributes: ["id", "name", "type"], model: Designation },
                  ],
                },
                {
                  model: companyKeyMember,
                  attributes: {
                    exclude: [
                      "company_id",
                      "designation_id",
                      "deletedAt",
                      "createdAt",
                    ],
                  },
                  separate: true,
                  include: [
                    { attributes: ["id", "name", "type"], model: Designation },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
      .then(async (data) => {
        res.send({
          message: constants.messages.UserCOmpanyinfoselection,
          status: constants.statusCode.successCode,
          data: data.userCompanies,
        });
      })
      .catch((err) => {
        res.status(constants.statusCode.serverError).send({
          message: constants.messages.apiError,
          data: err.message,
          status: constants.messages.notFound,
        });
      });
  } catch (error) {
    console.log("error==>", error);
  }
};

exports.getAllUserCompanyList = async (req, res) => {
  const userId = req.userId;
  let finalData = [];

  try {
    usercompanies
      .findAll({
        where: { user_id: userId },
        // raw: true,
        attributes: ["company_id"],
        include: [
          {
            model: Company,
            attributes: ["name", "id"],
            include: [
              {
                model: City,
                attributes: ["name"],
              },
            ],
          },
        ],
      })
      .then(async (data) => {
        await data.forEach(function (item) {
          finalData.push(item.company);
        });
        res.send({
          message: constants.messages.UserCOmpanyinfoselection,
          status: constants.statusCode.successCode,
          data: finalData,
        });
      })
      .catch((err) => {
        res.status(constants.statusCode.serverError).send({
          message: constants.messages.apiError,
          data: err.message,
          status: 404,
        });
      });
  } catch (error) {
    console.log("error==>", error);
  }
};

exports.getAllCompanyInfo = (req, res) => {
  let companyId = req.params.company;

  if (!companyId) {
    res.status(403).send({
      message: "Company id missing",
      status: 403,
    });
    return;
  }
  try {
    Companies.findAll({
      where: { id: companyId },
      include: [
        States,
        Pincode,
        City,
        Entity,
        { model: CompanyDocument },
        {
          model: CompanySupportingMember,
          attributes: {
            exclude: ["company_id", "designation_id", "deletedAt", "createdAt"],
          },
          separate: true,
          include: [
            { attributes: ["id", "name", "type"], model: Designations },
          ],
        },
        {
          model: CompanyKeyMember,
          attributes: {
            exclude: ["company_id", "designation_id", "deletedAt", "createdAt"],
          },
          separate: true,
          include: [
            { attributes: ["id", "name", "type"], model: Designations },
          ],
        },
      ],
    })
      .then(async (data) => {
        if (data[0]) {
          res.send({
            message: constants.messages.Projectinfoselection,
            status: constants.statusCode.successCode,
            data: data[0],
          });
        } else {
          res.status(constants.statusCode.notFound).send({
            message: constants.messages.notFound,
            status: constants.statusCode.notFound,
            data: {},
          });
        }
      })
      .catch((err) => {
        console.log("CompanydataErr1====>", err);
        res.status(constants.statusCode.serverError).send({
          message: constants.messages.notFound,
          data: err.message,
          status: 404,
        });
      });
  } catch (error) {
    console.log("CompanydataErr2==>", error);
  }
};

exports.validate = (method) => {
  switch (method) {
    case "createOrUpdate": {
      return [
        check("company")
          .optional({ nullable: true })
          .custom(async (value, { req }) => {
            await Company.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage("Please enter a valid company id"),
        check("project")
          .optional({ nullable: true })
          .custom(async (value, { req }) => {
            await Project.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage("Please enter a valid project id"),
        check("name")
          .notEmpty()
          .withMessage("Company name is required")
          .custom(async (value, { req }) => {
            let whereStatement = [{ name: value }];
            if (req.body.company)
              whereStatement.push({ id: { [Op.ne]: req.body.company } });

            await Company.count({ where: whereStatement }).then(
              async (count) => {
                if (count > 0) {
                  let companyId;

                  await Company.findAll({
                    where: whereStatement,
                  }).then(async (data) => {
                    if (data.length > 0) {
                      companyId = data[0].dataValues.id;
                    }
                  });

                  if (companyId !== 0) {
                    await usercompanies
                      .findAll({
                        where: { company_id: companyId },
                        include: [
                          {
                            model: Users,
                            as: "companiUsers",
                            order: [["id", "ASC"]],
                          },
                        ],
                      })
                      .then(async (data) => {
                        if (data.length > 0) {
                          const records = data.map(
                            (result) => result.dataValues
                          );

                          let mobile = 0;

                          records[0].companiUsers.dataValues.mobile
                            ? (mobile =
                                records[0].companiUsers.dataValues.mobile)
                            : (mobile = null);

                          let message = await constants.validationResponse(
                            "Company Name",
                            value,
                            mobile
                          );

                          throw new Error(message);
                        }
                      });
                  }
                }
              }
            );
          })
          .withMessage("This name is already taken"),
        check("pan_number")
          .notEmpty()
          .withMessage("Pan number is required")
          .matches(/^[A-Za-z0-9]+$/)
          .withMessage("Please enter a valid pan number")
          .custom(async (value, { req }) => {
            let whereStatement = [{ pan_number: value }];
            console.log("value000==>", value);

            if (req.body.company)
              whereStatement.push({ id: { [Op.ne]: req.body.company } });

            await Company.count({ where: whereStatement }).then(
              async (count) => {
                if (count > 0) {
                  let companyId;

                  await Company.findAll({
                    where: whereStatement,
                  }).then(async (data) => {
                    console.log("data1==>", data);
                    if (data.length > 0) {
                      companyId = data[0].dataValues.id;
                    }
                  });

                  if (companyId !== 0 && req.body.company) {
                    await usercompanies
                      .findAll({
                        where: { company_id: companyId },
                        include: {
                          model: Users,
                          as: "companiUsers",
                          order: [["id", "ASC"]],
                        },
                      })
                      .then(async (data) => {
                        if (data.length > 0) {
                          const records = data.map(
                            (result) => result.dataValues
                          );

                          let mobile = 0;

                          records[0].companiUsers.dataValues.mobile
                            ? (mobile =
                                records[0].companiUsers.dataValues.mobile)
                            : (mobile = null);

                          let message = await constants.validationResponse(
                            "Pan card",
                            value,
                            mobile
                          );

                          throw new Error(message);
                        }
                      });
                  } else {
                    throw new Error("Pan number already in use");
                  }
                }
              }
            );
          }),
        check("entity_id")
          .notEmpty()
          .withMessage("Entity field is required")
          .custom(async (value, { req }) => {
            await Entity.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This entity type is not in our collection.Please enter a valid entity type"
          ),
        check("cin_number")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("CIN number is required")
          .matches(/^[A-Za-z0-9]+$/)
          .withMessage("Please enter a valid CIN number")
          .custom(async (value, { req }) => {
            let whereStatement = [{ cin_number: value }];
            if (req.body.company)
              whereStatement.push({ id: { [Op.ne]: req.body.company } });

            await Company.count({ where: whereStatement }).then(
              async (count) => {
                if (count > 0) {
                  let companyId;

                  await Company.findAll({
                    where: whereStatement,
                  }).then(async (data) => {
                    if (data.length > 0) {
                      companyId = data[0].dataValues.id;
                    }
                  });

                  if (companyId !== 0 && req.body.company) {
                    await usercompanies
                      .findAll({
                        where: { company_id: companyId },
                        include: {
                          model: Users,
                          as: "companiUsers",
                          order: [["id", "ASC"]],
                        },
                      })
                      .then(async (data) => {
                        if (data.length > 0) {
                          const records = data.map(
                            (result) => result.dataValues
                          );

                          let mobile = 0;

                          records[0].companiUsers.dataValues.mobile
                            ? (mobile =
                                records[0].companiUsers.dataValues.mobile)
                            : (mobile = null);

                          let message = await constants.validationResponse(
                            "CIN Number",
                            value,
                            mobile
                          );

                          throw new Error(message);
                        } else {
                          throw new Error("CIN number already in use");
                        }
                      });
                  }
                }
              }
            );
          }),
        check("address_line_1")
          .notEmpty()
          .withMessage("Address line 1 is required"),
        check("state_id")
          .notEmpty()
          .withMessage("State field is required")
          .custom(async (value, { req }) => {
            await State.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This state is not in our collection.Please enter a valid state"
          ),
        check("district_id")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("District field is required")
          .custom(async (value, { req }) => {
            await District.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This district is not in our collection.Please enter a valid district"
          ),
        check("city_id")
          .notEmpty()
          .withMessage("City field is required")
          .custom(async (value, { req }) => {
            await City.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This city is not in our collection.Please enter a valid city"
          ),
        check("pincode_id")
          .notEmpty()
          .withMessage("Pincode field is required")
          .custom(async (value, { req }) => {
            await Pincode.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This Pincode is not in our collection.Please enter a valid pincode"
          ),
        check("files")
          .optional({ nullable: true })
          .isArray()
          .withMessage("Files field must be an array"),
        check("key_members")
          .optional({ nullable: true })
          .isArray()
          .withMessage("Key members field must be an array"),
        check("contact_persons")
          .optional({ nullable: true })
          .isArray()
          .withMessage("Key members field must be an array"),
        check("files.*.file_name")
          .notEmpty()
          .withMessage("File name is required"),
        check("files.*.file_url")
          .notEmpty()
          .withMessage("File URL is required"),
        check("files.*.document_type")
          .notEmpty()
          .withMessage("Document type is required")
          .isString()
          .withMessage("Document type must be a String")
          .isIn(["panCard", "addressProof"])
          .withMessage("Document type does contain invalid value"),
        check("key_members.*.name")
          .notEmpty()
          .withMessage("Key member name is required"),
        check("key_members.*.designation_id")
          .notEmpty()
          .withMessage("Key member designation is required"),
        check("key_members.*.mobile")
          .notEmpty()
          .withMessage("Key member mobile is required"),
        check("key_members.*.email")
          .notEmpty()
          .withMessage("Key member email is required"),
        check("key_members.*.director_pancard_document_number")
          .notEmpty()
          .withMessage("Key member pan card number is required"),
        check("key_members.*.director_pancard_document_url")
          .notEmpty()
          .withMessage("Key member pan card file URL is required"),
        check("key_members.*.director_pancard_document_name")
          .notEmpty()
          .withMessage("Key member pan card file name is required"),
        check("contact_persons.*.name")
          .notEmpty()
          .withMessage("Contact person name is required"),
        check("contact_persons.*.designation_id")
          .notEmpty()
          .withMessage("Contact person designation is required"),
        check("contact_persons.*.mobile")
          .notEmpty()
          .withMessage("Contact person mobile is required"),
        check("contact_persons.*.email")
          .notEmpty()
          .withMessage("Contact person email is required"),
      ];
    }
    case "createProjectCompany": {
      return [
        check("company")
          .optional({ nullable: true })
          .custom(async (value, { req }) => {
            await Company.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              } else {
                return;
              }
            });
          })
          .withMessage("Please enter a valid company id"),
        check("project")
          .optional({ nullable: true })
          .custom(async (value, { req }) => {
            await Project.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage("Please enter a valid project id"),
        check("name")
          .optional({ nullable: true })
          .custom(async (value, { req }) => {
            let whereStatement = [{ name: value }];
            if (req.body.company)
              whereStatement.push({ id: { [Op.ne]: req.body.company } });

            await Company.count({ where: whereStatement }).then((count) => {
              if (count > 0) {
                throw new Error();
              }
            });
          })
          .withMessage("This name is already taken"),
        check("pan_number")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("PAN Card number is required")
          .matches(/^[A-Za-z0-9]+$/)
          .withMessage("Please enter a valid pan number")
          .custom(async (value, { req }) => {
            let whereStatement = [{ pan_number: value }];
            if (req.body.company)
              whereStatement.push({ id: { [Op.ne]: req.body.company } });

            await Company.count({ where: whereStatement }).then(
              async (count) => {
                if (count > 0) {
                  let companyId;

                  await Company.findAll({
                    where: whereStatement,
                  }).then(async (data) => {
                    if (data.length > 0) {
                      companyId = data[0].dataValues.id;
                    }
                  });

                  if (companyId !== 0) {
                    await usercompanies
                      .findAll({
                        where: { company_id: companyId },
                        include: [
                          {
                            model: Users,
                            as: "companiUsers",
                            order: [["id", "ASC"]],
                          },
                        ],
                      })
                      .then(async (data) => {
                        if (data.length > 0) {
                          const records = data.map(
                            (result) => result.dataValues
                          );

                          let mobile = 0;

                          records[0].companiUsers.dataValues.mobile
                            ? (mobile =
                                records[0].companiUsers.dataValues.mobile)
                            : (mobile = null);

                          let message = await constants.validationResponse(
                            "Pan card",
                            value,
                            mobile
                          );

                          throw new Error(message);
                        }
                      });
                  }
                }
              }
            );
          }),
        check("entity_id")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("Entity field is required")
          .custom(async (value, { req }) => {
            await Entity.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This entity type is not in our collection.Please enter a valid entity type"
          ),
        check("cin_number")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("CIN number is required")
          .matches(/^[A-Za-z0-9]+$/)
          .withMessage("Please enter a valid CIN number")
          .custom(async (value, { req }) => {
            let whereStatement = [{ cin_number: value }];
            if (req.body.company)
              whereStatement.push({ id: { [Op.ne]: req.body.company } });

            await Company.count({ where: whereStatement }).then(
              async (count) => {
                if (count > 0) {
                  let companyId;

                  await Company.findAll({
                    where: whereStatement,
                  }).then(async (data) => {
                    if (data.length > 0) {
                      companyId = data[0].dataValues.id;
                    }
                  });

                  if (companyId !== 0) {
                    await usercompanies
                      .findAll({
                        where: { company_id: companyId },
                        include: [
                          {
                            model: Users,
                            as: "companiUsers",
                            order: [["id", "ASC"]],
                          },
                        ],
                      })
                      .then(async (data) => {
                        if (data.length > 0) {
                          const records = data.map(
                            (result) => result.dataValues
                          );

                          let mobile = 0;

                          records[0].companiUsers.dataValues.mobile
                            ? (mobile =
                                records[0].companiUsers.dataValues.mobile)
                            : (mobile = null);

                          let message = await constants.validationResponse(
                            "CIN Number",
                            value,
                            mobile
                          );

                          throw new Error(message);
                        }
                      });
                  }
                }
              }
            );
          }),
        check("address_line_1")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("Address line 1 is required"),
        check("state_id")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("State field is required")
          .custom(async (value, { req }) => {
            await State.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This state is not in our collection.Please enter a valid state"
          ),
        check("district_id")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("District field is required")
          .custom(async (value, { req }) => {
            await District.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This district is not in our collection.Please enter a valid district"
          ),
        check("city_id")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("City field is required")
          .custom(async (value, { req }) => {
            await City.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This city is not in our collection.Please enter a valid city"
          ),
        check("pincode_id")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("Pincode field is required")
          .custom(async (value, { req }) => {
            await Pincode.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage("Pincode field is invalid"),
        check("pincode_id")
          .optional({ nullable: true })
          .notEmpty()
          .withMessage("Pincode field is required")
          .custom(async (value, { req }) => {
            await Pincode.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This Pincode is not in our collection.Please enter a valid pincode"
          ),
        check("files")
          .optional({ nullable: true })
          .isArray()
          .withMessage("Files field must be an array"),
        check("key_members")
          .optional({ nullable: true })
          .isArray()
          .withMessage("Key members field must be an array"),
        check("contact_persons")
          .optional({ nullable: true })
          .isArray()
          .withMessage("Key members field must be an array"),
        check("files.*.file_name")
          .notEmpty()
          .withMessage("File name is required"),
        check("files.*.file_url")
          .notEmpty()
          .withMessage("File URL is required"),
        check("files.*.document_type")
          .notEmpty()
          .withMessage("Document type is required")
          .isString()
          .withMessage("Document type must be a String")
          .isIn(["panCard", "addressProof"])
          .withMessage("Document type does contain invalid value"),
        check("key_members.*.name")
          .notEmpty()
          .withMessage("Key member name is required"),
        check("key_members.*.designation_id")
          .notEmpty()
          .withMessage("Key member designation is required")
          .custom(async (value, { req }) => {
            await Designation.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This designation is not in our collection.Please enter a valid designation"
          ),
        check("key_members.*.mobile")
          .notEmpty()
          .withMessage("Key member mobile is required"),
        check("key_members.*.email")
          .notEmpty()
          .withMessage("Key member email is required"),
        check("key_members.*.director_pancard_document_number")
          .notEmpty()
          .withMessage("Key member pan card number is required"),
        check("key_members.*.director_pancard_document_url")
          .notEmpty()
          .withMessage("Key member pan card file URL is required"),
        check("key_members.*.director_pancard_document_name")
          .notEmpty()
          .withMessage("Key member pan card file name is required"),
        check("contact_persons.*.name")
          .notEmpty()
          .withMessage("Contact person name is required"),
        check("contact_persons.*.designation_id")
          .notEmpty()
          .withMessage("Contact person designation is required")
          .custom(async (value, { req }) => {
            await Designation.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage(
            "This designation is not in our collection.Please enter a valid designation"
          ),
        check("contact_persons.*.mobile")
          .notEmpty()
          .withMessage("Contact person mobile is required"),
        check("contact_persons.*.email")
          .notEmpty()
          .withMessage("Contact person email is required"),
        // check('username').isEmail().withMessage("the name must have minimum length of 3"),
        // // password must be at least 5 chars long
        // check('password').isLength({ min: 5 }),
      ];
    }
  }
};
