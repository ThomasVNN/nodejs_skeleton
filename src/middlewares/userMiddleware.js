
import {Configs, EndPoint, Env} from "../configs/index";
import Utils from "../helpers/utils";
import { HttpStatus,HeaderFile } from "../constants/index";
import { logger } from "../helpers/log"

const AUTH_WITH_SERVER = Configs.AUTH_WITH_SERVER;
const ACTIVE_KEY = "active";
const DEFAULT_UUID = "defaultUUID";
class UserMiddleware {
  // Client Password - HTTP Basic authentication
  static async authJWTRequest(token = "") {
    try {
      let result = null;
      if (AUTH_WITH_SERVER !== ACTIVE_KEY) {
        // Not auth with server
        const arrStr = token.split(".");
        if (arrStr.length !== 3) {
          throw { response: { status: HttpStatus.FORBIDDEN } };
        }
        result = arrStr[1].deBase64();
        result = JSON.parse(result);
        if (result.user  && result.user.client_uuid) {
          result.client_uuid  = result.user.client_uuid;
        }
      } else {
        const reqOpt = {
          method : "get",
          url: Configs.AUTH_SERVER + EndPoint.GET_INFO_USER,
          headers: {
            [HeaderFile.TOKEN_FEILD]: token
          }
        };
        const resAPi = await Utils.requestAPI(reqOpt);
        result = resAPi && resAPi.data && resAPi.data.data ? resAPi.data.data : {}
      }
      return result;
    } catch (ex) {
      throw ex;
    }
  }

  static async activeUser(req, res, next) {
    try {
      if (Configs.NODE_ENV === Env.DEVELOPMENT) {
        if (req.user === undefined) {
          req.user = {};
        }
        req.user.client_uuid = "";
      }else{
        const token = req.headers[HeaderFile.TOKEN_FEILD];
        const payload = await UserMiddleware.authJWTRequest(token);
        // eslint-disable-next-line no-use-before-define
        setInfoToReq({ client_uuid: payload.client_uuid }, req);
      }
      //
      req.body.storeGroupUUID= req.body.storeGroupUUID?req.body.storeGroupUUID.replace(/[^a-zA-Z0-9_-]/, ""):undefined ;
      req.body.storeType=req.body.storeType?req.body.storeType.replace(/[^a-zA-Z0-9_-]/, ""):undefined ;
      req.query.storeGroupUUID=req.query.storeGroupUUID?req.query.storeGroupUUID.replace(/[^a-zA-Z0-9_-]/, ""):undefined ;
      req.query.storeType=req.query.storeType?req.query.storeType.replace(/[^a-zA-Z0-9_]/, ""):undefined ;

      return next();
    } catch (ex) {
      if (ex.response && ex.response.status)
        ex.status = ex.response.status;
      else
        logger.error(ex)
      next(ex);
    }
  }
}

/**
 * @description set more info into req;
 */
function setInfoToReq(info = {}, req) {

  const { client_uuid } = info;
  if (req.user === undefined) {
    req.user = {};
  }
  req.user.client_uuid = client_uuid;
}

export default UserMiddleware;
