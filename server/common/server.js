import Express from "express";
import cookieParser from "cookie-parser";
import * as path from "path";
import * as bodyParser from "body-parser";
import * as http from "http";
import * as https from "https";
import * as os from "os";
import * as OpenApiValidator from "express-openapi-validator";
import errorHandler from "../api/middlewares/error.handler";
import * as fs from "fs";
const cors = require("cors");

//import sfConnection from '../common/sf.config';
import sfConnectionVariable from "../common/sf.config";
import commonLogs from "./logger";
const logger = commonLogs;
const pinoHTTP = require("pino-http");

const app = new Express();
const db = require("../api/model");
const { sfAuth: SfAuth } = sfConnectionVariable;

let sfSynch = true;


  var options = {
    key: fs.readFileSync("/etc/apache2/ssl_cert/AWS_LZ_Wild-22.key"),
    cert: fs.readFileSync("/etc/apache2/ssl_cert/Wildcard_AWS_LZ-22.cer"),
  };


db.sequelize
  .sync({ force: false })
  .then((result) => {
    logger.info("Synced database");
  })
  .catch((err) => {
    logger.error("Failed to sync db: " + err.message);
    //console.log("Failed to sync db: " + err.message);
  });

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);

    const apiSpec = path.join(__dirname, "api.yml");
    const apiSpecSf = path.join(__dirname, "api-sf.yml");

    const validateResponses = !!(
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
      process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === "true"
    );

   
    //only for testing
    // app.use(pinoHTTP({
    //   logger,
    // }));

    // app.use(cors({
    //   origin: 'https://cld-devport-uat-api.hdfc.com'
    // }));
    // app.use(
    //   cors({
    //     origin: "*",
    //     methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    //     preflightContinue: false,
    //     optionsSuccessStatus: 204,
    //   })
    // );
    // app.options("*", cors());
    app.use(cors());
    app.use(bodyParser.json({ limit: process.env.REQUEST_LIMIT || "100kb" }));
    app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || "100kb",
      })
    );
    app.use(bodyParser.text({ limit: process.env.REQUEST_LIMIT || "100kb" }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));

    app.use(process.env.OPENAPI_SPEC || "/spec", Express.static(apiSpec));

    ////validation need to check
    app.use(
      OpenApiValidator.middleware({
        apiSpec,
        validateResponses,
        ignorePaths: (path) => path.includes("/nocFileUploadData"),
      })
    );

    app.use(process.env.OPENAPI_SF_SPEC || "/spec", Express.static(apiSpecSf));
    //Sf Login authetication
    SfAuth.then(async (result) => {
      sfSynch = true;
      logger.info({ result }, "Synced SF");
      logger.info({ sfSynch }, "Synced status");

      //node js application local storage
      app.locals.sfSynch = sfSynch;
    }).catch((err) => {
      logger.error({ err }, "Failed to sync SF:");
    });
  }

  router(routes) {
    routes(app);
    app.use(errorHandler);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = (p) => () =>
      console.log(
        `up and running in ${
          process.env.NODE_ENV || "development"
        } @: ${os.hostname()} on port: ${p}}`
      );
    https.createServer(options, app).listen(port, welcome(port));

    return app;
  }
}
