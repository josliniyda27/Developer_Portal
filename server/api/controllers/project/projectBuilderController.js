const db = require("../../model");
const { Op } = require("sequelize");
const moment = require("moment");
const {
  projectBuilding: ProjectBuilding,
  buildingProgressDetail: BuildingProgressDetail,
  buildingProgressDetailDocument: BuildingProgressDetailDocument,
  sequelize: Sequelize,
} = db;

const {
  constants,
  sequelizeError,
  responseHelper,
} = require("../../../helper");
const { messages } = require("../../../helper/constants");

exports.createUpdateProjectBuilder = async (req, res) => {

  if (req.body.issues_sales_deed==="Yes") {
    req.body.estimated_date = null;
  }

  if (req.body.project_builder_id) {
    try {
      const projectUpdate = await ProjectBuilding.findByPk(
        req.body.project_builder_id
      );

      if (!projectUpdate) {
        let msg = `Project builder with id ${req.body.project_builder_id} not found`;
        responseHelper(res, constants.statusCode.notFound, msg);
        return;
      }

      const updatedProjectBuilder = await projectUpdate.update(req.body, {
        validate: true,
      });
      responseHelper(
        res,
        constants.statusCode.successCode,
        constants.messages.updatedProjectBuilderSuccess,
        updatedProjectBuilder.get({ plain: true })
      );
      return;
    } catch (err) {
      const catchErrmsg2 = await sequelizeError(err);
      responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
    }
  } else {
    // if (!req.body.project_id) {
    //   let msg = `project_id should be provided`;
    //   responseHelper(res, constants.statusCode.notFound, msg);
    //   return;
    // }

    try {
      ProjectBuilding.create(req.body)
        .then((data) => {
          responseHelper(
            res,
            constants.statusCode.successCode,
            constants.messages.createProjectBuilderSuccess,
            data
          );
          return;
        })
        .catch(async (error) => {
          const catchErrmsg2 = await sequelizeError(error);
          responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
          return;
        });
    } catch (err) {
      const catchErrmsg2 = await sequelizeError(error);
      responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
    }
  }
};
