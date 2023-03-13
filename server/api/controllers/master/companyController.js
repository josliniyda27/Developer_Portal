const { Op } = require("sequelize");
const constants = require("../../../helper/constants");
const db = require("../../model");
const { companies: Company, cities: City } = db;

exports.getAllCompanies = (req, res) => {
  const queryKey = req.query.key;
  let whereStatement = {};

  if (queryKey)
    whereStatement = {
      name: {
        [Op.iLike]: "%" + queryKey + "%",
      },
    };

  Company.findAll({
    attributes: ["id", "name"],
    include: [
      {
        model: City,
        attributes: ["name"],
      },
    ],
    where: whereStatement,
  })
    .then(async (data) => {
      res.send({
        message: constants.messages.CompanyDetailsForSelect,
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
