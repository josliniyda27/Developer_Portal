const db = require("../../model");
const {
  projectReraDetail: ProjectReraDetail,
  project: Project,
  projectBuildingCategory: ProjectBuildingCategory,
  userProjects: UserProjects,
  userProjects: Userprojects,
} = db;
const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

const reraDetails = Project.hasMany(ProjectReraDetail, {
  foreignKey: "project_id",
  onDelete: "SET NULL",
  as: "reraDetails",
});

const otpGenerator = require("otp-generator");
// Create and Save a new User
exports.reraDetails = async (req, res) => {

  let transaction;
  let Details = req.body;
  let finalData = "";

  const reference_no = otpGenerator.generate(10, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: true,
  });

  // Save Project in the database
  try {
    if (!Details.id) {
      Details.reference_no = reference_no;
      Details.completed_step = 1;
      Details.created_by=req.userId;

      //console.log("Details",Details);

      if (Details.reraDetails.length > 0) {
        Details.reraDetails.forEach((item) => {
          delete item.id;
          if (!item.application_number) {
            item.application_number = null;
          }
          if (!item.registration_number) {
            item.registration_number = null;
          }
        });
      }

      await Project.create(Details, {
        include: [{ association: reraDetails, as: "reraDetails" }],
      }).then((projectData) => {
        return UserProjects.create(
          {
            user_id: Details.user_id,
            project_id: projectData.id,
            assigned_by: Details.user_id,
          },
          {
            include: [{ association: reraDetails, as: "reraDetails" }],
          }
        ).then((userProjectData) => {
          responseHelper(
            res,
            constants.statusCode.successCode,
            constants.messages.projectInfoCreated,
            projectData
          );
        });
      });
    } else {
      //validating project id
      if (!Details.id) {
        res.status(403).send({
          message: "Project id missing",
          status: 403,
        });
        return;
      }

      // transaction = await Sequelize.transaction();

      await Project.update(Details, {
        where: { id: Details.id },
      }).then((pData) => {
        finalData = {
          id: Details.id,
          rera_applicable: Details.rera_applicable,
          reraDetails: [],
        };
      });

      if (Details.rera_applicable === false) {
        await ProjectReraDetail.destroy({
          where: { project_id: Details.id },
        }).then((dData) => {});
      }

      if (Details.reraDetails[0]) {
        if (Details.rera_applicable === true) {
          const reraDetail = await Details.reraDetails.map((v) => ({
            ...v,
            project_id: Details.id,
          }));

          let queriesCreate = [];
          let queriesUpdate = [];

          reraDetail.forEach((element) => {
            // console.log("application".application_number);
            if (!element.application_number) {
              element.application_number = null;
            }
            if (!element.registration_number) {
              element.registration_number = null;
            }
            ///console.log("element.element.application_number",element.application_number);
            if (!element.id) {
              // console.log("!element.1===>", element.id);
              queriesCreate.push(ProjectReraDetail.create(element));
            } else {
              // console.log("!element.2===>", element.id);
              queriesUpdate.push(
                ProjectReraDetail.update(element, {
                  where: { id: element.id },
                })
              );
            }
          });

          //create and update parallel
          const resultsC = await Promise.all(queriesCreate);
          const resultsU = await Promise.all(queriesUpdate);
        }
      }

      //findAll projects
      await Project.findAll({
        where: { id: Details.id },
        order: [["reraDetails", "id", "asc"]],
        include: [
          {
            model: ProjectReraDetail,
            as: "reraDetails",
          },
          {
            model: ProjectBuildingCategory,
            as: "projectCategories",
          },
        ],
      }).then(async (data) => {
        finalData = data;
      });
      // await transaction.commit();
      responseHelper(
        res,
        constants.statusCode.successCode,
        constants.messages.reraOperationsUpdate,
        finalData
      );
    }
  } catch (error) {
    console.log("projectInformationErr====>", error.name);
    const catchErrmsg2 = await sequelizeError(error);
    //await transaction.rollback();
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};
