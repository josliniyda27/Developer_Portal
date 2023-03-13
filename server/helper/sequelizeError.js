const commonLogs = require("../common/logger.js");
const sqError = (error) => {

  commonLogs.error("sqError===> " + error);
 
  let erMsg = "";
  if (error.name === "SequelizeValidationError") {
    erMsg = error.errors[0].message;

    //for Multiple errors in single response
    // const errors = error.errors.map((err) => ({
    //   field: err.path,
    //   message: err.message,
    // }));

    // return errors;
  
  } else if (error.name === "SequelizeUniqueConstraintError") {
    erMsg = error.message;
  } else if (
    error.name === "SequelizeForeignKeyConstraintError" 
  ) {
    if (error.parent.detail) {
      let keyValue = error.parent.detail.match(/\(([^)]+)\)/)[1];
      erMsg = keyValue + " not available in master data";
    } else {
      erMsg = erMsg.message;
      console.log("dbErrorName===> " + error.name);
    }
  } else if (error.name === "AggregateError") {
    erMsg = error.errors[0].errors.errors[0].message;
  } else if (error.name === "SequelizeDatabaseError") {
    erMsg = error.name;
  
  } else {
    erMsg = error;
  }
  return erMsg;
};

module.exports = sqError;
