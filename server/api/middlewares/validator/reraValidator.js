const { body, validationResult, check } = require("express-validator");
const reraValidationRule = () => {
  return [
    body("rera_applicable")
      .isBoolean()
      .withMessage("rera_applicable should be boolean")
      .notEmpty()
      .withMessage("Rera applicable is Missing")
      .custom((value, { req, loc, path }) => {
        if (value == true && req.body.reraDetails.length <= 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("Rera Details missing"),
    body("user_id")
      .notEmpty()
      .withMessage("User id missing")
      .isInt()
      .withMessage("It should be integer")
      .custom((value) => {
        if (value == 0) {
          console.log("value===>", value);
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("Invalid user id"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.map((err) => extractedErrors.push({ message: err.msg, status: 404 }));

  return responseHelper(
    res,
    extractedErrors[0].status,
    extractedErrors[0].message
  );
};

module.exports = {
  reraValidationRule,
  validate,
};
