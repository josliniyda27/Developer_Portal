const { validationResult, check } = require("express-validator");
const db = require("../../model");
const {
  companies: Company,
  project: Project,
  usercompanies: usercompanies,
  users: Users,
  entity: Entity,
  pincode: Pincode,
  cities: City,
  states: State,
} = db;
const { constants } = require("../../../helper");
const { Op } = require("sequelize");
const companyAndMembersRules = () => {
  return [
    check("company")
      .optional({ nullable: true })
      .custom(async (value, { req }) => {
        await Company.count({ where: { id: value } }).then((count) => {
          console.log("count====>", count);
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Please enter a valid company id"),
    check("project")
      .optional({ nullable: true })
      .custom(async (value, { req }) => {
        await Project.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Please enter a valid project id"),
    check("name")
      .notEmpty()
      .withMessage("Company name is required")
      .custom(async (value, { req }) => {
        console.log(req, "req");
        let whereStatement = [{ name: value }];
        if (req.body.company)
          whereStatement.push({ id: { [Op.ne]: req.body.company } });

        await Company.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This name is already taken"),
    check("pan_number")
      .notEmpty()
      .withMessage("Pan number is required")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Please enter a valid pan number")
      .custom(async (value, { req }) => {
        let whereStatement = [{ pan_number: value }];
        if (req.body.company)
          whereStatement.push({ id: { [Op.ne]: req.body.company } });

        await Company.count({ where: whereStatement }).then(async (count) => {
          if (count > 0) {
            let companyId;

            await Company.findAll({
              where: whereStatement,
            }).then(async (data) => {
              if (data.length > 0) {
                companyId = data[0].dataValues.id;
              }
            });

            if (companyId !== 0) {
              await usercompanies
                .findAll({
                  where: { company_id: companyId },
                  include: { model: Users },
                })
                .then(async (data) => {
                  console.log("data===>", data);
                  if (data.length > 0) {
                    let message = await constants.validationResponse(
                      "PAN Card",
                      value,
                      data[0].dataValues.user.mobile
                    );

                    throw new Error(message);
                  }
                });
            }
          }
        });
      }),
    check("entity_id")
      .notEmpty()
      .withMessage("Entity field is required")
      .custom(async (value, { req }) => {
        await Entity.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Entity field is invalid"),
    check("cin_number")
      .notEmpty()
      .withMessage("CIN number is required")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Please enter a valid CIN number")
      .custom(async (value, { req }) => {
        let whereStatement = [{ cin_number: value }];
        if (req.body.company)
          whereStatement.push({ id: { [Op.ne]: req.body.company } });

        await Company.count({ where: whereStatement }).then(async (count) => {
          if (count > 0) {
            let companyId;

            await Company.findAll({
              where: whereStatement,
            }).then(async (data) => {
              if (data.length > 0) {
                companyId = data[0].dataValues.id;
              }
            });

            if (companyId !== 0) {
              await usercompanies
                .findAll({
                  where: { company_id: companyId },
                  include: { model: Users },
                })
                .then(async (data) => {
                  if (data.length > 0) {
                    let message = await constants.validationResponse(
                      "CIN Number",
                      value,
                      data[0].dataValues.user.mobile
                    );

                    throw new Error(message);
                  }
                });
            }
          }
        });
      }),
    check("address_line_1")
      .notEmpty()
      .withMessage("Address line 1 is required"),
    check("state_id")
      .notEmpty()
      .withMessage("State field is required")
      .custom(async (value, { req }) => {
        await State.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("State field is invalid"),
    check("city_id")
      .notEmpty()
      .withMessage("City field is required")
      .custom(async (value, { req }) => {
        await City.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("City field is invalid"),
    check("pincode_id")
      .notEmpty()
      .withMessage("Pincode field is required")
      .custom(async (value, { req }) => {
        await Pincode.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Pincode field is invalid"),
    check("pincode_id")
      .notEmpty()
      .withMessage("Pincode field is required")
      .custom(async (value, { req }) => {
        await Pincode.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Pincode field is invalid"),
    check("entity_id")
      .notEmpty()
      .withMessage("Entity field is required")
      .custom(async (value, { req }) => {
        await Entity.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Entity field is invalid"),
    check("files")
      .optional({ nullable: true })
      .isArray()
      .withMessage("Files field must be an array"),
    check("key_members")
      .optional({ nullable: true })
      .isArray()
      .withMessage("Key members field must be an array"),
    check("contact_persons")
      .optional({ nullable: true })
      .isArray()
      .withMessage("Key members field must be an array"),
    check("files.*.file_name").notEmpty().withMessage("File name is required"),
    check("files.*.file_url").notEmpty().withMessage("File URL is required"),
    check("files.*.document_type")
      .notEmpty()
      .withMessage("Document type is required")
      .isString()
      .withMessage("Document type must be a String")
      .isIn(["panCard", "addressProof"])
      .withMessage("Document type does contain invalid value"),
    check("key_members.*.name")
      .notEmpty()
      .withMessage("Key member name is required"),
    check("key_members.*.designation_id")
      .notEmpty()
      .withMessage("Key member designation is required"),
    check("key_members.*.mobile")
      .notEmpty()
      .withMessage("Key member mobile is required"),
    check("key_members.*.email")
      .notEmpty()
      .withMessage("Key member email is required"),
    check("key_members.*.director_pancard_document_number")
      .notEmpty()
      .withMessage("Key member pan card number is required"),
    check("key_members.*.director_pancard_document_url")
      .notEmpty()
      .withMessage("Key member pan card file URL is required"),
    check("key_members.*.director_pancard_document_name")
      .notEmpty()
      .withMessage("Key member pan card file name is required"),
    check("contact_persons.*.name")
      .notEmpty()
      .withMessage("Contact person name is required"),
    check("contact_persons.*.designation_id")
      .notEmpty()
      .withMessage("Contact person designation is required"),
    check("contact_persons.*.mobile")
      .notEmpty()
      .withMessage("Contact person mobile is required"),
    check("contact_persons.*.email")
      .notEmpty()
      .withMessage("Contact person email is required"),
    // check('username').isEmail().withMessage("the name must have minimum length of 3"),
    // // password must be at least 5 chars long
    // check('password').isLength({ min: 5 }),
  ];
};

const companyAndMembersProjectRules = () => {
  return [
    check("company")
      .optional({ nullable: true })
      .custom(async (value, { req }) => {
        await Company.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Please enter a valid company id"),
    check("project")
      .optional({ nullable: true })
      .custom(async (value, { req }) => {
        await Project.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Please enter a valid project id"),
    check("name")
      .optional({ nullable: true })
      .custom(async (value, { req }) => {
        let whereStatement = [{ name: value }];
        if (req.body.company)
          whereStatement.push({ id: { [Op.ne]: req.body.company } });

        await Company.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This name is already taken"),
    check("pan_number")
      .notEmpty()
      .withMessage("Pan number is required")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Please enter a valid pan number")
      .custom(async (value, { req }) => {
        let whereStatement = [{ pan_number: value }];
        if (req.body.company)
          whereStatement.push({ id: { [Op.ne]: req.body.company } });

        await Company.count({ where: whereStatement }).then(async (count) => {
          if (count > 0) {
            let companyId;

            await Company.findAll({
              where: whereStatement,
            }).then(async (data) => {
              if (data.length > 0) {
                companyId = data[0].dataValues.id;
              }
            });

            if (companyId !== 0) {
              await usercompanies
                .findAll({
                  where: { company_id: companyId },
                  include: { model: Users },
                })
                .then(async (data) => {
                  if (data.length > 0) {
                    let message = await constants.validationResponse(
                      "PAN Card",
                      value,
                      data[0].dataValues.user.mobile
                    );

                    throw new Error(message);
                  }
                });
            }
          }
        });
      }),
    check("entity_id")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Entity field is required")
      .custom(async (value, { req }) => {
        await Entity.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Entity field is invalid"),
    check("cin_number")
      .notEmpty()
      .withMessage("CIN number is required")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Please enter a valid CIN number")
      .custom(async (value, { req }) => {
        let whereStatement = [{ cin_number: value }];
        if (req.body.company)
          whereStatement.push({ id: { [Op.ne]: req.body.company } });

        await Company.count({ where: whereStatement }).then(async (count) => {
          if (count > 0) {
            let companyId;

            await Company.findAll({
              where: whereStatement,
            }).then(async (data) => {
              if (data.length > 0) {
                companyId = data[0].dataValues.id;
              }
            });

            if (companyId !== 0) {
              await usercompanies
                .findAll({
                  where: { company_id: companyId },
                  include: { model: Users },
                })
                .then(async (data) => {
                  if (data.length > 0) {
                    let message = await constants.validationResponse(
                      "CIN Number",
                      value,
                      data[0].dataValues.user.mobile
                    );

                    throw new Error(message);
                  }
                });
            }
          }
        });
      }),
    check("address_line_1")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Address line 1 is required"),
    check("state_id")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("State field is required")
      .custom(async (value, { req }) => {
        await State.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("State field is invalid"),
    check("district_id")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("District field is required")
      .custom(async (value, { req }) => {
        await District.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("District field is invalid"),
    check("city_id")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("City field is required")
      .custom(async (value, { req }) => {
        await City.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("City field is invalid"),
    check("pincode_id")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Pincode field is required")
      .custom(async (value, { req }) => {
        await Pincode.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Pincode field is invalid"),
    check("pincode_id")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Pincode field is required")
      .custom(async (value, { req }) => {
        await Pincode.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Pincode field is invalid"),
    check("entity_id")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Entity field is required")
      .custom(async (value, { req }) => {
        await Entity.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Entity field is invalid"),
    check("files")
      .optional({ nullable: true })
      .isArray()
      .withMessage("Files field must be an array"),
    check("key_members")
      .optional({ nullable: true })
      .isArray()
      .withMessage("Key members field must be an array"),
    check("contact_persons")
      .optional({ nullable: true })
      .isArray()
      .withMessage("Key members field must be an array"),
    check("files.*.file_name").notEmpty().withMessage("File name is required"),
    check("files.*.file_url").notEmpty().withMessage("File URL is required"),
    check("files.*.document_type")
      .notEmpty()
      .withMessage("Document type is required")
      .isString()
      .withMessage("Document type must be a String")
      .isIn(["panCard", "addressProof"])
      .withMessage("Document type does contain invalid value"),
    check("key_members.*.name")
      .notEmpty()
      .withMessage("Key member name is required"),
    check("key_members.*.designation_id")
      .notEmpty()
      .withMessage("Key member designation is required"),
    check("key_members.*.mobile")
      .notEmpty()
      .withMessage("Key member mobile is required"),
    check("key_members.*.email")
      .notEmpty()
      .withMessage("Key member email is required"),
    check("key_members.*.director_pancard_document_number")
      .notEmpty()
      .withMessage("Key member pan card number is required"),
    check("key_members.*.director_pancard_document_url")
      .notEmpty()
      .withMessage("Key member pan card file URL is required"),
    check("key_members.*.director_pancard_document_name")
      .notEmpty()
      .withMessage("Key member pan card file name is required"),
    check("contact_persons.*.name")
      .notEmpty()
      .withMessage("Contact person name is required"),
    check("contact_persons.*.designation_id")
      .notEmpty()
      .withMessage("Contact person designation is required"),
    check("contact_persons.*.mobile")
      .notEmpty()
      .withMessage("Contact person mobile is required"),
    check("contact_persons.*.email")
      .notEmpty()
      .withMessage("Contact person email is required"),
    // check('username').isEmail().withMessage("the name must have minimum length of 3"),
    // // password must be at least 5 chars long
    // check('password').isLength({ min: 5 }),
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
  companyAndMembersRules,
  companyAndMembersProjectRules,
  validate,
};
