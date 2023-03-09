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
  projectBuilding: ProjectBuilding,
  projectBuildingUnit: ProjectBuildingUnit,
} = db;
const { Op } = require("sequelize");
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

exports.getUnitListByProject = async (req, res) => {
  const projectId = req.params.project;
  const towerId = req.params.tower;

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
    await ProjectBuildingUnit.findAll({ 
      where: { 
        project_id: projectId,
        project_building_id: towerId
       },
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
