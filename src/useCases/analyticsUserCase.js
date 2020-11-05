import { ResultCode, QueryBy, SortBy} from "../constants/"
import {StoreModel,
  StoreGroupUserModel,
  StoreStoreGroupModel,
  StoreUserModel,
  StoreGroupModel
} from "../models";
function baseResultAnalytics(emp) {
  return {
    clientUUID: emp.client_uuid || "NA",
    createDate:  new Date(emp.created_at).toISOString()|| "NA",
    updateDate: new Date(emp.updated_at).toISOString()|| "NA"
  }
}
function resultStoreGroupUserInfo(emp) {
  return Object.assign({
    storeGroupUUID: emp.storegroup_uuid || "NA",
    userUUID: emp.user_uuid || "NA",
  }, baseResultAnalytics(emp));
}
function resultStoreInfo(emp) {
  return  Object.assign({
    storeCode: emp.store_code || "NA",
    storeUUID: emp.store_uuid || "NA",
    storeName: emp.store_name,
    storeLat: emp.store_lat || "NA",
    storeLong: emp.store_long || "NA",
    storeType:emp.store_type || "NA",
    isActive: emp.active || "N",
  }, baseResultAnalytics(emp));
}
function resultStoreUserInfo(emp) {
  return Object.assign({
    storeUUID: emp.store_uuid || "NA",
    userUUID: emp.user_uuid || "NA",
  }, baseResultAnalytics(emp));
}
function resultStoreStoreGroupInfo(emp) {
  return Object.assign({
    storeUUID: emp.store_uuid || "NA",
    storeStoreGroupUUID: emp.store_group_uuid || "NA",
  }, baseResultAnalytics(emp));
}
function resultStoreGroupInfo(emp) {
  return Object.assign({
    storeGroup: emp.store_group || "NA",
    storeGroupUUID: emp.store_group_uuid || "NA",
  }, baseResultAnalytics(emp));
}

export async function createAStore(input) {
  try {
    const storeExist = await StoreModel.findOne({where:{store_uuid:input.store_uuid}});
    if (storeExist){
      return { result: ResultCode.NOT_HAVE_PERMISSION, message:  `store_uuid: ${input.storegroup_uuid} Registered`};
    }
    const store = await StoreModel.create(input);
    return { result: ResultCode.SUCCESS, data: resultStoreInfo(store)};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function updateAStoreByStoreByUUID(input) {
  try {
    const storeExist = await StoreModel.findOne({where:{store_uuid:input.store_uuid}});
    if (storeExist){
      storeExist.setDataValue("client_uuid", (input.client_uuid || storeExist.client_uuid));
      storeExist.setDataValue("sales_target", (input.sales_target || storeExist.sales_target));
      storeExist.setDataValue("business_date", (input.business_date || storeExist.business_date));
      storeExist.setDataValue("business_month", (input.business_month || storeExist.business_month));
      storeExist.setDataValue("business_year", (input.business_year || storeExist.business_year));
      storeExist.setDataValue("store_long", (input.store_uuid || storeExist.store_uuid));
      storeExist.setDataValue("created_at", Date.now());
      await storeExist.save();
      return { result: ResultCode.SUCCESS, data: resultStoreInfo(storeExist)};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found store uuid"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function deleteAStoreByUUID(input) {
  try {
    const storeExist = await StoreModel.destroy({where:{store_uuid:input.store_uuid}});
    if (storeExist){
      return { result: ResultCode.SUCCESS, data: {message: "Deleted" }};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found store uuid"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}

export async function createAStoreGroupUser(input) {
  try {
    const storeGroupUserExist = await StoreGroupUserModel.findOne({where:{storegroup_uuid:input.storegroup_uuid}});
    if (storeGroupUserExist){
      return { result: ResultCode.NOT_HAVE_PERMISSION, message: `StoreGroupUUID: ${input.storegroup_uuid} Registered`};
    }
    const store = await StoreGroupUserModel.create(input);
    return { result: ResultCode.SUCCESS, data: resultStoreGroupUserInfo(store)};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function updateAStoreGroupUserByUUID(input) {
  try {
    const storeExist = await StoreGroupUserModel.findOne({where:{storegroup_uuid:input.storegroup_uuid}});
    if (storeExist){
      storeExist.setDataValue("client_uuid", (input.client_uuid || storeExist.client_uuid));
      storeExist.setDataValue("user_uuid", (input.user_uuid || storeExist.user_uuid));
      storeExist.setDataValue("updated_at", Date.now());
      await storeExist.save();
      return { result: ResultCode.SUCCESS, data: resultStoreGroupUserInfo(storeExist)};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found store uuid"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function deleteAStoreGroupUserByUUID(input) {
  try {
    const storeExist = await StoreGroupUserModel.destroy({where:{storegroup_uuid:input.storegroup_uuid}});
    if (storeExist){
      return { result: ResultCode.SUCCESS, data: {message: "Deleted" }};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found StoreGroupUserByUUID"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}

export async function createAStoreUser(input) {
  try {
    const storeGroupUserExist = await StoreUserModel.findOne({where:{store_uuid:input.store_uuid}});
    if (storeGroupUserExist){
      return { result: ResultCode.NOT_HAVE_PERMISSION, message: "store_uuid Registered"};
    }
    const store = await StoreUserModel.create(input);
    return { result: ResultCode.SUCCESS, data: resultStoreUserInfo(store)};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function updateAStoreUserByUUID(input) {
  try {
    const storeExist = await StoreUserModel.findOne({where:{store_uuid:input.store_uuid}});
    if (storeExist){
      storeExist.setDataValue("client_uuid", (input.client_uuid || storeExist.client_uuid));
      storeExist.setDataValue("user_uuid", (input.user_uuid || storeExist.user_uuid));
      storeExist.setDataValue("updated_at", Date.now());
      await storeExist.save();
      return { result: ResultCode.SUCCESS, data: resultStoreUserInfo(storeExist)};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found store uuid"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function deleteAStoreUserByUUID(input) {
  try {
    const storeExist = await StoreUserModel.destroy({where:{store_uuid:input.store_uuid}});
    if (storeExist){
      return { result: ResultCode.SUCCESS, data: {message: "Deleted" }};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found Store UUID"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}

export async function createAStoreStoreGroup(input) {
  try {
    const storeGroupUserExist = await StoreStoreGroupModel.findOne({where:{store_group_uuid:input.store_group_uuid}});
    if (storeGroupUserExist){
      return { result: ResultCode.NOT_HAVE_PERMISSION, message: "storeStoreGroupUUID Registered"};
    }
    const store = await StoreStoreGroupModel.create(input);
    return { result: ResultCode.SUCCESS, data: resultStoreStoreGroupInfo(store)};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function updateAStoreStoreGroupByUUID(input) {
  try {
    const isExist = await StoreStoreGroupModel.findOne({where:{store_group_uuid:input.store_group_uuid}});
    if (isExist){
      isExist.setDataValue("client_uuid", (input.client_uuid || isExist.client_uuid));
      isExist.setDataValue("store_uuid", (input.store_uuid || isExist.store_uuid));
      isExist.setDataValue("updated_at", Date.now());
      await isExist.save();
      return { result: ResultCode.SUCCESS, data: resultStoreStoreGroupInfo(isExist)};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found store uuid"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function deleteAStoreStoreGroupByUUID(input) {
  try {
    const storeExist = await StoreStoreGroupModel.destroy({where:{store_group_uuid:input.store_group_uuid}});
    if (storeExist){
      return { result: ResultCode.SUCCESS, data: {message: "Deleted" }};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found Store UUID"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}

export async function createAStoreGroup(input) {
  try {
    const storeGroupUserExist = await StoreGroupModel.findOne({where:{store_group_uuid:input.store_group_uuid}});
    if (storeGroupUserExist){
      return { result: ResultCode.NOT_HAVE_PERMISSION, message: "storeGroupUUID Registered"};
    }
    const store = await StoreGroupModel.create(input);
    return { result: ResultCode.SUCCESS, data: resultStoreGroupInfo(store)};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function updateAStoreGroupByUUID(input) {
  try {
    const isExist = await StoreGroupModel.findOne({where:{store_group_uuid:input.store_group_uuid}});
    if (isExist){
      isExist.setDataValue("client_uuid", (input.client_uuid || isExist.client_uuid));
      isExist.setDataValue("store_group", (input.store_group || isExist.store_group));
      isExist.setDataValue("updated_at", Date.now());
      await isExist.save();
      return { result: ResultCode.SUCCESS, data: resultStoreGroupInfo(isExist)};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found store uuid"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function deleteAStoreGroupByUUID(input) {
  try {
    const storeExist = await StoreGroupModel.destroy({where:{store_group_uuid:input.store_group_uuid}});
    if (storeExist){
      return { result: ResultCode.SUCCESS, data: {message: "Deleted" }};
    }
    return { result: ResultCode.NOT_FOUND, message: "Not found Store UUID"};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function getReportByTime(userId, pageIndex = 1, pageSize = 20, t = QueryBy.DAY) {
  const page = pageIndex > 0 ? +pageIndex : 1;
  const size = pageSize > 0 ? +pageSize : 50;
  const paging = { skip: (page - 1) * size, limit: +size };
  const order = { updated_at: SortBy.DESC };
  const d = new Date();
  const start = 1;
  const query = {
    where: {
      start_date: {
        "$gte": new Date("2018-03-01"),
        "$lt": new Date("2018-04-01")
      }
    }
  };

}
