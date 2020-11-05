import {logger} from "../../helpers/log";

/**
 * @return {string}
 */
export const GetOptionStore = function(client_uuid) {
    return "SELECT store.store_type, gr.store_group_name, gr.store_group_uuid " +
      "from store_storegroup as storegroup " +
      "INNER JOIN stores AS store ON storegroup.store_uuid = store.store_uuid " +
      "INNER JOIN store_groups AS gr ON gr.store_group_uuid = storegroup.store_group_uuid " +
      `WHERE store.client_uuid= '${client_uuid}'` +
      "GROUP BY gr.store_group_name, store.store_type,gr.store_group_uuid";
  };

/**
 * @return {string}
 */
export const GetListStoreTargetPaging = function (param, pageIndex = 0,pageSize =50 ) {
  const p = pageIndex > 0 ? +pageIndex : 1;
  const s = pageSize > 50 ? 50: +pageSize ;
  const mont = new Date(param.business_date).getMonth() +1 ;
  let condition = `WHERE t1.clientuuid = '${param.client_uuid}'`;
  if(param.store_group_uuid !== undefined) {
    condition += ` AND t1.store_groupuuid = '${param.store_group_uuid}'`;
  }
  if(param.store_type !== undefined) {
    condition += ` AND t1.storetype = '${param.store_type}'`;
  }

  const  query = ";with t1 as ( SELECT  COUNT(*) OVER() as total, store.store_uuid as storeuuid,gr.store_group_uuid as store_groupuuid,  store.store_name as storename," +
    " store.store_code as storecode, store.store_type as storetype, gr.store_group_name as store_groupname,store.client_uuid as clientuuid " +
    " FROM store_storegroup as storegroup" +
    " INNER JOIN stores AS store ON storegroup.store_uuid = store.store_uuid " +
    " INNER JOIN store_groups AS gr ON gr.store_group_uuid = storegroup.store_group_uuid " +
    ` WHERE store.client_uuid ='${param.client_uuid}' ` + "),t2 as ( select store_code, sum(sales_target) as momthly_target  from store_targets " +
    ` WHERE business_month ='${mont}' ` + "group by store_code ), t3 as ( select target.store_code as storecode, target.sales_target as salestarget," +
    "TO_CHAR(target.business_date, 'YYYY-MM-DD') as businessdate from store_targets as target " +  ` WHERE target.business_date ='${param.business_date}')` +
    "select t1.total, t1.storeuuid,t1.storename, t1.storecode, t1.store_groupuuid, t1.store_groupname, t3.salestarget, t3.businessdate,t2.momthly_target " +
    "from t1 full outer join t2 on t1.storecode = t2.store_code full outer join t3 on t1.storecode = t3.storecode " +condition + ` OFFSET ${(p - 1) * s} LIMIT ${+s }`;
  return query;

};



/**
 * @return {string}
 */
//TODO need check from to
export const ExportListStoreTarget = function (param) {
  let condition = `WHERE t1.clientuuid = '${param.client_uuid}' AND t3.businessdate between '${param.from}' AND '${param.to}' `;
  if(param.store_group_uuid !== undefined) {
    condition += ` AND t1.store_groupuuid = '${param.store_group_uuid}'`;
  }
  if(param.store_type !== undefined) {
    condition += ` AND t1.storetype = '${param.store_type}'`;
  }

//
  const  query = ";with t1 as ( SELECT  COUNT(*) OVER() as total, store.store_uuid as storeuuid,gr.store_group_uuid as store_groupuuid,  store.store_name as storename," +
    " store.store_code as storecode, store.store_type as storetype, gr.store_group_name as store_groupname,store.client_uuid as clientuuid " +
    " FROM store_storegroup as storegroup" +
    " INNER JOIN stores AS store ON storegroup.store_uuid = store.store_uuid " +
    " INNER JOIN store_groups AS gr ON gr.store_group_uuid = storegroup.store_group_uuid " +
    ` WHERE store.client_uuid ='${param.client_uuid}' ` + "), t3 as ( select target.store_code as storecode, target.sales_target as salestarget," +
    "TO_CHAR(target.business_date, 'YYYY-MM-DD') as businessdate from store_targets as target )"+
    "select t1.total, t1.storeuuid,t1.storename, t1.storecode, t1.store_groupuuid, t1.store_groupname, t3.salestarget, t3.businessdate " +
    "from t1 full outer join t3 on t1.storecode = t3.storecode " +condition ;
  return query;

};


/**
 * @return {string}
 */
export const GetStoreAndStoreGroupByUser = function (param) {
  let condition = `WHERE store.client_uuid = '${param.client_uuid}' `;
  if(param.store_group_uuid !== undefined) {
    condition += ` AND gr.store_group_uuid = '${param.store_group_uuid}' `;
  }
  if(param.store_type !== undefined) {
    condition += ` AND store.store_type = '${param.store_type}' `;
  }
  return "SELECT store.store_type, store.store_uuid, gr.store_group_name, gr.store_group_uuid " +
    "from store_storegroup as storegroup INNER JOIN stores AS store ON storegroup.store_uuid = store.store_uuid " +
    "INNER JOIN store_groups AS gr " + "ON gr.store_group_uuid = storegroup.store_group_uuid " +condition ;
};

/**
 * @return {string}
 */
export const GetListProductMixPaging = function (param,  pageIndex = 1,pageSize =50 ,sort) {
  const p = pageIndex > 0 ? +pageIndex : 1;
  const s = pageSize > 50 ? 50: +pageSize ;
  const  sof = sort==="DESC"?"DESC":"ASC";
  return ("SELECT detail.product_name, detail.store_uuid, detail.product_code, count(*) as quantity, count(*) OVER() AS total " +
    "FROM order_details as detail WHERE detail.store_uuid in "+
    ` ( ${param} ) GROUP BY detail.product_code, detail.product_name, detail.store_uuid ORDER BY quantity ${sof} OFFSET ${(p - 1) * s} LIMIT ${+s }`);
};


/**
 * @return {string}
 */
export const GetSaleHistoryQuery = function (param,listStore) {
  return "SELECT channel, COUNT(transaction_value_with_tax) as billNum," +
    "SUM(transaction_value_with_tax) as saleNum, sos_kpi_met, hot_fresh_met,TO_CHAR(order_date, 'YYYY-MM-DD') as date,order_type " +
    "FROM orders WHERE store_uuid in "+ `(${listStore})` + ` AND client_uuid='${param.client_uuid}' AND order_date between '${param.from}' AND '${param.to}' GROUP BY channel,hot_fresh_met,sos_kpi_met,order_date,order_type;` ;
};


/**
 * @return {string}
 */
export const GetStoreAndStoreTargetMasterDataQuery = function (param) {
  const mont = new Date(param.date).getMonth() +1 ;
  let condition = `WHERE t1.clientuuid = '${param.client_uuid}'`;
  if(param.store_group_uuid !== undefined) {
    condition += ` AND t1.store_groupuuid = '${param.store_group_uuid}'`;
  }
  if(param.store_type !== undefined) {
    condition += ` AND t1.storetype = '${param.store_type}'`;
  }

  const  query = ";with t1 as ( SELECT  store.store_uuid as storeuuid, gr.store_group_uuid as store_groupuuid, " +
    " store.store_code as storecode, store.store_type as storetype, store.client_uuid as clientuuid " +
    " FROM store_storegroup as storegroup" +
    " INNER JOIN stores AS store ON storegroup.store_uuid = store.store_uuid " +
    " INNER JOIN store_groups AS gr ON gr.store_group_uuid = storegroup.store_group_uuid " +
    ` WHERE store.client_uuid ='${param.client_uuid}' ` + "),t2 as ( select store_code, sum(sales_target) as momthly_target  from store_targets " +
    ` WHERE business_month ='${mont}' ` + "group by store_code ), t3 as ( select target.store_code as storecode, target.sales_target as salestarget," +
    "TO_CHAR(target.business_date, 'YYYY-MM-DD') as businessdate from store_targets as target )"  +
    "select  t1.storeuuid,  t1.storecode, t1.store_groupuuid, t3.salestarget, t3.businessdate, t2.momthly_target " +
    "from t1 full outer join t2 on t1.storecode = t2.store_code full outer join t3 on t1.storecode = t3.storecode " +condition;
  return query;
};
/**
 * @return {string}
 */
export const GetStoreAndStoreTargeRedShiftQuery = function (param,listStore) {
  const mont = new Date(param.date).getMonth() +1 ;
  return "SELECT channel,store_uuid, COUNT(transaction_value_with_tax) as billNum, SUM(transaction_value_with_tax) as saleNum,order_type," +
    "TO_CHAR(order_date, 'YYYY-MM-DD') as date FROM orders  WHERE store_uuid in "+ `(${listStore})` + ` AND client_uuid='${param.client_uuid}' AND business_month='${mont}'`+
    "  GROUP BY channel,order_date,store_uuid,order_type" ;
};
