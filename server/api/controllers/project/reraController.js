const db = require("../../model");
const config = require("../../middlewares/auth.config");
const {
  projectReraDetail: ProjectReraDetail,
  project: Project,
  projectCompany: ProjectCompany,
} = db;
const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

const jwt = require("jsonwebtoken");
//const bcrypt = require("bcryptjs");
// const reraDetails = Project.hasMany(ProjectReraDetail, {
//   foreignKey: "project_id",
//   onDelete: "SET NULL",
//   as: "reraDetails",
// });

const reraDetails="";

const otpGenerator = require("otp-generator");
// Create and Save a new User
exports.reraDetails = async (req, res) => {
  let Details = req.body;
  let finalData = "";
  let reraDetailLength = Details.reraDetails;

  const reference_no = otpGenerator.generate(10, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: true,
  });

  if (Details.rera_applicable !== true && Details.rera_applicable !== false) {
    res.status(403).send({
      message: "Rera applicable is Missing",
      status: 403,
    });
    return;
  } else if (Details.rera_applicable === true && reraDetailLength.length <= 0) {
    res.status(403).send({
      message: "Rera Details missing",
      status: 403,
    });
    return;
  } else if (!Details.user_id) {
    res.status(403).send({
      message: "User id missing",
      status: 403,
    });
    return;
  }

  // Save Project in the database
  try {
    if (!Details.id) {
      Details.reference_no = reference_no;

      await Project.create(Details, {
        include: [{ association: reraDetails, as: "reraDetails" }],
      }).then((data) => {
        finalData = data;
       
      });

      if (finalData) {
        let projectCompanydata = {
          project_id: finalData.id,
          company_id: Details.company_id,
        };

        await ProjectCompany.create(projectCompanydata).then((data) => {
         
          responseHelper(
            res,
            constants.statusCode.successCode,
            constants.messages.projectInfoCreated,
            finalData
          );
        });
      }
    } else {
      if (!Details.id) {
        res.status(403).send({
          message: "Project id missing",
          status: 403,
        });

        return;
      }
      transaction = await Sequelize.transaction();
      await Project.update(
        Details,
        {
          where: { id: Details.id },
        },
        { transaction }
      ).then((pData) => {
        
        finalData = {
          id: Details.id,
          rera_applicable: Details.rera_applicable,
          reraDetails: [],
        };
      });

      if (Details.reraDetails[0]) {
        if (Details.rera_applicable === true) {
          const reraDetail = Details.reraDetails.map((v) => ({
            ...v,
            project_id: Details.id,
          }));

          await ProjectReraDetail.bulkCreate(
            reraDetail,
            {
              updateOnDuplicate: [
                "id",
                "registration_status",
                "registration_number",
                "autofill_enabled",
                "application_number",
              ],
            },
            { validate: true },
            { transaction }
          ).then((data) => {
            finalData = {
              id: Details.id,
              rera_applicable: Details.rera_applicable,
              reraDetails: data,
            };
          });
        }
      }
      await transaction.commit();
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
    await transaction.rollback();

    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};
