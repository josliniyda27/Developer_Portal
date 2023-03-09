"use strict";
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
  district: District,
  companyDocument: CompanyDocument,
  companyKeyMember,
  companySupportingMember,
  projectCompany: ProjectCompany,
  designations: Designation,
  sequelize: Sequelize,
  companies: Companies,
  companyKeyMember: CompanyKeyMember,
  companySupportingMember: CompanySupportingMember,
  designations: Designations,
  states: States,
} = db;
const { Op } = require("sequelize");
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

const { sfConst } = constants;

import sfConnectionVariable from "../../../common/sf.config";
const { sfConn: SfConn, sfAuth: SfAuth } = sfConnectionVariable;
const { tblName: tbN } = dbTableConstatns;
const { check, validationResult } = require("express-validator");

const commonLogs = require("../../../common/logger.js");


exports.addCompaniesToSFSs = async (req, res) => {

  let SfCreateJson = {};
  let companySupports;
  let companyKeys;

 

  const companyDBDetails = await Company.findByPk(264, {
      include: [CompanyDocument, companyKeyMember, companySupportingMember],
    });

    if (companyDBDetails) {

      try{
         companySupports = await CompanySupportingMember.findOne({ where: { builder_id: companyDBDetails.builder_id } });
         companyKeys = await CompanyKeyMember.findOne({ where: { builder_id: companyDBDetails.builder_id } }); 
          console.log(companyKeys);
       } catch (error) {
        console.log('', error);
       }
        
       

    }
       // let registeredUser = projectCompanyData.company.dataValues.companiesUsers.dataValues;

       //      let registeredUserDesignation =
       //        projectCompanyData.company.dataValues.companiesUsers.dataValues
       //          .designation.dataValues.name;

       //      //SF ContactPerson
       //      let contactPersonDetails =
       //        projectCompanyData.company.dataValues
       //          .company_supporting_members[0].dataValues;

       //      let contactPersonDesignation =
       //        contactPersonDetails.designation.dataValues.name;

       //      //SF keyMembers
       //      let keyMembers =
       //        projectCompanyData.company.dataValues.company_key_members[0]
       //          .dataValues;
       //      let keyMemberDesignation = keyMembers.designation.dataValues.name;

   SfCreateJson = {
              HDFC_DP_BUILDERID__c: 264,
              HDFC_DP_Builder_No__c: companyDBDetails.builder_id,
              Name: companyDBDetails.name,
              HDFC_DP_CIN_NO__c: companyDBDetails.cin_number,
              HDFC_DP_PAN_NO__c: companyDBDetails.pan_number,
              HDFC_DP_ADDRESS_LINE1__c: companyDBDetails.address_line_1,
              HDFC_DP_ADDRESS_LINE2__c: companyDBDetails.address_line_2,
              HDFC_DP_ADDRESS_LINE3__c: companyDBDetails.address_line_3,
              HDFC_DP_City__c: companyDBDetails.city_name,
              HDFC_DP_STATE__c: companyDBDetails.state_name,
              HDFC_DP_PINCODE__c: companyDBDetails.pincode,
              HDFC_DP_Created_Date__c: companyDBDetails.createdAt,
              HDFC_DP_project_completed_previously__c:
                companyDBDetails.completed_project_names,
              HDFC_DP_Is_Group_Company__c: companyDBDetails.is_group_company,
              // HDFC_DP_registered_by_user_name__c: registeredUser.username,
              // HDFC_DP_registered_by_email_id__c: registeredUser.email,
              // HDFC_DP_registered_by_mobile_number__c: registeredUser.mobile,

              HDFC_DP_contact_person_name__c: Object.entries(companySupports).length != 0?companySupports.name:'',
              HDFC_DP_contact_person_email__c: Object.entries(companySupports).length != 0?companySupports.email:'',
              HDFC_DP_contact_person_mobile_number__c: Object.entries(companySupports).length != 0?companySupports.mobile:'',
              HDFC_DP_contact_person_designation__c: Object.entries(companySupports).length != 0?companySupports.designation_name:'',
              HDFC_DP_Key_Member_Designation__c: Object.entries(companySupports).length != 0?companyKeys.designation_name:'',
              HDFC_DP_Key_Member_name__c: Object.entries(companyKeys).length != 0 ?companyKeys.name:'',
              HDFC_DP_key_member_mobile_number__c: Object.entries(companyKeys).length != 0?companyKeys.mobile:'',
              HDFC_DP_key_member_email_id__c: Object.entries(companyKeys).length != 0?companyKeys.email:'',
              HDFC_DP_key_member_pan_number__c: Object.entries(companyKeys).length != 0?companyKeys.director_pancard_document_number:'',
              HDFC_DP_key_member_pan_card_url__c: Object.entries(companyKeys).length != 0?companyKeys.director_pancard_document_url:'',
              //HDFC_DP_registered_by_designation__c: registeredUserDesignation,
            };

if (SfCreateJson) {
              //HDFC_DP_Builder_Master_Lead__c
              await SfConn.sobject("HDFC_DP_Builder_Master_Lead__c").create(
                SfCreateJson,

                function (err, ret, next) {
                  if (!err) {
                    Companies.update(
                      { is_send_to_sf: true },
                      {
                        where: { id: 1 },
                      }
                    )
                      .then(async (data) => {
                        res.send({
          message: constants.messages.nocRequestListData,
          status: constants.statusCode.successCode,
          data: 'data',
        });
                      })
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
  res.send({
          message: constants.messages.nocRequestListData,
          status: constants.statusCode.successCode,
          data: [SfCreateJson],
            });}

           
};


exports.addCompaniesToSFS = async (req, res) => {

  let sfCreateJson = [];
  
  const companyDBDetails = await Company.findAll({where: {
      builder_id: {
        [Op.between]: ['575211', '578524']
     }
  }});

    

  if (companyDBDetails.length > 0) {
        try{

          for (let items in companyDBDetails) {

            let item = companyDBDetails[items];
            let sfProjectDataJson = {};
            let companySupports;
            let companyKeys;
            if (item) {
              try{
                  companySupports = await CompanySupportingMember.findOne({ where: { builder_id: item.builder_id } });
                  companyKeys = await CompanyKeyMember.findOne({ where: { builder_id: item.builder_id } }); 
                  console.log(companyKeys);
              } catch (error) {
                  console.log('', error);
              }
          }

          sfProjectDataJson = {
              HDFC_DP_BUILDERID__c: item.id ,
              HDFC_DP_Builder_No__c: item.builder_id,
              Name: item.name,
              HDFC_DP_CIN_NO__c: item.cin_number,
              HDFC_DP_PAN_NO__c: item.pan_number,
              HDFC_DP_ADDRESS_LINE1__c: item.address_line_1,
              HDFC_DP_ADDRESS_LINE2__c: item.address_line_2,
              HDFC_DP_ADDRESS_LINE3__c: item.address_line_3,
              HDFC_DP_City__c: item.city_name,
              HDFC_DP_STATE__c: item.state_name,
              HDFC_DP_PINCODE__c: item.pincode,
              HDFC_DP_Created_Date__c: '2022-11-17 13:30:00Z',
              HDFC_DP_project_completed_previously__c:item.completed_project_names,
              HDFC_DP_Is_Group_Company__c: item.is_group_company,
                    // HDFC_DP_registered_by_user_name__c: registeredUser.username,
                    // HDFC_DP_registered_by_email_id__c: registeredUser.email,
                    // HDFC_DP_registered_by_mobile_number__c: registeredUser.mobile,
              HDFC_DP_Source_Type__c: "PAMS",
              HDFC_DP_contact_person_name__c: Object.entries(companySupports).length != 0?companySupports.name:'',
              HDFC_DP_contact_person_email__c: Object.entries(companySupports).length != 0?companySupports.email:'',
              HDFC_DP_contact_person_mobile_number__c: Object.entries(companySupports).length != 0?companySupports.mobile:'',
              HDFC_DP_contact_person_designation__c: Object.entries(companySupports).length != 0?companySupports.designation_name:'',
              HDFC_DP_Key_Member_Designation__c: Object.entries(companySupports).length != 0?companyKeys.designation_name:'',
              HDFC_DP_Key_Member_name__c: Object.entries(companyKeys).length != 0 ?companyKeys.name:'',
              HDFC_DP_key_member_mobile_number__c: Object.entries(companyKeys).length != 0?companyKeys.mobile:'',
              HDFC_DP_key_member_email_id__c: Object.entries(companyKeys).length != 0?companyKeys.email:'',
              HDFC_DP_key_member_pan_number__c: Object.entries(companyKeys).length != 0?companyKeys.director_pancard_document_number:'',
              HDFC_DP_key_member_pan_card_url__c: Object.entries(companyKeys).length != 0?companyKeys.director_pancard_document_url:'',
              //HDFC_DP_registered_by_designation__c: registeredUserDesignation,
            };

            sfCreateJson.push(sfProjectDataJson);
}
    // });
            }catch (error) {
                    console.log('', error);
                   }
                    

    }            


   

if (sfCreateJson) {
  SfConn.sobject("HDFC_DP_Builder_Master_Lead__c").insertBulk(
                      sfCreateJson,
                      function (err, ret) {
                        commonLogs.info(err, ret);
                        if (!err) {
                          console.log("HDFC_DP_Builder_Master_Lead__c status==>",ret[0].success)
                          // //commonLogs.info("HDFC_DP_Project_Document__c status",ret);
                          // if (ret[0].success === true) {
                          //   ProjectDocument.update(
                          //     { is_send_to_sf: true },
                          //     {
                          //       where: { id: projectDocIdJson },
                          //     }
                          //   )
                          //     .then(async (data) => {})
                          //     .catch((err) => {});
                          // }
                        }
                      }
                    );
              //HDFC_DP_Builder_Master_Lead__c
        //       await SfConn.sobject("HDFC_DP_Builder_Master_Lead__c").create(
        //         SfCreateJson,

        //         function (err, ret, next) {
        //           if (!err) {
        //             Companies.update(
        //               { is_send_to_sf: true },
        //               {
        //                 where: { id: 1 },
        //               }
        //             )
        //               .then(async (data) => {
        //                 res.send({
        //   message: constants.messages.nocRequestListData,
        //   status: constants.statusCode.successCode,
        //   data: 'data',
        // });
        //               })
        //               .catch((err) => {});

                      
        //           } else {
        //             commonLogs.info(
        //               { err, ret },
        //               "sferror===>HDFC_DP_Builder_Master_Lead__c : "
        //             );
        //             // );\\c
        //           }
        //         }
        //       );
  res.send({
          message: constants.messages.nocRequestListData,
          status: constants.statusCode.successCode,
          data: [sfCreateJson],
            });}

           
};
