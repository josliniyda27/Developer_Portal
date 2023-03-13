"use strict";
const db = require("../../model");
const {
  companies: Company,
  usercompanies: Usercompanies,
  cities: City,
  projectCompany: Projectcompanies,
  designations: Designation,
  sequelize: Sequelize,
  users: User,
  project: Project,
  projectAddressDetail: projectAddressDetail,
  query: Query,
  queryCommunications: QueryCommunications,
  queryCommunicationDocuments:QueryCommunicationDocuments
} = db;
const { Op } = require("sequelize");
const {
  constants,
  dbTableConstatns,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

exports.getQueriesByProject = async (req, res) => {
  const projectId = req.params.project;

  let companyNameKey = req.query.nameSearchKey;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  let whereStatement={};
  let finalData = [{}];
  let order = [];

   console.log("req===>", req.params.project);

  offset ? (offset = offset) : (offset = "0");
  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "ASC");

  order.push(['status']);

  try {
    await Query.findAll({ 
      where: { project_id: projectId },
      order: order,
      attributes: {
        include: [
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("queries.createdAt"),
              "mm-dd-YYYY"
            ),
            "createdAt",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("queries.last_submission_date"),
              "mm-dd-YYYY"
            ),
            "last_submission_date",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("queries.updatedAt"),
              "mm-dd-YYYY"
            ),
            "updatedAt",
          ],
        ],
        //exclude: ["createdAt"],
      },
      include: [
        {
            model: Project,
            required: true,
            attributes: [
              "id",
              "name",
            ],
        },
        {
            model: Company,
            required: true,
            attributes: [
              "id",
              "name",
              "address_line_1",
              "address_line_2",
              "address_line_3",
              "city_id",
            ],
        },
      ], 
    }).then(async (data) => {
            res.send({
              message: constants.messages.queryListData,
              status: constants.statusCode.successCode,
              data: data,
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

exports.getQueriesByCompany = async (req, res) => {
  const companyId = req.params.company;

  let companyNameKey = req.query.nameSearchKey;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  let whereStatement={};
  let finalData = [{}];
  let order = [];

   console.log("req===>", req.params.company);

  offset ? (offset = offset) : (offset = "0");
  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "ASC");

  order.push(['status']);

  try {
    await Query.findAll({ 
      where: { company_id: companyId },
      order: order,
      attributes: {
        include: [
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("queries.createdAt"),
              "mm-dd-YYYY"
            ),
            "createdAt",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("queries.last_submission_date"),
              "mm-dd-YYYY"
            ),
            "last_submission_date",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("queries.updatedAt"),
              "mm-dd-YYYY"
            ),
            "updatedAt",
          ],
        ],
        //exclude: ["createdAt"],
      },
      include: [
        {
            model: Project,
            required: true,
            attributes: [
              "id",
              "name",
            ],
        },
        {
            model: Company,
            required: true,
            attributes: [
              "id",
              "name",
              "address_line_1",
              "address_line_2",
              "address_line_3",
              "city_id",
            ],
        },
      ], 
    }).then(async (data) => {
            res.send({
              message: constants.messages.queryListData,
              status: constants.statusCode.successCode,
              data: data,
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

exports.getQueriesDetailsById = async (req, res) => {
  const queryId = req.params.query;

  let companyNameKey = req.query.nameSearchKey;
  let orderByKey = req.query.orderByKey;
  let offset = req.query.offsetKey;
  let whereStatement={};
  let finalData = [{}];
  let order = [];

   console.log("req===>", req.params.query);

  offset ? (offset = offset) : (offset = "0");
  orderByKey ? (orderByKey = orderByKey) : (orderByKey = "ASC");

  try {
    await Query.findOne({ 
      where: { id: queryId },
      order: order,
      attributes: {
        include: [
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("queries.createdAt"),
              "mm-dd-YYYY"
            ),
            "createdAt",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("queries.last_submission_date"),
              "mm-dd-YYYY"
            ),
            "last_submission_date",
          ],
          [
            Sequelize.fn(
              "to_char",
              Sequelize.col("queries.updatedAt"),
              "mm-dd-YYYY"
            ),
            "updatedAt",
          ],
        ],
        //exclude: ["createdAt"],
      },
      include: [
        {
            model: Project,
            required: true,
            attributes: [
              "id",
              "name",
            ],
        },
        {
            model: Company,
            attributes: [
              "id",
              "name",
              "address_line_1",
              "address_line_2",
              "address_line_3",
              "city_id",
            ],
        },
        {
          model: QueryCommunications,
          as: "queryCommunications",
          attributes: [
            "id",
            "query_id",
            "message",
            "source",
            "destination",
            "document_name",
            "document_url",
            "task_id",
            "createdAt",
            "updatedAt"
          ],
          include: [
          {
            model: QueryCommunicationDocuments,
            as: "queryCommunicationDocuments",
            attributes: [
              "id",
              "query_communication_id",
              "document_name",
              "document_url",
            ],
          },
        ], 
        },
      ], 
    }).then(async (data) => {
            res.send({
              message: constants.messages.queryListData,
              status: constants.statusCode.successCode,
              data: data,
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