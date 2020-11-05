import Sequelize from "sequelize";
import {PG} from "../storages/"
import {SchemaName} from "../constants";

const schema = PG.sequelize.define(SchemaName.STORE_GROUP, {
  store_group_uuid: {type: Sequelize.STRING(36), allowNull: false},
  client_uuid:  {type: Sequelize.STRING(36), allowNull: false},
  store_group: {type: Sequelize.STRING(36)},
  created_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
  updated_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
}, {
  timestamps: false
});
schema.removeAttribute("id");
export const StoreGroupModel = schema;
