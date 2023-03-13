"use strict";
const db = require("../../model");
const {
  query: Query,
  queryCommunications: QueryCommunications,
  queryCommunicationDocuments: QueryCommunicationDocuments,
  sequelize: Sequelize,
} = db;
const { Op } = require("sequelize");
const {
  constants,
  responseHelper,
  sequelizeError,
} = require("../../../helper");

const { sfConst } = constants;

import sfConnectionVariable from "../../../common/sf.config";
const { sfConn: SfConn, sfAuth: SfAuth } = sfConnectionVariable;

exports.addQueryCommunication = async (req, res) => {
  const queryId = await req.params.query;

  const communicationDetails = {
    message: req.body.message,
    document_name: req.body.documentName,
    document_url: req.body.documentUrl,
    source: "portal",
    destination: "hdfc",
    query_id: queryId,
  };

  Query.findByPk(queryId)
    .then(async (queryData) => {
      if (queryData) {
        QueryCommunications.create(communicationDetails, {}).then(
          (communicationDetailsData) => {
            const message = constants.messages.querycommunicationSuccess;
            responseHelper(
              res,
              constants.statusCode.successCode,
              message,
              communicationDetailsData
            );
          }
        );
      } else {
        res.status(constants.statusCode.notFound).send({
          message: constants.messages.queryNotFound,
        });
      }
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.queryDetailsError,
        details: err.message,
      });
    });
};

exports.submitNewDate = async (req, res) => {
  const queryId = await req.params.query;

  const Details = {
    last_submission_date: req.body.last_submission_date,
  };

  await Query.update(Details, {
    where: { id: queryId },
  })
    .then((communicationDetailsData) => {
      const message = constants.messages.querycommunicationSuccess;
      responseHelper(res, constants.statusCode.successCode, message, Details);
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.queryDetailsError,
        details: err.message,
      });
    });
};

exports.addQueryCommunicationDetails = async (req, res) => {
  try {
    const queryId = req.query.queryId;

    const communicationDetails = {
      message: req.body.message,
      source: "portal",
      destination: "hdfc",
      query_id: queryId,
      queryCommunicationFiles: req.body.queryCommunicationFiles,
    };

    const queryType = await Query.findByPk(queryId, {
      attributes: ["type"],
    });
    if (!queryType) {
      let msg = `Query  with id ${queryId} not found`;
      responseHelper(res, constants.statusCode.notFound, msg);
      return;
    }
    if (req.body.queryCommunicationFiles) {
      if (queryType.type === "document") {
        if (
          Array.isArray(req.body.queryCommunicationFiles) &&
          req.body.queryCommunicationFiles.length <= 0
        ) {
          responseHelper(
            res,
            constants.statusCode.successCode,
            "Please provide documents"
          );
          return;
        }
      }
    } else {
      if (queryType.type === "document") {
        responseHelper(
          res,
          constants.statusCode.successCode,
          "Please provide documents"
        );
        return;
      }
    }

    let transaction;
    try {
      transaction = await Sequelize.transaction();

      const newCommunicationRecord = await QueryCommunications.create(
        communicationDetails,
        { transaction }
      );
      const newRecordId = newCommunicationRecord.id;
      if (req.body.queryCommunicationFiles) {
        const queryCommunicationFiles =
          await req.body.queryCommunicationFiles.map((record) => ({
            ...record,
            query_communication_id: newRecordId,
          }));

        await QueryCommunicationDocuments.bulkCreate(
          queryCommunicationFiles,
          // {
          //   validate: true,
          // },
          { transaction }

          //transaction end with commit transaction
        );
      }
      transaction.commit();
      const message = constants.messages.querycommunicationSuccess;
      responseHelper(res, constants.statusCode.successCode, message);
      return;
    } catch (error) {
      const catchErrmsg2 = await sequelizeError(error);
      responseHelper(res, constants.statusCode.successCode, catchErrmsg2);
      return;
    }
  } catch (error) {
    const catchErrmsg2 = await sequelizeError(error);
    responseHelper(res, constants.statusCode.notFound, catchErrmsg2);
    return;
  }
};
