import Sequelize from "sequelize";
import {PG} from "../storages/"
import {SchemaName} from "../constants";

const schema = PG.sequelize.define(SchemaName.STORE_GROUP_USER, {
  client_uuid:  {type: Sequelize.STRING(36), allowNull: false},
  storegroup_uuid: {type: Sequelize.STRING(36), allowNull: false},
  user_uuid: {type: Sequelize.STRING(36), allowNull: false},
  storegroupuser_uuid: {type: Sequelize.STRING(36), allowNull: false},
  created_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
  updated_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
}, {
  timestamps: false
});
schema.removeAttribute("id");
export const StoreGroupUserModel = schema;
