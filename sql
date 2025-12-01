
-- =========================
-- ENUM TYPE DEFINITIONS
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quality_packaging_status_enum') THEN
    CREATE TYPE quality_packaging_status_enum AS ENUM ('ok','damaged','compromised');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quality_expiry_status_enum') THEN
    CREATE TYPE quality_expiry_status_enum AS ENUM ('valid','near_expiry','expired');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quality_result_enum') THEN
    CREATE TYPE quality_result_enum AS ENUM ('passed','failed','conditional');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'purchase_order_status_enum') THEN
    CREATE TYPE purchase_order_status_enum AS ENUM ('draft','submitted','approved','partially_received','received','cancelled');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status_enum') THEN
    CREATE TYPE user_status_enum AS ENUM ('active','inactive','suspended');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'location_type_enum') THEN
    CREATE TYPE location_type_enum AS ENUM ('branch','warehouse','external','supplier','quarantine');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'location_status_enum') THEN
    CREATE TYPE location_status_enum AS ENUM ('active','inactive');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'product_drug_type_enum') THEN
    CREATE TYPE product_drug_type_enum AS ENUM ('otc','prescription','controlled','supplement');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supplier_active_status_enum') THEN
    CREATE TYPE supplier_active_status_enum AS ENUM ('active','inactive');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'goods_receipt_condition_enum') THEN
    CREATE TYPE goods_receipt_condition_enum AS ENUM ('ok','damaged','pending_inspection','rejected');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'batch_stock_type_enum') THEN
    CREATE TYPE batch_stock_type_enum AS ENUM ('available','near_expiry','removed','expired','disposed','damaged','quarantined');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_transfer_status_enum') THEN
    CREATE TYPE stock_transfer_status_enum AS ENUM ('draft','submitted','shipped','received','cancelled');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'replenishment_request_status_enum') THEN
    CREATE TYPE replenishment_request_status_enum AS ENUM ('pending','accepted','rejected','fulfilled','cancelled');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rfq_supplier_status_enum') THEN
    CREATE TYPE rfq_supplier_status_enum AS ENUM ('pending','quoted','declined');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rfq_status_enum') THEN
    CREATE TYPE rfq_status_enum AS ENUM ('draft','sent','closed','cancelled');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_name_enum') THEN
    CREATE TYPE role_name_enum AS ENUM ('admin','manager','pharmacist','warehouse_clerk','viewer');
  END IF;
END $$;

-- =========================
-- TABLES (Original naming preserved)
-- =========================

CREATE TABLE "QualityInspection" (
  "inspection_id" serial PRIMARY KEY,
  "GRN_id" int,
  "BatchId" int,
  "Temperature_check" boolean,
  "Packaging_status" quality_packaging_status_enum,
  "Expiry_status" quality_expiry_status_enum,
  "QCResult" quality_result_enum,
  "Inspector_name" varchar(30),
  "inspectionDate" date
);

CREATE TABLE "ingredients" (
  "id" serial PRIMARY KEY,
  "name" varchar(30),
  "description" text,
  "is_active" boolean
);

CREATE TABLE "PurchaseOrder" (
  "po_id" serial PRIMARY KEY,
  "requested_by" int,
  "supplier_id" int,
  "po_number" int,
  "order_date" date,
  "expected_date" date,
  "status" purchase_order_status_enum,
  "total_amount" int
);

CREATE TABLE "categories" (
  "cat_id" serial PRIMARY KEY,
  "name" varchar(30),
  "description" text
);

CREATE TABLE "Users" (
  "user_id" serial PRIMARY KEY,
  "user_name" varchar,
  "password_hash" varchar,
  "full_name" varchar,
  "email" varchar,
  "phone" varchar,
  "role_id" int,
  "location_id" int,
  "status" user_status_enum
);

CREATE TABLE "roles_permission_id" (
  "permission_id" int,
  "role_id" int
);

CREATE TABLE "measurement_units" (
  "m_id" serial PRIMARY KEY,
  "name" varchar(30),
  "is_base_unit" boolean,
  "con_fact" int,
  "description" text,
  "sympol" varchar(30)
);

CREATE TABLE "SupplierPerformace" (
  "SupplierId" serial PRIMARY KEY,
  "AverageLeadTime" int,
  "LeadTimeVariance" int,
  "FillRate" decimal(5,2),
  "OTIF" decimal(5,2),
  "ShelfLifeCompliance" float,
  "ReturnRate" decimal(5,2),
  "RatingUpdateDate" date
);

CREATE TABLE "location_stock_level" (
  "id" serial PRIMARY KEY,
  "product_id" integer,
  "location_id" smallint,
  "stock_type" varchar(13),
  "on_hand_quantity" integer,
  "dispatch_method" varchar(50)
);

CREATE TABLE "Location" (
  "location_id" serial PRIMARY KEY,
  "location_name" varchar,
  "location_type" location_type_enum,
  "parent_location" int,
  "is_direct_to_main" boolean,
  "address" varchar,
  "status" location_status_enum
);

CREATE TABLE "Products" (
  "product_id" serial PRIMARY KEY,
  "name" varchar(40),
  "barcode" varchar(130),
  "SKU" varchar(64),
  "scientific_name" varchar(40),
  "description" text,
  "cost" integer,
  "selling_price" integer,
  "concentration" varchar(10),
  "daily_dosage" smallint,
  "Manufacturer" varchar(30),
  "is_drug" boolean,
  "controlled_substance" boolean,
  "Substitutable" boolean,
  "Max allowed units" smallint,
  "Break packs allowed" boolean,
  "drug_type" product_drug_type_enum,
  "Category ID" smallint,
  "safety_stock_expiry_threshold" smallint,
  "reorder_quantity" int,
  "measurement_unit_id" int,
  "controlled_category" varchar(3),
  "storage_conditions" text,
  "cycle_stock_min" integer,
  "safety_stock_min" integer
);

CREATE TABLE "Supplier_Product" (
  "sup_prod_id" serial PRIMARY KEY,
  "supplier_id" int,
  "product_id" int,
  "vendorSKU" varchar(64),
  "Pack_size" int,
  "MOQ" int,
  "Lead_time_days" int,
  "Price" int,
  "Last_update" date
);

CREATE TABLE "Stocktakings" (
  "stocktaking_id" serial PRIMARY KEY,
  "Date" date,
  "User ID" int,
  "status" varchar(15)
);

CREATE TABLE "Supplier" (
  "supplier_id" serial PRIMARY KEY,
  "supplier_name" varchar(30),
  "supplier_phone" varchar(30),
  "supplier_email" varchar(30),
  "country" varchar(30),
  "rating" decimal,
  "Currency" varchar(30),
  "Active_status" supplier_active_status_enum
);

CREATE TABLE "SupplierInvoiceLine" (
  "line_id" serial PRIMARY KEY,
  "invoice_id" int,
  "prod_id" int,
  "qty_invoiced" int,
  "tax_rate" decimal(5,2),
  "unit_price" float,
  "line_total" float
);

CREATE TABLE "Stocktaking_items" (
  "id" serial PRIMARY KEY,
  "stocktaking_id" int,
  "Product ID" int,
  "count" integer,
  "digital_quantity" integer,
  "expiry_date_observed" date
);

CREATE TABLE "PO_items" (
  "line_id" serial PRIMARY KEY,
  "po_id" int,
  "prod_id" int,
  "unit_price" int,
  "qty_orderd" int,
  "discount" decimal
);

CREATE TABLE "batches_shelves" (
  "id" serial PRIMARY KEY,
  "batch_id" int,
  "shelf_id" int,
  "quantity" int,
  "threshold" int
);

CREATE TABLE "SupplierInvoice" (
  "invoice_id" serial PRIMARY KEY,
  "po_id" int,
  "supplier_id" int,
  "invoice_number" varchar(30),
  "invoice_date" date,
  "subtotal_amount" float,
  "tax_amount" float,
  "total_amount" float
);

CREATE TABLE "SupplierQuotation" (
  "quotation_id " serial PRIMARY KEY,
  "rfq_id" int,
  "supplier_id" int,
  "delay_time" float
);

CREATE TABLE "Stock_Transfer_Items " (
  "tranfer_itemId" serial PRIMARY KEY,
  "transfer_Id" int,
  "product_id" int,
  "batch_id" int,
  "Qty" int
);

CREATE TABLE "products_ingredients" (
  "id" serial PRIMARY KEY,
  "product_id" int,
  "ingredient_id" int,
  "amount" int
);

CREATE TABLE "ReturnOrder" (
  "return_id" serial PRIMARY KEY,
  "origin_location_id" int,
  "destination_id" int,
  "reson" varchar(30),
  "created_by" int
);

CREATE TABLE "RFQ_items" (
  "RFQ_item_id" serial PRIMARY KEY,
  "RFQ_id" int,
  "Product_id" int,
  "Qty" int
);

CREATE TABLE "GoodReciept" (
  "GRN_id" serial PRIMARY KEY,
  "PO_id" int,
  "Recieved_Date" date,
  "condition_Status" goods_receipt_condition_enum
);

CREATE TABLE "GoodRecieptItem" (
  "GRN_item_id" serial PRIMARY KEY,
  "GRN_id" varchar(30),
  "Line_ID" int,
  "BatchId" int,
  "PO_item_ID" int,
  "RecievedQty" int,
  "ExpiryDate" date
);

CREATE TABLE "Roles" (
  "role_id" serial PRIMARY KEY,
  "role_name" role_name_enum
);

CREATE TABLE "RFQ_supp_item" (
  "pfq_item_id" serial PRIMARY KEY,
  "rfq_id" int,
  "supplier_id" int,
  "product_id " int,
  "unit_price" float,
  "required_lead_time" timestamp
);

CREATE TABLE "Replishment_routing_rules" (
  "rule_id" serial PRIMARY KEY,
  "location_id" int,
  "primary_warehouse" boolean,
  "Can_access_main" boolean
);

CREATE TABLE "ReplishmentRequest" (
  "rep_id" serial PRIMARY KEY,
  "req_loc_id" int,
  "supplier_id" int,
  "product_id" int,
  "status" replenishment_request_status_enum,
  "requested_Qty" int,
  "requested_date" date
);

CREATE TABLE "RFQ_supplier" (
  "RFQ_sipplier_id" serial PRIMARY KEY,
  "RFQ_id" int,
  "Supplier_id" int,
  "status" rfq_supplier_status_enum
);

CREATE TABLE "Purchase_Forecast" (
  "Forecast_ID" serial PRIMARY KEY,
  "Location_ID" int,
  "Product_ID" int,
  "Expected_Demand" int,
  "Forecast_date" date,
  "confidence_interval" int
);

CREATE TABLE "Batches" (
  "batch_id" serial PRIMARY KEY,
  "product_id" int,
  "location_id" int,
  "stock_type" batch_stock_type_enum,
  "quantity" int,
  "batch_number" varchar(50),
  "cost" int,
  "supplier_id" int,
  "manufacturing_date" date,
  "expiry_date" date,
  "receiving_date" date,
  "alert_date" date,
  "clearance_date" date,
  "parent_batch_id" integer
);

CREATE TABLE "movement_log" (
  "movement_id" serial PRIMARY KEY,
  "Batch id" integer,
  "source_location_id" smallint,
  "destination_location_id" smallint,
  "user_id" smallint,
  "timestamp" timestamp,
  "reference_document_path" varchar,
  "transfer_type" varchar(30)
);

CREATE TABLE "Stock_transfers" (
  "transfer_id" serial PRIMARY KEY,
  "fromId" int,
  "Date" date,
  "status" stock_transfer_status_enum,
  "toId" int
);

CREATE TABLE "returnOrderItem" (
  "return_line_id " serial PRIMARY KEY,
  "return_id " int,
  "prod_id" int,
  "batch_id" int,
  "quantity" int,
  "unit_cost" float,
  "total_cost" float
);

CREATE TABLE "shelves" (
  "shelf_id" serial PRIMARY KEY,
  "location_id" smallint,
  "on_hand_qty" int,
  "dispatch_method" varchar
);

CREATE TABLE "Request_for_quotaion" (
  "RFQ_id" serial PRIMARY KEY,
  "user_id" int,
  "created_date" date,
  "status" rfq_status_enum
);

CREATE TABLE "permission" (
  "permission_id" serial PRIMARY KEY,
  "permission_name" varchar
);

CREATE TABLE "products_categories" (
  "cat_id" integer,
  "product_id" integer,
  PRIMARY KEY ("cat_id","product_id")
);

-- =========================
-- FOREIGN KEY RELATIONS (errors resolved)
-- =========================

-- Products ↔ categories (products_categories)
ALTER TABLE "products_categories"
  ADD CONSTRAINT fk_products_categories_cat
    FOREIGN KEY ("cat_id") REFERENCES "categories" ("cat_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_products_categories_product
    FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id") ON DELETE CASCADE;

-- Products ↔ measurement_units
ALTER TABLE "Products"
  ADD CONSTRAINT fk_products_measurement_unit
    FOREIGN KEY ("measurement_unit_id") REFERENCES "measurement_units" ("m_id") ON DELETE SET NULL;

-- Products primary category reference (column "Category ID")
ALTER TABLE "Products"
  ADD CONSTRAINT fk_products_primary_category
    FOREIGN KEY ("Category ID") REFERENCES "categories" ("cat_id") ON DELETE SET NULL;

-- products_ingredients ↔ Products & ingredients
ALTER TABLE "products_ingredients"
  ADD CONSTRAINT fk_products_ingredients_product
    FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_products_ingredients_ingredient
    FOREIGN KEY ("ingredient_id") REFERENCES "ingredients" ("id") ON DELETE RESTRICT;

-- Supplier_Product ↔ Supplier & Products
ALTER TABLE "Supplier_Product"
  ADD CONSTRAINT fk_supplier_product_supplier
    FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("supplier_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_supplier_product_product
    FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id") ON DELETE CASCADE;

-- location_stock_level ↔ Products & Location
ALTER TABLE "location_stock_level"
  ADD CONSTRAINT fk_lsl_product
    FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_lsl_location
    FOREIGN KEY ("location_id") REFERENCES "Location" ("location_id") ON DELETE CASCADE;

-- shelves ↔ Location
ALTER TABLE "shelves"
  ADD CONSTRAINT fk_shelves_location
    FOREIGN KEY ("location_id") REFERENCES "Location" ("location_id") ON DELETE CASCADE;

-- batches_shelves ↔ Batches & shelves
ALTER TABLE "batches_shelves"
  ADD CONSTRAINT fk_batches_shelves_batch
    FOREIGN KEY ("batch_id") REFERENCES "Batches" ("batch_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_batches_shelves_shelf
    FOREIGN KEY ("shelf_id") REFERENCES "shelves" ("shelf_id") ON DELETE CASCADE;

-- Batches ↔ Products, Location, Supplier, parent batch
ALTER TABLE "Batches"
  ADD CONSTRAINT fk_batches_product
    FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id") ON DELETE RESTRICT,
  ADD CONSTRAINT fk_batches_location
    FOREIGN KEY ("location_id") REFERENCES "Location" ("location_id") ON DELETE RESTRICT,
  ADD CONSTRAINT fk_batches_supplier
    FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("supplier_id") ON DELETE SET NULL,
  ADD CONSTRAINT fk_batches_parent
    FOREIGN KEY ("parent_batch_id") REFERENCES "Batches" ("batch_id") ON DELETE SET NULL;

-- movement_log ↔ Batches, Users, Location
ALTER TABLE "movement_log"
  ADD CONSTRAINT fk_movement_batch
    FOREIGN KEY ("Batch id") REFERENCES "Batches" ("batch_id") ON DELETE RESTRICT,
  ADD CONSTRAINT fk_movement_user
    FOREIGN KEY ("user_id") REFERENCES "Users" ("user_id") ON DELETE SET NULL,
  ADD CONSTRAINT fk_movement_src_location
    FOREIGN KEY ("source_location_id") REFERENCES "Location" ("location_id") ON DELETE SET NULL,
  ADD CONSTRAINT fk_movement_dest_location
    FOREIGN KEY ("destination_location_id") REFERENCES "Location" ("location_id") ON DELETE SET NULL;

-- Stock_transfers ↔ Location
ALTER TABLE "Stock_transfers"
  ADD CONSTRAINT fk_transfers_from_location
    FOREIGN KEY ("fromId") REFERENCES "Location" ("location_id") ON DELETE RESTRICT,
  ADD CONSTRAINT fk_transfers_to_location
    FOREIGN KEY ("toId") REFERENCES "Location" ("location_id") ON DELETE RESTRICT;

-- Stock_Transfer_Items ↔ Stock_transfers, Products, Batches
ALTER TABLE "Stock_Transfer_Items "
  ADD CONSTRAINT fk_transfer_items_transfer
    FOREIGN KEY ("transfer_Id") REFERENCES "Stock_transfers" ("transfer_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_transfer_items_product
    FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id") ON DELETE RESTRICT,
  ADD CONSTRAINT fk_transfer_items_batch
    FOREIGN KEY ("batch_id") REFERENCES "Batches" ("batch_id") ON DELETE SET NULL;

-- Stocktakings ↔ Users
ALTER TABLE "Stocktakings"
  ADD CONSTRAINT fk_stocktakings_user
    FOREIGN KEY ("User ID") REFERENCES "Users" ("user_id") ON DELETE SET NULL;

-- Stocktaking_items ↔ Stocktakings, Products
ALTER TABLE "Stocktaking_items"
  ADD CONSTRAINT fk_stocktaking_items_session
    FOREIGN KEY ("stocktaking_id") REFERENCES "Stocktakings" ("stocktaking_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_stocktaking_items_product
    FOREIGN KEY ("Product ID") REFERENCES "Products" ("product_id") ON DELETE RESTRICT;

-- PurchaseOrder ↔ Users, Supplier
ALTER TABLE "PurchaseOrder"
  ADD CONSTRAINT fk_po_requested_by
    FOREIGN KEY ("requested_by") REFERENCES "Users" ("user_id") ON DELETE SET NULL,
  ADD CONSTRAINT fk_po_supplier
    FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("supplier_id") ON DELETE SET NULL;

-- PO_items ↔ PurchaseOrder, Products
ALTER TABLE "PO_items"
  ADD CONSTRAINT fk_po_items_po
    FOREIGN KEY ("po_id") REFERENCES "PurchaseOrder" ("po_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_po_items_product
    FOREIGN KEY ("prod_id") REFERENCES "Products" ("product_id") ON DELETE RESTRICT;

-- GoodReciept ↔ PurchaseOrder
ALTER TABLE "GoodReciept"
  ADD CONSTRAINT fk_gr_po
    FOREIGN KEY ("PO_id") REFERENCES "PurchaseOrder" ("po_id") ON DELETE SET NULL;

-- GoodRecieptItem ↔ Batches, PO_items
-- NOTE: Omitted FK to GoodReciept due to type mismatch (varchar vs int)
ALTER TABLE "GoodRecieptItem"
  ADD CONSTRAINT fk_gri_batch
    FOREIGN KEY ("BatchId") REFERENCES "Batches" ("batch_id") ON DELETE SET NULL,
  ADD CONSTRAINT fk_gri_po_item
    FOREIGN KEY ("PO_item_ID") REFERENCES "PO_items" ("line_id") ON DELETE SET NULL;

-- QualityInspection ↔ GoodReciept, Batches
ALTER TABLE "QualityInspection"
  ADD CONSTRAINT fk_qi_gr
    FOREIGN KEY ("GRN_id") REFERENCES "GoodReciept" ("GRN_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_qi_batch
    FOREIGN KEY ("BatchId") REFERENCES "Batches" ("batch_id") ON DELETE SET NULL;

-- SupplierInvoice ↔ PurchaseOrder, Supplier
ALTER TABLE "SupplierInvoice"
  ADD CONSTRAINT fk_si_po
    FOREIGN KEY ("po_id") REFERENCES "PurchaseOrder" ("po_id") ON DELETE SET NULL,
  ADD CONSTRAINT fk_si_supplier
    FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("supplier_id") ON DELETE SET NULL;

-- SupplierInvoiceLine ↔ SupplierInvoice, Products
ALTER TABLE "SupplierInvoiceLine"
  ADD CONSTRAINT fk_sil_invoice
    FOREIGN KEY ("invoice_id") REFERENCES "SupplierInvoice" ("invoice_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_sil_product
    FOREIGN KEY ("prod_id") REFERENCES "Products" ("product_id") ON DELETE RESTRICT;

-- ReturnOrder ↔ Location, Users
ALTER TABLE "ReturnOrder"
  ADD CONSTRAINT fk_return_origin_location
    FOREIGN KEY ("origin_location_id") REFERENCES "Location" ("location_id") ON DELETE RESTRICT,
  ADD CONSTRAINT fk_return_created_by
    FOREIGN KEY ("created_by") REFERENCES "Users" ("user_id") ON DELETE SET NULL;

-- returnOrderItem ↔ ReturnOrder, Products, Batches
ALTER TABLE "returnOrderItem"
  ADD CONSTRAINT fk_return_item_return
    FOREIGN KEY ("return_id ") REFERENCES "ReturnOrder" ("return_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_return_item_product
    FOREIGN KEY ("prod_id") REFERENCES "Products" ("product_id") ON DELETE RESTRICT,
  ADD CONSTRAINT fk_return_item_batch
    FOREIGN KEY ("batch_id") REFERENCES "Batches" ("batch_id") ON DELETE SET NULL;

-- RFQ_items ↔ Request_for_quotaion, Products
ALTER TABLE "RFQ_items"
  ADD CONSTRAINT fk_rfq_items_rfq
    FOREIGN KEY ("RFQ_id") REFERENCES "Request_for_quotaion" ("RFQ_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_rfq_items_product
    FOREIGN KEY ("Product_id") REFERENCES "Products" ("product_id") ON DELETE RESTRICT;

-- RFQ_supp_item ↔ Request_for_quotaion, Supplier, Products
ALTER TABLE "RFQ_supp_item"
  ADD CONSTRAINT fk_rfq_supp_item_rfq
    FOREIGN KEY ("rfq_id") REFERENCES "Request_for_quotaion" ("RFQ_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_rfq_supp_item_supplier
    FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("supplier_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_rfq_supp_item_product
    FOREIGN KEY ("product_id ") REFERENCES "Products" ("product_id") ON DELETE RESTRICT;

-- SupplierQuotation ↔ RFQ & Supplier
ALTER TABLE "SupplierQuotation"
  ADD CONSTRAINT fk_supplier_quotation_rfq
    FOREIGN KEY ("rfq_id") REFERENCES "Request_for_quotaion" ("RFQ_id") ON DELETE SET NULL,
  ADD CONSTRAINT fk_supplier_quotation_supplier
    FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("supplier_id") ON DELETE SET NULL;

-- Replishment_routing_rules ↔ Location
ALTER TABLE "Replishment_routing_rules"
  ADD CONSTRAINT fk_repl_rules_location
    FOREIGN KEY ("location_id") REFERENCES "Location" ("location_id") ON DELETE CASCADE;

-- ReplishmentRequest ↔ Location, Supplier, Products
ALTER TABLE "ReplishmentRequest"
  ADD CONSTRAINT fk_replen_req_location
    FOREIGN KEY ("req_loc_id") REFERENCES "Location" ("location_id") ON DELETE RESTRICT,
  ADD CONSTRAINT fk_replen_req_supplier
    FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("supplier_id") ON DELETE SET NULL,
  ADD CONSTRAINT fk_replen_req_product
    FOREIGN KEY ("product_id") REFERENCES "Products" ("product_id") ON DELETE RESTRICT;

-- Users ↔ Roles (role_id), Location (location_id)
ALTER TABLE "Users"
  ADD CONSTRAINT fk_users_role
    FOREIGN KEY ("role_id") REFERENCES "Roles" ("role_id") ON DELETE SET NULL,
  ADD CONSTRAINT fk_users_location
    FOREIGN KEY ("location_id") REFERENCES "Location" ("location_id") ON DELETE SET NULL;

-- roles_permission_id ↔ Roles, permission
ALTER TABLE "roles_permission_id"
  ADD CONSTRAINT fk_roles_perm_role
    FOREIGN KEY ("role_id") REFERENCES "Roles" ("role_id") ON DELETE CASCADE,
  ADD CONSTRAINT fk_roles_perm_perm
    FOREIGN KEY ("permission_id") REFERENCES "permission" ("permission_id") ON DELETE CASCADE;