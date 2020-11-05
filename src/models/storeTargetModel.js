import Sequelize from "sequelize";
import {PG} from "../storages/"
import {SchemaName} from "../constants";
const schema = PG.sequelize.define(SchemaName.STORE_TARGET_MODEL, {
  sales_target: {type: Sequelize.NUMBER(53), allowNull: false},
  business_date: {type: Sequelize.DATE},
  business_month: {type: Sequelize.STRING(2)},
  business_year: {type: Sequelize.STRING(4)},
  store_code: {type: Sequelize.STRING(36),allowNull: false},
  created_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
  updated_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
  storetarget_uuid: {type: Sequelize.STRING(36),allowNull: false},

}, {
  timestamps: false
});

schema.removeAttribute("id");


export const StoreTargetModel = schema;
