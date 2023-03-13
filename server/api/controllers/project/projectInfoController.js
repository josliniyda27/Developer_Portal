const db = require("../../model");
const {
  project: Project,
  projectBuildingCategory: ProjectBuildingCategory,
  sequelize: Sequelize,
  projectReraDetail: ProjectReraDetail,
  buildingCategory: BuildingCategory,
  projectCompany: ProjectCompany,
  companies: Companies,
  companyDocument: CompanyDocument,
  companyKeyMember: CompanyKeyMember,
  companySupportingMember: CompanySupportingMember,

  designations: Designations,
  states: States,
  pincode: Pincode,
  cities: City,
  entity: Entity,
  district: District,
  area: Area,
  taluka: Taluka,
  userProjects: UserProjects,
  users: User,
} = db;
const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");
const { projectAddressDetail } = require("../../model");

exports.projectInformation = async (req, res) => {
  let projectDetails = req.body;
  console.log(projectDetails.rera_applicable, "rera_applicable");

  let transaction;

  if (!projectDetails.id) {
    res.status(constants.statusCode.forbidden).send({
      message: "Project id missing",
      status: constants.statusCode.forbidden,
    });
    return;
  }

  transaction = await Sequelize.transaction();
  let finalData = "";
  try {
    await Project.update(
      projectDetails,
      {
        where: { id: projectDetails.id },
      },
      { transaction }
    ).then(async (data) => {
      await Project.findAll({
        where: { id: projectDetails.id },

        order: [["projectCategories", "id", "asc"]],
        include: [
          {
            model: ProjectBuildingCategory,
            as: "projectCategories",
            attributes: [
              "id",
              "total_units",
              "sold_units",
              "rate_per_square_feet",
              "unsold_units",
              "project_id",
              "building_category_id",
            ],
          },
        ],
      }).then((data1) => {
        console.log("Category1.data===>", data1);
        finalData = data1;
      });
    });

    if (projectDetails.projectCategories) {
      const buildingCatDetails = projectDetails.projectCategories.map((v) => ({
        ...v,
        project_id: projectDetails.id,
      }));

      await ProjectBuildingCategory.bulkCreate(
        buildingCatDetails,
        {
          updateOnDuplicate: [
            "id",
            "total_units",
            "rate_per_square_feet",
            "unsold_units",
            "sold_units",
            "rate_per_square_feet",
            "building_category_id",
          ],
          where: { id: ["id"] },
        },
        { transaction }
      ).then(async (data) => {
        await Project.findAll({
          where: { id: projectDetails.id },
          order: [["projectCategories", "id", "asc"]],
          include: [
            {
              model: ProjectBuildingCategory,
              as: "projectCategories",
              attributes: [
                "id",
                "total_units",
                "sold_units",
                "rate_per_square_feet",
                "unsold_units",
                "project_id",
                "building_category_id",
              ],
            },
          ],
        }).then((data) => {
          console.log("Category1.data===>", data);
          finalData = data;
        });
      });
    }

    await transaction.commit();
    responseHelper(
      res,
      constants.statusCode.successCode,
      constants.messages.projectInfoCreated,
      finalData
    );
  } catch (error) {
    console.log("projectInformationErr====>", error);
    const catchErrmsg2 = await sequelizeError(error);
    await transaction.rollback();
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};

exports.getAllProjectInfo = (req, res) => {
  let ProjectId = req.body.project_id;

  if (!ProjectId) {
    res.status(403).send({
      message: "Project id missing",
      status: 403,
    });
    return;
  }
  try {
    Project.findAll({
      where: { id: ProjectId },
      attributes: {
        include: [
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("projects.createdAt"),
              "mm-dd-YYYY"
            ),
            "createdAt",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("projects.submitted_date"),
              "mm-dd-YYYY"
            ),
            "submitted_date",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("projects.updatedAt"),
              "mm-dd-YYYY"
            ),
            "updatedAt",
          ],
        ],
        //exclude: ["createdAt"],
      },
      include: [
        {
          model: ProjectReraDetail,
          as: "reraDetails",
        },
        {
          model: ProjectBuildingCategory,
          as: "projectCategories",

          include: [{ model: BuildingCategory }],
        },
        {
          model: projectAddressDetail,
          include: [States, Pincode, City, District, Area, Taluka],
        },
        {
          model: ProjectCompany,
          as: "projectCompany",
          separate: true,
          attributes: {
            exclude: ["createdAt", "updatedAt", "company_id", "id"],
          },
          include: [
            {
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "company_id",
                  "city_id",
                  "state_id",
                  "deletedAt",
                  "pincode_id",
                ],
              },
              model: Companies,
              include: [
                States,
                Pincode,
                City,
                Entity,
                { model: CompanyDocument },
                {
                  model: CompanySupportingMember,
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
                    { attributes: ["id", "name", "type"], model: Designations },
                  ],
                },
                {
                  model: CompanyKeyMember,
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
                    { attributes: ["id", "name", "type"], model: Designations },
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
          message: constants.messages.Projectinfoselection,
          status: constants.statusCode.successCode,
          data: data,
        });
      })
      .catch((err) => {
        res.status(constants.statusCode.serverError).send({
          message: constants.messages.apiError,
          data: err.message,
          status: constants.statusCode.notFound,
        });
      });
  } catch (error) {
    res.status(constants.statusCode.serverError).send({
      message: constants.messages.notFound,
      data: err.message,
      status: constants.statusCode.notFound,
    });
  }
};

exports.getCompanyInfoByProject = (req, res) => {
 
  let ProjectId = req.body.project_id;

  if (!ProjectId) {
    res.status(403).send({
      message: "Project id missing",
      status: 403,
    });
    return;
  }
  try {
    Project.findAll({
      where: { id: ProjectId },
      include: [
        {
          model: ProjectCompany,
          as: "projectCompany",
          separate: true,
          attributes: {
            exclude: ["createdAt", "updatedAt", "company_id", "id"],
          },
          include: [
            {
              attributes: {
                exclude: [
                  "createdAt",
                  "updatedAt",
                  "company_id",
                  "id",
                  "city_id",
                  "state_id",
                  "entity_id",
                  "entity_id",
                  "deletedAt",
                  "pincode_id",
                ],
              },
              model: Companies,
              include: [
                States,
                Pincode,
                City,
                { model: CompanyDocument },
                {
                  model: CompanySupportingMember,
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
                    { attributes: ["id", "name", "type"], model: Designations },
                  ],
                },
                {
                  model: CompanyKeyMember,
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
                    { attributes: ["id", "name", "type"], model: Designations },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
      .then(async (data) => {
        if (data[0]) {
          res.send({
            message: constants.messages.Projectinfoselection,
            status: constants.statusCode.successCode,
            data: data[0].projectCompany[0],
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

exports.getCompanyProjects = (req, res) => {
  let companyId = req.params.company;

  if (!companyId) {
    res.status(403).send({
      message: "Company id missing",
      status: 403,
    });
    return;
  }
  try {
    Companies.findByPk(companyId, {
      include: [
        {
          model: Project,
          as: "projects",
          include: [
            {
              model: ProjectReraDetail,
              as: "reraDetails",
            },
            {
              model: ProjectBuildingCategory,
              as: "projectCategories",

              include: [{ model: BuildingCategory }],
            },
            {
              model: projectAddressDetail,
              include: [States, Pincode, City],
            },
            {
              model: ProjectCompany,
              as: "projectCompany",
              separate: true,
              attributes: {
                exclude: ["createdAt", "updatedAt", "company_id", "id"],
              },
              include: [
                {
                  attributes: {
                    exclude: [
                      "createdAt",
                      "updatedAt",
                      "company_id",
                      "city_id",
                      "state_id",
                      "deletedAt",
                      "pincode_id",
                    ],
                  },
                  model: Companies,
                  include: [
                    States,
                    Pincode,
                    City,
                    Entity,
                    { model: CompanyDocument },
                    {
                      model: CompanySupportingMember,
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
                        {
                          attributes: ["id", "name", "type"],
                          model: Designations,
                        },
                      ],
                    },
                    {
                      model: CompanyKeyMember,
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
                        {
                          attributes: ["id", "name", "type"],
                          model: Designations,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
      .then(async (data) => {
        if (data) {
          res.send({
            message: constants.messages.ProjectinfoByCompany,
            status: constants.statusCode.successCode,
            data: data.projects,
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

exports.getCompanyProjectsForSelection = (req, res) => {
  let companyId = req.params.company;

  if (!companyId) {
    res.status(403).send({
      message: "Company id missing",
      status: 403,
    });
    return;
  }
  try {
    Companies.findByPk(companyId, {
      include: [
        {
          model: Project,
          as: "projects",
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    })
      .then(async (data) => {
        if (data) {
          res.send({
            message: constants.messages.ProjectinfoByCompanyForSelection,
            status: constants.statusCode.successCode,
            data: data.projects,
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

exports.getProjectsforCompany = (req, res) => {
  let companyId = req.params.company;
  let limit = req.query.limitKey;
  //let projectNameKey = req.query.nameSearchKey;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  //let whereStatement = "";
  let finalData = {};

  limit ? (limit = limit) : (limit = 12);

  offset ? (offset = offset) : (offset = "0");

  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "asc");

  if (!companyId) {
    res.status(403).send({
      message: "Company id missing",
      status: 403,
    });
    return;
  }
  try {
    ProjectCompany.findAll({
      where: { company_id: companyId },
      attributes: ["project_id"],
      limit: limit,
      offset: offset,
      include: [
        {
          model: Project,
          attributes: [
            "name",
            "status",
            [
              Sequelize.fn(
                "to_char",
                Sequelize.col("project.createdAt"),
                "mm-dd-YYYY"
              ),
              "createdAt",
            ],
            [
              Sequelize.fn(
                "to_char",
                Sequelize.col("project.submitted_date"),
                "mm-dd-YYYY"
              ),
              "submitted_date",
            ],
          ],
          order: ["id", orderByKey],
          include: [
            {
              model: UserProjects,
              attributes: ["user_id"],
              as: "projectUserDetails",

              include: [
                {
                  model: User,
                  attributes: ["status"],
                  as: "UserProjectDetails",
                },
              ],
            },
            {
              model: projectAddressDetail,
              attributes: ["id"],
              include: [{ model: City, attributes: ["name"] }],
            },
          ],
        },
      ],
    })
      .then(async (data) => {
        console.log(data);
        if (data.length > 0) {
          data.forEach((user) => {
            let activeUserCount = 0;
            let totalUserCount = 0;
            if (
              user.dataValues.project.dataValues.projectUserDetails.length > 0
            ) {
              user.dataValues.project.dataValues.projectUserDetails.forEach(
                (pDetails) => {
                  console.log(pDetails.dataValues.UserProjectDetails);
                  totalUserCount += 1;
                  if (
                    pDetails.dataValues.UserProjectDetails.status === "Active"
                  ) {
                    activeUserCount += 1;
                  }
                }
              );
            }
            user.dataValues.activeUserCount = activeUserCount;
            user.dataValues.totalUserCount = totalUserCount;
            // data.projects.dataValues=1;
          });
          // data.push({ totalRecords: data.length });
        }

        if (data) {
          return res.send({
            message: constants.messages.ProjectinfoByCompany,
            status: constants.statusCode.successCode,
            data: data,
            totalRecords: data.length,
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
