import { logger } from "../helpers/log";
import { AppUserCase } from "../useCases";
import BaseController from "./";

class AppConfigController extends BaseController {
  constructor() {
    super();
    logger.info("init appConfig Controller")
  }
  async getAppConfig(req, res, next) {
    try {
      const outPut = await AppUserCase.getAppConfig();
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }

}
export default AppConfigController;
