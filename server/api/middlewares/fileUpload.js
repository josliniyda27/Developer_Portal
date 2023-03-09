const multer = require("multer");
const path = require("path");
const fs = require("fs");
const parentDir = path.join(__dirname, "../../..");

var errorHandle = function (err, req, res, next) {
    console.log("errrr==>",err)
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    res.status(400).json({ message: "There was an error uploading the file." });
  } else {
    next(err);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("req==>",req)
    console.log("file==>",file)
    if (!fs.existsSync(parentDir + "/readableFileUpload")) {
      fs.mkdirSync(parentDir + "/readableFileUpload");
    }
    cb(null, parentDir + "/readableFileUpload");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, `${Date.now()}-nocFile-${file.originalname}`);
  },
});

var uploadFile = multer({  errorHandle: errorHandle,storage: storage });
exports.uploadFile = uploadFile;
