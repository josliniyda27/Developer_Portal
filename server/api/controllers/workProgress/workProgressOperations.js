const db = require("../../model");
const { Op } = require("sequelize");
const moment = require("moment");
const {
  projectBuilding: ProjectBuilding,
  buildingProgressDetail: BuildingProgressDetail,
  buildingProgressDetailDocument: BuildingProgressDetailDocument,
  project: Project,
  sequelize: Sequelize,
} = db;

const {
  constants,
  sequelizeError,
  responseHelper,
} = require("../../../helper");
const { messages } = require("../../../helper/constants");

exports.updateWorkProgess = async (req, res) => {
  const BuildingProgressData = req.body.BuildingProgressDetail;

  const BuildingProgressDocumentData = req.body.BuildingProgressDocumentData;

  if (
    !Array.isArray(BuildingProgressData) ||
    BuildingProgressData.length <= 0
  ) {
    responseHelper(
      res,
      constants.statusCode.notFound,
      constants.messages.BuildingProgressDataErr,
      BuildingProgressData
    );
    return;
  }

  if (
    !Array.isArray(BuildingProgressDocumentData) ||
    BuildingProgressDocumentData.length <= 0
  ) {
    responseHelper(
      res,
      constants.statusCode.notFound,
      constants.messages.BuildingProgressDocumentDataErr,
      BuildingProgressDocumentData
    );
    return;
  }

  const ProjectBuildingIds = BuildingProgressData.map(
    (item) => item.project_building_id
  );
  const ProjectBuildingTotalPercentage = BuildingProgressData.map((item) => ({
    total_completion_percentage: item.construction_completion_percentage,
    added_by:req.userId
  }));

  //transaction started

  let transaction;

  try {
    transaction = await Sequelize.transaction();

    const createdBuildingProgressDetail =
      await BuildingProgressDetail.bulkCreate(
        BuildingProgressData,
        { validate: true },
        { returning: ["id", "project_building_id"] },
        { transaction }
      );

    const updateProjectBuilding = await ProjectBuilding.update(
      ProjectBuildingTotalPercentage[0],
      {
        where: {
          id: ProjectBuildingIds,
        },
      },
      { transaction }
    );

    const lastInsertedIds = await createdBuildingProgressDetail.map((row) => ({
      building_progress_detail_id: row.id,
      project_building_id: row.project_building_id,
    }));

    for (let BPD = 0; BPD < BuildingProgressDocumentData.length; BPD++) {
      for (let lIds = 0; lIds < lastInsertedIds.length; lIds++) {
        if (
          BuildingProgressDocumentData[BPD]["project_building_id"] ===
          lastInsertedIds[lIds]["project_building_id"]
        ) {
          BuildingProgressDocumentData[BPD].building_progress_detail_id =
            lastInsertedIds[lIds]["building_progress_detail_id"];
            BuildingProgressDocumentData[BPD].uploaded_by =req.userId
        }
      }
    }

    const createdBuildingProgressDetailDocument =
      await BuildingProgressDetailDocument.bulkCreate(
        BuildingProgressDocumentData,
        { validate: true },
        { transaction }
      );

    await transaction.commit();
    //transaction end with commit transaction

    res.status(constants.statusCode.successCode).send({
      status: constants.statusCode.successCode,
      message: constants.messages.workProgressSuccess,
      data: "",
    });
  } catch (err) {
    const catchErrmsg = await sequelizeError(err);
    await transaction.rollback();
    res.status(constants.statusCode.serverError).send({
      status: constants.statusCode.serverError,
      message: catchErrmsg,
      data: "",
    });
  }
};

exports.getProjectBuilderByProjectId = async (req, res) => {
  try {
    const projectId = req.query.projectId;
    const projectBuilderIds = req.query.projectBuilderIds;
    let IncludeCondition = "";

//where condition
    if (!projectBuilderIds) {
      IncludeCondition = {
        model: ProjectBuilding,
        as: "projectToProjectBuildings",
      };
    } else {
      IncludeCondition = {
        model: ProjectBuilding,
        as: "projectToProjectBuildings",
        where: {
          id: projectBuilderIds,
        },
      };
    }


//sequelize query
    Project.findOne({
      where: { id: projectId },
      attributes: ["id", "name"],
      include: [IncludeCondition],
    })
      .then((data) => {
        res.status(constants.statusCode.successCode).send({
          status: constants.statusCode.successCode,
          message: constants.messages.projectBuilderDetails,
          data: data,
        });
      })
      .catch((err) => {
        res.status(constants.statusCode.notFound).send({
          status: constants.statusCode.notFound,
          message: constants.messages.apiError,
          data: err,
        });
      });
  } catch (err) {
    
  }
};
