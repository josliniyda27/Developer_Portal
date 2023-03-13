const constants = require("../../../helper/constants");
const db = require("../../model");
const {
  sequelize: Sequelize,
} = db;

exports.getAllCities = async (req, res) => {
  const state = req.query.state;
  
  let query;

  if(state)
    query = "select id as id,name as name from cities where state_id ="+state;
  else
    query = "select id,name from cities";

  await Sequelize.query(query)
    .then(async (data) => {
      res.send({
        message: constants.messages.CityDetailsForSelect,
        
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
