// export default logger;
import * as winston from "winston";
import { Configs } from "../configs";
import * as env from "../configs/env";
require("winston-daily-rotate-file");

const tsFormat = () => (new Date()).toLocaleTimeString();
const fs = require("fs");
const path = require("path");

// const appLogDir = path.join(process.cwd(), Configs.TMP_FOLDER_LAMBDA);
// if (!fs.existsSync(appLogDir)) {
//   fs.mkdirSync(appLogDir);
// }

// log file path, notice the "-" char since we are going to use daily rotate log file
// const logFilePath = path.join(appLogDir, "%DATE%-logs.log");

// reference:
//  * log levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
//  * for more information about log levels, check out the document at: https://github.com/winstonjs/winston
let logLevel = "silly"; // default is "silly" for LOCAL env.
if (Configs.NODE_ENV === env.PRODUCTION) {
  logLevel = "warn";
} else if (Configs.NODE_ENV === env.DEVELOPMENT || Configs.NODE_ENV === env.TEST) {
  logLevel = "info";
}

// create logger with empty transports, we'll add transports later
const winstonLogger = new winston.Logger({
  exitOnError: false
});

// detect NODE_ENV then add relevant log transport
// if (Configs.NODE_ENV === env.PRODUCTION) {
  winstonLogger.configure({
    transports: [
      new (winston.transports.Console)(
        {
          level: logLevel, // logs everything to the console
          json: false,
          colorize: true,
          timestamp: tsFormat,
          handleExceptions: true,
          prettyPrint: true
        })
    ]
  });
// }

export const logger = winstonLogger;
export const logStream = {
  write: (text) => {
    logger.info(text);
  }
};
