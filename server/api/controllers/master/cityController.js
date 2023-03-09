const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const { cities: City } = db;

exports.getAllCities = (req, res) => {
  const district = req.query.district;
  let whereStatement = {};

  if (district)
    whereStatement = {
      district_id: district
    };

    City.findAll({
    attributes: ["id", "name"],
    where: whereStatement,
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.CityDetailsForSelect,
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
