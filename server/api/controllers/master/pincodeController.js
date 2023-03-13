const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const { pincode: Pincode } = db;

exports.getAllPincodes = (req, res) => {
  const state = req.query.state;
  const city = req.query.city;
  let whereStatement = {};

  if (state)
    whereStatement = {...whereStatement,
        state_id: state
    };

  if (city)
    whereStatement = {...whereStatement,
        city_id: city
    };  

    Pincode.findAll({
    attributes: ["id", "pincode"],
    where: whereStatement,
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.PincodeDetailsForSelect,
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
