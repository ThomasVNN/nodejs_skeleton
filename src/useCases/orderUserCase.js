import { ResultCode, QueryBy, SortBy} from "../constants/"
import {OrderModel} from "../models";
import {logger} from "../helpers/log";
import {StoreQueries} from "../storages/storeQueries";

import uuidV4 from "uuid/v4";
import {PG, RS} from "../storages";

function baseResultAnalytics(emp) {
  return {
    createDate:  new Date(emp.created_at).toISOString()|| "NA",
    updateDate: new Date(emp.updated_at).toISOString()|| "NA"
  }
}

function resultStoreProductInfo(emp) {
  return{
    storeGroupUUID: emp.store_uuid || "NA",
    storeGroupName:emp.store_group_name || "",
    productName: emp.product_name || "NA",
    storeType: emp.store_type ||"Meoww",
    productCode:emp.product_code ||"Meoww",
    quantity:emp.quantity || 0
  }
}
function resultStoreProductList(emp) {
  return {
    productUUID: emp.product_uuid || "NA",
    productName: emp.product_name || "NA",
    productCode:emp.product_code ||"Meoww",
    storeUUID: emp.store_uuid ||"Meoww",
    storeType:emp.store_type ||"Meoww",
    storeGroupUUID:emp.store_group_uuid ||"Meoww",
    quantity:emp.quantity || 0
  }
}
export async function createAnOrder(input) {
  try {
    const store = await OrderModel.create(input);
    return { result: ResultCode.SUCCESS, data: resultStoreProductInfo(store)};
  }catch (err) {
    logger.error(err);
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}

export async function getListProductMix(param, pageIndex = 1, pageSize = 50) {
  try {
    const getListStoreUUIDQuery =await StoreQueries.GetStoreAndStoreGroupByUser(param);
    const  storeUUIDandStoreGroup = await PG.query(false,getListStoreUUIDQuery);
    const list = await storeUUIDandStoreGroup.rows.map((store)=>`'${store.store_uuid}'`).toString();
    const getProductMixQuery =await StoreQueries.GetListProductMixPaging(list,pageIndex,pageSize,param.sort);
    logger.info("getProductMixQuery:",getProductMixQuery);
    const productMixQR = await RS.query(false,getProductMixQuery);
    const merge = productMixQR.rows.map((product) =>{
      const mes = product;
      storeUUIDandStoreGroup.rows.forEach((store)=>{
        if(mes.store_uuid === store.store_uuid) {
          mes.store_group_name = store.store_group_name;
          mes.store_type = store.store_type;
          return mes;
        }
      });
      return mes;
    });
    const result = {
      stores: merge.map((g) => {
        return resultStoreProductInfo(g);
      }),
      total: merge.length > 0 ?   parseInt(merge[0].total) : 0
    }

    return { result: ResultCode.SUCCESS, data: result};
  } catch (err) {
    return {result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
