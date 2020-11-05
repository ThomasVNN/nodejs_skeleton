import {ResultCode, QueryBy, SortBy, HttpStatus, HeaderFile} from "../constants/"
import {Configs} from "../configs/"
import { PG, AWS3,RS} from "../storages/"
import Utils from "../helpers/utils";
import uuidV4 from "uuid/v4";
const fs = require("fs");
import { StoreTargetModel,StoreModel,StoreStoreGroupModel} from "../models";
import {logger} from "../helpers/log";
import {StoreQueries} from "../storages/storeQueries";
import csv from "csvtojson";

function resultStoreWithTarget(emp,querDate) {
  return{
    storeUUID: emp.storeuuid || "NA",
    storeName: emp.storename || "NA",
    storeCode:emp.storecode||"",
    storeDayTarget: emp.salestarget || "0",
    storeMonthTarget: emp.momthly_target || "0",
    businessDate: emp.businessdate?(new Date(emp.businessdate).getBusinessDate()): querDate,
    storeGroupUUID: emp.store_groupuuid || "NA",
    storeGroupName: emp.store_groupname || "NA",
  };
}
function resultStoreOftion(emp) {
  return{
    storeStyle: emp.store_type || "NA",
    storeGroup: emp.store_group_name || "NA",
    storeGroupUUID: emp.store_group_uuid || "NA",
  }
}

function resultOrderByType(ordeList,filed,key) {
  let hotFreshMet = ordeList.groupByKey(filed)[key];
  if(hotFreshMet && hotFreshMet.length> 0){
    hotFreshMet =  hotFreshMet.groupAndSumByKey("channel","billnum");
    const CARRYOUT =  hotFreshMet.filter(item=>item.order_type ==="CARRYOUT");
    const DELIVERY =  hotFreshMet.filter(item=>item.order_type ==="DELIVERY");
    const totalBillDelivery =  DELIVERY.sumWithKey("billnum");
    const totalBillCarrYout =  CARRYOUT.sumWithKey("billnum");
    const percenSOS =   100*totalBillDelivery/(totalBillDelivery+totalBillCarrYout);
    return {
      "CARRYOUT":{
        "percent": percenSOS.toFixed(2),
        "list_detail": CARRYOUT.map((item)=>{return {"channel":item.channel ||"Null chanel", "value":parseInt(item.billnum) ||0}})
      },
      "DELIVERY":{
        "percent": ( 100- percenSOS).toFixed(2),
        "list_detail":DELIVERY.map((item)=>{return {"channel":item.channel ||"Null chanel", "value":parseInt(item.billnum) ||0}})
      }
    }
  }
  return {
    "CARRYOUT":{
      "percent": 0,
      "list_detail": []
    },
    "DELIVERY":{
      "percent": 0,
      "list_detail": []
    }
  }
}
async function createAStoreTarget(input){
  const condition ="SELECT " +
    "* from store_targets"+ ` WHERE store_code ='${input.store_code}'`+
    ` and business_date='${input.business_date}' LIMIT 1`;
  try {
    const  storeExist = await PG.query(false,condition);
    if (storeExist.rows.length === 1){
     const  update = "UPDATE store_targets" + ` SET sales_target='${input.sales_target}',business_date='${input.business_date}',store_code='${input.store_code}',business_month='${input.business_month}',` +
       `updated_at='${input.updated_at}' `+
       `WHERE storetarget_uuid = '${storeExist.rows[0].storetarget_uuid}'`;
      await PG.query(false,update);
      logger.info("update:",storeExist.rows[0].storetarget_uuid);
    }else{
      const temp = input
      temp.storetarget_uuid = uuidV4();
      logger.info("create:",temp.storetarget_uuid);

      await StoreTargetModel.create(temp);
    }
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function getListStoreTarget(param, pageIndex = 1, pageSize = 50) {
  try {
    const queries = StoreQueries.GetListStoreTargetPaging(param,pageIndex,pageSize);
    logger.info(queries);
    const  storeTargets = await PG.query(false,queries);
    const queryDate =  new Date(param.business_date).getBusinessDate();
    const result = {
    stores: storeTargets.rows.map((g) => {
        return resultStoreWithTarget(g,queryDate);
      }),
      total: storeTargets.rows.length > 0 ?   parseInt(storeTargets.rows[0].total) : 0
    }
    return { result: ResultCode.SUCCESS, data:result};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function getOptionsStoreTarget(client_uuid) {
  try {
    const queries =  StoreQueries.GetOptionStore(client_uuid);
    const  db  = await PG.query(false,queries);
    const storeTargets = db.rows.map((e)=>resultStoreOftion(e));
    const store_group_uuid = Utils.uniqByKeepLast( storeTargets,it=>it.storeGroupUUID);
    const storeTypes =  Utils.uniqByKeepLast( storeTargets,it=>it.storeStyle);
    const reult = {
        storeGroups: store_group_uuid,
        storeTypes: storeTypes,
    };
    return { result: ResultCode.SUCCESS, data:reult};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
export async function exportAStoreTarget(param) {
  try {
    const queries = StoreQueries.ExportListStoreTarget(param);
    const  storeTargets = await PG.query(false,queries);
    if(storeTargets.rows.length < 1) {
      return { result: ResultCode.SUCCESS, data:{"code":"NO_DATA"}} ;
    }

    const data = await storeTargets.rows.map((emp) => {
      return {
        store_code:emp.storecode||"",
        sales_target: emp.salestarget || "0",
        business_date: emp.businessdate?(new Date(emp.businessdate).getBusinessDate()): "NA",
      };
    })
    const name = `storeTarget-${uuidV4()}.csv`;
    const ws = await Utils.coverArrayToCSVFileAndUploadToS3(data, name);
    fs.unlinkSync(ws.path);
    return { result: ResultCode.SUCCESS, data:{url:ws.url}} ;
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}

export async function importStoreTarget(req) {
  try {
    const targets = await csv().fromString(req.file.buffer.toString("utf8"));
    if(targets.length <1 ){
      return { result: ResultCode.SUCCESS,data:{"code":"NO_DATA"}};
    }
    for (const e of targets) {
      const temp = e;
      const date = new Date(temp.business_date);
      if(temp.sales_target && parseInt(temp.sales_target) > 0 && isNaN(date.getBusinessDate())){
        temp.business_date = date.getBusinessDate();
        temp.business_month = date.getMonth()+1;
        temp.business_year = date.getFullYear();
        temp.sales_target = parseInt(temp.sales_target);
        temp.updated_at =  new Date().getBusinessDate();
        await createAStoreTarget(temp)
      }
    }
    return { result: ResultCode.SUCCESS,data:"ok"};
  }catch (err) {
    return { result: ResultCode.SUCCESS, data: err};
  }

}
export async function createAStoreTargetServices(param) {
  return createAStoreTarget(param);
}
export async function getSaleHistory(param) {
  try {
    const getListStoreUUIDQuery =await StoreQueries.GetStoreAndStoreGroupByUser(param);
    const  storeUUIDandStoreGroup = await PG.query(false,getListStoreUUIDQuery);
    const storeUUID = await storeUUIDandStoreGroup.rows.map(store=>store.store_uuid);
    const listStore = await [...new Set(storeUUID)].map((store)=>`'${store}'`).toString();
    const queries = await StoreQueries.GetSaleHistoryQuery(param,listStore);
    const  historySale  = await RS.query(false,queries);
    const date =await historySale.rows.groupAndSumByKey("channel","salenum","billnum");
    const totalSale = await date.sumWithKey("salenum");
    const totalBill = await date.sumWithKey("billnum");
    const hotFresResualt = await resultOrderByType(historySale.rows,"hot_fresh_met","Y");
    const sosReulat = await resultOrderByType(historySale.rows,"sos_kpi_met","Y");
    const result =  {
              "date": `${param.from}-${param.to}`,
              "channel_report":{
                "sales": {
                  "total": totalSale,
                  "list_detail": date.map((item)=>{return {"channel":item.channel ||"Null chanel", "value":parseInt(item.salenum) ||"Null sale"}})
                },
                "bill": {
                  "total": totalBill,
                  "list_detail": date.map((item)=>{return {"channel":item.channel ||"Null chanel", "value":parseInt(item.billnum) ||"Null bill"}})
                },
                "sos":sosReulat ,
                "fresh_hot":hotFresResualt
              }
            }
    return { result: ResultCode.SUCCESS, data:result};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}

export async function getTodaySale(param) {
  try {
    const getStoreAndStoreTargetMasterDataQuery =await StoreQueries.GetStoreAndStoreTargetMasterDataQuery(param);
    const  getStoreAndStoreTarget = await PG.query(false,getStoreAndStoreTargetMasterDataQuery);
    const storeUUID = await getStoreAndStoreTarget.rows.map(store=>store.storeuuid);
    const listStore = await [...new Set(storeUUID)].map((store)=>`'${store}'`).toString();
    const queries = await StoreQueries.GetStoreAndStoreTargeRedShiftQuery(param,listStore);
    const  historySale  = await RS.query(false,queries);
    const today =await historySale.rows.filter(item=>item.date ==param.date);
    const todaySale =await today.sumWithKey("salenum");
    const todayBill =await  today.sumWithKey("billnum");

    const monthTarget = await getStoreAndStoreTarget.rows.length > 0? parseInt(getStoreAndStoreTarget.rows[0].momthly_target):0;
    const monthlSale = await historySale.rows.sumWithKey("salenum");
    const dailyTarget =await  getStoreAndStoreTarget.rows.filter(item=>item.businessdate ==param.date);
    const sumDailyTarget =await dailyTarget.sumWithKey("salestarget");
    const sos = await today.groupByKey("sos_kpi_met")["Y"];
    let totalSOS =   0;
    if(sos && sos.length> 0){
      totalSOS = sos.length
    }
    const hotFreshMet = await today.groupByKey("hot_fresh_met")["Y"];
    let totalHotFresh = 0;
    if(hotFreshMet && hotFreshMet.length> 0){
      totalHotFresh = hotFreshMet.length
    }
    const channelReport = await today.groupAndSumByKey("channel","salenum","billnum");
    const deliveryMethod = await today.groupByKey("order_type");
    const sal = {
      DELIVERY: deliveryMethod.DELIVERY ? parseInt(deliveryMethod.DELIVERY.sumWithKey("salenum")):0,
      CARRYOUT: deliveryMethod.CARRYOUT ? parseInt(deliveryMethod.CARRYOUT.sumWithKey("salenum")):0,
    };
    const bil = {
      DELIVERY: deliveryMethod.DELIVERY ? parseInt(deliveryMethod.DELIVERY.sumWithKey("billnum")):0,
      CARRYOUT: deliveryMethod.CARRYOUT ? parseInt(deliveryMethod.CARRYOUT.sumWithKey("billnum")):0,
    };
    const result  = {
      date: param.date,
      salesReport: {
        totalSales: todaySale,
        totalBill: todayBill,
        sos:  totalSOS,
        freshHot: totalHotFresh,
      },
      targetStats: {
        dailyTarget: {
          target: {
            value: sumDailyTarget,
            percent: 100,
          },
          current: {
            value: todaySale
          },
        },
        monthlyTarget: {
          target: {
            value: monthTarget,
            percent: 100,
          },
          current: {
            value: monthlSale
          },
        }},
      channelReport: {
        sale: {
          listDetail: channelReport.map((item)=>{return {"channel":item.channel ||"Null chanel", "value":parseInt(item.salenum) ||"Null sale"}}),
        },
        bill: {
          listDetail: channelReport.map((item)=>{return {"channel":item.channel ||"Null chanel", "value":parseInt(item.billnum) ||"Null bill"}}),
        },
      },
      deliveryMethod: {
        sale: sal,
        bill: bil,
      }
    }
    return { result: ResultCode.SUCCESS, data:result};
  }catch (err) {
    return { result: ResultCode.BAD_INPUT_DATA, data: err};
  }
}
