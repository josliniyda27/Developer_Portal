const db = require("../../model");
const {
  sequelize: Sequelize,
  projectDocument: ProjectDocument,
  documentType: DocumentType,
  project: Project,
} = db;
const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

const { Op } = require("sequelize");
const { messages } = require("../../../helper/constants");

exports.projectDocdetail = async (req, res) => {
  let docDetails = req.body;
  let message = "";
  let initialReturn = false;

  docDetails.forEach((element) => {
    if (
    !element.document_url ||
      !element.document_name ||
      !element.document_type_id
    ) {
      initialReturn = true;
    }
  });

  if (initialReturn)
    return responseHelper(
      res,
      constants.statusCode.forbidden,
      "Please provide document details"
    );

  let transaction;
  transaction = await Sequelize.transaction();

  try {
    //check if doc details is null
    if (Array.isArray(docDetails) && docDetails.length > 0) {
      let queriesCreate = [];
      let queriesUpdate = [];
      //loop through for promises and crud operations
      docDetails.forEach((element) => {
        if (!element.id) {
          queriesCreate.push(ProjectDocument.create(element, { transaction }));
        } else {
          queriesUpdate.push(
            ProjectDocument.update(
              element,
              { where: { id: element.id } },
              { transaction }
            )
          );
        }
      });

      //create project document
      const resultsC = await Promise.all(queriesCreate).then((data) => {
        message = constants.messages.ProjectDocSave;
      });

      //update project document
      const resultsU = await Promise.all(queriesUpdate).then((data) => {
        message = constants.messages.ProjectDocUpdate;
      });

      //update project doc
      await Project.update(
        { completed_step: 6 },
        {
          where: {
            id: docDetails[0].project_id,
            completed_step: {
              [Op.lt]: 6,
            },
          },
        },

        { transaction }
      );

      await transaction.commit();
    } else {
      return responseHelper(
        res,
        constants.statusCode.notFound,
        constants.messages.fileuploadempty
      );
    }

    let projectData = "";
    let docData = "";
    let finaldataJson = {};

    //find all project data by project id
    await Project.findAll({
      where: { id: docDetails[0].project_id },
    }).then((data) => {
      projectData = data;
    });

    //find all project doc data by project id
    await ProjectDocument.findAll({
      where: { project_id: docDetails[0].project_id },
    }).then((data) => {
      docData = data;
    });
    try {
      let projectDocumentData = { projectDocument: docData };

      finaldataJson = { ...projectData[0].dataValues, ...projectDocumentData };
    } catch (error) {
      return responseHelper(
        res,
        constants.statusCode.notFound,
        constants,
        messages.apiError
      );
    }

    return responseHelper(
      res,
      constants.statusCode.successCode,
      message,
      finaldataJson
    );
  } catch (error) {
    console.log("projectInformationErr====>", error.name);
    const catchErrmsg2 = await sequelizeError(error);
    await transaction.rollback();
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
    return;
  }
};

///Get the all documents
exports.getAllDocuments = async (req, res) => {
  let projectId = req.params.project;
  let finalData = "";
  let message = "";

  if (!projectId) {
    res.status(403).send({
      message: "Project id missing",
      status: 403,
    });

    return;
  }
  try {
    await ProjectDocument.findAll({
      where: { project_id: projectId },
      attributes: [
        "id",
        "document_url",
        "document_name",
        "remarks",
        "document_type_id",
        [
          Sequelize.fn(
            "to_char",
            Sequelize.col("project_document.createdAt"),
            "mm-dd-YYYY HH24:mi:ss"
          ),
          "createdAt",
        ],
        [
          Sequelize.fn(
            "to_char",
            Sequelize.col("project_document.updatedAt"),
            "mm-dd-YYYY HH24:mi:ss"
          ),
          "updatedAt",
        ],
      ],
      order: ["document_type_id"],
      include: [
        {
          model: DocumentType,
          required: true,
        },
      ],
    }).then((data) => {
      finalData = data;
    });

    responseHelper(res, constants.statusCode.successCode, message, finalData);
  } catch (error) {
    console.log("projectInformationErr====>", error.name);
    const catchErrmsg2 = await sequelizeError(error);
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};

//delete doc by type
exports.deteleDocumentByDocType = async (req, res) => {
  let projectId = req.body.project_id;
  let document_type_id = req.body.document_type_id;
  let docCombineId = {
    project_id: projectId,
    document_type_id: document_type_id,
  };
  if (!projectId) {
    res.status(403).send({
      message: "Project id missing",
      status: 403,
    });
    return;
  }

  if (!document_type_id) {
    res.status(403).send({
      message: "Document type id missing",
      status: 403,
    });
    return;
  }
  try {
    await ProjectDocument.destroy({
      where: { project_id: projectId, document_type_id: document_type_id },
    }).then((data) => {
      if (data) {
        responseHelper(
          res,
          constants.statusCode.successCode,
          constants.messages.documentBulkDetele,
          docCombineId
        );
      } else {
        responseHelper(
          res,
          constants.statusCode.notFound,
          constants.messages.documentNotFound,
          docCombineId
        );
      }
    });
  } catch (err) {
    responseHelper(
      res,
      constants.statusCode.notFound,
      constants.messages.contactSupport,
      err
    );
  }
};
