const { responseHelper } = require("../../../helper");
const { body, validationResult } = require("express-validator");
const projectRules = () => {
  return [
    body("id").notEmpty().withMessage("Project id missing"),
    body("tab")
      .notEmpty()
      .withMessage("Select proper tab")
      .custom((value, { req, loc, path }) => {
        if (value !== "projectInfo" && value !== "constructionFin") {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("Tab type is invalid"),
    body("name")
      .custom((value, { req, loc, path }) => {
        if (value === "projectInfo" && !req.body.name) {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("Project name missing"),
    body("projectCategories")
      .custom((value, { req, loc, path }) => {
        if (req.body.tab === "projectInfo" && !Array.isArray(value)) {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("ProjectCategories should be array"),
    body("projectCategories")
      .custom((value, { req, loc, path }) => {
        if (req.body.tab === "projectInfo" && value.length <= 0) {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("projectCategories missing"),
    body("contact_person_name")
      .custom((value, { req, loc, path }) => {
        if (req.body.tab === "projectInfo" && !value) {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("Contact Person Name is missing"),
    body("contact_person_designation")
      .custom((value, { req, loc, path }) => {
        if (req.body.tab === "projectInfo" && !value) {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("Contact Person Designation is missing"),
    body("contact_person_mobile")
      .custom((value, { req, loc, path }) => {
        if (req.body.tab === "projectInfo" && !value) {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("Contact Person Mobile is missing"),
    body("cover_image")
      .custom((value, { req, loc, path }) => {
        if (req.body.tab === "projectInfo" && !value) {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("Cover image is missing"),
    body("mortaged_institution")
      .custom((value, { req, loc, path }) => {
        if (
          req.body.project_mortaged == true &&
          req.body.tab === "constructionFin" &&
          !value
        ) {
          throw new Error();
        } else {
          return true;
        }
      })
      .withMessage("Mortaged institution is missing"),
  ];
};

const projectAddressRules = () => {
  return [
    body("project_id").notEmpty().withMessage("Project id missing"),
    body("address_line_1").notEmpty().withMessage("Address line 1 missing"),
    body("state_id").notEmpty().withMessage("State id missing"),
    body("city_id").notEmpty().withMessage("City id missing"),
    body("district_id").notEmpty().withMessage("District id missing"),
    body("area_id").notEmpty().withMessage("Area id missing"),
    //body("taluka_id").notEmpty().withMessage("Thaluk id missing"),
    body("pincode_id").notEmpty().withMessage("Pincode missing"),
  ];
};

const projectDocRules = () => {
  return [
    //body("project_id").notEmpty().withMessage("Project id missing"),
    body("document_url").notEmpty().withMessage("document url required"),
    body("document_name").notEmpty().withMessage("document name required"),
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
  projectRules,
  projectAddressRules,
  projectDocRules,
  validate,
};
