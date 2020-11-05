import { ResultCode , HttpStatus}from "../constants/";
import { logger } from "../helpers/log";
import {Configs, Env} from "../configs";
// import SwaggerRoutes from "../routes/swaggerRoutes";

class BaseController {
  /**
   * @param {Model} model The default model object
   */

  constructor() {
  }

  /*
    output {
      result: ResultCode,
      message: errorMessage // optional
      data: any
    }
  */
  responseJsonWithOutput(req, res, next, output) {
    switch (output.result) {
      case ResultCode.SUCCESS:
        return output.data ? res.json(output.data) : res.json({});
      case ResultCode.BAD_INPUT_DATA:
        if (Configs.NODE_ENV === Env.DEVELOPMENT) {
            logger.info(res.json(output.data));
        }
        return res.sendStatus(HttpStatus.BAD_REQUEST);
      case ResultCode.NOT_HAVE_PERMISSION:
        next({ status: HttpStatus.FORBIDDEN, message: output.message || "unknown" }, req, res, next);
        return;
      case ResultCode.NOT_FOUND:
        next({ status: HttpStatus.NOT_FOUND, message: output.message || "unknown" }, req, res, next);
        return;
      case ResultCode.NOT_AUTHORIZE:
        next({ status: HttpStatus.NOT_AUTHORIZED, message: output.message || "unknown" }, req, res, next);
        return;
      default:
        if (Configs.NODE_ENV === Env.DEVELOPMENT) {
          logger.info(res.json(output.data));
        }
        return next({ message: "server error" }, req, res, next);
    }
  }

  handleUnknownError(error, req, res, next) {
    logger.error(error);
    return next({ message: "server error" }, req, res, next);
  }
}

export default BaseController;
