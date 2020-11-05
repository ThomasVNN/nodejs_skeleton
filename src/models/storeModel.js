import Sequelize from "sequelize";
import {PG} from "../storages/"
import {SchemaName} from "../constants";

const schema = PG.sequelize.define(SchemaName.STORE, {
  client_uuid: {type: Sequelize.STRING(36), allowNull: false},
  store_code: {type: Sequelize.STRING(36),allowNull: false},
  store_uuid: {type: Sequelize.STRING(36),allowNull: false},
  store_name: {type: Sequelize.STRING(100),allowNull: false},
  active: {type: Sequelize.STRING(1),defaultValue:"Y"},
  store_lat: {type: Sequelize.STRING(50)},
  store_long: {type: Sequelize.STRING(50)},
  store_type: {type: Sequelize.STRING(50)},
  store_group_uuid: {type: Sequelize.STRING(36), allowNull: false},
  created_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
  updated_at: {type: Sequelize.DATE(6),defaultValue:Date.now()},
}, {
  timestamps: false
});


schema.removeAttribute("id");
export const StoreModel = schema;
