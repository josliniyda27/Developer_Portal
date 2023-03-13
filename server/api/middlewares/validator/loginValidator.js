const { validationResult } = require("express-validator");
const loginValidationRules = () => {};

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
  loginValidationRules,
  validate,
};
