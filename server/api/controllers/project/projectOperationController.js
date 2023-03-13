const db = require("../../model");
const {
  users: User,
  project: Project,
  projectBuildingCategory: ProjectBuildingCategory,
  sequelize: Sequelize,
  projectReraDetail: ProjectReraDetail,
  buildingCategory: BuildingCategory,
  projectCompany: ProjectCompany,
  companies: Companies,
  companyDocument: CompanyDocument,
  companyKeyMember: CompanyKeyMember,
  companySupportingMember: CompanySupportingMember,
  designations: Designations,
  states: States,
  pincode: Pincode,
  cities: City,
  entity: Entity,
  area: Area,
  projectAddressDetail: ProjectAddressDetail,
  userProjects: Userproject,
  taluka: Taluka,
  projectDocument: ProjectDocument,
  documentType: DocumentType,
} = db;
const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");
const { sfConst } = constants;

import sfConnectionVariable from "../../../common/sf.config";
const { sfConn: SfConn, sfAuth: SfAuth } = sfConnectionVariable;

const { Op } = require("sequelize");
const moment = require("moment");

const commonLogs = require("../../../common/logger.js");

exports.projectInformation = async (req, res) => {
  let projectDetails = req.body;

  if (projectDetails.tab === "projectInfo") {
    delete projectDetails.mortaged_institution;
    delete projectDetails.cf_loan_number;
    delete projectDetails.project_mortaged;
  }

  delete projectDetails.rera_applicable;
  delete projectDetails.submitted_date;

  let transaction;

  //check if project id
  if (!projectDetails.id) {
    res.status(constants.statusCode.notFound).send({
      message: constants.messages.projectIdmissing,
      status: constants.statusCode.notFound,
    });
    return;
  }

  //transaction started
  transaction = await Sequelize.transaction();
  let finalData = "";

  try {
    const project_data = await Project.findAll({
      where: { id: projectDetails.id },
      attributes: ["completed_step"],
      raw: true,
    });

    //for stepper purpose
    if (project_data) {
      if (
        projectDetails.tab === "projectInfo" &&
        project_data[0].completed_step < 2
      ) {
        projectDetails.completed_step = 2;
      } else if (
        projectDetails.tab === "constructionFin" &&
        project_data[0].completed_step < 4
      ) {
        projectDetails.completed_step = 4;
      }
    }

    //for stepper purpose
    await Project.update(
      projectDetails,
      {
        where: { id: projectDetails.id },
      },
      { transaction }
    ).then(async (data) => {
      await Project.findAll({
        where: { id: projectDetails.id },

        order: [["projectCategories", "id", "asc"]],
        include: [
          {
            model: ProjectBuildingCategory,
            as: "projectCategories",
            attributes: [
              "id",
              "total_units",
              "sold_units",
              "rate_per_square_feet",
              "unsold_units",
              "project_id",
              "building_category_id",
            ],
          },
        ],
      }).then((data1) => {
        finalData = data1;
      });
    });

    if (projectDetails.projectCategories) {
      const buildingCatDetails = await projectDetails.projectCategories.map(
        (v) => ({
          ...v,
          project_id: projectDetails.id,
        })
      );

      let queriesCreate = [];
      let queriesUpdate = [];
      let queriesDelete = [];

      //foreach for promise and crud operations
      buildingCatDetails.forEach((element) => {
        if (!element.id) {
          //console.log("!element.1===>", element.id);
          if (element.building_category_id)
            queriesCreate.push(
              ProjectBuildingCategory.create(element, { transaction })
            );
        } else {
          //console.log("!element.2===>", element.deletedAt);
          // const IsoDateTo = moment(element.deletedAt).format("YYYY-MM-DD");
          if (element.deletedAt) {
            //console.log("!element.deteledAt===>", element.deletedAt);
            queriesDelete.push(
              ProjectBuildingCategory.destroy(
                {
                  where: { id: element.id },
                },
                { validate: true },
                { transaction }
              )
            );
          }

          if (element.building_category_id) delete element.building_category_id;

          queriesUpdate.push(
            ProjectBuildingCategory.update(
              element,
              {
                where: { id: element.id },
              },
              { transaction }
            )
          );
        }
      });

      //create update and delete parallel
      const resultsC = await Promise.all(queriesCreate);
      const resultsU = await Promise.all(queriesUpdate);
      const resultsD = await Promise.all(queriesDelete);
    }

    //commit transaction
    await transaction.commit();

    //find the projects
    await Project.findAll({
      where: { id: projectDetails.id },
      order: [
        ["reraDetails", "id", "asc"],
        ["projectCategories", "id", "asc"],
      ],
      include: [
        {
          model: ProjectReraDetail,
          as: "reraDetails",
        },
        {
          model: ProjectBuildingCategory,
          as: "projectCategories",
        },
      ],
    }).then((data) => {
      // console.log("Category1.data===>", data);
      finalData = data;
    });
    responseHelper(
      res,
      constants.statusCode.successCode,
      constants.messages.projectInfoCreated,
      finalData
    );
  } catch (error) {
    console.log("projectInformationErr====>", error);
    const catchErrmsg2 = await sequelizeError(error);
    await transaction.rollback();
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};

//get all projects info
exports.getAllProjectInfo = (req, res) => {
  //console.log("req===>", req.body);
  let ProjectId = req.body.project_id;

  Project.findAll({
    where: { id: ProjectId },
    include: [
      {
        model: ProjectReraDetail,
        as: "reraDetails",
      },
      {
        model: ProjectBuildingCategory,
        as: "projectCategories",
        include: [models.ProjectCategories.building_category_id],
      },
    ],
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.Projectinfoselection,
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
};

//submit projects
exports.submitProject = async (req, res) => {
  let sfSynch = req.app.locals.sfSynch;
  let projectDetails = req.body;

  projectDetails.status = "pending";

  //let sf_Tb_Name=

  //let transaction;

  if (!projectDetails.project_id) {
    res.status(constants.statusCode.notFound).send({
      message: constants.messages.projectIdmissing,
      status: constants.statusCode.notFound,
    });

    return;
  }

  if (!projectDetails.submitted_date) {
    res.status(constants.statusCode.notFound).send({
      message: constants.messages.submittedDateMissing,
      status: constants.statusCode.notFound,
    });

    return;
  }
  let updated = false;
  //transaction = await Sequelize.transaction();
  try {
    await Project.update(projectDetails, {
      where: { id: projectDetails.project_id },
    }).then(async (data) => {
      if (data[0] === 1) {
        updated = true;
      }
    });

    //await transaction.commit();
    if (updated) {
      try {
        await Project.findAll({
          where: { id: projectDetails.project_id },
          // attributes:['projectCategories.projectCategories->building_category.name'],
          //attributes:["projects.id"],
          include: [
            {
              model: ProjectReraDetail,
              as: "reraDetails",
            },
            {
              model: ProjectAddressDetail,
              include: [States, Pincode, City, Area],
            },
            {
              model: ProjectBuildingCategory,
              as: "projectCategories",

              include: [{ model: BuildingCategory }],
            },
            {
              model: ProjectDocument,
              as: "projectDocument",
              include: [{ model: DocumentType }],
            },
            {
              model: ProjectCompany,
              as: "projectCompany",
              separate: true,
              attributes: {
                exclude: ["createdAt", "updatedAt", "company_id", "id"],
              },
              include: [
                {
                  attributes: {
                    exclude: [
                      "updatedAt",
                      "company_id",
                      "city_id",
                      "state_id",
                      "deletedAt",
                      "pincode_id",
                    ],
                  },
                  model: Companies,
                  include: [
                    States,
                    Pincode,
                    City,
                    Entity,
                    {
                      model: User,
                      as: "companiesUsers",
                      include: [
                        {
                          attributes: ["id", "name", "type"],
                          model: Designations,
                        },
                      ],
                    },
                    { model: CompanyDocument },
                    {
                      model: CompanySupportingMember,
                      attributes: {
                        exclude: [
                          "company_id",
                          "designation_id",
                          "deletedAt",
                          "createdAt",
                        ],
                      },
                      separate: true,
                      include: [
                        {
                          attributes: ["id", "name", "type"],
                          model: Designations,
                        },
                      ],
                    },
                    {
                      model: CompanyKeyMember,
                      attributes: {
                        exclude: [
                          "company_id",
                          "designation_id",
                          "deletedAt",
                          "createdAt",
                        ],
                      },
                      separate: true,
                      include: [
                        {
                          attributes: ["id", "name", "type"],
                          model: Designations,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        }).then(async (data) => {
          if (data.length > 0) {
            res.send({
              message: constants.messages.submittedProject,
              status: constants.statusCode.successCode,
              data: data,
            });

            //Sf background CRUD
            let projectData = data[0].dataValues;
            let SfCreateJson = {};

            let projectCompanyData = projectData.projectCompany[0].dataValues;
            let companyData = projectCompanyData.company.dataValues;

            let state =
              projectCompanyData.company.dataValues.state.dataValues.name;

            let pincode =
              projectCompanyData.company.dataValues.pincode.dataValues.pincode;

            let city =
              projectCompanyData.company.dataValues.city.dataValues.name;

            //SF registeredUser
            let registeredUser =
              projectCompanyData.company.dataValues.companiesUsers.dataValues;

            let registeredUserDesignation =
              projectCompanyData.company.dataValues.companiesUsers.dataValues
                .designation.dataValues.name;

            //SF ContactPerson
            let contactPersonDetails =
              projectCompanyData.company.dataValues
                .company_supporting_members[0].dataValues;

            let contactPersonDesignation =
              contactPersonDetails.designation.dataValues.name;

            //SF keyMembers
            let keyMembers =
              projectCompanyData.company.dataValues.company_key_members[0]
                .dataValues;
            let keyMemberDesignation = keyMembers.designation.dataValues.name;

            //SF projectAddressDetail

            let projectAddressDetail =
              projectData.project_address_detail.dataValues;

            let projectAddressState =
              projectAddressDetail.state.dataValues.name;

            let projectAddressCity = projectAddressDetail.city.dataValues.name;

            let projectAddressArea = projectAddressDetail.area.dataValues.name;

            let projectAddressPincode =
              projectAddressDetail.pincode.dataValues.pincode;

            SfCreateJson = {
              HDFC_DP_BUILDERID__c: companyData.id,
              Name: companyData.name,
              HDFC_DP_CIN_NO__c: companyData.cin_number,
              HDFC_DP_PAN_NO__c: companyData.pan_number,
              HDFC_DP_ADDRESS_LINE1__c: companyData.address_line_1,
              HDFC_DP_ADDRESS_LINE2__c: companyData.address_line_2,
              HDFC_DP_ADDRESS_LINE3__c: companyData.address_line_3,
              HDFC_DP_City__c: city,
              HDFC_DP_STATE__c: state,
              HDFC_DP_PINCODE__c: pincode,
              HDFC_DP_Created_Date__c: companyData.createdAt,
              HDFC_DP_project_completed_previously__c:
                companyData.completed_project_names,
              HDFC_DP_Is_Group_Company__c: companyData.is_group_company,
              HDFC_DP_registered_by_user_name__c: registeredUser.username,
              HDFC_DP_registered_by_email_id__c: registeredUser.email,
              HDFC_DP_registered_by_mobile_number__c: registeredUser.mobile,
              HDFC_DP_contact_person_name__c: contactPersonDetails.name,
              HDFC_DP_contact_person_email__c: contactPersonDetails.email,
              HDFC_DP_contact_person_mobile_number__c:
                contactPersonDetails.mobile,
              HDFC_DP_contact_person_designation__c: contactPersonDesignation,

              HDFC_DP_Key_Member_Designation__c: keyMemberDesignation,
              HDFC_DP_Key_Member_name__c: keyMembers.name,
              HDFC_DP_key_member_mobile_number__c: keyMembers.mobile,
              HDFC_DP_key_member_email_id__c: keyMembers.email,

              HDFC_DP_key_member_pan_number__c:
                keyMembers.director_pancard_document_number,
              HDFC_DP_key_member_pan_card_url__c:
                keyMembers.director_pancard_document_url,
              HDFC_DP_registered_by_designation__c: registeredUserDesignation,
              HDFC_DP_Source_Type__c: "DP",
            };

            let sfProjectData = {
              HDFC_DP_BUILDERID__c: companyData.id,
              HDFC_DP_PROJECT_NAME__c: projectData.name,
              HDFC_DP_TOTAL_UNIT_BOOKD__c: projectData.total_units,
              HDFC_DP_IS_MORTGAGE_BY_OTH_INST__c: projectData.project_mortaged,
              HDFC_DP_CREATED_DT__c: projectData.createdAt,
              HDFC_DP_Contact_Person_Name__c: projectData.contact_person_name,
              HDFC_DP_Contact_Person_Designation__c:
                projectData.contact_person_designation,
              HDFC_DP_Contact_Person_Mobile__c:
                projectData.contact_person_mobile,
              HDFC_DP_Contact_Person_Email__c: projectData.contact_person_email,
              HDFC_DP_APPROVED_BY_OTH_INSTUTION__c:
                projectData.mortaged_institution,

              HDFC_DP_STREET1__c: projectAddressDetail.address_line_1,
              HDFC_DP_STREET2__c: projectAddressDetail.address_line_2,
              HDFC_DP_STREET3__c: projectAddressDetail.address_line_3,
              HDFC_DP_STATE__c: projectAddressState,
              HDFC_DP_CITY__c: projectAddressCity,
              HDFC_DP_Area_Name__c: projectAddressArea,
              HDFC_DP_PROJECT_NO__c: projectData.id,
              HDFC_DP_STATE_CODE__c: projectAddressDetail.state_id,
              HDFC_DP_CITY_Code__C: projectAddressDetail.city_id,
              HDFC_DP_AREA_CODE__c: projectAddressDetail.area_id,
              HDFC_DP_PINCODE__c: projectAddressPincode,
              HDFC_DP_TOTAL_UNIT_BOOKD__c: projectData.total_units,
              HDFC_DP_TOTAL_NO_OF_BLD__c: projectData.total_towers,
              HDFC_DP_Submitted_Date__c: projectData.submitted_date,
              HDFC_DP_STATUS__c: projectData.status,
              HDFC_DP_RERA_Applicable__c: projectData.rera_appliclable,
              HDFC_DP_LANDMARK__c: projectAddressDetail.landmark,
            };

            let sfProjectDocData = [];
            let sfReraDetailsData = [];
            let sfCategorisData = [];
            let projectDocIdJson = [];
            let projectReraIdJson = [];
            let projectCatIdJson = [];

            //Project doc details
            if (projectData.projectDocument.length > 0) {
              projectData.projectDocument.forEach((item) => {
                let sfProjectDataJson = {};

                (sfProjectDataJson.HDFC_DASH_Project_No__c = projectData.id),
                  (sfProjectDataJson.HDFC_DP_Document_Name__c =
                    item.document_name),
                  (sfProjectDataJson.HDFC_DP_Document_Url__c =
                    item.document_url),
                  (sfProjectDataJson.HDFC_DP_Created_At__c = moment(
                    item.createdAt
                  ).format("YYYY-MM-DD")),
                  (sfProjectDataJson.HDFC_DP_Project_Document_Type__c =
                    item.document_type.type),
                  (sfProjectDataJson.HDFC_DP_Remarks__c = item.remarks);

                sfProjectDocData.push(sfProjectDataJson);
                projectDocIdJson.push(item.id);
              });
            }

            //Project rera details
            if (projectData.reraDetails.length > 0) {
              projectData.reraDetails.forEach((item) => {
                let sfReraDetailsJson = {};

                (sfReraDetailsJson.HDFC_DP_RERA_ID__c = item.id),
                  (sfReraDetailsJson.HDFC_DP_Project_Id__c = projectData.id),
                  (sfReraDetailsJson.HDFC_DP_RERA_STATUS__c =
                    item.registration_status),
                  (sfReraDetailsJson.HDFC_DP_Registration_Number__c =
                    item.registration_number),
                  (sfReraDetailsJson.HDFC_DP_RERA_DETAILS_AUTOFILL__c =
                    item.autofill_enabled),
                  (sfReraDetailsJson.HDFC_DP_Application_Number__c =
                    item.application_number);

                sfReraDetailsData.push(sfReraDetailsJson);
                projectReraIdJson.push(item.id);
              });
            }

            //Project Categories
            //console.log("companyData.is_send_to_sf2==>",projectData.projectDocument)
            if (projectData.projectCategories.length > 0) {
              projectData.projectCategories.forEach((item) => {
                let sfCategoriesDataJson = {};

                (sfCategoriesDataJson.HDFC_DP_Sold_Units__c = item.sold_units),
                  (sfCategoriesDataJson.HDFC_DP_Total_Units__c =
                    item.total_units),
                  (sfCategoriesDataJson.HDFC_DP_Project_id__c =
                    item.project_id),
                  (sfCategoriesDataJson.HDFC_DP_Building_Category_Id__c =
                    item.building_category_id);

                sfCategoriesDataJson.HDFC_DP_Rate_Per_Square_Feet__c =
                  item.rate_per_square_feet;

                sfCategoriesDataJson.HDFC_DP_Unsold_units__c =
                  item.unsold_units;
                sfCategoriesDataJson.HDFC_DP_Created_At__c = moment(
                  item.createdAt
                ).format("YYYY-MM-DD");

                sfCategorisData.push(sfCategoriesDataJson);
                projectCatIdJson.push(item.id);
              });
            }

            if (!companyData.is_send_to_sf && sfSynch) {
              //HDFC_DP_Builder_Master_Lead__c
              await SfConn.sobject("HDFC_DP_Builder_Master_Lead__c").create(
                SfCreateJson,

                function (err, ret, next) {
                  if (!err) {
                    Companies.update(
                      { is_send_to_sf: true },
                      {
                        where: { id: companyData.id },
                      }
                    )
                      .then(async (data) => {})
                      .catch((err) => {});
                  } else {
                    commonLogs.info(
                      { err, ret },
                      "sferror===>HDFC_DP_Builder_Master_Lead__c : "
                    );
                    // );\\c
                  }
                }
              );
            }

            //END

            //HDFC_DP_Project_Lead__c

            if (sfSynch) {
              await SfConn.sobject("HDFC_DP_Project_Lead__c").create(
                sfProjectData,
                function (err, ret) {
                  if (!err) {
                    Project.update(
                      { is_send_to_sf: true },
                      {
                        where: { id: projectData.id },
                      }
                    )
                      .then(async (data) => {
                        commonLogs.info(data);
                      })
                      .catch((err) => {
                        commonLogs.error(err);
                      });
                    //Project doc insert
                    SfConn.sobject("HDFC_DP_Project_Document__c").insertBulk(
                      sfProjectDocData,
                      function (err, ret) {
                        commonLogs.info(err, ret);
                        if (!err) {
                          console.log(
                            "HDFC_DP_Project_Document__c status==>",
                            ret[0].success
                          );
                          //commonLogs.info("HDFC_DP_Project_Document__c status",ret);
                          if (ret[0].success === true) {
                            ProjectDocument.update(
                              { is_send_to_sf: true },
                              {
                                where: { id: projectDocIdJson },
                              }
                            )
                              .then(async (data) => {
                                commonLogs.info(data);
                              })
                              .catch((err) => {
                                commonLogs.error(err);
                              });
                          }
                        }
                      }
                    );

                    //project rera
                    SfConn.sobject("HDFC_DP_RERA_Lead__c").insertBulk(
                      sfReraDetailsData,
                      function (err, ret) {
                        commonLogs.info(err, ret);
                        if (!err) {
                          console.log(
                            "HDFC_DP_RERA_Lead__c status==>",
                            ret[0].success
                          );
                          // commonLogs.info("HDFC_DP_RERA_Lead__c status",ret);
                          if (ret[0].success === true) {
                            ProjectReraDetail.update(
                              { is_send_to_sf: true },
                              {
                                where: { id: projectReraIdJson },
                              }
                            )
                              .then(async (data) => {
                                commonLogs.info(data);
                              })
                              .catch((err) => {
                                commonLogs.error(err);
                              });
                          }
                        }
                      }
                    );

                    //project Building Categories
                    SfConn.sobject(
                      "HDFC_DP_Project_Building_Categories__c"
                    ).insertBulk(sfCategorisData, function (err, ret) {
                      commonLogs.info(err, ret);
                      if (!err) {
                        console.log(
                          "HDFC_DP_Project_Building_Categories__c status==>",
                          ret[0].success
                        );
                        //commonLogs.info("HDFC_DP_Project_Building_Categories__c status",ret);
                        if (ret[0].success === true) {
                          ProjectBuildingCategory.update(
                            { is_send_to_sf: true },
                            {
                              where: { id: projectCatIdJson },
                            }
                          )
                            .then(async (data) => {
                              commonLogs.info(data);
                            })
                            .catch((err) => {
                              commonLogs.error(err);
                            });
                        }
                      }
                    });
                  } else {
                    commonLogs.info(
                      { err, ret },
                      "sferror===>HDFC_DP_Builder_Master_Lead__c : "
                    );
                  }
                }
              );

              //End
            }
          } else {
            commonLogs.error("sferror===>SF connection not established : ");
          }
        });
      } catch (error) {
        console.log(error, "submitProjectErr1====>");
        // const catchErrmsg2 = await sequelizeError(error);
        // responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
      }
    } else {
      return res.status(constants.statusCode.serverError).send({
        message: constants.messages.apiError,
        data: "",
        status: 404,
      });
    }
  } catch (error) {
    console.log("submitProjectErr2====>", error);
    const catchErrmsg2 = await sequelizeError(error);
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
  }
};

//get all project by user
exports.getAllProjectByUser = (req, res) => {
 
  const nameKey = req.query.key;
  let limit = req.query.limitKey;
  let order = req.query.orderKey;
  //offset condition
  let offset = req.query.offsetKey;
  let whereStatement = [];

  limit ? (limit = limit) : (limit = 12);
  order ? (order = order) : (order = "desc");
  offset ? (offset = offset) : (offset = 0);
  let user_id = req.userId;
  console.log("req===>",user_id);
  //where condition
  if (nameKey) {
    whereStatement = [
      {
        id: { [Op.ne]: null },
        name: { [Op.iLike]: "%" + nameKey + "%" },
      },
    ];
  } else {
    whereStatement = [{ id: { [Op.ne]: null } }];
  }

 
 
  //find all user project by user_id
  Userproject.findAll({
    where: { user_id: user_id },
    offset: offset,
    limit: limit,
    attributes: ["project_id"],
    order: [["project_id", order]],
    include: [
      {
        model: Project,
        as: "project",
        where: whereStatement,
        attributes: [
          "name",
          "cover_image",
          "cover_image_name",
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("project.createdAt"),
              "mm-dd-YYYY"
            ),
            "createdAt",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("submitted_date"),
              "mm-dd-YYYY"
            ),
            "submitted_date",
          ],
        ],
        include: [
          {
            model: ProjectAddressDetail,
            attributes: {
              exclude: [
                "taluka_id",
                "state_id",
                "area_id",
                "district_id",
                "deletedAt",
                "pincode_id",
                "createdAt",
                "updatedAt",
                "project_id",
                "city_id",
              ],
            },
            include: [
              {
                model: States,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt"],
                },
              },
              {
                model: Pincode,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedAt", "state_id"],
                },
              },
              {
                model: City,
                attributes: {
                  exclude: [
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "district_id",
                  ],
                },
              },
              {
                model: Area,
                attributes: {
                  exclude: [
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "district_id",
                  ],
                },
              },
              {
                model: Taluka,
                attributes: {
                  exclude: [
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "district_id",
                  ],
                },
              },
            ],
          },
        ],
      },
    ],
  })
    .then(async (data) => {
      let totalRecordsCount = 0;
      if (data) {
        totalRecordsCount = await Userproject.count({
          where: { user_id: user_id },
        });
      }
      return res.send({
        message: constants.messages.Projectinfoselection,
        status: constants.statusCode.successCode,
        data: data,
        totalRecords: totalRecordsCount,
      });
    })
    .catch((err) => {
      return res.status(constants.statusCode.serverError).send({
        message: err.message,
        data: "",
        status: constants.statusCode.notFound,
      });
    });
};

//get all project by user for sellection
exports.getAllProjectByUserForSelect = (req, res) => {
  const nameKey = req.query.key;

  let user_id = req.userId;

  //find all user project by user_id
  User.findByPk(user_id, {
    include: [
      {
        model: Project,
        as: "projects",
        attributes: ["id", "name"],
      },
    ],
  })
    .then(async (data) => {
      return res.send({
        message: constants.messages.Projectinfoselection,
        status: constants.statusCode.successCode,
        data: data.projects,
      });
    })
    .catch((err) => {
      return res.status(constants.statusCode.serverError).send({
        message: err.message,
        data: "",
        status: constants.statusCode.notFound,
      });
    });
};
