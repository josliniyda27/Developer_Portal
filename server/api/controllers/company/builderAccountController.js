"use strict";
const db = require("../../model");
const {
  companies: Company,
  usercompanies: Usercompanies,
  cities: City,
  projectCompany: Projectcompanies,
  designations: Designation,
  sequelize: Sequelize,
  users: User,
  project: Project,
  projectAddressDetail: projectAddressDetail,
  builderAccount: BuilderAccount,
  projectPurchaser: ProjectPurchaser,
} = db;
const { Op } = require("sequelize");
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

exports.getAccountListByBuilder = async (req, res) => {
  const companyId = req.params.company;
  const unitType = req.params.type;

  let companyNameKey = req.query.nameSearchKey;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  let whereStatement = {};
  let finalData = [{}];
  let order = [];

  console.log("req===>", req.params.project);

  offset ? (offset = offset) : (offset = "0");
  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "ASC");

  //order.push(['status']);

  try {
    await BuilderAccount.findAll({
      where: {
        company_id: companyId,
      },
      order: order,
    })
      .then(async (data) => {
        res.send({
          message: constants.messages.nocRequestListData,
          status: constants.statusCode.successCode,
          data: data,
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

exports.getAccountDetailsById = async (req, res) => {
  const accountId = req.params.id;

  let companyNameKey = req.query.nameSearchKey;
  let unitType = req.query.type;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  let whereStatement = {};
  let finalData = [{}];
  let order = [];

  console.log("req===>", req.params.project);

  offset ? (offset = offset) : (offset = "0");
  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "ASC");

  //order.push(['status']);

  try {
    await BuilderAccount.findOne({
      where: {
        id: accountId,
      },
      order: order,
      include: [
        {
          model: Company,
          attributes: [
            "id",
            "name",
            "address_line_1",
            "address_line_2",
            "address_line_3",
            "city_id",
          ],
        },
        {
          model: Project,
          attributes: ["id", "name"],
        },
      ],
    })
      .then(async (data) => {
        res.send({
          message: constants.messages.nocRequestListData,
          status: constants.statusCode.successCode,
          data: data,
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

exports.getAccountListByProject = async (req, res) => {
  const projectId = req.params.project;
  const unitType = req.params.type;

  let companyNameKey = req.query.nameSearchKey;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  let whereStatement = {};
  let finalData = [{}];
  let order = [];

  console.log("req===>", req.params.project);

  offset ? (offset = offset) : (offset = "0");
  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "ASC");

  //order.push(['status']);

  try {
    await BuilderAccount.findAll({
      where: {
        project_id: projectId,
      },
      order: order,
    })
      .then(async (data) => {
        res.send({
          message: constants.messages.nocRequestListData,
          status: constants.statusCode.successCode,
          data: data,
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

exports.createAccountforBulkCreation = async (req, res) => {
  const accountId = req.body.accountId;
  let companyAccountJson = {};

  (companyAccountJson.payee_name = req.body.payee_name),
    (companyAccountJson.account_number = req.body.account_number),
    (companyAccountJson.company_id = req.body.company_id);
  (companyAccountJson.account_type = req.body.account_type),
    (companyAccountJson.bank = req.body.bank),
    (companyAccountJson.ifsc_code = req.body.ifsc_code),
    (companyAccountJson.file_name = req.body.file_name),
    (companyAccountJson.file_url = req.body.file_url);
  companyAccountJson.Added_by = req.userId;
  companyAccountJson.project_id = req.body.project_id;

  const purchaseIds = req.body.purchaseIdArray;

  if (!purchaseIds || purchaseIds.length <= 0) {
    res.send({
      message: "purchaseIds is required",
      status: constants.statusCode.notFound,
      data: "",
    });
    return;
  }

  if (accountId) {
    try {
      const ProjectPurchaserUpdate = await ProjectPurchaser.update(
        { builder_account_id: accountId },
        { where: { id: { [Op.in]: purchaseIds } } }
      );
      if (ProjectPurchaserUpdate) {
        res.send({
          message: constants.messages.accountDetailsUpdated,
          status: constants.statusCode.successCode,
          data: " Total row updation:" + ProjectPurchaserUpdate[0],
        });
      }
    } catch (error) {
      const catchErrmsg = sequelizeError(error);
      res.send({
        message: constants.messages.apiError,
        status: constants.statusCode.notFound,
        data: catchErrmsg,
      });
    }
  } else {
    let transaction;
    try {
      transaction = await Sequelize.transaction();

      // Create a new record in BuilderAccountCreate
      const BuilderAccountCreate = await BuilderAccount.create(
        companyAccountJson,
        { transaction }
      );
      console.log("BuilderAccountCreate,", BuilderAccountCreate.id);
      // Update  ProjectPurchaser in ProjectPurchaser
      await ProjectPurchaser.update(
        { builder_account_id: BuilderAccountCreate.id },
        {
          where: { id: { [Op.in]: purchaseIds } },
          transaction,
        }
      );

      await transaction.commit();
      res.send({
        message: constants.messages.accountDetailsUpdated,
        status: constants.statusCode.successCode,
        data: BuilderAccountCreate,
      });
    } catch (error) {
  
      const catchErrmsg = sequelizeError(error);
      await transaction.rollback();
      res.send({
        message: constants.messages.apiError,
        status: constants.statusCode.notFound,
        data: catchErrmsg,
      });
    }
  }
};
