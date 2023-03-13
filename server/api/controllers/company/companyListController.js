"use strict";
const db = require("../../model");
const {
  companies: Company,
  projectCompany: Projectcompanies,
  companyGroups: CompanyGroups,
  sequelize: Sequelize,
  users: User,
} = db;
const { Op } = require("sequelize");
const { constants } = require("../../../helper");

exports.getCompanyByAdminuser = async (req, res) => {
  const userId = req.userId;
  let limit = req.query.limitKey;
  let companyNameKey = req.query.nameSearchKey;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  let whereStatement = "";
  let finalData = {};


  limit ? (limit = limit) : (limit = 12);

  offset ? (offset = offset) : (offset = "0");

  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "asc");
  companyNameKey
    ? (whereStatement = {
        model: Company,
        as: "groupCompanies",
        where: {
          name: {
            [Op.iLike]: "%" + companyNameKey + "%",
          },
        },
        required: true,
        attributes: [
          "name",
          "address_line_1",
          "address_line_2",
          "address_line_3",
          "city_id",
          [
            Sequelize.fn(
              "COUNT",
              Sequelize.col("groupCompanies.companyProjects.project_id")
            ),
            "projectCount",
          ],
        ],
        include: [
          {
            model: Projectcompanies,
            attributes: [],
            as: "companyProjects",
          },
        ],
      })
    : (whereStatement = {
        model: Company,
        required: true,
        as: "groupCompanies",
        attributes: [
          "name",
          "address_line_1",
          "address_line_2",
          "address_line_3",
          "city_id",
          [
            Sequelize.fn(
              "COUNT",
              Sequelize.col("groupCompanies.companyProjects.project_id")
            ),
            "projectCount",
          ],
          //[Sequelize.col('COUNT(DISTINCT(company.companyProjects.project.project_address_detail.city_id))'), 'countOfProducts'],
        ],
        include: [
          {
            model: Projectcompanies,
            attributes: [],
            as: "companyProjects",
          },
        ],
      });

  try {
    let parentId = 0;
    let parentCompanyName = "Company Name";

    await Company.findAll({ where: { created_by: userId, is_group_admin: true } })
      .then(async (data) => {
        if (data.length > 0) {
          parentId = data[0].dataValues.id;
          parentCompanyName = data[0].dataValues.name;
        }
      })
      .catch((err) => {
        res.status(constants.statusCode.serverError).send({
          message: constants.messages.apiError,
          data: err.message,
          status: 404,
        });
      });

    if (parentId === 0) {
      return res.send({
        message: "No group company found",
        status: constants.statusCode.forbidden,
        data: "HideTab",
      });
    }

    await User.findAll({ where: { id: userId } })
      .then((userData) => {

        if (userData.length === 0) {
          return res.send({
            message: "No permission",
            status: constants.statusCode.forbidden,
            data: finalData,
          });
        } else if (userData[0].dataValues.role_id !== 1) {
          return res.send({
            message: "No permission",
            status: constants.statusCode.forbidden,
            data: finalData,
          });
        }

        return CompanyGroups.findAll({
          required: true,
          attributes: ["company_id"],
          order: [["id", orderByKey]],
          offset: offset,
          limit: limit,
          subQuery:false,
          where: { parent_id: parentId },
          include: [whereStatement],
          group: [
            "groupCompanies.id",
            "company_groups.id",
          ],
        })

          .then(async (data) => {
            let projectCount = 0;
            let cityCount = 0;
            let companyCount = data.length;
            let cityArray = [];

            data.forEach((user) => {
              let city_id = user.dataValues.groupCompanies.dataValues.city_id;
              if (!cityArray.includes(city_id)) {
                cityArray.push(city_id);
                cityCount += 1;
              }
              projectCount += parseInt(
                user.dataValues.groupCompanies.dataValues.projectCount
              );
            });
            finalData.companiesDetails = data;
            finalData.projectCount = projectCount;
            finalData.userName = userData[0].dataValues.username;
            finalData.cityCount = cityCount;
            finalData.companyCount = companyCount;
            finalData.parentCompanyName = parentCompanyName;
            return res.send({
              message: constants.messages.companyInfo,
              status: constants.statusCode.successCode,
              data: finalData,
              totalRecord:companyCount
            });
          })
          .catch((err) => {
            res.status(constants.statusCode.serverError).send({
              message: constants.messages.apiError,
              data: err.message,
              status: 404,
            });
          });
      })
      .catch((err) => {
        res.status(constants.statusCode.serverError).send({
          message: constants.messages.apiError,
          data: err.message,
          status: 404,
        });
      });
  } catch (error) {
    console.log("error==>", error);
  }
};
