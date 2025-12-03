--
-- PostgreSQL database dump
--

\restrict d797H2lN8oShx1uAC73gMit6SVCrLSN5bp6rCkvIpKXWsEZ67H7swRdx1sBRYwj

-- Dumped from database version 18.1 (Ubuntu 18.1-1.pgdg24.04+2)
-- Dumped by pg_dump version 18.1 (Ubuntu 18.1-1.pgdg24.04+2)

-- Started on 2025-12-03 16:44:41 EET

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 283 (class 1259 OID 22085)
-- Name: Batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Batches" (
    batch_id integer NOT NULL,
    product_id integer,
    location_id integer,
    stock_type character varying(30),
    quantity integer,
    batch_number character varying(50),
    cost integer,
    supplier_id integer,
    manufacturing_date date,
    expiry_date date,
    receiving_date date,
    alert_date date,
    clearance_date date,
    parent_batch_id integer
);


ALTER TABLE public."Batches" OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 22084)
-- Name: Batches_batch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Batches_batch_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Batches_batch_id_seq" OWNER TO postgres;

--
-- TOC entry 3829 (class 0 OID 0)
-- Dependencies: 282
-- Name: Batches_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Batches_batch_id_seq" OWNED BY public."Batches".batch_id;


--
-- TOC entry 267 (class 1259 OID 22021)
-- Name: GoodReciept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GoodReciept" (
    "GRN_id" integer NOT NULL,
    "PO_id" integer,
    "Recieved_Date" date,
    "condition_Status" character varying(30)
);


ALTER TABLE public."GoodReciept" OWNER TO postgres;

--
-- TOC entry 269 (class 1259 OID 22029)
-- Name: GoodRecieptItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GoodRecieptItem" (
    "GRN_item_id" integer NOT NULL,
    "GRN_id" character varying(30),
    "Line_ID" integer,
    "BatchId" integer,
    "PO_item_ID" integer,
    "RecievedQty" integer,
    "ExpiryDate" date
);


ALTER TABLE public."GoodRecieptItem" OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 22028)
-- Name: GoodRecieptItem_GRN_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GoodRecieptItem_GRN_item_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GoodRecieptItem_GRN_item_id_seq" OWNER TO postgres;

--
-- TOC entry 3830 (class 0 OID 0)
-- Dependencies: 268
-- Name: GoodRecieptItem_GRN_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GoodRecieptItem_GRN_item_id_seq" OWNED BY public."GoodRecieptItem"."GRN_item_id";


--
-- TOC entry 266 (class 1259 OID 22020)
-- Name: GoodReciept_GRN_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GoodReciept_GRN_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GoodReciept_GRN_id_seq" OWNER TO postgres;

--
-- TOC entry 3831 (class 0 OID 0)
-- Dependencies: 266
-- Name: GoodReciept_GRN_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GoodReciept_GRN_id_seq" OWNED BY public."GoodReciept"."GRN_id";


--
-- TOC entry 237 (class 1259 OID 21893)
-- Name: Location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Location" (
    location_id integer NOT NULL,
    location_name character varying,
    location_type character varying(30),
    parent_location integer,
    is_direct_to_main boolean,
    address character varying,
    status character varying(30)
);


ALTER TABLE public."Location" OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 21892)
-- Name: Location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Location_location_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Location_location_id_seq" OWNER TO postgres;

--
-- TOC entry 3832 (class 0 OID 0)
-- Dependencies: 236
-- Name: Location_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Location_location_id_seq" OWNED BY public."Location".location_id;


--
-- TOC entry 251 (class 1259 OID 21955)
-- Name: PO_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PO_items" (
    line_id integer NOT NULL,
    po_id integer,
    prod_id integer,
    unit_price integer,
    qty_orderd integer,
    discount numeric
);


ALTER TABLE public."PO_items" OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 21954)
-- Name: PO_items_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PO_items_line_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PO_items_line_id_seq" OWNER TO postgres;

--
-- TOC entry 3833 (class 0 OID 0)
-- Dependencies: 250
-- Name: PO_items_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PO_items_line_id_seq" OWNED BY public."PO_items".line_id;


--
-- TOC entry 239 (class 1259 OID 21903)
-- Name: Products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Products" (
    product_id integer NOT NULL,
    name character varying(40),
    barcode character varying(130),
    "SKU" character varying(64),
    scientific_name character varying(40),
    description text,
    cost integer,
    selling_price integer,
    concentration character varying(10),
    daily_dosage smallint,
    "Manufacturer" character varying(30),
    is_drug boolean,
    controlled_substance boolean,
    "Substitutable" boolean,
    "Max allowed units" smallint,
    "Break packs allowed" boolean,
    drug_type character varying(30),
    "Category ID" smallint,
    safety_stock_expiry_threshold smallint,
    reorder_quantity integer,
    measurement_unit_id integer,
    controlled_category character varying(3),
    storage_conditions text,
    cycle_stock_min integer,
    safety_stock_min integer
);


ALTER TABLE public."Products" OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 21902)
-- Name: Products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Products_product_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Products_product_id_seq" OWNER TO postgres;

--
-- TOC entry 3834 (class 0 OID 0)
-- Dependencies: 238
-- Name: Products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Products_product_id_seq" OWNED BY public."Products".product_id;


--
-- TOC entry 224 (class 1259 OID 21836)
-- Name: PurchaseOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseOrder" (
    po_id integer NOT NULL,
    requested_by integer,
    supplier_id integer,
    po_number integer,
    order_date date,
    expected_date date,
    status character varying(30),
    total_amount integer
);


ALTER TABLE public."PurchaseOrder" OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 21835)
-- Name: PurchaseOrder_po_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."PurchaseOrder_po_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."PurchaseOrder_po_id_seq" OWNER TO postgres;

--
-- TOC entry 3835 (class 0 OID 0)
-- Dependencies: 223
-- Name: PurchaseOrder_po_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."PurchaseOrder_po_id_seq" OWNED BY public."PurchaseOrder".po_id;


--
-- TOC entry 281 (class 1259 OID 22077)
-- Name: Purchase_Forecast; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Purchase_Forecast" (
    "Forecast_ID" integer NOT NULL,
    "Location_ID" integer,
    "Product_ID" integer,
    "Expected_Demand" integer,
    "Forecast_date" date,
    confidence_interval integer
);


ALTER TABLE public."Purchase_Forecast" OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 22076)
-- Name: Purchase_Forecast_Forecast_ID_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Purchase_Forecast_Forecast_ID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Purchase_Forecast_Forecast_ID_seq" OWNER TO postgres;

--
-- TOC entry 3836 (class 0 OID 0)
-- Dependencies: 280
-- Name: Purchase_Forecast_Forecast_ID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Purchase_Forecast_Forecast_ID_seq" OWNED BY public."Purchase_Forecast"."Forecast_ID";


--
-- TOC entry 220 (class 1259 OID 21818)
-- Name: QualityInspection; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QualityInspection" (
    inspection_id integer NOT NULL,
    "GRN_id" integer,
    "BatchId" integer,
    "Temperature_check" boolean,
    "Packaging_status" character varying(30),
    "Expiry_status" character varying(30),
    "QCResult" character varying(30),
    "Inspector_name" character varying(30),
    "inspectionDate" date
);


ALTER TABLE public."QualityInspection" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 21817)
-- Name: QualityInspection_inspection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."QualityInspection_inspection_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."QualityInspection_inspection_id_seq" OWNER TO postgres;

--
-- TOC entry 3837 (class 0 OID 0)
-- Dependencies: 219
-- Name: QualityInspection_inspection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."QualityInspection_inspection_id_seq" OWNED BY public."QualityInspection".inspection_id;


--
-- TOC entry 265 (class 1259 OID 22013)
-- Name: RFQ_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RFQ_items" (
    "RFQ_item_id" integer NOT NULL,
    "RFQ_id" integer,
    "Product_id" integer,
    "Qty" integer
);


ALTER TABLE public."RFQ_items" OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 22012)
-- Name: RFQ_items_RFQ_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RFQ_items_RFQ_item_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RFQ_items_RFQ_item_id_seq" OWNER TO postgres;

--
-- TOC entry 3838 (class 0 OID 0)
-- Dependencies: 264
-- Name: RFQ_items_RFQ_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RFQ_items_RFQ_item_id_seq" OWNED BY public."RFQ_items"."RFQ_item_id";


--
-- TOC entry 273 (class 1259 OID 22045)
-- Name: RFQ_supp_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RFQ_supp_item" (
    pfq_item_id integer NOT NULL,
    rfq_id integer,
    supplier_id integer,
    "product_id " integer,
    unit_price double precision,
    required_lead_time timestamp without time zone
);


ALTER TABLE public."RFQ_supp_item" OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 22044)
-- Name: RFQ_supp_item_pfq_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RFQ_supp_item_pfq_item_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RFQ_supp_item_pfq_item_id_seq" OWNER TO postgres;

--
-- TOC entry 3839 (class 0 OID 0)
-- Dependencies: 272
-- Name: RFQ_supp_item_pfq_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RFQ_supp_item_pfq_item_id_seq" OWNED BY public."RFQ_supp_item".pfq_item_id;


--
-- TOC entry 279 (class 1259 OID 22069)
-- Name: RFQ_supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RFQ_supplier" (
    "RFQ_sipplier_id" integer NOT NULL,
    "RFQ_id" integer,
    "Supplier_id" integer,
    status character varying(30)
);


ALTER TABLE public."RFQ_supplier" OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 22068)
-- Name: RFQ_supplier_RFQ_sipplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."RFQ_supplier_RFQ_sipplier_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."RFQ_supplier_RFQ_sipplier_id_seq" OWNER TO postgres;

--
-- TOC entry 3840 (class 0 OID 0)
-- Dependencies: 278
-- Name: RFQ_supplier_RFQ_sipplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."RFQ_supplier_RFQ_sipplier_id_seq" OWNED BY public."RFQ_supplier"."RFQ_sipplier_id";


--
-- TOC entry 277 (class 1259 OID 22061)
-- Name: ReplishmentRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReplishmentRequest" (
    rep_id integer NOT NULL,
    req_loc_id integer,
    supplier_id integer,
    product_id integer,
    status character varying(30),
    "requested_Qty" integer,
    requested_date date
);


ALTER TABLE public."ReplishmentRequest" OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 22060)
-- Name: ReplishmentRequest_rep_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ReplishmentRequest_rep_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ReplishmentRequest_rep_id_seq" OWNER TO postgres;

--
-- TOC entry 3841 (class 0 OID 0)
-- Dependencies: 276
-- Name: ReplishmentRequest_rep_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ReplishmentRequest_rep_id_seq" OWNED BY public."ReplishmentRequest".rep_id;


--
-- TOC entry 275 (class 1259 OID 22053)
-- Name: Replishment_routing_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Replishment_routing_rules" (
    rule_id integer NOT NULL,
    location_id integer,
    primary_warehouse boolean,
    "Can_access_main" boolean
);


ALTER TABLE public."Replishment_routing_rules" OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 22052)
-- Name: Replishment_routing_rules_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Replishment_routing_rules_rule_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Replishment_routing_rules_rule_id_seq" OWNER TO postgres;

--
-- TOC entry 3842 (class 0 OID 0)
-- Dependencies: 274
-- Name: Replishment_routing_rules_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Replishment_routing_rules_rule_id_seq" OWNED BY public."Replishment_routing_rules".rule_id;


--
-- TOC entry 293 (class 1259 OID 22129)
-- Name: Request_for_quotaion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Request_for_quotaion" (
    "RFQ_id" integer NOT NULL,
    user_id integer,
    created_date date,
    status character varying(30)
);


ALTER TABLE public."Request_for_quotaion" OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 22128)
-- Name: Request_for_quotaion_RFQ_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Request_for_quotaion_RFQ_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Request_for_quotaion_RFQ_id_seq" OWNER TO postgres;

--
-- TOC entry 3843 (class 0 OID 0)
-- Dependencies: 292
-- Name: Request_for_quotaion_RFQ_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Request_for_quotaion_RFQ_id_seq" OWNED BY public."Request_for_quotaion"."RFQ_id";


--
-- TOC entry 263 (class 1259 OID 22005)
-- Name: ReturnOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ReturnOrder" (
    return_id integer NOT NULL,
    origin_location_id integer,
    destination_id integer,
    reson character varying(30),
    created_by integer
);


ALTER TABLE public."ReturnOrder" OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 22004)
-- Name: ReturnOrder_return_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ReturnOrder_return_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ReturnOrder_return_id_seq" OWNER TO postgres;

--
-- TOC entry 3844 (class 0 OID 0)
-- Dependencies: 262
-- Name: ReturnOrder_return_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ReturnOrder_return_id_seq" OWNED BY public."ReturnOrder".return_id;


--
-- TOC entry 271 (class 1259 OID 22037)
-- Name: Roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Roles" (
    role_id integer NOT NULL,
    role_name character varying(30)
);


ALTER TABLE public."Roles" OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 22036)
-- Name: Roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Roles_role_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Roles_role_id_seq" OWNER TO postgres;

--
-- TOC entry 3845 (class 0 OID 0)
-- Dependencies: 270
-- Name: Roles_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Roles_role_id_seq" OWNED BY public."Roles".role_id;


--
-- TOC entry 259 (class 1259 OID 21989)
-- Name: Stock_Transfer_Items ; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Stock_Transfer_Items " (
    "tranfer_itemId" integer NOT NULL,
    "transfer_Id" integer,
    product_id integer,
    batch_id integer,
    "Qty" integer
);


ALTER TABLE public."Stock_Transfer_Items " OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 21988)
-- Name: Stock_Transfer_Items _tranfer_itemId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Stock_Transfer_Items _tranfer_itemId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Stock_Transfer_Items _tranfer_itemId_seq" OWNER TO postgres;

--
-- TOC entry 3846 (class 0 OID 0)
-- Dependencies: 258
-- Name: Stock_Transfer_Items _tranfer_itemId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Stock_Transfer_Items _tranfer_itemId_seq" OWNED BY public."Stock_Transfer_Items "."tranfer_itemId";


--
-- TOC entry 287 (class 1259 OID 22103)
-- Name: Stock_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Stock_transfers" (
    transfer_id integer NOT NULL,
    "fromId" integer,
    "Date" date,
    status character varying(30),
    "toId" integer
);


ALTER TABLE public."Stock_transfers" OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 22102)
-- Name: Stock_transfers_transfer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Stock_transfers_transfer_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Stock_transfers_transfer_id_seq" OWNER TO postgres;

--
-- TOC entry 3847 (class 0 OID 0)
-- Dependencies: 286
-- Name: Stock_transfers_transfer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Stock_transfers_transfer_id_seq" OWNED BY public."Stock_transfers".transfer_id;


--
-- TOC entry 249 (class 1259 OID 21947)
-- Name: Stocktaking_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Stocktaking_items" (
    id integer NOT NULL,
    stocktaking_id integer,
    "Product ID" integer,
    count integer,
    digital_quantity integer,
    expiry_date_observed date
);


ALTER TABLE public."Stocktaking_items" OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 21946)
-- Name: Stocktaking_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Stocktaking_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Stocktaking_items_id_seq" OWNER TO postgres;

--
-- TOC entry 3848 (class 0 OID 0)
-- Dependencies: 248
-- Name: Stocktaking_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Stocktaking_items_id_seq" OWNED BY public."Stocktaking_items".id;


--
-- TOC entry 243 (class 1259 OID 21921)
-- Name: Stocktakings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Stocktakings" (
    stocktaking_id integer NOT NULL,
    "Date" date,
    "User ID" integer,
    status character varying(15)
);


ALTER TABLE public."Stocktakings" OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 21920)
-- Name: Stocktakings_stocktaking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Stocktakings_stocktaking_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Stocktakings_stocktaking_id_seq" OWNER TO postgres;

--
-- TOC entry 3849 (class 0 OID 0)
-- Dependencies: 242
-- Name: Stocktakings_stocktaking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Stocktakings_stocktaking_id_seq" OWNED BY public."Stocktakings".stocktaking_id;


--
-- TOC entry 245 (class 1259 OID 21929)
-- Name: Supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Supplier" (
    supplier_id integer NOT NULL,
    supplier_name character varying(30),
    supplier_phone character varying(30),
    supplier_email character varying(30),
    country character varying(30),
    rating numeric,
    "Currency" character varying(30),
    "Active_status" character varying(30)
);


ALTER TABLE public."Supplier" OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 21973)
-- Name: SupplierInvoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SupplierInvoice" (
    invoice_id integer NOT NULL,
    po_id integer,
    supplier_id integer,
    invoice_number character varying(30),
    invoice_date date,
    subtotal_amount double precision,
    tax_amount double precision,
    total_amount double precision
);


ALTER TABLE public."SupplierInvoice" OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 21939)
-- Name: SupplierInvoiceLine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SupplierInvoiceLine" (
    line_id integer NOT NULL,
    invoice_id integer,
    prod_id integer,
    qty_invoiced integer,
    tax_rate numeric(5,2),
    unit_price double precision,
    line_total double precision
);


ALTER TABLE public."SupplierInvoiceLine" OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 21938)
-- Name: SupplierInvoiceLine_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SupplierInvoiceLine_line_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SupplierInvoiceLine_line_id_seq" OWNER TO postgres;

--
-- TOC entry 3850 (class 0 OID 0)
-- Dependencies: 246
-- Name: SupplierInvoiceLine_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SupplierInvoiceLine_line_id_seq" OWNED BY public."SupplierInvoiceLine".line_id;


--
-- TOC entry 254 (class 1259 OID 21972)
-- Name: SupplierInvoice_invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SupplierInvoice_invoice_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SupplierInvoice_invoice_id_seq" OWNER TO postgres;

--
-- TOC entry 3851 (class 0 OID 0)
-- Dependencies: 254
-- Name: SupplierInvoice_invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SupplierInvoice_invoice_id_seq" OWNED BY public."SupplierInvoice".invoice_id;


--
-- TOC entry 233 (class 1259 OID 21877)
-- Name: SupplierPerformace; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SupplierPerformace" (
    "SupplierId" integer NOT NULL,
    "AverageLeadTime" integer,
    "LeadTimeVariance" integer,
    "FillRate" numeric(5,2),
    "OTIF" numeric(5,2),
    "ShelfLifeCompliance" double precision,
    "ReturnRate" numeric(5,2),
    "RatingUpdateDate" date
);


ALTER TABLE public."SupplierPerformace" OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 21876)
-- Name: SupplierPerformace_SupplierId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SupplierPerformace_SupplierId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SupplierPerformace_SupplierId_seq" OWNER TO postgres;

--
-- TOC entry 3852 (class 0 OID 0)
-- Dependencies: 232
-- Name: SupplierPerformace_SupplierId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SupplierPerformace_SupplierId_seq" OWNED BY public."SupplierPerformace"."SupplierId";


--
-- TOC entry 257 (class 1259 OID 21981)
-- Name: SupplierQuotation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SupplierQuotation" (
    "quotation_id " integer NOT NULL,
    rfq_id integer,
    supplier_id integer,
    delay_time double precision
);


ALTER TABLE public."SupplierQuotation" OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 21980)
-- Name: SupplierQuotation_quotation_id _seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."SupplierQuotation_quotation_id _seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."SupplierQuotation_quotation_id _seq" OWNER TO postgres;

--
-- TOC entry 3853 (class 0 OID 0)
-- Dependencies: 256
-- Name: SupplierQuotation_quotation_id _seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."SupplierQuotation_quotation_id _seq" OWNED BY public."SupplierQuotation"."quotation_id ";


--
-- TOC entry 241 (class 1259 OID 21913)
-- Name: Supplier_Product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Supplier_Product" (
    sup_prod_id integer NOT NULL,
    supplier_id integer,
    product_id integer,
    "vendorSKU" character varying(64),
    "Pack_size" integer,
    "MOQ" integer,
    "Lead_time_days" integer,
    "Price" integer,
    "Last_update" date
);


ALTER TABLE public."Supplier_Product" OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 21912)
-- Name: Supplier_Product_sup_prod_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Supplier_Product_sup_prod_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Supplier_Product_sup_prod_id_seq" OWNER TO postgres;

--
-- TOC entry 3854 (class 0 OID 0)
-- Dependencies: 240
-- Name: Supplier_Product_sup_prod_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Supplier_Product_sup_prod_id_seq" OWNED BY public."Supplier_Product".sup_prod_id;


--
-- TOC entry 244 (class 1259 OID 21928)
-- Name: Supplier_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Supplier_supplier_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Supplier_supplier_id_seq" OWNER TO postgres;

--
-- TOC entry 3855 (class 0 OID 0)
-- Dependencies: 244
-- Name: Supplier_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Supplier_supplier_id_seq" OWNED BY public."Supplier".supplier_id;


--
-- TOC entry 228 (class 1259 OID 21854)
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    user_id integer NOT NULL,
    user_name character varying,
    password_hash character varying,
    full_name character varying,
    email character varying,
    phone character varying,
    role_id integer,
    location_id integer,
    status character varying(30)
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 21853)
-- Name: Users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_user_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_user_id_seq" OWNER TO postgres;

--
-- TOC entry 3856 (class 0 OID 0)
-- Dependencies: 227
-- Name: Users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_user_id_seq" OWNED BY public."Users".user_id;


--
-- TOC entry 253 (class 1259 OID 21965)
-- Name: batches_shelves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.batches_shelves (
    id integer NOT NULL,
    batch_id integer,
    shelf_id integer,
    quantity integer,
    threshold integer
);


ALTER TABLE public.batches_shelves OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 21964)
-- Name: batches_shelves_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.batches_shelves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.batches_shelves_id_seq OWNER TO postgres;

--
-- TOC entry 3857 (class 0 OID 0)
-- Dependencies: 252
-- Name: batches_shelves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.batches_shelves_id_seq OWNED BY public.batches_shelves.id;


--
-- TOC entry 226 (class 1259 OID 21844)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    cat_id integer NOT NULL,
    name character varying(30),
    description text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 21843)
-- Name: categories_cat_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_cat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_cat_id_seq OWNER TO postgres;

--
-- TOC entry 3858 (class 0 OID 0)
-- Dependencies: 225
-- Name: categories_cat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_cat_id_seq OWNED BY public.categories.cat_id;


--
-- TOC entry 222 (class 1259 OID 21826)
-- Name: ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredients (
    id integer NOT NULL,
    name character varying(30),
    description text,
    is_active boolean
);


ALTER TABLE public.ingredients OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 21825)
-- Name: ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingredients_id_seq OWNER TO postgres;

--
-- TOC entry 3859 (class 0 OID 0)
-- Dependencies: 221
-- Name: ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ingredients_id_seq OWNED BY public.ingredients.id;


--
-- TOC entry 235 (class 1259 OID 21885)
-- Name: location_stock_level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location_stock_level (
    id integer NOT NULL,
    product_id integer,
    location_id smallint,
    stock_type character varying(13),
    on_hand_quantity integer,
    dispatch_method character varying(50)
);


ALTER TABLE public.location_stock_level OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 21884)
-- Name: location_stock_level_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.location_stock_level_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.location_stock_level_id_seq OWNER TO postgres;

--
-- TOC entry 3860 (class 0 OID 0)
-- Dependencies: 234
-- Name: location_stock_level_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.location_stock_level_id_seq OWNED BY public.location_stock_level.id;


--
-- TOC entry 231 (class 1259 OID 21867)
-- Name: measurement_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.measurement_units (
    m_id integer NOT NULL,
    name character varying(30),
    is_base_unit boolean,
    con_fact integer,
    description text,
    sympol character varying(30)
);


ALTER TABLE public.measurement_units OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 21866)
-- Name: measurement_units_m_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.measurement_units_m_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.measurement_units_m_id_seq OWNER TO postgres;

--
-- TOC entry 3861 (class 0 OID 0)
-- Dependencies: 230
-- Name: measurement_units_m_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.measurement_units_m_id_seq OWNED BY public.measurement_units.m_id;


--
-- TOC entry 285 (class 1259 OID 22093)
-- Name: movement_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movement_log (
    movement_id integer NOT NULL,
    "Batch id" integer,
    source_location_id smallint,
    destination_location_id smallint,
    user_id smallint,
    "timestamp" timestamp without time zone,
    reference_document_path character varying,
    transfer_type character varying(30)
);


ALTER TABLE public.movement_log OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 22092)
-- Name: movement_log_movement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.movement_log_movement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.movement_log_movement_id_seq OWNER TO postgres;

--
-- TOC entry 3862 (class 0 OID 0)
-- Dependencies: 284
-- Name: movement_log_movement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.movement_log_movement_id_seq OWNED BY public.movement_log.movement_id;


--
-- TOC entry 295 (class 1259 OID 22137)
-- Name: permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permission (
    permission_id integer NOT NULL,
    permission_name character varying
);


ALTER TABLE public.permission OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 22136)
-- Name: permission_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permission_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permission_permission_id_seq OWNER TO postgres;

--
-- TOC entry 3863 (class 0 OID 0)
-- Dependencies: 294
-- Name: permission_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permission_permission_id_seq OWNED BY public.permission.permission_id;


--
-- TOC entry 296 (class 1259 OID 22146)
-- Name: products_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_categories (
    cat_id integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.products_categories OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 21997)
-- Name: products_ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_ingredients (
    id integer NOT NULL,
    product_id integer,
    ingredient_id integer,
    amount integer
);


ALTER TABLE public.products_ingredients OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 21996)
-- Name: products_ingredients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_ingredients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_ingredients_id_seq OWNER TO postgres;

--
-- TOC entry 3864 (class 0 OID 0)
-- Dependencies: 260
-- Name: products_ingredients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_ingredients_id_seq OWNED BY public.products_ingredients.id;


--
-- TOC entry 289 (class 1259 OID 22111)
-- Name: returnOrderItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."returnOrderItem" (
    "return_line_id " integer NOT NULL,
    "return_id " integer,
    prod_id integer,
    batch_id integer,
    quantity integer,
    unit_cost double precision,
    total_cost double precision
);


ALTER TABLE public."returnOrderItem" OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 22110)
-- Name: returnOrderItem_return_line_id _seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."returnOrderItem_return_line_id _seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."returnOrderItem_return_line_id _seq" OWNER TO postgres;

--
-- TOC entry 3865 (class 0 OID 0)
-- Dependencies: 288
-- Name: returnOrderItem_return_line_id _seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."returnOrderItem_return_line_id _seq" OWNED BY public."returnOrderItem"."return_line_id ";


--
-- TOC entry 229 (class 1259 OID 21863)
-- Name: roles_permission_id; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles_permission_id (
    permission_id integer,
    role_id integer
);


ALTER TABLE public.roles_permission_id OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 22119)
-- Name: shelves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shelves (
    shelf_id integer NOT NULL,
    location_id smallint,
    on_hand_qty integer,
    dispatch_method character varying
);


ALTER TABLE public.shelves OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 22118)
-- Name: shelves_shelf_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shelves_shelf_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shelves_shelf_id_seq OWNER TO postgres;

--
-- TOC entry 3866 (class 0 OID 0)
-- Dependencies: 290
-- Name: shelves_shelf_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shelves_shelf_id_seq OWNED BY public.shelves.shelf_id;


--
-- TOC entry 3529 (class 2604 OID 22088)
-- Name: Batches batch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Batches" ALTER COLUMN batch_id SET DEFAULT nextval('public."Batches_batch_id_seq"'::regclass);


--
-- TOC entry 3521 (class 2604 OID 22024)
-- Name: GoodReciept GRN_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GoodReciept" ALTER COLUMN "GRN_id" SET DEFAULT nextval('public."GoodReciept_GRN_id_seq"'::regclass);


--
-- TOC entry 3522 (class 2604 OID 22032)
-- Name: GoodRecieptItem GRN_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GoodRecieptItem" ALTER COLUMN "GRN_item_id" SET DEFAULT nextval('public."GoodRecieptItem_GRN_item_id_seq"'::regclass);


--
-- TOC entry 3506 (class 2604 OID 21896)
-- Name: Location location_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location" ALTER COLUMN location_id SET DEFAULT nextval('public."Location_location_id_seq"'::regclass);


--
-- TOC entry 3513 (class 2604 OID 21958)
-- Name: PO_items line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PO_items" ALTER COLUMN line_id SET DEFAULT nextval('public."PO_items_line_id_seq"'::regclass);


--
-- TOC entry 3507 (class 2604 OID 21906)
-- Name: Products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products" ALTER COLUMN product_id SET DEFAULT nextval('public."Products_product_id_seq"'::regclass);


--
-- TOC entry 3500 (class 2604 OID 21839)
-- Name: PurchaseOrder po_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder" ALTER COLUMN po_id SET DEFAULT nextval('public."PurchaseOrder_po_id_seq"'::regclass);


--
-- TOC entry 3528 (class 2604 OID 22080)
-- Name: Purchase_Forecast Forecast_ID; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase_Forecast" ALTER COLUMN "Forecast_ID" SET DEFAULT nextval('public."Purchase_Forecast_Forecast_ID_seq"'::regclass);


--
-- TOC entry 3498 (class 2604 OID 21821)
-- Name: QualityInspection inspection_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QualityInspection" ALTER COLUMN inspection_id SET DEFAULT nextval('public."QualityInspection_inspection_id_seq"'::regclass);


--
-- TOC entry 3520 (class 2604 OID 22016)
-- Name: RFQ_items RFQ_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_items" ALTER COLUMN "RFQ_item_id" SET DEFAULT nextval('public."RFQ_items_RFQ_item_id_seq"'::regclass);


--
-- TOC entry 3524 (class 2604 OID 22048)
-- Name: RFQ_supp_item pfq_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_supp_item" ALTER COLUMN pfq_item_id SET DEFAULT nextval('public."RFQ_supp_item_pfq_item_id_seq"'::regclass);


--
-- TOC entry 3527 (class 2604 OID 22072)
-- Name: RFQ_supplier RFQ_sipplier_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_supplier" ALTER COLUMN "RFQ_sipplier_id" SET DEFAULT nextval('public."RFQ_supplier_RFQ_sipplier_id_seq"'::regclass);


--
-- TOC entry 3526 (class 2604 OID 22064)
-- Name: ReplishmentRequest rep_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReplishmentRequest" ALTER COLUMN rep_id SET DEFAULT nextval('public."ReplishmentRequest_rep_id_seq"'::regclass);


--
-- TOC entry 3525 (class 2604 OID 22056)
-- Name: Replishment_routing_rules rule_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Replishment_routing_rules" ALTER COLUMN rule_id SET DEFAULT nextval('public."Replishment_routing_rules_rule_id_seq"'::regclass);


--
-- TOC entry 3534 (class 2604 OID 22132)
-- Name: Request_for_quotaion RFQ_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Request_for_quotaion" ALTER COLUMN "RFQ_id" SET DEFAULT nextval('public."Request_for_quotaion_RFQ_id_seq"'::regclass);


--
-- TOC entry 3519 (class 2604 OID 22008)
-- Name: ReturnOrder return_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReturnOrder" ALTER COLUMN return_id SET DEFAULT nextval('public."ReturnOrder_return_id_seq"'::regclass);


--
-- TOC entry 3523 (class 2604 OID 22040)
-- Name: Roles role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles" ALTER COLUMN role_id SET DEFAULT nextval('public."Roles_role_id_seq"'::regclass);


--
-- TOC entry 3517 (class 2604 OID 21992)
-- Name: Stock_Transfer_Items  tranfer_itemId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock_Transfer_Items " ALTER COLUMN "tranfer_itemId" SET DEFAULT nextval('public."Stock_Transfer_Items _tranfer_itemId_seq"'::regclass);


--
-- TOC entry 3531 (class 2604 OID 22106)
-- Name: Stock_transfers transfer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock_transfers" ALTER COLUMN transfer_id SET DEFAULT nextval('public."Stock_transfers_transfer_id_seq"'::regclass);


--
-- TOC entry 3512 (class 2604 OID 21950)
-- Name: Stocktaking_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stocktaking_items" ALTER COLUMN id SET DEFAULT nextval('public."Stocktaking_items_id_seq"'::regclass);


--
-- TOC entry 3509 (class 2604 OID 21924)
-- Name: Stocktakings stocktaking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stocktakings" ALTER COLUMN stocktaking_id SET DEFAULT nextval('public."Stocktakings_stocktaking_id_seq"'::regclass);


--
-- TOC entry 3510 (class 2604 OID 21932)
-- Name: Supplier supplier_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier" ALTER COLUMN supplier_id SET DEFAULT nextval('public."Supplier_supplier_id_seq"'::regclass);


--
-- TOC entry 3515 (class 2604 OID 21976)
-- Name: SupplierInvoice invoice_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierInvoice" ALTER COLUMN invoice_id SET DEFAULT nextval('public."SupplierInvoice_invoice_id_seq"'::regclass);


--
-- TOC entry 3511 (class 2604 OID 21942)
-- Name: SupplierInvoiceLine line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierInvoiceLine" ALTER COLUMN line_id SET DEFAULT nextval('public."SupplierInvoiceLine_line_id_seq"'::regclass);


--
-- TOC entry 3504 (class 2604 OID 21880)
-- Name: SupplierPerformace SupplierId; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierPerformace" ALTER COLUMN "SupplierId" SET DEFAULT nextval('public."SupplierPerformace_SupplierId_seq"'::regclass);


--
-- TOC entry 3516 (class 2604 OID 21984)
-- Name: SupplierQuotation quotation_id ; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierQuotation" ALTER COLUMN "quotation_id " SET DEFAULT nextval('public."SupplierQuotation_quotation_id _seq"'::regclass);


--
-- TOC entry 3508 (class 2604 OID 21916)
-- Name: Supplier_Product sup_prod_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier_Product" ALTER COLUMN sup_prod_id SET DEFAULT nextval('public."Supplier_Product_sup_prod_id_seq"'::regclass);


--
-- TOC entry 3502 (class 2604 OID 21857)
-- Name: Users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN user_id SET DEFAULT nextval('public."Users_user_id_seq"'::regclass);


--
-- TOC entry 3514 (class 2604 OID 21968)
-- Name: batches_shelves id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batches_shelves ALTER COLUMN id SET DEFAULT nextval('public.batches_shelves_id_seq'::regclass);


--
-- TOC entry 3501 (class 2604 OID 21847)
-- Name: categories cat_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN cat_id SET DEFAULT nextval('public.categories_cat_id_seq'::regclass);


--
-- TOC entry 3499 (class 2604 OID 21829)
-- Name: ingredients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN id SET DEFAULT nextval('public.ingredients_id_seq'::regclass);


--
-- TOC entry 3505 (class 2604 OID 21888)
-- Name: location_stock_level id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_stock_level ALTER COLUMN id SET DEFAULT nextval('public.location_stock_level_id_seq'::regclass);


--
-- TOC entry 3503 (class 2604 OID 21870)
-- Name: measurement_units m_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurement_units ALTER COLUMN m_id SET DEFAULT nextval('public.measurement_units_m_id_seq'::regclass);


--
-- TOC entry 3530 (class 2604 OID 22096)
-- Name: movement_log movement_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movement_log ALTER COLUMN movement_id SET DEFAULT nextval('public.movement_log_movement_id_seq'::regclass);


--
-- TOC entry 3535 (class 2604 OID 22140)
-- Name: permission permission_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission ALTER COLUMN permission_id SET DEFAULT nextval('public.permission_permission_id_seq'::regclass);


--
-- TOC entry 3518 (class 2604 OID 22000)
-- Name: products_ingredients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_ingredients ALTER COLUMN id SET DEFAULT nextval('public.products_ingredients_id_seq'::regclass);


--
-- TOC entry 3532 (class 2604 OID 22114)
-- Name: returnOrderItem return_line_id ; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."returnOrderItem" ALTER COLUMN "return_line_id " SET DEFAULT nextval('public."returnOrderItem_return_line_id _seq"'::regclass);


--
-- TOC entry 3533 (class 2604 OID 22122)
-- Name: shelves shelf_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves ALTER COLUMN shelf_id SET DEFAULT nextval('public.shelves_shelf_id_seq'::regclass);


--
-- TOC entry 3599 (class 2606 OID 22091)
-- Name: Batches Batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Batches"
    ADD CONSTRAINT "Batches_pkey" PRIMARY KEY (batch_id);


--
-- TOC entry 3585 (class 2606 OID 22035)
-- Name: GoodRecieptItem GoodRecieptItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GoodRecieptItem"
    ADD CONSTRAINT "GoodRecieptItem_pkey" PRIMARY KEY ("GRN_item_id");


--
-- TOC entry 3583 (class 2606 OID 22027)
-- Name: GoodReciept GoodReciept_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GoodReciept"
    ADD CONSTRAINT "GoodReciept_pkey" PRIMARY KEY ("GRN_id");


--
-- TOC entry 3553 (class 2606 OID 21901)
-- Name: Location Location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT "Location_pkey" PRIMARY KEY (location_id);


--
-- TOC entry 3567 (class 2606 OID 21963)
-- Name: PO_items PO_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PO_items"
    ADD CONSTRAINT "PO_items_pkey" PRIMARY KEY (line_id);


--
-- TOC entry 3555 (class 2606 OID 21911)
-- Name: Products Products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (product_id);


--
-- TOC entry 3541 (class 2606 OID 21842)
-- Name: PurchaseOrder PurchaseOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY (po_id);


--
-- TOC entry 3597 (class 2606 OID 22083)
-- Name: Purchase_Forecast Purchase_Forecast_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase_Forecast"
    ADD CONSTRAINT "Purchase_Forecast_pkey" PRIMARY KEY ("Forecast_ID");


--
-- TOC entry 3537 (class 2606 OID 21824)
-- Name: QualityInspection QualityInspection_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QualityInspection"
    ADD CONSTRAINT "QualityInspection_pkey" PRIMARY KEY (inspection_id);


--
-- TOC entry 3581 (class 2606 OID 22019)
-- Name: RFQ_items RFQ_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_items"
    ADD CONSTRAINT "RFQ_items_pkey" PRIMARY KEY ("RFQ_item_id");


--
-- TOC entry 3589 (class 2606 OID 22051)
-- Name: RFQ_supp_item RFQ_supp_item_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_supp_item"
    ADD CONSTRAINT "RFQ_supp_item_pkey" PRIMARY KEY (pfq_item_id);


--
-- TOC entry 3595 (class 2606 OID 22075)
-- Name: RFQ_supplier RFQ_supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_supplier"
    ADD CONSTRAINT "RFQ_supplier_pkey" PRIMARY KEY ("RFQ_sipplier_id");


--
-- TOC entry 3593 (class 2606 OID 22067)
-- Name: ReplishmentRequest ReplishmentRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReplishmentRequest"
    ADD CONSTRAINT "ReplishmentRequest_pkey" PRIMARY KEY (rep_id);


--
-- TOC entry 3591 (class 2606 OID 22059)
-- Name: Replishment_routing_rules Replishment_routing_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Replishment_routing_rules"
    ADD CONSTRAINT "Replishment_routing_rules_pkey" PRIMARY KEY (rule_id);


--
-- TOC entry 3609 (class 2606 OID 22135)
-- Name: Request_for_quotaion Request_for_quotaion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Request_for_quotaion"
    ADD CONSTRAINT "Request_for_quotaion_pkey" PRIMARY KEY ("RFQ_id");


--
-- TOC entry 3579 (class 2606 OID 22011)
-- Name: ReturnOrder ReturnOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReturnOrder"
    ADD CONSTRAINT "ReturnOrder_pkey" PRIMARY KEY (return_id);


--
-- TOC entry 3587 (class 2606 OID 22043)
-- Name: Roles Roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY (role_id);


--
-- TOC entry 3575 (class 2606 OID 21995)
-- Name: Stock_Transfer_Items  Stock_Transfer_Items _pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock_Transfer_Items "
    ADD CONSTRAINT "Stock_Transfer_Items _pkey" PRIMARY KEY ("tranfer_itemId");


--
-- TOC entry 3603 (class 2606 OID 22109)
-- Name: Stock_transfers Stock_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock_transfers"
    ADD CONSTRAINT "Stock_transfers_pkey" PRIMARY KEY (transfer_id);


--
-- TOC entry 3565 (class 2606 OID 21953)
-- Name: Stocktaking_items Stocktaking_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stocktaking_items"
    ADD CONSTRAINT "Stocktaking_items_pkey" PRIMARY KEY (id);


--
-- TOC entry 3559 (class 2606 OID 21927)
-- Name: Stocktakings Stocktakings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stocktakings"
    ADD CONSTRAINT "Stocktakings_pkey" PRIMARY KEY (stocktaking_id);


--
-- TOC entry 3563 (class 2606 OID 21945)
-- Name: SupplierInvoiceLine SupplierInvoiceLine_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierInvoiceLine"
    ADD CONSTRAINT "SupplierInvoiceLine_pkey" PRIMARY KEY (line_id);


--
-- TOC entry 3571 (class 2606 OID 21979)
-- Name: SupplierInvoice SupplierInvoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierInvoice"
    ADD CONSTRAINT "SupplierInvoice_pkey" PRIMARY KEY (invoice_id);


--
-- TOC entry 3549 (class 2606 OID 21883)
-- Name: SupplierPerformace SupplierPerformace_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierPerformace"
    ADD CONSTRAINT "SupplierPerformace_pkey" PRIMARY KEY ("SupplierId");


--
-- TOC entry 3573 (class 2606 OID 21987)
-- Name: SupplierQuotation SupplierQuotation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierQuotation"
    ADD CONSTRAINT "SupplierQuotation_pkey" PRIMARY KEY ("quotation_id ");


--
-- TOC entry 3557 (class 2606 OID 21919)
-- Name: Supplier_Product Supplier_Product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier_Product"
    ADD CONSTRAINT "Supplier_Product_pkey" PRIMARY KEY (sup_prod_id);


--
-- TOC entry 3561 (class 2606 OID 21937)
-- Name: Supplier Supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY (supplier_id);


--
-- TOC entry 3545 (class 2606 OID 21862)
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (user_id);


--
-- TOC entry 3569 (class 2606 OID 21971)
-- Name: batches_shelves batches_shelves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batches_shelves
    ADD CONSTRAINT batches_shelves_pkey PRIMARY KEY (id);


--
-- TOC entry 3543 (class 2606 OID 21852)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (cat_id);


--
-- TOC entry 3539 (class 2606 OID 21834)
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id);


--
-- TOC entry 3551 (class 2606 OID 21891)
-- Name: location_stock_level location_stock_level_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_stock_level
    ADD CONSTRAINT location_stock_level_pkey PRIMARY KEY (id);


--
-- TOC entry 3547 (class 2606 OID 21875)
-- Name: measurement_units measurement_units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.measurement_units
    ADD CONSTRAINT measurement_units_pkey PRIMARY KEY (m_id);


--
-- TOC entry 3601 (class 2606 OID 22101)
-- Name: movement_log movement_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movement_log
    ADD CONSTRAINT movement_log_pkey PRIMARY KEY (movement_id);


--
-- TOC entry 3611 (class 2606 OID 22145)
-- Name: permission permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission
    ADD CONSTRAINT permission_pkey PRIMARY KEY (permission_id);


--
-- TOC entry 3613 (class 2606 OID 22152)
-- Name: products_categories products_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_categories
    ADD CONSTRAINT products_categories_pkey PRIMARY KEY (cat_id, product_id);


--
-- TOC entry 3577 (class 2606 OID 22003)
-- Name: products_ingredients products_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_ingredients
    ADD CONSTRAINT products_ingredients_pkey PRIMARY KEY (id);


--
-- TOC entry 3605 (class 2606 OID 22117)
-- Name: returnOrderItem returnOrderItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."returnOrderItem"
    ADD CONSTRAINT "returnOrderItem_pkey" PRIMARY KEY ("return_line_id ");


--
-- TOC entry 3607 (class 2606 OID 22127)
-- Name: shelves shelves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT shelves_pkey PRIMARY KEY (shelf_id);


--
-- TOC entry 3661 (class 2606 OID 22223)
-- Name: Batches fk_batches_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Batches"
    ADD CONSTRAINT fk_batches_location FOREIGN KEY (location_id) REFERENCES public."Location"(location_id) ON DELETE RESTRICT;


--
-- TOC entry 3662 (class 2606 OID 22233)
-- Name: Batches fk_batches_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Batches"
    ADD CONSTRAINT fk_batches_parent FOREIGN KEY (parent_batch_id) REFERENCES public."Batches"(batch_id) ON DELETE SET NULL;


--
-- TOC entry 3663 (class 2606 OID 22218)
-- Name: Batches fk_batches_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Batches"
    ADD CONSTRAINT fk_batches_product FOREIGN KEY (product_id) REFERENCES public."Products"(product_id) ON DELETE RESTRICT;


--
-- TOC entry 3636 (class 2606 OID 22208)
-- Name: batches_shelves fk_batches_shelves_batch; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batches_shelves
    ADD CONSTRAINT fk_batches_shelves_batch FOREIGN KEY (batch_id) REFERENCES public."Batches"(batch_id) ON DELETE CASCADE;


--
-- TOC entry 3637 (class 2606 OID 22213)
-- Name: batches_shelves fk_batches_shelves_shelf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batches_shelves
    ADD CONSTRAINT fk_batches_shelves_shelf FOREIGN KEY (shelf_id) REFERENCES public.shelves(shelf_id) ON DELETE CASCADE;


--
-- TOC entry 3664 (class 2606 OID 22228)
-- Name: Batches fk_batches_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Batches"
    ADD CONSTRAINT fk_batches_supplier FOREIGN KEY (supplier_id) REFERENCES public."Supplier"(supplier_id) ON DELETE SET NULL;


--
-- TOC entry 3651 (class 2606 OID 22318)
-- Name: GoodReciept fk_gr_po; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GoodReciept"
    ADD CONSTRAINT fk_gr_po FOREIGN KEY ("PO_id") REFERENCES public."PurchaseOrder"(po_id) ON DELETE SET NULL;


--
-- TOC entry 3652 (class 2606 OID 22323)
-- Name: GoodRecieptItem fk_gri_batch; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GoodRecieptItem"
    ADD CONSTRAINT fk_gri_batch FOREIGN KEY ("BatchId") REFERENCES public."Batches"(batch_id) ON DELETE SET NULL;


--
-- TOC entry 3653 (class 2606 OID 22328)
-- Name: GoodRecieptItem fk_gri_po_item; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GoodRecieptItem"
    ADD CONSTRAINT fk_gri_po_item FOREIGN KEY ("PO_item_ID") REFERENCES public."PO_items"(line_id) ON DELETE SET NULL;


--
-- TOC entry 3624 (class 2606 OID 22464)
-- Name: Location fk_location_parent; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Location"
    ADD CONSTRAINT fk_location_parent FOREIGN KEY (parent_location) REFERENCES public."Location"(location_id) ON DELETE SET NULL;


--
-- TOC entry 3622 (class 2606 OID 22198)
-- Name: location_stock_level fk_lsl_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_stock_level
    ADD CONSTRAINT fk_lsl_location FOREIGN KEY (location_id) REFERENCES public."Location"(location_id) ON DELETE CASCADE;


--
-- TOC entry 3623 (class 2606 OID 22193)
-- Name: location_stock_level fk_lsl_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location_stock_level
    ADD CONSTRAINT fk_lsl_product FOREIGN KEY (product_id) REFERENCES public."Products"(product_id) ON DELETE CASCADE;


--
-- TOC entry 3665 (class 2606 OID 22238)
-- Name: movement_log fk_movement_batch; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movement_log
    ADD CONSTRAINT fk_movement_batch FOREIGN KEY ("Batch id") REFERENCES public."Batches"(batch_id) ON DELETE RESTRICT;


--
-- TOC entry 3666 (class 2606 OID 22253)
-- Name: movement_log fk_movement_dest_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movement_log
    ADD CONSTRAINT fk_movement_dest_location FOREIGN KEY (destination_location_id) REFERENCES public."Location"(location_id) ON DELETE SET NULL;


--
-- TOC entry 3667 (class 2606 OID 22248)
-- Name: movement_log fk_movement_src_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movement_log
    ADD CONSTRAINT fk_movement_src_location FOREIGN KEY (source_location_id) REFERENCES public."Location"(location_id) ON DELETE SET NULL;


--
-- TOC entry 3668 (class 2606 OID 22243)
-- Name: movement_log fk_movement_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movement_log
    ADD CONSTRAINT fk_movement_user FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) ON DELETE SET NULL;


--
-- TOC entry 3634 (class 2606 OID 22308)
-- Name: PO_items fk_po_items_po; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PO_items"
    ADD CONSTRAINT fk_po_items_po FOREIGN KEY (po_id) REFERENCES public."PurchaseOrder"(po_id) ON DELETE CASCADE;


--
-- TOC entry 3635 (class 2606 OID 22313)
-- Name: PO_items fk_po_items_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PO_items"
    ADD CONSTRAINT fk_po_items_product FOREIGN KEY (prod_id) REFERENCES public."Products"(product_id) ON DELETE RESTRICT;


--
-- TOC entry 3616 (class 2606 OID 22298)
-- Name: PurchaseOrder fk_po_requested_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT fk_po_requested_by FOREIGN KEY (requested_by) REFERENCES public."Users"(user_id) ON DELETE SET NULL;


--
-- TOC entry 3617 (class 2606 OID 22303)
-- Name: PurchaseOrder fk_po_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseOrder"
    ADD CONSTRAINT fk_po_supplier FOREIGN KEY (supplier_id) REFERENCES public."Supplier"(supplier_id) ON DELETE SET NULL;


--
-- TOC entry 3675 (class 2606 OID 22153)
-- Name: products_categories fk_products_categories_cat; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_categories
    ADD CONSTRAINT fk_products_categories_cat FOREIGN KEY (cat_id) REFERENCES public.categories(cat_id) ON DELETE CASCADE;


--
-- TOC entry 3676 (class 2606 OID 22158)
-- Name: products_categories fk_products_categories_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_categories
    ADD CONSTRAINT fk_products_categories_product FOREIGN KEY (product_id) REFERENCES public."Products"(product_id) ON DELETE CASCADE;


--
-- TOC entry 3645 (class 2606 OID 22178)
-- Name: products_ingredients fk_products_ingredients_ingredient; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_ingredients
    ADD CONSTRAINT fk_products_ingredients_ingredient FOREIGN KEY (ingredient_id) REFERENCES public.ingredients(id) ON DELETE RESTRICT;


--
-- TOC entry 3646 (class 2606 OID 22173)
-- Name: products_ingredients fk_products_ingredients_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_ingredients
    ADD CONSTRAINT fk_products_ingredients_product FOREIGN KEY (product_id) REFERENCES public."Products"(product_id) ON DELETE CASCADE;


--
-- TOC entry 3625 (class 2606 OID 22163)
-- Name: Products fk_products_measurement_unit; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT fk_products_measurement_unit FOREIGN KEY (measurement_unit_id) REFERENCES public.measurement_units(m_id) ON DELETE SET NULL;


--
-- TOC entry 3626 (class 2606 OID 22168)
-- Name: Products fk_products_primary_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT fk_products_primary_category FOREIGN KEY ("Category ID") REFERENCES public.categories(cat_id) ON DELETE SET NULL;


--
-- TOC entry 3614 (class 2606 OID 22338)
-- Name: QualityInspection fk_qi_batch; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QualityInspection"
    ADD CONSTRAINT fk_qi_batch FOREIGN KEY ("BatchId") REFERENCES public."Batches"(batch_id) ON DELETE SET NULL;


--
-- TOC entry 3615 (class 2606 OID 22333)
-- Name: QualityInspection fk_qi_gr; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QualityInspection"
    ADD CONSTRAINT fk_qi_gr FOREIGN KEY ("GRN_id") REFERENCES public."GoodReciept"("GRN_id") ON DELETE CASCADE;


--
-- TOC entry 3657 (class 2606 OID 22423)
-- Name: Replishment_routing_rules fk_repl_rules_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Replishment_routing_rules"
    ADD CONSTRAINT fk_repl_rules_location FOREIGN KEY (location_id) REFERENCES public."Location"(location_id) ON DELETE CASCADE;


--
-- TOC entry 3658 (class 2606 OID 22428)
-- Name: ReplishmentRequest fk_replen_req_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReplishmentRequest"
    ADD CONSTRAINT fk_replen_req_location FOREIGN KEY (req_loc_id) REFERENCES public."Location"(location_id) ON DELETE RESTRICT;


--
-- TOC entry 3659 (class 2606 OID 22438)
-- Name: ReplishmentRequest fk_replen_req_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReplishmentRequest"
    ADD CONSTRAINT fk_replen_req_product FOREIGN KEY (product_id) REFERENCES public."Products"(product_id) ON DELETE RESTRICT;


--
-- TOC entry 3660 (class 2606 OID 22433)
-- Name: ReplishmentRequest fk_replen_req_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReplishmentRequest"
    ADD CONSTRAINT fk_replen_req_supplier FOREIGN KEY (supplier_id) REFERENCES public."Supplier"(supplier_id) ON DELETE SET NULL;


--
-- TOC entry 3647 (class 2606 OID 22368)
-- Name: ReturnOrder fk_return_created_by; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReturnOrder"
    ADD CONSTRAINT fk_return_created_by FOREIGN KEY (created_by) REFERENCES public."Users"(user_id) ON DELETE SET NULL;


--
-- TOC entry 3671 (class 2606 OID 22383)
-- Name: returnOrderItem fk_return_item_batch; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."returnOrderItem"
    ADD CONSTRAINT fk_return_item_batch FOREIGN KEY (batch_id) REFERENCES public."Batches"(batch_id) ON DELETE SET NULL;


--
-- TOC entry 3672 (class 2606 OID 22378)
-- Name: returnOrderItem fk_return_item_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."returnOrderItem"
    ADD CONSTRAINT fk_return_item_product FOREIGN KEY (prod_id) REFERENCES public."Products"(product_id) ON DELETE RESTRICT;


--
-- TOC entry 3673 (class 2606 OID 22373)
-- Name: returnOrderItem fk_return_item_return; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."returnOrderItem"
    ADD CONSTRAINT fk_return_item_return FOREIGN KEY ("return_id ") REFERENCES public."ReturnOrder"(return_id) ON DELETE CASCADE;


--
-- TOC entry 3648 (class 2606 OID 22363)
-- Name: ReturnOrder fk_return_origin_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ReturnOrder"
    ADD CONSTRAINT fk_return_origin_location FOREIGN KEY (origin_location_id) REFERENCES public."Location"(location_id) ON DELETE RESTRICT;


--
-- TOC entry 3649 (class 2606 OID 22393)
-- Name: RFQ_items fk_rfq_items_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_items"
    ADD CONSTRAINT fk_rfq_items_product FOREIGN KEY ("Product_id") REFERENCES public."Products"(product_id) ON DELETE RESTRICT;


--
-- TOC entry 3650 (class 2606 OID 22388)
-- Name: RFQ_items fk_rfq_items_rfq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_items"
    ADD CONSTRAINT fk_rfq_items_rfq FOREIGN KEY ("RFQ_id") REFERENCES public."Request_for_quotaion"("RFQ_id") ON DELETE CASCADE;


--
-- TOC entry 3654 (class 2606 OID 22408)
-- Name: RFQ_supp_item fk_rfq_supp_item_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_supp_item"
    ADD CONSTRAINT fk_rfq_supp_item_product FOREIGN KEY ("product_id ") REFERENCES public."Products"(product_id) ON DELETE RESTRICT;


--
-- TOC entry 3655 (class 2606 OID 22398)
-- Name: RFQ_supp_item fk_rfq_supp_item_rfq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_supp_item"
    ADD CONSTRAINT fk_rfq_supp_item_rfq FOREIGN KEY (rfq_id) REFERENCES public."Request_for_quotaion"("RFQ_id") ON DELETE CASCADE;


--
-- TOC entry 3656 (class 2606 OID 22403)
-- Name: RFQ_supp_item fk_rfq_supp_item_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RFQ_supp_item"
    ADD CONSTRAINT fk_rfq_supp_item_supplier FOREIGN KEY (supplier_id) REFERENCES public."Supplier"(supplier_id) ON DELETE CASCADE;


--
-- TOC entry 3620 (class 2606 OID 22458)
-- Name: roles_permission_id fk_roles_perm_perm; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permission_id
    ADD CONSTRAINT fk_roles_perm_perm FOREIGN KEY (permission_id) REFERENCES public.permission(permission_id) ON DELETE CASCADE;


--
-- TOC entry 3621 (class 2606 OID 22453)
-- Name: roles_permission_id fk_roles_perm_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles_permission_id
    ADD CONSTRAINT fk_roles_perm_role FOREIGN KEY (role_id) REFERENCES public."Roles"(role_id) ON DELETE CASCADE;


--
-- TOC entry 3674 (class 2606 OID 22203)
-- Name: shelves fk_shelves_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shelves
    ADD CONSTRAINT fk_shelves_location FOREIGN KEY (location_id) REFERENCES public."Location"(location_id) ON DELETE CASCADE;


--
-- TOC entry 3638 (class 2606 OID 22343)
-- Name: SupplierInvoice fk_si_po; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierInvoice"
    ADD CONSTRAINT fk_si_po FOREIGN KEY (po_id) REFERENCES public."PurchaseOrder"(po_id) ON DELETE SET NULL;


--
-- TOC entry 3639 (class 2606 OID 22348)
-- Name: SupplierInvoice fk_si_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierInvoice"
    ADD CONSTRAINT fk_si_supplier FOREIGN KEY (supplier_id) REFERENCES public."Supplier"(supplier_id) ON DELETE SET NULL;


--
-- TOC entry 3630 (class 2606 OID 22353)
-- Name: SupplierInvoiceLine fk_sil_invoice; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierInvoiceLine"
    ADD CONSTRAINT fk_sil_invoice FOREIGN KEY (invoice_id) REFERENCES public."SupplierInvoice"(invoice_id) ON DELETE CASCADE;


--
-- TOC entry 3631 (class 2606 OID 22358)
-- Name: SupplierInvoiceLine fk_sil_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierInvoiceLine"
    ADD CONSTRAINT fk_sil_product FOREIGN KEY (prod_id) REFERENCES public."Products"(product_id) ON DELETE RESTRICT;


--
-- TOC entry 3632 (class 2606 OID 22293)
-- Name: Stocktaking_items fk_stocktaking_items_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stocktaking_items"
    ADD CONSTRAINT fk_stocktaking_items_product FOREIGN KEY ("Product ID") REFERENCES public."Products"(product_id) ON DELETE RESTRICT;


--
-- TOC entry 3633 (class 2606 OID 22288)
-- Name: Stocktaking_items fk_stocktaking_items_session; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stocktaking_items"
    ADD CONSTRAINT fk_stocktaking_items_session FOREIGN KEY (stocktaking_id) REFERENCES public."Stocktakings"(stocktaking_id) ON DELETE CASCADE;


--
-- TOC entry 3629 (class 2606 OID 22283)
-- Name: Stocktakings fk_stocktakings_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stocktakings"
    ADD CONSTRAINT fk_stocktakings_user FOREIGN KEY ("User ID") REFERENCES public."Users"(user_id) ON DELETE SET NULL;


--
-- TOC entry 3627 (class 2606 OID 22188)
-- Name: Supplier_Product fk_supplier_product_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier_Product"
    ADD CONSTRAINT fk_supplier_product_product FOREIGN KEY (product_id) REFERENCES public."Products"(product_id) ON DELETE CASCADE;


--
-- TOC entry 3628 (class 2606 OID 22183)
-- Name: Supplier_Product fk_supplier_product_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier_Product"
    ADD CONSTRAINT fk_supplier_product_supplier FOREIGN KEY (supplier_id) REFERENCES public."Supplier"(supplier_id) ON DELETE CASCADE;


--
-- TOC entry 3640 (class 2606 OID 22413)
-- Name: SupplierQuotation fk_supplier_quotation_rfq; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierQuotation"
    ADD CONSTRAINT fk_supplier_quotation_rfq FOREIGN KEY (rfq_id) REFERENCES public."Request_for_quotaion"("RFQ_id") ON DELETE SET NULL;


--
-- TOC entry 3641 (class 2606 OID 22418)
-- Name: SupplierQuotation fk_supplier_quotation_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SupplierQuotation"
    ADD CONSTRAINT fk_supplier_quotation_supplier FOREIGN KEY (supplier_id) REFERENCES public."Supplier"(supplier_id) ON DELETE SET NULL;


--
-- TOC entry 3642 (class 2606 OID 22278)
-- Name: Stock_Transfer_Items  fk_transfer_items_batch; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock_Transfer_Items "
    ADD CONSTRAINT fk_transfer_items_batch FOREIGN KEY (batch_id) REFERENCES public."Batches"(batch_id) ON DELETE SET NULL;


--
-- TOC entry 3643 (class 2606 OID 22273)
-- Name: Stock_Transfer_Items  fk_transfer_items_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock_Transfer_Items "
    ADD CONSTRAINT fk_transfer_items_product FOREIGN KEY (product_id) REFERENCES public."Products"(product_id) ON DELETE RESTRICT;


--
-- TOC entry 3644 (class 2606 OID 22268)
-- Name: Stock_Transfer_Items  fk_transfer_items_transfer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock_Transfer_Items "
    ADD CONSTRAINT fk_transfer_items_transfer FOREIGN KEY ("transfer_Id") REFERENCES public."Stock_transfers"(transfer_id) ON DELETE CASCADE;


--
-- TOC entry 3669 (class 2606 OID 22258)
-- Name: Stock_transfers fk_transfers_from_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock_transfers"
    ADD CONSTRAINT fk_transfers_from_location FOREIGN KEY ("fromId") REFERENCES public."Location"(location_id) ON DELETE RESTRICT;


--
-- TOC entry 3670 (class 2606 OID 22263)
-- Name: Stock_transfers fk_transfers_to_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Stock_transfers"
    ADD CONSTRAINT fk_transfers_to_location FOREIGN KEY ("toId") REFERENCES public."Location"(location_id) ON DELETE RESTRICT;


--
-- TOC entry 3618 (class 2606 OID 22448)
-- Name: Users fk_users_location; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT fk_users_location FOREIGN KEY (location_id) REFERENCES public."Location"(location_id) ON DELETE SET NULL;


--
-- TOC entry 3619 (class 2606 OID 22443)
-- Name: Users fk_users_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES public."Roles"(role_id) ON DELETE SET NULL;


-- Completed on 2025-12-03 16:44:41 EET

--
-- PostgreSQL database dump complete
--

\unrestrict d797H2lN8oShx1uAC73gMit6SVCrLSN5bp6rCkvIpKXWsEZ67H7swRdx1sBRYwj

