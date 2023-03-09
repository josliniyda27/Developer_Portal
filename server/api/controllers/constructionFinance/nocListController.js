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
  projectPurchaser: ProjectPurchaser,
  projectCoPurchaser: ProjectCoPurchaser,
} = db;
const { Op } = require("sequelize");
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

exports.getNocListByProject = async (req, res) => {
  const projectId = req.params.project;
  const unitType = req.params.type.toLowerCase();

  let companyNameKey = req.query.nameSearchKey;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  let whereStatement={};
  let finalData = [{}];
  let order = [];

   console.log("req===>", req.params.project);

  offset ? (offset = offset) : (offset = "0");
  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "ASC");

  //order.push(['status']);

  try {
    await ProjectPurchaser.findAll({ 
      where: { 
        project_id: projectId,
        unit_type: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('unit_type')), '=', unitType)
       },
      order: order,
      attributes: [
              "id",
              "name",
              "file_number",
              "mobile_number",
              "email",
              "lead_shared_with_hdfc",
              "noc_status",
              "loan_status",
              "disbursement_request_status",
              "institution",
              "issued_on",
              "unit_type",
              "unit_type_name",
              "unit_number",
              "booking_date",
              "carpet_area",
              "rate_per_sqfeet",
              "agreement_value",
              "sanctioned_loan_amount",
              "balance_recievable",
              "noc_file",
              "requested_date",
              "requested_amount",
              "last_disbursed_date",
              "createdAt",
              "updatedAt",
            ],
    }).then(async (data) => {
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

exports.getNocDetailsForPurchaser = async (req, res) => {
  const purchaserID = req.params.purchaser;
  const projectId = req.params.project;

  let companyNameKey = req.query.nameSearchKey;
  let unitType = req.query.type;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  let whereStatement={};
  let finalData = [{}];
  let order = [];

   console.log("req===>", req.params.project);

  offset ? (offset = offset) : (offset = "0");
  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "ASC");

  //order.push(['status']);

  try {
    await ProjectPurchaser.findOne({ 
      where: { 
        id: purchaserID,
        project_id: projectId
       },
      order: order,
      attributes: [
              "id",
              "name",
              "file_number",
              "mobile_number",
              "email",
              "lead_shared_with_hdfc",
              "noc_status",
              "loan_status",
              "disbursement_request_status",
              "institution",
              "issued_on",
              "unit_type",
              "unit_type_name",
              "unit_number",
              "booking_date",
              "carpet_area",
              "rate_per_sqfeet",
              "agreement_value",
              "sanctioned_loan_amount",
              "balance_recievable",
              "noc_file",
              "requested_date",
              "requested_amount",
              "last_disbursed_date",
              "createdAt",
              "updatedAt",
            ],
      include: [
        {
            model: Project,
            required: true,
            attributes: [
              "id",
              "name",
            ],
        },    
        {
            model: ProjectCoPurchaser,
            as: "projectCoPurchasers",            
          },    
      ], 
    }).then(async (data) => {
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
