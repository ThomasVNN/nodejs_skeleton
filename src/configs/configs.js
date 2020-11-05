import dotEnv from "dotenv";
import { TEST } from "./env";
import { join } from "path";
import {Configs} from "./index";

const env = process.env.NODE_ENV;
if (env === TEST) {
  dotEnv.config({ path: join(__dirname, "../../.test.env") });
} else {
  dotEnv.config();
}

const NODE_ENV = env || "development";
export { NODE_ENV };
// server configurations
export const AUTH_API = process.env.AUTH_API || "Default value";
export const SYSTEM_API = process.env.SYSTEM_API || "Default value";
export const CLIENT_UUID = process.env.CLIENT_UUID || "Default value";

// S3 config
export const S3_BUCKET = process.env.S3_BUCKET ||"Default value";
export const S3_AWS_ENDPOINT = "Default value";
export const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || "Default value";
export const S3_SECRET_KEY = process.env.S3_SECRET_KEY || "Default value";
export const S3_FOLDER = process.env.S3_FOLDER || "Default value";
export const S3_API_VERSION = "Default value";

//  #POSDEV
export const URL_REDSHIFT = process.env.URL_REDSHIFT || "Default value";
export const DB_REDSHIFT = process.env.DB_REDSHIFT || "Default value";
export const USERNAME_REDSHIFT = process.env.USERNAME_REDSHIFT || "Default value";
export const PASSWORD_REDSHIFT = process.env.PASSWORD_REDSHIFT || "Default value";

//TESTING
export const PHJ_REDSHIFT_TEST = process.env.PHJ_REDSHIFT_TEST || "Default value";
export const USERNAME_PHJ_REDSHIFT_TEST = process.env.USERNAME_PHJ_REDSHIFT_TEST || "Default value";
export const PASSWORD_PHJ_REDSHIFT_TEST = process.env.PASSWORD_PHJ_REDSHIFT_TEST || "Default value";

//APP
export const APP_PORT = process.env.APP_PORT || 9027;
export const LOGGING = process.env.LOGGING || false;
export const TMP_FOLDER_LAMBDA = process.env.TMP_FOLDER_LAMBDA || "/tmp";

//DB MONGO
export const DB_URI = process.env.DB_URI ||"Default value";
export const DB_NAME = process.env.DB_NAME || "Default value";
export const DATABASE_URL = `${DB_URI}/${DB_NAME}`;
// DB PG
export const PG_HOST  = process.env.PG_HOST || "Default value";
export const PG_PORT  = process.env.PG_PORT || "Default value";
export const PG_USER  = process.env.PG_USER ||"Default value";
export const PG_PASSWORD  = process.env.PG_PASSWORD ||"Default value";
export const PG_DB_NAME  = process.env.PG_DB_NAME ||"Default value";
export const PG_CONFIG = {
  user: PG_USER,
  host: PG_HOST,
  database: PG_DB_NAME,
  password: PG_PASSWORD,
  port: PG_PORT,
  max: 10,
  idleTimeoutMillis: 30000
};

//REDDSHIFT DB
export const RS_HOST  = process.env.RS_HOST ||"Default value";
export const RS_PORT  = process.env.RS_PORT ||5439;
export const RS_USER  = process.env.RS_USER ||"pos";
export const RS_PASSWORD  = process.env.RS_PASSWORD ||"Default value";
export const RS_DB_NAME  = process.env.RS_DB_NAME ||"Default value";
export const RS_CONFIG = {
  user: RS_USER,
  host: RS_HOST,
  database: RS_DB_NAME,
  password: RS_PASSWORD,
  port: RS_PORT,
  max: 10,
  idleTimeoutMillis: 30000
};

export const SEQUELIZE_URL = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB_NAME}`;

//Cloud GCP_POS
export const GCP_PROJECT_TYPE = process.env.GCP_PROJECT_TYPE || "Default value";
export const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID || "Default value";
export const GCP_PROJECT_PRIVATE_KEY_ID = process.env.GCP_PROJECT_PRIVATE_KEY_ID || "Default value";
export const GCP_GCP_PROJECT_PRIVATE_KEY = process.env.GCP_GCP_PROJECT_PRIVATE_KEY ||"Default value";
export const GCP_PROJECT_CLIENT_EMAIL = process.env.GCP_PROJECT_CLIENT_EMAIL || "Default value";
export const GCP_PROJECT_CLIENT_ID = process.env.GCP_PROJECT_CLIENT_ID || "Default value";
export const GCP_PROJECT_AUTH_URI = process.env.GCP_PROJECT_AUTH_URI || "Default value";
export const GCP_PROJECT_TOKEN_URI = process.env.GCP_PROJECT_TOKEN_URI || "Default value";
export const GCP_PROJECT_AUTH_CERT_URL = process.env.GCP_PROJECT_AUTH_CERT_URL || "Default value";
export const GCP_PROJECT_AUTH_CLIENT_CERT_URL = process.env.GCP_PROJECT_AUTH_CLIENT_CERT_URL || "Default value";
// Auth Server
export const AUTH_SERVER = process.env.AUTH_SERVER;
export const AUTH_WITH_SERVER = process.env.AUTH_WITH_SERVER;
