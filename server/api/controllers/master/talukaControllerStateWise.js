const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const {
  cities: City,
  states: States,
  district: District,
  sequelize: Sequelize,
} = db;

exports.getAllTaluka = async (req, res) => {
  const state = req.query.state;
  const district = req.query.district;

  let where = '';

  if(state || district)
    where = "where true";

  if(state)
    where = where+" and talukas.state_id=" +state;

  if(district)
    where = where+" and talukas.district_id=" +district;  

  await Sequelize.query(
    "Select id,name from talukas "+where)
    .then(async (data) => {

      res.send({
        message: constants.messages.talukaDetailsForSelect,
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
