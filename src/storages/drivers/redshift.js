import {Configs} from "../../configs"
const {Pool} = require("pg")
const globalPool = new Pool(Configs.RS_CONFIG);

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
    pool = new Pool(Configs.RS_CONFIG);
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

