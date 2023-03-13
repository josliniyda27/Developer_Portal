//Sales force config file
const dotenv = require("dotenv");
dotenv.config();

const sfConnectionVariable = {};
const { SALESFORCE_USERNAME, SALESFORCE_PASSWORD, SALESFORCE_URL } =
  process.env;

var jsforce = require("jsforce");
var sfConn = new jsforce.Connection({
  // you can change loginUrl to connect to sandbox or production env.
  loginUrl: SALESFORCE_URL,
});

var sfAuth = sfConn.login(
  SALESFORCE_USERNAME,
  SALESFORCE_PASSWORD,
  async function (err, userInfo) {
    if (err) {
      return console.error(err);
    } else {
      return true;
    }
  }
);

sfConnectionVariable.sfConn = sfConn;
sfConnectionVariable.sfAuth = sfAuth;


module.exports = sfConnectionVariable;
