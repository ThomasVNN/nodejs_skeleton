import validator from "joi";
import {StoreModel,
  StoreGroupModel,
  StoreGroupUserModel,
  StoreStoreGroupModel,
  StoreUserModel} from "../models";

import { UserStatus, HttpStatus, ResultCode} from "../constants";
import Utils from "../helpers/Utils";

class AnalyticsMiddleWares {
  static validateAnalyticsBasic(req, res, next){
    if(!req.body.address || (req.body.address.length < 3)){
      throw { status: HttpStatus.BAD_REQUEST, message: "address not correct" };
    }
    if(!req.body.name || (req.body.name.length < 3)){
      throw { status: HttpStatus.BAD_REQUEST, message: "name not correct" };
    }
    if(!req.body.phoneNumber || (req.body.phoneNumber.length < 8)){
      throw { status: HttpStatus.BAD_REQUEST, message: "phoneNumber not correct" };
    }
    if(!req.body.website || (!Utils.isURL(req.body.website))){
      throw { status: HttpStatus.BAD_REQUEST, message: "website not correct" };
    }
    if(!req.body.email || (!Utils.isEmail(req.body.email))){
      throw { status: HttpStatus.BAD_REQUEST, message: "email not correct" };
    }
    return next();
  }


}

export default AnalyticsMiddleWares;
