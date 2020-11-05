import Sequelize from "sequelize";
import {PG} from "../storages/"
import {SchemaName} from "../constants";

const schema = PG.sequelize.define(SchemaName.STORE_STOREGROUP, {
  client_uuid:  {type: Sequelize.STRING(36), allowNull: false},
  store_uuid: {type: Sequelize.STRING(36), allowNull: false},
  store_group_uuid: {type: Sequelize.STRING(36), allowNull: false},
  created_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
  updated_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
  store_storegroup_uuid: {type: Sequelize.STRING(36), allowNull: false}

}, {
  timestamps: false
});
schema.removeAttribute("id");
export const StoreStoreGroupModel = schema;
