//adding datadog apm by Harry
import express from "express";
import { logger } from "./helpers/log";
import { Env,Configs } from "./configs";
import { MongoDB } from "./storages";
import Routes from "./routes/index";
import serverless from "serverless-http";

import * as _ from "./helpers/utils"
class server {
  constructor() {

    logger.info("starting server:");
    this.initDatabase().then(() => {
      this.initRoutes(express());
      this.start();
    }).catch((e)=> {
      logger.error(e)
      this.stop();
    });
  }

  initDatabase() {
    logger.info("connecting db");
    // PG.connect();
    return MongoDB.connect(Configs.DATABASE_URL);
  }

  initRoutes(routes) {
    this.app = (new Routes(routes));
  }

  start() {
    logger.info("app starting");
    this.app.listen(Configs.APP_PORT, () => {
      logger.info("Running on port:", Configs.APP_PORT);
    });
    process.on("unhandledRejection", error => {
      logger.error("unhandledRejection", error.message);
    });
  }

  stop() {
    MongoDB.disconnect().catch(e => logger.error(e));
    process.exit();
  }
}

export default new server();

if (Configs.NODE_ENV === Env.PRODUCTION) {
  module.exports.handler = serverless(new Routes(express()));
}
