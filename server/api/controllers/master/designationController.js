const constants = require("../../../helper/constants");
const db = require("../../model");
const { designations: Designation } = db;

exports.getAllDesignations = async (req, res) => {
  const type = req.query.type;
  let whereStatement = {};

  if (type)
    whereStatement = {
      type: type,
    };
  try {
    await Designation.findAll({
      attributes: ["id", "name"],
      where: whereStatement,
    })
      .then((data) => {
        res.send({
          message: constants.messages.designationDetailsForSelect,
          status: constants.statusCode.successCode,
          data: data,
        });
      })
      .catch((err) => {
        res.status(constants.statusCode.serverError).send({
          message: constants.messages.userDetailsError,
          details: err.message,
        });
      });
  } catch (error) {
    console.log("error===>", error);
  }
};
