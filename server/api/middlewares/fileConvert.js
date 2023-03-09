const fs = require("fs");
const path = require("path");
const parentDir = path.join(__dirname, "../../..");

const base64ToFile = async (req, res, next) => {
  try {
    const base64Data = req.body.data.replace(/^data:image\/jpeg;base64,/, "");
    const base64WithoutData = base64Data.substring(base64Data.indexOf(',') + 1);
    const buffer = Buffer.from(base64WithoutData, "base64");

    const filename = `${Date.now()}-purchase-`+req.body.filename;

    if (!fs.existsSync(parentDir + "/readableFileUpload")) {
      fs.mkdirSync(parentDir + "/readableFileUpload");
    }
    const filepath = path.join(parentDir, "readableFileUpload", filename);

    fs.writeFile(filepath, buffer, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error: reading the file");
      }
      req.filepath = filepath; // add the filepath to the request object to be used by the next middleware

      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  base64ToFile,
};
