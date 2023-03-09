const { constants } = require("../../../helper");
const db = require("../../model");
const { buildingCategory: BuildingCategory } = db;

exports.getAllCategory = async (req, res) => {

  try {
    await BuildingCategory.findAll({
      attributes: ["id", "name"],
    })
      .then((data) => {
        res.send({
          message: constants.messages.projectCategorySelect,
          status: constants.statusCode.successCode,
          data: data,
        });
      })
      .catch((err) => {
        console.log("prjectcategoryerror1=====>", error);
        res.status(constants.statusCode.serverError).send({
          message: constants.messages.apiError,
          details: err.message,
        });
      });
  } catch (error) {
    console.log("prjectcategoryerror2=====>", error);
  }
};
