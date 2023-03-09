const {constants} = require("../../../helper");
const db = require("../../model");
const { documentType: DocumentType } = db;

exports.getAllDocumentType= (req, res) => {
    try{
    DocumentType.findAll({
    attributes: ["id", "type"]
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.documentTypeList,
        status: constants.statusCode.successCode,
        data: data,
      });
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.apiError,
        details: err.message,
      });
    });
}catch(error){
    console.log("documentTypeListerror=====>",error)
}
};
