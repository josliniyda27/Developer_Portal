const db = require("../../model");
const { Op } = require("sequelize");
const moment = require("moment");
const {
  projectBuilding: ProjectBuilding,
  buildingProgressDetail: BuildingProgressDetail,
  projectPurchaser: ProjectPurchaser,
  sequelize: Sequelize,
} = db;

const { constants, sequelizeError, dataTime } = require("../../../helper");

exports.getAllTowers = async (req, res) => {
  const search = req.query.search;
  const project = req.params.project;
  const buildingType = req.query.buildingType;
  const sortField = req.query.sortField;
  const sortOrder = req.query.sortOrder ? req.query.sortOrder : "asc";

  let today = "";
  let endDay = "";

  const sortOrderType = req.query.sortOrderType;

  //offset condition
  let offset = req.query.offsetKey;
  offset ? (offset = offset) : (offset = 0);

  let whereStatement = [{ project_id: project }];
  let order = [];

  if (buildingType) whereStatement.push({ building_type: buildingType });

  if (search)
    whereStatement.push({
      building_name: {
        [Op.iLike]: "%" + search + "%",
      },
    });

  if (sortField) {
    order.push([sortField, sortOrder]);
  }

  if (sortOrderType) {
    const dataSort = await constants.towerFilerCase(sortOrderType);
    whereStatement.push(dataSort);
  }

  await ProjectBuilding.findAll({
    offset: offset,
    limit: 10,
    //subQuery: false,
    order: [["id", sortOrder],["projectBuildingProgressDetail", 'id', sortOrder]],
    where: whereStatement,
    attributes: [
      "id",
      "building_name",
      "total_floor",
      [
        Sequelize.fn("to_char", Sequelize.col("estimated_date"), "mm-dd-YYYY"),
        "estimated_date",
      ],
      "issues_sales_deed",
      "funding_source",
      "building_type",
      "total_completion_percentage",
    ],
    include: [
      {
        attributes: [
          "id",
          "stage_of_construction",
          "project_building_id",
          "added_by",
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("projectBuildingProgressDetail.createdAt"),
              "mm-dd-YYYY"
            ),
            "createdAt",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("projectBuildingProgressDetail.submited_on"),
              "mm-dd-YYYY"
            ),
            "submited_on",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col(
                "projectBuildingProgressDetail.tower_commencement_date"
              ),
              "mm-dd-YYYY"
            ),
            "tower_commencement_date",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col(
                "projectBuildingProgressDetail.estimated_completion_date"
              ),
              "mm-dd-YYYY"
            ),
            "estimated_completion_date",
          ],
        ],
        model: BuildingProgressDetail,
        as: "projectBuildingProgressDetail",
        // where: {
        //   "createdAt": 'MAX(created_at)'
        // }
      },
    ],
  })
    .then(async (data) => {
      if (data) {

        let totalRecordsCount = await ProjectBuilding.count({
          where: whereStatement,
        });

        res.send({
          message: constants.messages.getAllBuildingDetails,
          status: constants.statusCode.successCode,
          data: data,
          totalRecords: totalRecordsCount,
        });
      } else {
        const catchErrmsg = await sequelizeError(err);
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.buildingNotFound + project,

        });
      }
    })
    .catch((err) => {
      const catchErrmsg1 = sequelizeError(err);
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.getAllBuildingError + project,
        details: catchErrmsg1,
      });
    });
};

exports.getProgressHistory = async (req, res) => {
  const buildings = req.query.buildings;

  let whereStatement = [{ id: { [Op.in]: buildings } }];

  await ProjectBuilding.findAll({
    subQuery: false,
    where: whereStatement,
    include: [
      {
        attributes: [
          "id",
          "stage_of_construction",
          "project_building_id",
          "added_by",
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("projectBuildingProgressDetail.createdAt"),
              "mm-dd-YYYY"
            ),
            "createdAt",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("projectBuildingProgressDetail.submited_on"),
              "mm-dd-YYYY"
            ),
            "submited_on",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col(
                "projectBuildingProgressDetail.estimated_completion_date"
              ),
              "mm-dd-YYYY"
            ),
            "estimated_completion_date",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col(
                "projectBuildingProgressDetail.tower_commencement_date"
              ),
              "mm-dd-YYYY"
            ),
            "tower_commencement_date",
          ],
        ],
        model: BuildingProgressDetail,
        as: "projectBuildingProgressDetail",
      },
    ],
  })
    .then(async (data) => {
      if (data) {
        res.send({
          message: constants.messages.getAllBuildingDetailsById,
          status: constants.statusCode.successCode,
          data: data,
        });
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.buildingNotFound,
        });
      }
    })
    .catch((err) => {
      const catchErrmsg1 = sequelizeError(err);
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.getAllBuildingError,
        details: catchErrmsg1,
      });
    });
};

exports.getProgressHistoryByTower = async (req, res) => {
  const building = req.params.projectBuilding;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  let subWhereStatement = [];

  if (startDate)
    subWhereStatement.push({
      createdAt: {
        [Op.gte]: moment(startDate).format("YYYY-MM-DD"),
      },
    });

  if (endDate)
    subWhereStatement.push({
      createdAt: {
        [Op.lte]: moment(endDate).format("YYYY-MM-DD"),
      },
    });

  await ProjectBuilding.findByPk(building, {
    subQuery: false,
    include: [
      {
        model: BuildingProgressDetail,
        as: "projectBuildingProgressDetail",
        where: subWhereStatement,
      },
    ],
  })
    .then(async (data) => {
      if (data) {
        res.send({
          message: constants.messages.getAllBuildingDetailsById,
          status: constants.statusCode.successCode,
          data: data,
        });
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.buildingNotFound,
          status: constants.statusCode.notFound,
          data: "",
        });
      }
    })
    .catch((err) => {
      const catchErrmsg1 = sequelizeError(err);
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.getAllBuildingError,
        details: catchErrmsg1,
      });
    });
};

exports.getProgressHistoryByTowerId = async (req, res) => {
  const building = req.params.projectBuilding;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const sortOrderType = req.query.sortOrderType;

  console.log("sortOrderType", sortOrderType);

  let subWhereStatement = [];

  if (sortOrderType) {
    const dataSort = await constants.towerFilerCase(sortOrderType);
    subWhereStatement.push(dataSort);
  }

  if (startDate)
    subWhereStatement.push({
      createdAt: {
        [Op.gte]: moment(startDate).format("YYYY-MM-DD"),
      },
    });

  if (endDate)
    subWhereStatement.push({
      createdAt: {
        [Op.lte]: moment(endDate).format("YYYY-MM-DD"),
      },
    });

  await ProjectBuilding.findOne({
    where: { id: building },

    include: [
      {
        attributes: [
          "id",
          "stage_of_construction",
          "project_building_id",
          "added_by",
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("projectBuildingProgressDetail.createdAt"),
              "mm-dd-YYYY"
            ),
            "createdAt",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("projectBuildingProgressDetail.submited_on"),
              "mm-dd-YYYY"
            ),
            "submited_on",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col(
                "projectBuildingProgressDetail.estimated_completion_date"
              ),
              "mm-dd-YYYY"
            ),
            "estimated_completion_date",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col(
                "projectBuildingProgressDetail.tower_commencement_date"
              ),
              "mm-dd-YYYY"
            ),
            "tower_commencement_date",
          ],
        ],
        model: BuildingProgressDetail,
        as: "projectBuildingProgressDetail",
        where: subWhereStatement,
      },
    ],

    order: [["projectBuildingProgressDetail", "id", "ASC"]],
  })
    .then(async (data) => {
      if (data) {
        res.send({
          message: constants.messages.getAllBuildingDetailsById,
          status: constants.statusCode.successCode,
          data: data,
        });
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.buildingNotFound,
          status: constants.statusCode.notFound,
          data: "",
        });
      }
    })
    .catch((err) => {
      const catchErrmsg1 = sequelizeError(err);
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.getAllBuildingError,
        details: catchErrmsg1,
      });
    });
};
