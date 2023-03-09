const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const {
  cities: City,
  states: States,
  district: District,
  sequelize: Sequelize,
} = db;

exports.getAllArea = async (req, res) => {
  const state = req.query.state;
  const city = req.query.city;

  let where = '';

  if(state || city)
    where = "where true";

  if(state)
    where = where+" and state_id=" +state;

  if(city)
    where = where+" and city_id=" +city; 

  await Sequelize.query(
    "Select id,name from areas " +
      where
  )
    .then(async (data) => {
     
      res.send({
        message: constants.messages.areaDetailsForSelect,
        status: constants.statusCode.successCode,
        data: data[0],
      });
    })
    .catch((err) => {
      res.status(constants.statusCode.serverError).send({
        message: constants.messages.apiError,
        details: err.message,
      });
    });
};
