const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const { roles:Role } = db;

exports.getAllAccessLevel = (req, res) => {
  let whereStatement = {};
    whereStatement = {
        id: {[Op.ne]:1}
    };

    Role.findAll({
    attributes: ["id", "name"],
    where: whereStatement,
  })
    .then(async (data) => {
      
      res.send({
        message: constants.messages.accessLevelData,
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
