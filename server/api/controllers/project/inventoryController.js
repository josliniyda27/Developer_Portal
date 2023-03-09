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
  projectInventoryHistory: ProjectInventoryHistory,
} = db;
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

exports.getInventoryHistory = async (req, res) => {
  const projectId = req.params.project;

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
    await Project.findOne({ 
      where: { 
        id: projectId
      },
      attributes: [
          "id",
          "name",
          "total_units",
          "units_for_sales",
          "sold_units",
          "avg_rate_per_square_feet",
          "total_unsold_inventory",
          "total_value_of_unsold_inventory",
          "unsold_units"
        ],
      include: [
          {
            model: ProjectInventoryHistory,
            as: "projectInventoryHistories",
          },
        ],
      order: order,
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

exports.getInventoryDetails = async (req, res) => {
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
    await Project.findOne({ 
      where: { 
        id: projectId,
       },
       attributes: [
              "id",
              "name",
              "total_units",
              "units_for_sales",
              "sold_units",
              "avg_rate_per_square_feet",
              "total_unsold_inventory",
              "total_value_of_unsold_inventory",
              "unsold_units"
            ],
      order: order,
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

exports.updateInventory = async (req, res) => {

    const projectId = await req.params.project;

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(constants.statusCode.notFound).json({
        message: errors.array()[0].msg,
        status: constants.statusCode.notFound,
      });
    }


    if (!projectId) {
      res.status(403).send({
        message: "Project id missing",
        status: 403,
      });

      return;
    }

    const inventoryDetails = {
      total_units: req.body.total_units,
      units_for_sales: req.body.units_for_sales,
      sold_units: req.body.sold_units,
      avg_rate_per_square_feet: req.body.avg_rate_per_square_feet,
      total_unsold_inventory: req.body.total_unsold_inventory,
      total_value_of_unsold_inventory: req.body.total_value_of_unsold_inventory
    };


    await Project.update(inventoryDetails, {
        where: { id: projectId },
      }).then((projectData) => {
        return ProjectInventoryHistory.create(
          {
            project_id: projectId,
            total_units: req.body.total_units,
            units_for_sales: req.body.units_for_sales,
            sold_units: req.body.sold_units,
            avg_rate_per_square_feet: req.body.avg_rate_per_square_feet,
            total_unsold_inventory: req.body.total_unsold_inventory,
            total_value_of_unsold_inventory: req.body.total_value_of_unsold_inventory
          })}).then((pData) => {
        // do insert in history
        const message = constants.messages.querycommunicationSuccess;
        responseHelper(res, constants.statusCode.successCode, message, inventoryDetails);
      });
  
  };


exports.validate = (method) => {
  switch (method) {
    case "updateInventory": {
      return [
        check("project")
          .notEmpty()
          .withMessage("Project id is required")
          .custom(async (value, { req }) => {
            await Project.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage("Please enter a valid project id"),
          check("total_units").notEmpty().withMessage("Total units is required"),
          check("units_for_sales").notEmpty().withMessage("Units for sales is required"),
          check("sold_units").notEmpty().withMessage("Sold units is required"),
          check("avg_rate_per_square_feet").notEmpty().withMessage("Avg rate per square feet is required"),
          check("total_unsold_inventory").notEmpty().withMessage("Total unsold inventory is required"),
          check("total_value_of_unsold_inventory").notEmpty().withMessage("Total value of unsold inventory is required"),
      ];
    }
  }
};
