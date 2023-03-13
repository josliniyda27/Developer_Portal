//Database config file
const dotenv = require("dotenv");
dotenv.config()
module.exports = {
    HOST: process.env.DBHOST,
    USER: process.env.DBUSER,
    PASSWORD: process.env.DBPASSWORD,
    DB: process.env.DB,
    DBPORT: process.env.DBPORT,
    dialect: "postgres",
    pool: {
     max: 20,
     min: 0,
     acquire: 100000,
     idle: 10000
    }
  };