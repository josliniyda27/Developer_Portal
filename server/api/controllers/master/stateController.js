const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const { states: State } = db;

exports.getAllStates = (req, res) => {

    State.findAll({
    attributes: ["id", "name"],
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.StatesDetailsForSelect,
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
