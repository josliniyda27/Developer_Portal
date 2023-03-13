const dotenv = require("dotenv");
dotenv.config()

module.exports = {
  "development": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": process.env.DB,
    "host": process.env.DBHOST,
    "port": process.env.DBPORT,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": process.env.DB,
    "host": process.env.DBHOST,
    "port": process.env.DBPORT,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.DBUSER,
    "password": process.env.DBPASSWORD,
    "database": process.env.DB,
    "host": process.env.DBHOST,
    "port": process.env.DBPORT,
    "dialect": "postgres"
  }
};
