import {logger} from "../helpers/log";
import {AnalyticsUserCase} from "../useCases";
import BaseController from "./";
import {SchemaName} from "../constants";
import * as ResultCode from "../constants/resultCode";
import uuidV4 from "uuid/v4";

class AnalyticController extends BaseController {

  constructor() {
    super();
    logger.info("init AnalyticController Controller")
  }
  async powerAPI(req, res, next){
    let name = req.body.action;
    switch (req.params.id) {
      case SchemaName.STORE:
        name  += "AStore";
        break;
      case SchemaName.STORE_GROUP:
        name  += "StoreGroup";
        break;
      case SchemaName.STORE_GROUP_USER:
        name  += "StoreGroupUser";
        break;
      case SchemaName.STORE_STOREGROUP:
        name  += "StoreStoreGroup";
        break;
      case SchemaName.STORE_USER:
        name  += "StoreUser";
        break;
      default:
        return super.responseJsonWithOutput(req, res, next, { result: ResultCode.BAD_INPUT_DATA});
      }
    req.body = req.body.body || req.body;
    return new AnalyticController()[name](req, res, next);
  }
  async createAStore(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        store_code: req.body.storeCode,
        store_uuid: uuidV4(),
        store_name: req.body.storeName,
        store_lat: req.body.storeLat,
        store_long: req.body.storeLong,
        store_type: req.body.storeType,
        store_group_uuid:req.body.storeGroupUUID
      };
      const outPut = await AnalyticsUserCase.createAStore(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async updateAStore(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        store_code: req.body.storeCode,
        store_name: req.body.storeName,
        store_lat: req.body.storeLat,
        store_long: req.body.storeLong,
        store_type: req.body.storeType,
        active: req.body.isActive,
        store_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.updateAStoreByStoreByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async deleteAStore(req, res, next) {
    try {
      const param = {
        store_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.deleteAStoreByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }

  async createStoreGroupUser(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        user_uuid: req.body.storeUUID,
        storegroup_uuid: req.body.storeGroupUUID
      };
      const outPut = await AnalyticsUserCase.createAStoreGroupUser(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async updateStoreGroupUser(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        user_uuid: req.body.storeUUID,
        storegroup_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.updateAStoreGroupUserByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async deleteStoreGroupUser(req, res, next) {
    try {
      const param = {
        storegroup_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.deleteAStoreGroupUserByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }

  async createStoreUser(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        store_uuid: req.body.storeUUID,
        user_uuid: req.body.userUUID
      };
      const outPut = await AnalyticsUserCase.createAStoreUser(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async updateStoreUser(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        user_uuid: req.body.userUUID,
        store_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.updateAStoreUserByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async deleteStoreUser(req, res, next) {
    try {
      const param = {
        store_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.deleteAStoreUserByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }

  async createStoreStoreGroup(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        store_group_uuid: req.body.storeStoreGroupUUID,
        store_uuid: req.body.storeUUID
      };
      const outPut = await AnalyticsUserCase.createAStoreStoreGroup(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async updateStoreStoreGroup(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        store_uuid: req.body.storeUUID,
        store_group_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.updateAStoreStoreGroupByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async deleteStoreStoreGroup(req, res, next) {
    try {
      const param = {
        store_group_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.deleteAStoreStoreGroupByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }

  async createStoreGroup(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        store_group_uuid: req.body.storeGroupUUID,
        store_group: req.body.storeGroup
      };
      const outPut = await AnalyticsUserCase.createAStoreGroup(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async updateStoreGroup(req, res, next) {
    try {
      const param = {
        client_uuid: req.body.clientUUID,
        store_group: req.body.storeGroup,
        store_group_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.updateAStoreGroupByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
  async deleteStoreGroup(req, res, next) {
    try {
      const param = {
        store_group_uuid: req.params.id
      };
      const outPut = await AnalyticsUserCase.deleteAStoreGroupByUUID(param);
      super.responseJsonWithOutput(req, res, next, outPut);
    } catch (err) {
      super.handleUnknownError(err, req, res, next);
    }
  }
}

export default AnalyticController;
