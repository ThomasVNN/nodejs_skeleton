import { logger, logStream } from "../helpers/log";
const morgan = require("morgan");
import passport from "passport/lib/index";
import bodyParser from "body-parser";
// import cors from "cors";
import httpContext from "express-http-context";
import {Env,Configs} from "../configs"
import {HttpStatus} from  "../constants";
import SwaggerRoutes from "./SwaggerRoutes";
import AnalyticsRoutes from "./analyticsRoutes";
const cors = require("cors");
class AppRoutes {
  constructor(Routers) {
    logger.info("App routes init");
    this.router = Routers;
    this.router.use(bodyParser.urlencoded({ extended: false }));
    this.router.use(bodyParser.json({ limit: "5mb" }));
    const allowCrossDomain = function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Methods", "*");
      res.header("Access-Control-Allow-Headers", "*");
      next();
    };
    this.router.use(allowCrossDomain);

    this.router.use(morgan("dev", { stream: logStream }));
    this.router.use(httpContext.middleware);
    this.router.use(cors({credentials: true, origin: true}));
    this.router.use(passport.initialize());
    this.router.get("/", (req, res, next) => {
      res.json({ message: "Welcome to the Lambda API!" });
    });

    // health check
    this.router.get("/health", (req, res, next) => {
      res.sendStatus(HttpStatus.OK);
    });
    //
    // swagger api
    if (Configs.NODE_ENV === Env.DEVELOPMENT) {
      this.router.use("/api-docs", new SwaggerRoutes());
    }

    // api
    this.router.use("/analytics", new AnalyticsRoutes());

    // now found and error handling
    this.router.use((req, res, next) => {
      logger.info("%s %d %s", req.method, req.statusCode, req.url);
      res.status(HttpStatus.NOT_FOUND);
      return res.json({
        error: "Not found"
      });
    });
    this.router.use((error, req, res, next) => {
      res.status(error.status || HttpStatus.SERVER_ERROR);
      logger.error(`${req.method} ${req.url} return ${res.statusCode} ${error.message}`);
      return res.json({
        error: error.message
      });
    });
    return this.router;
  }
}

export default AppRoutes;
