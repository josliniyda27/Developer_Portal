const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const { bank: Bank } = db;

exports.getAllBanks = (req, res) => {

    Bank.findAll({
    attributes: ["id", "name", "code"],
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.BankDetailsForSelect,
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
