const { responseHelper } = require("../../../helper");
const { body, validationResult } = require("express-validator");
const db = require("../../model");
const { 
    query: Query,
    queryCommunications: QueryCommunications,
} = db;
const { Op } = require("sequelize");
const queryCommunicationRules = () => {
  return [
    body("message")
      .optional({ nullable: true })
      .custom(async (value, { req }) => {

        const queryId = req.params.query;

        await Query.findByPk(queryId).then((queryData) => {
          if (queryData.type == 'document' && value.length > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Only documents are accepted in communication"),
    body("documentName")
      .optional({ nullable: true })
      .custom(async (value, { req }) => {

        const queryId = req.params.query;

        await Query.findByPk(queryId).then((queryData) => {
          if (queryData.type == 'document' && value.length == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Document name is required"),
    body("documentUrl")
      .optional({ nullable: true })
      .custom(async (value, { req }) => {

        const queryId = req.params.query;

        await Query.findByPk(queryId).then((queryData) => {
          if (queryData.type == 'document' && value.length == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Document URL is required"),  
  ];
};

const submitNewDateRules = () => {
  return [
    body("last_submission_date").notEmpty().withMessage("Last submission date is missing"),
  ];
};


const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors
    .array()
    .map((err) => extractedErrors.push({ message: err.msg, status: 404 }));

  return responseHelper(
    res,
    extractedErrors[0].status,
    extractedErrors[0].message
  );
};

module.exports = {
    queryCommunicationRules,
    submitNewDateRules,
    validate,
};
