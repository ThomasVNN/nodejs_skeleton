import {Configs} from "../../configs"
import Sequelize from "sequelize";


const { Pool } = require("pg")
const globalPool = new Pool(Configs.PG_CONFIG);

export async function connect() {
  try {
    return await globalPool.connect();
  } catch (error) {
    return error
  }
}

export function disconnect() {
  return globalPool.disconnect();
}

export async function query (p= false, q = "") {
  let pool = globalPool;
  if (p){
    pool = new Pool(Configs.PG_CONFIG);
  }
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    try {
      res = await client.query(q);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
}

export const sequelize =  new Sequelize(Configs.SEQUELIZE_URL, {
    host: Configs.PG_HOST,
    dialect:"postgres",
    define: {
    //prevent sequelize from pluralizing table names
      freezeTableName: true
    },
    pool:{
      max:10,
      min:0,
      idle:10000
    },
    logging: false
  }
);
sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });
