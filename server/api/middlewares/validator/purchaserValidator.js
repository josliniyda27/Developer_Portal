const { responseHelper } = require("../../../helper");
const { body, validationResult } = require("express-validator");
const db = require("../../model");
const { 
    builderAccount : BuilderAccount
} = db;
const { Op } = require("sequelize");
const addPurchaseRule = () => {
  return [
    body("total_units")
        .notEmpty()
        .withMessage("Total units is required"),
    body("units_for_sales")
        .notEmpty()
        .withMessage("Units for Sales is required"),
    body("sold_units")
        .notEmpty()
        .withMessage("Sold units is required"),
    body("avg_rate_per_square_feet")
        .notEmpty()
        .withMessage("Average rate per square feet is required"),
    body("total_unsold_inventory")
        .notEmpty()
        .withMessage("Total unsold inventory is required"),
    body("total_value_of_unsold_inventory")
        .notEmpty()
        .withMessage("Total value of unsold inventory is required"),
    body("builder_account_id")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("Builder account cannot be empty")
        .custom(async (value, { req }) => {
        let whereStatement = [{ 
            id: value,  
        }];

        await BuilderAccount.count({ where: whereStatement }).then((count) => {
            if (count == 0) {
            throw new Error();
            }
        });
        })
        .withMessage("Please select a valid builder account"),
    body("payee_name")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("Payee name cannot be empty")
        .custom(async (value, { req }) => {
            if(req.body.builder_account_id && req.body.builder_account_id.length > 0)
                throw new Error('pass shit');

        })
        .withMessage("Please pass either account details or account id"),
        body("account_number")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("Account number cannot be empty")
        .custom(async (value, { req }) => {
            if(req.body.builder_account_id && req.body.builder_account_id.length > 0)
                throw new Error();

        })
        .withMessage("Please pass either account details or account id"),
        body("account_type")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("Account type cannot be empty")
        .custom(async (value, { req }) => {
            if(req.body.builder_account_id && req.body.builder_account_id.length > 0)
                throw new Error();

        })
        .withMessage("Please pass either account details or account id"), 
        body("bank")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("Bank cannot be empty")
        .custom(async (value, { req }) => {
            if(req.body.builder_account_id && req.body.builder_account_id.length > 0)
                throw new Error();

        })
        .withMessage("Please pass either account details or account id"),  
        body("ifsc_code")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("IFSC code cannot be empty")
        .custom(async (value, { req }) => {
            if(req.body.builder_account_id && req.body.builder_account_id.length > 0)
                throw new Error();

        })
        .withMessage("Please pass either account details or account id"), 
        body("file_name")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("File name code cannot be empty")
        .custom(async (value, { req }) => {
            if(req.body.builder_account_id && req.body.builder_account_id.length > 0)
                throw new Error();

        })
        .withMessage("Please pass either account details or account id"),           
        body("file_url")
        .optional({ nullable: true })
        .notEmpty()
        .withMessage("File url code cannot be empty")
        .custom(async (value, { req }) => {
            if(req.body.builder_account_id && req.body.builder_account_id.length > 0)
                throw new Error();

        })
        .withMessage("Please pass either account details or account id"),
        body("purchaser")
        .notEmpty()
        .isArray()
        .withMessage("Purchaser field must be an array"), 
        body("purchaser.*.unit_type")
        .notEmpty()
        .withMessage("Unit type is required")
        .isString()
        .withMessage("Unit type must be a String")
        .isIn(["tower", "bungalow"])
        .withMessage("Unit type does contain invalid value"),       
           
    
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
    addPurchaseRule,
    validate,
};
