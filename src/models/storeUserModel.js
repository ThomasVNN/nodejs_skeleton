import Sequelize from "sequelize";
import {PG} from "../storages/"
import {SchemaName} from "../constants";

const schema = PG.sequelize.define(SchemaName.STORE_USER, {
  client_uuid: {type: Sequelize.STRING(36), allowNull: false},
  store_uuid: {type: Sequelize.STRING(36),allowNull: false},
  user_uuid: {type: Sequelize.STRING(36)},
  created_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
  updated_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
  storeuser_uuid: {type: Sequelize.STRING(36), allowNull: false},
  store_group_uuid: {type: Sequelize.STRING(36), allowNull: false}

}, {
  timestamps: false
});
schema.removeAttribute("id");
export const StoreUserModel = schema;
