const { responseHelper } = require("../../../helper");
const { body, validationResult } = require("express-validator");
const db = require("../../model");
const { 
  users: User, 
  designations: Designation, 
  cities: City, 
  roles: Role,
  companies: Company,
  project: Project,
} = db;
const { Op } = require("sequelize");
const userRules = () => {
  return [

    body("email")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Email cannot be empty")
      .custom(async (value, { req }) => {
        const token = req.headers["otp-access-token"];
        let whereStatement = [{ 
            email: value,  
            [Op.or]: [
                { otp_token: { [Op.ne]: token } },
                { otp_token: { [Op.eq]: null } },
            ]
        }];

        await User.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This email address is already registered to the platform, please use another email address"),
    body("mobile")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Mobile cannot be empty")
      .custom(async (value, { req }) => {
        const token = req.headers["otp-access-token"];
        let whereStatement = [{ 
            mobile: value,  
            [Op.or]: [
                { otp_token: { [Op.ne]: token } },
                { otp_token: { [Op.eq]: null } },
            ] 
        }];

        await User.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This mobile number is already registered to the platform, please use another number"),
  ];
};

const createUserRules = () => {
  return [

    body("userName")
      .notEmpty()
      .withMessage("Username cannot be empty")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            username: value,  
        }];

        await User.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This username is already registered by another user"),
    body("userEmail")
      .notEmpty()
      .withMessage("Email cannot be empty")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            email: value,  
        }];

        await User.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This email address is already registered by another user"),
    body("userMobile")
      .notEmpty()
      .withMessage("Mobile cannot be empty")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            mobile: value,   
        }];

        await User.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This mobile number address is already registered by another user"),
    body("designationId")
      .notEmpty()
      .withMessage("Designation is required")
      .custom(async (value, { req }) => {
        await Designation.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This designation is not in our collection.Please enter a valid designation"),
    body("cityId")
      .notEmpty()
      .withMessage("City field is required")
      .custom(async (value, { req }) => {
        await City.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This city is not in our collection.Please enter a valid city"),
    body("roleId")
      .notEmpty()
      .withMessage("Access level field is required")
      .custom(async (value, { req }) => {
        await Role.count({ where: { id: value, name: { [Op.ne]: 'Super Admin' } }}).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This access level is not in our collection.Please enter a valid city"),  
  ];
};

const updateUserRules = () => {
  return [

    body("userName")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Username cannot be empty")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            username: value,  
        }];

        if (req.params.user)
              whereStatement.push({ id: { [Op.ne]: req.params.user } });

        await User.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This username is already registered by another user"),
    body("userEmail")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Email cannot be empty")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            email: value,  
        }];

        if (req.params.user)
              whereStatement.push({ id: { [Op.ne]: req.params.user } });

        await User.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This email address is already registered by another user"),
    body("userMobile")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Mobile cannot be empty")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            mobile: value,   
        }];

        if (req.params.user)
              whereStatement.push({ id: { [Op.ne]: req.params.user } });

        await User.count({ where: whereStatement }).then((count) => {
          if (count > 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This mobile number address is already registered by another user"),
    body("designationId")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Designation is required")
      .custom(async (value, { req }) => {
        await Designation.count({ where: { id: value } }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This designation is not in our collection.Please enter a valid designation"),
    body("cityId")
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
      .withMessage("This city is not in our collection.Please enter a valid city"),
    body("roleId")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Access level field is required")
      .custom(async (value, { req }) => {
        await Role.count({ where: { id: value, name: { [Op.ne]: 'Super Admin' } }}).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("This access level is not in our collection.Please enter a valid city"),
      body("status")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Status field is required")
      .isString()
      .withMessage("Status field must be a String")
      .isIn(["active", "inactive"])
      .withMessage("Status field does contain invalid value"),
      body("projects")
      .optional({ nullable: true })
      .isArray()
      .withMessage("projects field must be an array"),
    body("projects.*").notEmpty().withMessage("Project id is required")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            id: value,  
        }];

        await Project.count({ where: whereStatement }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Please select a valid project"),
    body("companies")
      .optional({ nullable: true })
      .notEmpty()
      .withMessage("Company cannot be empty")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            id: value,  
        }];

        await Company.count({ where: whereStatement }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Please select a valid company"),  
  ];
};

const assignUserCompanyRules = () => {

  return [
    
    body("companyId")
      .notEmpty()
      .withMessage("Company cannot be empty")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            id: value,  
        }];

        await Company.count({ where: whereStatement }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Please select a valid company"),
    body("projects")
      .optional({ nullable: true })
      .isArray()
      .withMessage("projects field must be an array"),
    body("projects.*").notEmpty().withMessage("Project id is required")
      .custom(async (value, { req }) => {
        let whereStatement = [{ 
            id: value,  
        }];

        await Project.count({ where: whereStatement }).then((count) => {
          if (count == 0) {
            throw new Error();
          }
        });
      })
      .withMessage("Please select a valid project")

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
    userRules,
    createUserRules,
    updateUserRules,
    assignUserCompanyRules,
    validate,
};
