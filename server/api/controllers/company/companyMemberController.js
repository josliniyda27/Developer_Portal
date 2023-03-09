"use strict";
const db = require("../../model");
const {
  companies: Company,
  users: Users,
  companyDocument: CompanyDocument,
  companyKeyMember,
  companySupportingMember,
  designations: Designation,
  sequelize: Sequelize,
} = db;
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");
const { tblName: tbN } = dbTableConstatns;
const { check, validationResult } = require("express-validator");


// Save a company details
exports.createOrUpdate = async (req, res) => {
  let companyId = req.body.company;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(constants.statusCode.notFound).json({
      message: errors.array()[0].msg,
      status: constants.statusCode.notFound,
    });
  }


  if (!companyId) {
    res.status(403).send({
      message: "Company id missing",
      status: 403,
    });

    return;
  }

  let transaction;
    try {
      transaction = await Sequelize.transaction();

      if (req.body.files && Array.isArray(req.body.files)) {
        const fileDetails = req.body.files.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await CompanyDocument.bulkCreate(
          fileDetails,
          {
            updateOnDuplicate: ["id"],
          },
          { validate: true },
          { transaction }
        );
      }

      if (req.body.key_members && Array.isArray(req.body.key_members)) {
        const keyMemberDetails = req.body.key_members.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await companyKeyMember.bulkCreate(
          keyMemberDetails,
          {
            updateOnDuplicate: ["id"],
          },
          { validate: true },
          { transaction }
        );
      }

      if (req.body.contact_persons && Array.isArray(req.body.contact_persons)) {
        const contactPersonsDetails = req.body.contact_persons.map((v) => ({
          ...v,
          company_id: companyId,
        }));

        await companySupportingMember.bulkCreate(
          contactPersonsDetails,
          {
            updateOnDuplicate: ["id"],
          },
          { validate: true },
          { transaction }
        );
      }

      await Users.update(
        { is_profile_completed: true },
        { where: { id: req.userId } },
        { transaction }
      ).then((data) => {});

      await transaction.commit();
    } catch (error) {
      console.log("error====>", error);
      const catchErrmsg1 = await sequelizeError(error);
      await transaction.rollback();
      responseHelper(res, constants.statusCode.notFound, catchErrmsg1);
    }

  const companyDBDetails = await Company.findByPk(companyId, {
    include: [CompanyDocument, companyKeyMember, companySupportingMember],
  });

  const companyData = await {
    id: companyDBDetails.id,
    [tbN.name]: companyDBDetails.name,
    [tbN.panNumber]: companyDBDetails.pan_number,
    [tbN.cinNumber]: companyDBDetails.cin_number,
    [tbN.addressLine1]: companyDBDetails.address_line_1,
    [tbN.addressLine2]: companyDBDetails.address_line_2,
    [tbN.addressLine3]: companyDBDetails.address_line_3,
    [tbN.pincodeId]: companyDBDetails.pincode_id,
    [tbN.cityId]: companyDBDetails.city_id,
    [tbN.stateId]: companyDBDetails.state_id,
    [tbN.districtId]: companyDBDetails.district_id,
    [tbN.groupCompanyName]: companyDBDetails.group_company_name,
    [tbN.completedProjectCount]: companyDBDetails.completed_project_count,
    [tbN.completedProjectNames]: companyDBDetails.completed_project_names,
    files: companyDBDetails.company_documents,
    company_key_members: companyDBDetails.company_key_members,
    company_supporting_members: companyDBDetails.company_supporting_members,
  };

  responseHelper(
    res,
    constants.statusCode.successCode,
    constants.messages.companyDetailsUpdatedSuccess,
    companyData
  );
};

exports.validate = (method) => {
  switch (method) {
    case "createOrUpdate": {
      return [
        check("company")
          .notEmpty()
          .withMessage("Company id is required")
          .custom(async (value, { req }) => {
            await Company.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage("Please enter a valid company id"),
          check('files').optional({ nullable: true }).isArray().withMessage("Files field must be an array"),  
          check('key_members').optional({ nullable: true }).isArray().withMessage("Key members field must be an array"),  
          check('contact_persons').optional({ nullable: true }).isArray().withMessage("Key members field must be an array"),  
          check("files.*.file_name").notEmpty().withMessage("File name is required"),
          check("files.*.file_url").notEmpty().withMessage("File URL is required"),
          check("files.*.document_type").notEmpty().withMessage("Document type is required").isString()
          .withMessage('Document type must be a String')
          .isIn(['panCard', 'addressProof'])
          .withMessage('Document type does contain invalid value'),
          check("key_members.*.name").notEmpty().withMessage("Key member name is required"),
          check("key_members.*.designation_id").notEmpty().withMessage("Key member designation is required")
          .custom(async (value, { req }) => {
            await Designation.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage("This designation is not in our collection.Please enter a valid designation"),
          check("key_members.*.mobile").notEmpty().withMessage("Key member mobile is required"),
          check("key_members.*.email").notEmpty().withMessage("Key member email is required"),
          check("key_members.*.director_pancard_document_number").notEmpty().withMessage("Key member pan card number is required"),
          check("key_members.*.director_pancard_document_url").notEmpty().withMessage("Key member pan card file URL is required"),
          check("key_members.*.director_pancard_document_name").notEmpty().withMessage("Key member pan card file name is required"),
          check("contact_persons.*.name").notEmpty().withMessage("Contact person name is required"),
          check("contact_persons.*.designation_id").notEmpty().withMessage("Contact person designation is required")
          .custom(async (value, { req }) => {
            await Designation.count({ where: { id: value } }).then((count) => {
              if (count == 0) {
                throw new Error();
              }
            });
          })
          .withMessage("This designation is not in our collection.Please enter a valid designation"),
          check("contact_persons.*.mobile").notEmpty().withMessage("Contact person mobile is required"),
          check("contact_persons.*.email").notEmpty().withMessage("Contact person email is required"),
        // check('username').isEmail().withMessage("the name must have minimum length of 3"),
        // // password must be at least 5 chars long
        // check('password').isLength({ min: 5 }),
      ];
    }
  }
};


