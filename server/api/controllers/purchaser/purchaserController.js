"use strict";
const db = require("../../model");
const {
  sequelize: Sequelize,
  project: Project,
  builderAccount: BuilderAccount,
  projectInventoryHistory: ProjectInventoryHistory,
  projectPurchaser: ProjectPurchaser,
  projectCoPurchaser: ProjectCoPurchaser,
} = db;

const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

exports.addPurchaser = async (req, res) => {

    const projectId = await req.params.project;
    const companyId = await req.params.company;
    let transaction;

    if (!projectId) {
      res.status(403).send({
        message: "Project id missing",
        status: 403,
      });

      return;
    }

    if (!companyId) {
      res.status(403).send({
        message: "Company id missing",
        status: 403,
      });

      return;
    }

    transaction = await Sequelize.transaction();

    try {

      const inventoryDetails = {
        total_units: req.body.total_units,
        units_for_sales: req.body.units_for_sales,
        sold_units: req.body.sold_units,
        avg_rate_per_square_feet: req.body.avg_rate_per_square_feet,
        total_unsold_inventory: req.body.total_unsold_inventory,
        total_value_of_unsold_inventory: req.body.total_value_of_unsold_inventory
      };


    await Project.update(inventoryDetails, {
        where: { id: projectId },
      }).then((projectData) => {
        return ProjectInventoryHistory.create(
          {
            project_id: projectId,
            total_units: req.body.total_units,
            units_for_sales: req.body.units_for_sales,
            sold_units: req.body.sold_units,
            avg_rate_per_square_feet: req.body.avg_rate_per_square_feet,
            total_unsold_inventory: req.body.total_unsold_inventory,
            total_value_of_unsold_inventory: req.body.total_value_of_unsold_inventory
          })}).then((pData) => {
        // do insert in history
      });

      let builderAccountId;

      if(req.body.builder_account_id){
        builderAccountId = await req.body.builder_account_id;
      }
      else
      {
        await BuilderAccount.create({
          payee_name: req.body.payee_name,
          account_number: req.body.account_number,
          account_type: req.body.account_type,
          bank: req.body.bank,
          ifsc_code: req.body.ifsc_code,
          file_name: req.body.file_name,
          file_url: req.body.file_url,
          project_id: projectId,
          Added_by: req.userId,
          company_id: companyId,

        }).then((builderAccountData) => {
          builderAccountId = builderAccountData.id;
        });
      }

      if(req.body.purchaser.length > 0)
      {
        req.body.purchaser.forEach(async (purchaser) => {

          console.log('purchaser-------------------------------->',purchaser);
          await ProjectPurchaser.create({
            project_id: projectId,
            created_by: req.userId,
            builder_account_id: builderAccountId,
            name: purchaser.name,
            file_number: purchaser.file_number,
            mobile_number: purchaser.mobile_number,
            email: purchaser.email,
            lead_shared_with_hdfc: purchaser.lead_shared_with_hdfc,
            unit_type: purchaser.unit_type,
            unit_type_name: purchaser.unit_type_name,
            unit_number: purchaser.unit_number,
            carpet_area: purchaser.carpet_area,
            rate_per_sqfeet: purchaser.rate_per_sqfeet,
            agreement_value: purchaser.agreement_value,
            sanctioned_loan_amount: purchaser.sanctioned_loan_amount,
            balance_recievable: purchaser.balance_recievable,
          }).then((purchaserData) => {

            purchaser.co_purchaser.forEach(async (coPurchaser) => {
              await ProjectCoPurchaser.create({
                project_purchaser_id: purchaserData.id,
                co_purchaser_name: coPurchaser.co_purchaser_name,
                co_purchaser_email: coPurchaser.co_purchaser_email,
                co_purchaser_mobile_number: coPurchaser.co_purchaser_mobile_number,
              })
          });

          })
        });
      }


      await transaction.commit();

      const projectDetails = await Project.findByPk(projectId, {
        include: [
          {
            model: ProjectPurchaser,
            as: 'projectPurchasers',
            include : [
              {
                model: ProjectCoPurchaser,
                as: 'projectCoPurchasers'
              },
            ]
          },
        ]  
          
      });  

      const message = constants.messages.purchaserAddedSuccess;
      responseHelper(res, constants.statusCode.successCode, message, projectDetails);

    } catch (error) {
      console.log("purchaserInformationErr====>", error);
      const catchErrmsg2 = await sequelizeError(error);
      await transaction.rollback();
      responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
    }
  
  };

