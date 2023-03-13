const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const { bankAccountType: BankAccountType } = db;

exports.getAllBankAccountTypess = (req, res) => {

    BankAccountType.findAll({
    attributes: ["id", "name"],
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.BankAccountTypeDetailsForSelect,
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
