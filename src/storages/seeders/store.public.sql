/*
 Navicat Premium Data Transfer

 Source Server         : DEV_DataWH-MasterDB
 Source Server Type    : PostgreSQL
 Source Server Version : 110008
 Source Host           : cloudpospg.cmckfsruhnjy.ap-southeast-1.rds.amazonaws.com:8888
 Source Catalog        : analytics_dev
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 110008
 File Encoding         : 65001

 Date: 25/08/2020 06:50:00
*/


-- ----------------------------
-- Table structure for store_groups
-- ----------------------------
DROP TABLE IF EXISTS "public"."store_groups";
CREATE TABLE "public"."store_groups" (
                                         "store_group" varchar(36) COLLATE "pg_catalog"."default",
                                         "store_group_uuid" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
                                         "created_at" timestamp(6),
                                         "updated_at" timestamp(6)
)
;
ALTER TABLE "public"."store_groups" OWNER TO "pos";

-- ----------------------------
-- Table structure for store_orders
-- ----------------------------
DROP TABLE IF EXISTS "public"."store_orders";
CREATE TABLE "public"."store_orders" (
                                         "business_date" varchar(4) COLLATE "pg_catalog"."default",
                                         "business_month" varchar(6) COLLATE "pg_catalog"."default",
                                         "business_year" varchar(4) COLLATE "pg_catalog"."default",
                                         "business_quater" varchar(1) COLLATE "pg_catalog"."default",
                                         "business_hour" varchar(2) COLLATE "pg_catalog"."default",
                                         "order_uuid" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
                                         "client_uuid" varchar(36) COLLATE "pg_catalog"."default",
                                         "channel" varchar(255) COLLATE "pg_catalog"."default",
                                         "store_uuid" varchar(36) COLLATE "pg_catalog"."default",
                                         "customer_uuid" varchar(36) COLLATE "pg_catalog"."default",
                                         "order_type" varchar(128) COLLATE "pg_catalog"."default",
                                         "order_device" varchar(128) COLLATE "pg_catalog"."default",
                                         "delivery_address" varchar(255) COLLATE "pg_catalog"."default",
                                         "created_at" timestamp(6),
                                         "updated_at" timestamp(6),
                                         "order_time" timestamp(6),
                                         "sos" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."store_orders" OWNER TO "pos";

-- ----------------------------
-- Table structure for store_products
-- ----------------------------
DROP TABLE IF EXISTS "public"."store_products";
CREATE TABLE "public"."store_products" (
                                           "product_uuid" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
                                           "product_name" varchar(255) COLLATE "pg_catalog"."default",
                                           "product_code" varchar(255) COLLATE "pg_catalog"."default",
                                           "store_uuid" varchar(36) COLLATE "pg_catalog"."default",
                                           "created_at" timestamp(6),
                                           "updated_at" timestamp(6),
                                           "quantity" int4
)
;
ALTER TABLE "public"."store_products" OWNER TO "pos";

-- ----------------------------
-- Table structure for store_storegroup
-- ----------------------------
DROP TABLE IF EXISTS "public"."store_storegroup";
CREATE TABLE "public"."store_storegroup" (
                                             "client_uuid" varchar(36) COLLATE "pg_catalog"."default",
                                             "store_group_uuid" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
                                             "store_uuid" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
                                             "created_at" timestamp(6),
                                             "updated_at" timestamp(6)
)
;
ALTER TABLE "public"."store_storegroup" OWNER TO "pos";

-- ----------------------------
-- Table structure for store_targets
-- ----------------------------
DROP TABLE IF EXISTS "public"."store_targets";
CREATE TABLE "public"."store_targets" (
                                          "client_uuid" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
                                          "sales_target" varchar(53) COLLATE "pg_catalog"."default",
                                          "business_date" varchar(4) COLLATE "pg_catalog"."default",
                                          "business_month" varchar(6) COLLATE "pg_catalog"."default",
                                          "business_year" varchar(4) COLLATE "pg_catalog"."default",
                                          "store_uuid" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
                                          "created_at" timestamp(6),
                                          "updated_at" timestamp(6)
)
;
ALTER TABLE "public"."store_targets" OWNER TO "pos";

-- ----------------------------
-- Table structure for store_user
-- ----------------------------
DROP TABLE IF EXISTS "public"."store_user";
CREATE TABLE "public"."store_user" (
                                       "client_uuid" varchar(36) COLLATE "pg_catalog"."default",
                                       "store_uuid" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                       "user_uuid" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                       "created_at" timestamp(6),
                                       "updated_at" timestamp(6)
)
;
ALTER TABLE "public"."store_user" OWNER TO "pos";

-- ----------------------------
-- Table structure for storegroup_user
-- ----------------------------
DROP TABLE IF EXISTS "public"."storegroup_user";
CREATE TABLE "public"."storegroup_user" (
                                            "client_uuid" varchar(36) COLLATE "pg_catalog"."default",
                                            "storegroup_uuid" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
                                            "user_uuid" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
                                            "created_at" timestamp(6),
                                            "updated_at" timestamp(6)
)
;
ALTER TABLE "public"."storegroup_user" OWNER TO "pos";

-- ----------------------------
-- Table structure for stores
-- ----------------------------
DROP TABLE IF EXISTS "public"."stores";
CREATE TABLE "public"."stores" (
                                   "client_uuid" varchar(36) COLLATE "pg_catalog"."default",
                                   "store_code" varchar(36) COLLATE "pg_catalog"."default",
                                   "store_uuid" varchar(36) COLLATE "pg_catalog"."default" NOT NULL,
                                   "store_name" varchar(100) COLLATE "pg_catalog"."default",
                                   "active" varchar(1) COLLATE "pg_catalog"."default",
                                   "store_lat" varchar(50) COLLATE "pg_catalog"."default",
                                   "store_long" varchar(50) COLLATE "pg_catalog"."default",
                                   "store_type" varchar(50) COLLATE "pg_catalog"."default",
                                   "created_at" timestamp(6),
                                   "updated_at" timestamp(6),
                                   "store_group_uuid" varchar(36) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."stores" OWNER TO "pos";

-- ----------------------------
-- Primary Key structure for table store_groups
-- ----------------------------
ALTER TABLE "public"."store_groups" ADD CONSTRAINT "store_groups_pkey" PRIMARY KEY ("store_group_uuid");

-- ----------------------------
-- Primary Key structure for table store_orders
-- ----------------------------
ALTER TABLE "public"."store_orders" ADD CONSTRAINT "store_orders_pkey" PRIMARY KEY ("order_uuid");

-- ----------------------------
-- Primary Key structure for table store_products
-- ----------------------------
ALTER TABLE "public"."store_products" ADD CONSTRAINT "store_products_pkey" PRIMARY KEY ("product_uuid");

-- ----------------------------
-- Foreign Keys structure for table store_products
-- ----------------------------
ALTER TABLE "public"."store_products" ADD CONSTRAINT "store_detail" FOREIGN KEY ("store_uuid") REFERENCES "public"."stores" ("store_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Primary Key structure for table store_storegroup
-- ----------------------------
ALTER TABLE "public"."store_storegroup" ADD CONSTRAINT "store_storegroup_pkey" PRIMARY KEY ("store_group_uuid");

-- ----------------------------
-- Foreign Keys structure for table store_targets
-- ----------------------------
ALTER TABLE "public"."store_targets" ADD CONSTRAINT "store_details" FOREIGN KEY ("store_uuid") REFERENCES "public"."stores" ("store_uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Primary Key structure for table store_user
-- ----------------------------
ALTER TABLE "public"."store_user" ADD CONSTRAINT "store_user_pkey" PRIMARY KEY ("store_uuid");

-- ----------------------------
-- Primary Key structure for table storegroup_user
-- ----------------------------
ALTER TABLE "public"."storegroup_user" ADD CONSTRAINT "storegroup_user_pkey" PRIMARY KEY ("storegroup_uuid");

-- ----------------------------
-- Primary Key structure for table stores
-- ----------------------------
ALTER TABLE "public"."stores" ADD CONSTRAINT "store_pkey" PRIMARY KEY ("store_uuid");
