"use strict";
const db = require("../../model");
const { usercompanies: usercompanies, companies: Companies, users: User } = db;
const { constants, responseHelper } = require("../../../helper");
const validate = async (req, res, next) => {
  let CompanyName = req.body.companyName.toLowerCase();
  let companyId = 0;
  let errorMessage = "";
  await Companies.findAll({
    where: { name: CompanyName },
  })
    .then((data) => {
      if (data.length > 0) {
        companyId = data[0].dataValues.id;
      }
    })
    .catch((err) => {
      return responseHelper(res, constants.statusCode.notFound, err);
    });

  if (companyId !== 0) {
    await usercompanies
      .findAll({
        where: { company_id: companyId },
        include: [{ model: User, as: "companiUsers", order: [["id", "ASC"]] }],
      })
      .then(async (data) => {
        if (data.length > 0) {
          const records = data.map((result) => result.dataValues);

          let mobile = 0;

          records[0].companiUsers.dataValues.mobile
            ? (mobile = records[0].companiUsers.dataValues.mobile)
            : (mobile = null);

          let message = await constants.messageResponse(
            req.body.companyName,
            mobile
          );

          errorMessage = message;
        }
      })
      .catch((err) => {
        return responseHelper(res, constants.statusCode.notFound, err);
      });
  }

  if (errorMessage) {
    return responseHelper(res, constants.statusCode.notFound, errorMessage);
  }
  next();
};

module.exports = {
  validate,
};
