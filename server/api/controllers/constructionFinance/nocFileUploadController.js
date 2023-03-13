"use strict";
const path = require("path");
const xlsx = require("xlsx");
const fs = require("fs");
var FormData = require("form-data");
const parentDir = path.join(__dirname, "/../../../..");
const coPurchaserLimit = 3;

const { constants, sequelizeError } = require("../../../helper");
const db = require("../../model");
const { excelServices } = require("./controllerServices");
const {
  projectCoPurchaser: ProjectCoPurchaser,
  projectPurchaser: projectPurchaser,
  sequelize: Sequelize,
} = db;

const { validColumnsForExcel: validColumns } = constants;
const { readExcel, excelReadOutPut } = excelServices;

exports.readUploadFile = async (req, res) => {
  //check file available or not
  if (!req.filepath) {
    res.status(constants.statusCode.notFound).send({
      message: constants.messages.uploadExcelFile,
      data: "",
      status: constants.statusCode.notFound,
    });
    return;
  }
  const projectId = req.body.project_id;
  let path = req.filepath;
  //checking file type of double validation
  try {

    //iterating excel
    const readExcelforData = await readExcel(path);
    const headers = readExcelforData.headers;
    const data = readExcelforData.data;

    const result = validColumns.every((value) => headers.includes(value));

    if (!result) {
      const missingValues = validColumns.filter(
        (value) => !headers.includes(value)
      );

      res.status(constants.statusCode.notFound).json({
        status: constants.statusCode.notFound,
        message:
          constants.messages.PleaseReferTemplate + missingValues.join(", "),
      });
      return;
    }

    //creating new json for insertion
    //iterating excel
    const newJson = await excelReadOutPut(
      data,
      coPurchaserLimit,
      projectId,
      req.userId
    );
    //inserting sequelize
    if (result) {
      let transaction;

      try {
        transaction = await Sequelize.transaction();

        const projectPurchaserCreate = await projectPurchaser.bulkCreate(
          newJson.data,
          {
            include: [{ model: ProjectCoPurchaser, as: "projectCoPurchasers" }],
            validate: true,
            // individualHooks: true,
          },
          { transaction }
        );

        await transaction.commit();

        if (projectPurchaserCreate) {
          let deletFile = await constants.deleteFile(path);
          const ids = projectPurchaserCreate.map((data) => data.id);

          res.status(constants.statusCode.successCode).json({
            status: constants.statusCode.successCode,
            message: constants.messages.fileBulkExcel,
            data: ids,
          });
        }
      } catch (e) {
        let deletFile = await constants.deleteFile(path);
        await transaction.rollback();
        const catchErrmsg2 = await sequelizeError(e);
        return res.status(404).json({
          status: 404,
          message: catchErrmsg2,
          //data: projectPurchaserCreate,
        });
      }
    } else {
      let deletFile = await constants.deleteFile(path);
      res
        .status(404)
        .json({ status: 404, message: constants.messages.excelFileHeadError });
    }
  } catch (error) {
    let deletFile = await constants.deleteFile(path);
    const catchErrmsg2 = await sequelizeError(error);
    if (catchErrmsg2) {
      return res.status(400).json({
        status: 404,
        message: catchErrmsg2,
        data: sequelizeError(error),
      });
    }
   
  }
};
