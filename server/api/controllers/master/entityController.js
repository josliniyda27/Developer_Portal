const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const { entity: Entity } = db;

exports.getAllEntities = (req, res) => {

    Entity.findAll({
    attributes: ["id", "name"],
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.EntityDetailsForSelect,
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
