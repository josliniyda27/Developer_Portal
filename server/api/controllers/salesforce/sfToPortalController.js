const db = require("../../model");
const { companies: Companies, project: Projects } = db;
const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

const { Op } = require("sequelize");
const { messages } = require("../../../helper/constants");

exports.updateBuilderStatus = async (req, res) => {
  let companyId = req.body.builderId;
  try {
    const updateJson = req.body;
    const companiesUpdate = await Companies.findByPk(companyId);

    if (!companiesUpdate) {
      let msg = `Builder with id ${companyId} not found`;
      responseHelper(res, constants.statusCode.notFound, msg);
      return;
    }

    const updatedComapnies = await companiesUpdate.update(updateJson);

    responseHelper(
      res,
      constants.statusCode.successCode,
      constants.messages.builderDetailsSuccess,
      updatedComapnies.get({ plain: true })
    );
    return;
  } catch (error) {
    console.log("updateBuilderStatusErr2====>", error);
    const catchErrmsg2 = await sequelizeError(error);
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};

//Project update api

exports.updateProjectDetails = async (req, res) => {
  let projectId = req.body.project_id;
  try {
    const updateJson = req.body;
    const projectsUpdate = await Projects.findByPk(projectId);

    if (!req.body.status) {
        let msg = `Status should be required`;
        responseHelper(res, constants.statusCode.notFound, msg);
        return;
      }

    if (!projectsUpdate) {
      let msg = `Project with id ${projectId} not found`;
      responseHelper(res, constants.statusCode.notFound, msg);
      return;
    }

    const updatedComapnies = await projectsUpdate.update(updateJson);

    responseHelper(
      res,
      constants.statusCode.successCode,
      constants.messages.projectDetailsSuccess,
      updatedComapnies.get({ plain: true })
    );
    return;
  } catch (error) {
    console.log("updateBuilderStatusErr2====>", error);
    const catchErrmsg2 = await sequelizeError(error);
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};
