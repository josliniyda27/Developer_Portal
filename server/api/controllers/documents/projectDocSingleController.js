const db = require("../../model");
const { sequelize: Sequelize, projectDocument: ProjectDocument } = db;
const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

exports.projectDocdetail = async (req, res) => {
  let transaction;
  let docDetails = req.body;
  let finalData = "";
  let message = "";
  transaction = await Sequelize.transaction();
  try {
    if (!docDetails.id) {
      await ProjectDocument.create(docDetails, { transaction }).then((data) => {
        message = constants.messages.ProjectDocSave;
      });
    } else {
      
      await ProjectDocument.update(
        docDetails,
        { where: { id: docDetails.id } },
        { transaction }
      ).then((data) => {
        message = constants.messages.ProjectDocUpdate;
      });
    }
    await transaction.commit();

    await ProjectDocument.findAll({
      where: { project_id: docDetails.project_id },
    }).then((data1) => {
      finalData = data1;
    });

    responseHelper(res, constants.statusCode.successCode, message, finalData);
  } catch (error) {
  
    const catchErrmsg2 = await sequelizeError(error);
    await transaction.rollback();

    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};

exports.deteleDocumentByid = async (req, res) => {
  let documentId = req.body.document_id;
  if (!documentId) {
    res.status(403).send({
      message: "documentId id missing",
      status: 403,
    });
    return;
  }
  try {
    await ProjectDocument.destroy({ where: { id: documentId } }).then(
      (data) => {
        console.log("deteleDocumnetByid.data===>", data);
        if (data === 1) {
          responseHelper(
            res,
            constants.statusCode.successCode,
            constants.messages.documentsingleDetele,
            documentId
          );
        } else {
          responseHelper(
            res,
            constants.statusCode.notFound,
            constants.messages.documentNotFound,
            documentId
          );
        }
      }
    );
  } catch (err) {
    console.log("deteleDocumnetByid.error===>", err);
    responseHelper(
      res,
      constants.statusCode.notFound,
      constants.messages.contactSupport,
      err
    );
  }
};
