const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const { district: District } = db;

exports.getAllDistricts = (req, res) => {
  const state = req.query.state;
  let whereStatement = {};

  if (state)
    whereStatement = {
      state_id: state
    };

    District.findAll({
    attributes: ["id", "name"],
    where: whereStatement,
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.DistrictDetailsForSelect,
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
