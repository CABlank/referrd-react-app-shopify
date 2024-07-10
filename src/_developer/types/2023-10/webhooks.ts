export interface CUSTOMERS_MERGE_errors {
  customer_ids: Array<number>;
  field: string;
  message: string;
}
export interface CUSTOMERS_MERGE {
  admin_graphql_api_customer_kept_id: string;
  admin_graphql_api_customer_deleted_id: string;
  admin_graphql_api_job_id: null | string;
  status: string;
  errors: Array<CUSTOMERS_MERGE_errors>;
}
export interface SUBSCRIPTION_BILLING_ATTEMPTS_CHALLENGED {
  id: null | string;
  admin_graphql_api_id: null | string;
  idempotency_key: string;
  order_id: number;
  admin_graphql_api_order_id: string;
  subscription_contract_id: number;
  admin_graphql_api_subscription_contract_id: string;
  ready: boolean;
  error_message: null | string;
  error_code: null | string;
}
export interface FULFILLMENT_ORDERS_HOLD_RELEASED_fulfillment_order {
  id: string;
  status: string;
}
export interface FULFILLMENT_ORDERS_HOLD_RELEASED {
  fulfillment_order: FULFILLMENT_ORDERS_HOLD_RELEASED_fulfillment_order;
}
export interface FULFILLMENT_ORDERS_FULFILLMENT_SERVICE_FAILED_TO_COMPLETE_fulfillment_order {
  id: string;
  status: string;
}
export interface FULFILLMENT_ORDERS_FULFILLMENT_SERVICE_FAILED_TO_COMPLETE {
  fulfillment_order: FULFILLMENT_ORDERS_FULFILLMENT_SERVICE_FAILED_TO_COMPLETE_fulfillment_order;
  message: string;
}
export interface INVENTORY_LEVELS_DISCONNECT {
  inventory_item_id: number;
  location_id: number;
}
export interface PRODUCT_FEEDS_FULL_SYNC_metadata {
  action: string;
  type: string;
  resource: string;
  fullSyncId: string;
  truncatedFields: Array<any>;
  occurred_at: string;
}
export interface PRODUCT_FEEDS_FULL_SYNC_productFeed {
  id: string;
  shop_id: string;
  language: string;
  country: string;
}
export interface PRODUCT_FEEDS_FULL_SYNC_fullSync {
  createdAt: string;
  errorCode: string;
  status: string;
  count: number;
}
export interface PRODUCT_FEEDS_FULL_SYNC {
  metadata: PRODUCT_FEEDS_FULL_SYNC_metadata;
  productFeed: PRODUCT_FEEDS_FULL_SYNC_productFeed;
  fullSync: PRODUCT_FEEDS_FULL_SYNC_fullSync;
}
export interface THEMES_CREATE {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  role: string;
  theme_store_id: number;
  previewable: boolean;
  processing: boolean;
  admin_graphql_api_id: string;
}
export interface ORDERS_PAID_current_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_current_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_current_subtotal_price_set {
  shop_money: ORDERS_PAID_current_subtotal_price_set_shop_money;
  presentment_money: ORDERS_PAID_current_subtotal_price_set_presentment_money;
}
export interface ORDERS_PAID_current_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_current_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_current_total_discounts_set {
  shop_money: ORDERS_PAID_current_total_discounts_set_shop_money;
  presentment_money: ORDERS_PAID_current_total_discounts_set_presentment_money;
}
export interface ORDERS_PAID_current_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_current_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_current_total_price_set {
  shop_money: ORDERS_PAID_current_total_price_set_shop_money;
  presentment_money: ORDERS_PAID_current_total_price_set_presentment_money;
}
export interface ORDERS_PAID_current_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_current_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_current_total_tax_set {
  shop_money: ORDERS_PAID_current_total_tax_set_shop_money;
  presentment_money: ORDERS_PAID_current_total_tax_set_presentment_money;
}
export interface ORDERS_PAID_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_subtotal_price_set {
  shop_money: ORDERS_PAID_subtotal_price_set_shop_money;
  presentment_money: ORDERS_PAID_subtotal_price_set_presentment_money;
}
export interface ORDERS_PAID_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_discounts_set {
  shop_money: ORDERS_PAID_total_discounts_set_shop_money;
  presentment_money: ORDERS_PAID_total_discounts_set_presentment_money;
}
export interface ORDERS_PAID_total_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_line_items_price_set {
  shop_money: ORDERS_PAID_total_line_items_price_set_shop_money;
  presentment_money: ORDERS_PAID_total_line_items_price_set_presentment_money;
}
export interface ORDERS_PAID_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_price_set {
  shop_money: ORDERS_PAID_total_price_set_shop_money;
  presentment_money: ORDERS_PAID_total_price_set_presentment_money;
}
export interface ORDERS_PAID_total_shipping_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_shipping_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_shipping_price_set {
  shop_money: ORDERS_PAID_total_shipping_price_set_shop_money;
  presentment_money: ORDERS_PAID_total_shipping_price_set_presentment_money;
}
export interface ORDERS_PAID_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_total_tax_set {
  shop_money: ORDERS_PAID_total_tax_set_shop_money;
  presentment_money: ORDERS_PAID_total_tax_set_presentment_money;
}
export interface ORDERS_PAID_billing_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_PAID_customer_email_marketing_consent {
  state: string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface ORDERS_PAID_customer_default_address {
  id: number;
  customer_id: number;
  first_name: null | string;
  last_name: null | string;
  company: null | string;
  address1: string;
  address2: null | string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}
export interface ORDERS_PAID_customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null | string;
  updated_at: null | string;
  first_name: string;
  last_name: string;
  state: string;
  note: null | string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  phone: null | string;
  email_marketing_consent: ORDERS_PAID_customer_email_marketing_consent;
  sms_marketing_consent: null | string;
  tags: string;
  currency: string;
  accepts_marketing_updated_at: null | string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  admin_graphql_api_id: string;
  default_address: ORDERS_PAID_customer_default_address;
}
export interface ORDERS_PAID_line_items_attributed_staffs {
  id: string;
  quantity: number;
}
export interface ORDERS_PAID_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_line_items_price_set {
  shop_money: ORDERS_PAID_line_items_price_set_shop_money;
  presentment_money: ORDERS_PAID_line_items_price_set_presentment_money;
}
export interface ORDERS_PAID_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_line_items_total_discount_set {
  shop_money: ORDERS_PAID_line_items_total_discount_set_shop_money;
  presentment_money: ORDERS_PAID_line_items_total_discount_set_presentment_money;
}
export interface ORDERS_PAID_line_items {
  id: number;
  admin_graphql_api_id: string;
  attributed_staffs: Array<ORDERS_PAID_line_items_attributed_staffs>;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: null | string;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: ORDERS_PAID_line_items_price_set;
  product_exists: boolean;
  product_id: number;
  properties: Array<any>;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: ORDERS_PAID_line_items_total_discount_set;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: null | string;
  vendor: null | string;
  tax_lines: Array<any>;
  duties: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_PAID_shipping_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_PAID_shipping_lines_discounted_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_shipping_lines_discounted_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_shipping_lines_discounted_price_set {
  shop_money: ORDERS_PAID_shipping_lines_discounted_price_set_shop_money;
  presentment_money: ORDERS_PAID_shipping_lines_discounted_price_set_presentment_money;
}
export interface ORDERS_PAID_shipping_lines_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_shipping_lines_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PAID_shipping_lines_price_set {
  shop_money: ORDERS_PAID_shipping_lines_price_set_shop_money;
  presentment_money: ORDERS_PAID_shipping_lines_price_set_presentment_money;
}
export interface ORDERS_PAID_shipping_lines {
  id: number;
  carrier_identifier: null | string;
  code: null | string;
  discounted_price: string;
  discounted_price_set: ORDERS_PAID_shipping_lines_discounted_price_set;
  phone: null | string;
  price: string;
  price_set: ORDERS_PAID_shipping_lines_price_set;
  requested_fulfillment_service_id: null | string;
  source: string;
  title: string;
  tax_lines: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_PAID {
  id: number;
  admin_graphql_api_id: string;
  app_id: null | string;
  browser_ip: null | string;
  buyer_accepts_marketing: boolean;
  cancel_reason: string;
  cancelled_at: string;
  cart_token: null | string;
  checkout_id: null | string;
  checkout_token: null | string;
  client_details: null | string;
  closed_at: null | string;
  confirmation_number: null | string;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: ORDERS_PAID_current_subtotal_price_set;
  current_total_additional_fees_set: null | string;
  current_total_discounts: string;
  current_total_discounts_set: ORDERS_PAID_current_total_discounts_set;
  current_total_duties_set: null | string;
  current_total_price: string;
  current_total_price_set: ORDERS_PAID_current_total_price_set;
  current_total_tax: string;
  current_total_tax_set: ORDERS_PAID_current_total_tax_set;
  customer_locale: string;
  device_id: null | string;
  discount_codes: Array<any>;
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillment_status: string;
  landing_site: null | string;
  landing_site_ref: null | string;
  location_id: null | string;
  merchant_of_record_app_id: null | string;
  name: string;
  note: null | string;
  note_attributes: Array<any>;
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_additional_fees_set: null | string;
  original_total_duties_set: null | string;
  payment_gateway_names: Array<string>;
  phone: null | string;
  po_number: null | string;
  presentment_currency: string;
  processed_at: null | string;
  reference: null | string;
  referring_site: null | string;
  source_identifier: null | string;
  source_name: string;
  source_url: null | string;
  subtotal_price: string;
  subtotal_price_set: ORDERS_PAID_subtotal_price_set;
  tags: string;
  tax_exempt: boolean;
  tax_lines: Array<any>;
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: ORDERS_PAID_total_discounts_set;
  total_line_items_price: string;
  total_line_items_price_set: ORDERS_PAID_total_line_items_price_set;
  total_outstanding: string;
  total_price: string;
  total_price_set: ORDERS_PAID_total_price_set;
  total_shipping_price_set: ORDERS_PAID_total_shipping_price_set;
  total_tax: string;
  total_tax_set: ORDERS_PAID_total_tax_set;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: null | string;
  billing_address: ORDERS_PAID_billing_address;
  customer: ORDERS_PAID_customer;
  discount_applications: Array<any>;
  fulfillments: Array<any>;
  line_items: Array<ORDERS_PAID_line_items>;
  payment_terms: null | string;
  refunds: Array<any>;
  shipping_address: ORDERS_PAID_shipping_address;
  shipping_lines: Array<ORDERS_PAID_shipping_lines>;
}
export interface COMPANIES_DELETE {
  name: string;
  note: string;
  external_id: string;
  main_contact_admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  customer_since: string;
  admin_graphql_api_id: string;
}
export interface COMPANY_CONTACTS_CREATE_company {
  name: string;
  note: string;
  external_id: string;
  main_contact_admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  customer_since: string;
  admin_graphql_api_id: string;
}
export interface COMPANY_CONTACTS_CREATE {
  customer_admin_graphql_api_id: string;
  title: string;
  locale: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  company: COMPANY_CONTACTS_CREATE_company;
}
export interface ORDERS_EDITED_order_edit_line_items_additions {
  id: number;
  delta: number;
}
export interface ORDERS_EDITED_order_edit_line_items_removals {
  id: number;
  delta: number;
}
export interface ORDERS_EDITED_order_edit_line_items {
  additions: Array<ORDERS_EDITED_order_edit_line_items_additions>;
  removals: Array<ORDERS_EDITED_order_edit_line_items_removals>;
}
export interface ORDERS_EDITED_order_edit_discounts_line_item {
  additions: Array<any>;
  removals: Array<any>;
}
export interface ORDERS_EDITED_order_edit_discounts {
  line_item: ORDERS_EDITED_order_edit_discounts_line_item;
}
export interface ORDERS_EDITED_order_edit_shipping_lines {
  additions: Array<any>;
}
export interface ORDERS_EDITED_order_edit {
  id: number;
  app_id: null | string;
  created_at: string;
  notify_customer: boolean;
  order_id: number;
  staff_note: string;
  user_id: null | string;
  line_items: ORDERS_EDITED_order_edit_line_items;
  discounts: ORDERS_EDITED_order_edit_discounts;
  shipping_lines: ORDERS_EDITED_order_edit_shipping_lines;
}
export interface ORDERS_EDITED {
  order_edit: ORDERS_EDITED_order_edit;
}
export interface PAYMENT_SCHEDULES_DUE {
  id: number;
  payment_terms_id: number;
  amount: string;
  currency: string;
  issued_at: string;
  due_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
}
export interface APP_PURCHASES_ONE_TIME_UPDATE_app_purchase_one_time {
  admin_graphql_api_id: string;
  name: string;
  status: string;
  admin_graphql_api_shop_id: string;
  created_at: string;
  updated_at: string;
}
export interface APP_PURCHASES_ONE_TIME_UPDATE {
  app_purchase_one_time: APP_PURCHASES_ONE_TIME_UPDATE_app_purchase_one_time;
}
export interface SELLING_PLAN_GROUPS_CREATE_selling_plans_billing_policy {
  interval: string;
  interval_count: number;
  min_cycles: null | string;
  max_cycles: null | string;
}
export interface SELLING_PLAN_GROUPS_CREATE_selling_plans_delivery_policy {
  interval: string;
  interval_count: number;
  anchors: Array<any>;
  cutoff: null | string;
  pre_anchor_behavior: string;
}
export interface SELLING_PLAN_GROUPS_CREATE_selling_plans {
  name: string;
  options: Array<string>;
  position: null | string;
  description: null | string;
  billing_policy: SELLING_PLAN_GROUPS_CREATE_selling_plans_billing_policy;
  delivery_policy: SELLING_PLAN_GROUPS_CREATE_selling_plans_delivery_policy;
  pricing_policies: Array<any>;
}
export interface SELLING_PLAN_GROUPS_CREATE {
  admin_graphql_api_id: string;
  id: number;
  name: string;
  merchant_code: string;
  admin_graphql_api_app: string;
  app_id: null | string;
  description: null | string;
  options: Array<string>;
  position: null | string;
  summary: string;
  selling_plans: Array<SELLING_PLAN_GROUPS_CREATE_selling_plans>;
  product_variants: Array<any>;
  products: Array<any>;
}
export interface COMPANY_LOCATIONS_DELETE_company {
  name: string;
  note: string;
  external_id: string;
  main_contact_admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  customer_since: string;
  admin_graphql_api_id: string;
}
export interface COMPANY_LOCATIONS_DELETE_billing_address {
  address1: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  recipient: string;
  address2: null | string;
  phone: string;
  zone_code: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  company_admin_graphql_api_id: string;
}
export interface COMPANY_LOCATIONS_DELETE_shipping_address {
  address1: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  recipient: string;
  address2: null | string;
  phone: string;
  zone_code: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  company_admin_graphql_api_id: string;
}
export interface COMPANY_LOCATIONS_DELETE_tax_registration {
  tax_id: string;
}
export interface COMPANY_LOCATIONS_DELETE {
  name: string;
  external_id: string;
  phone: string;
  locale: string;
  created_at: string;
  updated_at: string;
  note: string;
  buyer_experience_configuration: null | string;
  admin_graphql_api_id: string;
  tax_exemptions: Array<string>;
  company: COMPANY_LOCATIONS_DELETE_company;
  billing_address: COMPANY_LOCATIONS_DELETE_billing_address;
  shipping_address: COMPANY_LOCATIONS_DELETE_shipping_address;
  tax_registration: COMPANY_LOCATIONS_DELETE_tax_registration;
}
export interface ORDERS_FULFILLED_current_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_current_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_current_subtotal_price_set {
  shop_money: ORDERS_FULFILLED_current_subtotal_price_set_shop_money;
  presentment_money: ORDERS_FULFILLED_current_subtotal_price_set_presentment_money;
}
export interface ORDERS_FULFILLED_current_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_current_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_current_total_discounts_set {
  shop_money: ORDERS_FULFILLED_current_total_discounts_set_shop_money;
  presentment_money: ORDERS_FULFILLED_current_total_discounts_set_presentment_money;
}
export interface ORDERS_FULFILLED_current_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_current_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_current_total_price_set {
  shop_money: ORDERS_FULFILLED_current_total_price_set_shop_money;
  presentment_money: ORDERS_FULFILLED_current_total_price_set_presentment_money;
}
export interface ORDERS_FULFILLED_current_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_current_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_current_total_tax_set {
  shop_money: ORDERS_FULFILLED_current_total_tax_set_shop_money;
  presentment_money: ORDERS_FULFILLED_current_total_tax_set_presentment_money;
}
export interface ORDERS_FULFILLED_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_subtotal_price_set {
  shop_money: ORDERS_FULFILLED_subtotal_price_set_shop_money;
  presentment_money: ORDERS_FULFILLED_subtotal_price_set_presentment_money;
}
export interface ORDERS_FULFILLED_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_discounts_set {
  shop_money: ORDERS_FULFILLED_total_discounts_set_shop_money;
  presentment_money: ORDERS_FULFILLED_total_discounts_set_presentment_money;
}
export interface ORDERS_FULFILLED_total_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_line_items_price_set {
  shop_money: ORDERS_FULFILLED_total_line_items_price_set_shop_money;
  presentment_money: ORDERS_FULFILLED_total_line_items_price_set_presentment_money;
}
export interface ORDERS_FULFILLED_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_price_set {
  shop_money: ORDERS_FULFILLED_total_price_set_shop_money;
  presentment_money: ORDERS_FULFILLED_total_price_set_presentment_money;
}
export interface ORDERS_FULFILLED_total_shipping_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_shipping_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_shipping_price_set {
  shop_money: ORDERS_FULFILLED_total_shipping_price_set_shop_money;
  presentment_money: ORDERS_FULFILLED_total_shipping_price_set_presentment_money;
}
export interface ORDERS_FULFILLED_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_total_tax_set {
  shop_money: ORDERS_FULFILLED_total_tax_set_shop_money;
  presentment_money: ORDERS_FULFILLED_total_tax_set_presentment_money;
}
export interface ORDERS_FULFILLED_billing_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_FULFILLED_customer_email_marketing_consent {
  state: string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface ORDERS_FULFILLED_customer_default_address {
  id: number;
  customer_id: number;
  first_name: null | string;
  last_name: null | string;
  company: null | string;
  address1: string;
  address2: null | string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}
export interface ORDERS_FULFILLED_customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null | string;
  updated_at: null | string;
  first_name: string;
  last_name: string;
  state: string;
  note: null | string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  phone: null | string;
  email_marketing_consent: ORDERS_FULFILLED_customer_email_marketing_consent;
  sms_marketing_consent: null | string;
  tags: string;
  currency: string;
  accepts_marketing_updated_at: null | string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  admin_graphql_api_id: string;
  default_address: ORDERS_FULFILLED_customer_default_address;
}
export interface ORDERS_FULFILLED_line_items_attributed_staffs {
  id: string;
  quantity: number;
}
export interface ORDERS_FULFILLED_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_line_items_price_set {
  shop_money: ORDERS_FULFILLED_line_items_price_set_shop_money;
  presentment_money: ORDERS_FULFILLED_line_items_price_set_presentment_money;
}
export interface ORDERS_FULFILLED_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_line_items_total_discount_set {
  shop_money: ORDERS_FULFILLED_line_items_total_discount_set_shop_money;
  presentment_money: ORDERS_FULFILLED_line_items_total_discount_set_presentment_money;
}
export interface ORDERS_FULFILLED_line_items {
  id: number;
  admin_graphql_api_id: string;
  attributed_staffs: Array<ORDERS_FULFILLED_line_items_attributed_staffs>;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: null | string;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: ORDERS_FULFILLED_line_items_price_set;
  product_exists: boolean;
  product_id: number;
  properties: Array<any>;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: ORDERS_FULFILLED_line_items_total_discount_set;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: null | string;
  vendor: null | string;
  tax_lines: Array<any>;
  duties: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_FULFILLED_shipping_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_FULFILLED_shipping_lines_discounted_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_shipping_lines_discounted_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_shipping_lines_discounted_price_set {
  shop_money: ORDERS_FULFILLED_shipping_lines_discounted_price_set_shop_money;
  presentment_money: ORDERS_FULFILLED_shipping_lines_discounted_price_set_presentment_money;
}
export interface ORDERS_FULFILLED_shipping_lines_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_shipping_lines_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_FULFILLED_shipping_lines_price_set {
  shop_money: ORDERS_FULFILLED_shipping_lines_price_set_shop_money;
  presentment_money: ORDERS_FULFILLED_shipping_lines_price_set_presentment_money;
}
export interface ORDERS_FULFILLED_shipping_lines {
  id: number;
  carrier_identifier: null | string;
  code: null | string;
  discounted_price: string;
  discounted_price_set: ORDERS_FULFILLED_shipping_lines_discounted_price_set;
  phone: null | string;
  price: string;
  price_set: ORDERS_FULFILLED_shipping_lines_price_set;
  requested_fulfillment_service_id: null | string;
  source: string;
  title: string;
  tax_lines: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_FULFILLED {
  id: number;
  admin_graphql_api_id: string;
  app_id: null | string;
  browser_ip: null | string;
  buyer_accepts_marketing: boolean;
  cancel_reason: string;
  cancelled_at: string;
  cart_token: null | string;
  checkout_id: null | string;
  checkout_token: null | string;
  client_details: null | string;
  closed_at: null | string;
  confirmation_number: null | string;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: ORDERS_FULFILLED_current_subtotal_price_set;
  current_total_additional_fees_set: null | string;
  current_total_discounts: string;
  current_total_discounts_set: ORDERS_FULFILLED_current_total_discounts_set;
  current_total_duties_set: null | string;
  current_total_price: string;
  current_total_price_set: ORDERS_FULFILLED_current_total_price_set;
  current_total_tax: string;
  current_total_tax_set: ORDERS_FULFILLED_current_total_tax_set;
  customer_locale: string;
  device_id: null | string;
  discount_codes: Array<any>;
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillment_status: string;
  landing_site: null | string;
  landing_site_ref: null | string;
  location_id: null | string;
  merchant_of_record_app_id: null | string;
  name: string;
  note: null | string;
  note_attributes: Array<any>;
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_additional_fees_set: null | string;
  original_total_duties_set: null | string;
  payment_gateway_names: Array<string>;
  phone: null | string;
  po_number: null | string;
  presentment_currency: string;
  processed_at: null | string;
  reference: null | string;
  referring_site: null | string;
  source_identifier: null | string;
  source_name: string;
  source_url: null | string;
  subtotal_price: string;
  subtotal_price_set: ORDERS_FULFILLED_subtotal_price_set;
  tags: string;
  tax_exempt: boolean;
  tax_lines: Array<any>;
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: ORDERS_FULFILLED_total_discounts_set;
  total_line_items_price: string;
  total_line_items_price_set: ORDERS_FULFILLED_total_line_items_price_set;
  total_outstanding: string;
  total_price: string;
  total_price_set: ORDERS_FULFILLED_total_price_set;
  total_shipping_price_set: ORDERS_FULFILLED_total_shipping_price_set;
  total_tax: string;
  total_tax_set: ORDERS_FULFILLED_total_tax_set;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: null | string;
  billing_address: ORDERS_FULFILLED_billing_address;
  customer: ORDERS_FULFILLED_customer;
  discount_applications: Array<any>;
  fulfillments: Array<any>;
  line_items: Array<ORDERS_FULFILLED_line_items>;
  payment_terms: null | string;
  refunds: Array<any>;
  shipping_address: ORDERS_FULFILLED_shipping_address;
  shipping_lines: Array<ORDERS_FULFILLED_shipping_lines>;
}
export interface FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_PICKUP_fulfillment_order_delivery_method {
  method_type: string;
}
export interface FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_PICKUP_fulfillment_order {
  id: string;
  status: string;
  preparable: boolean;
  delivery_method: FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_PICKUP_fulfillment_order_delivery_method;
}
export interface FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_PICKUP {
  fulfillment_order: FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_PICKUP_fulfillment_order;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_subtotal_price_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_current_subtotal_price_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_current_subtotal_price_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_total_discounts_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_current_total_discounts_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_current_total_discounts_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_total_price_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_current_total_price_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_current_total_price_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_current_total_tax_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_current_total_tax_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_current_total_tax_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_subtotal_price_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_subtotal_price_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_subtotal_price_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_discounts_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_total_discounts_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_total_discounts_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_line_items_price_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_total_line_items_price_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_total_line_items_price_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_price_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_total_price_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_total_price_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_shipping_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_shipping_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_shipping_price_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_total_shipping_price_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_total_shipping_price_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_total_tax_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_total_tax_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_total_tax_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_billing_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_customer_email_marketing_consent {
  state: string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface ORDERS_PARTIALLY_FULFILLED_customer_default_address {
  id: number;
  customer_id: number;
  first_name: null | string;
  last_name: null | string;
  company: null | string;
  address1: string;
  address2: null | string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}
export interface ORDERS_PARTIALLY_FULFILLED_customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null | string;
  updated_at: null | string;
  first_name: string;
  last_name: string;
  state: string;
  note: null | string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  phone: null | string;
  email_marketing_consent: ORDERS_PARTIALLY_FULFILLED_customer_email_marketing_consent;
  sms_marketing_consent: null | string;
  tags: string;
  currency: string;
  accepts_marketing_updated_at: null | string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  admin_graphql_api_id: string;
  default_address: ORDERS_PARTIALLY_FULFILLED_customer_default_address;
}
export interface ORDERS_PARTIALLY_FULFILLED_line_items_attributed_staffs {
  id: string;
  quantity: number;
}
export interface ORDERS_PARTIALLY_FULFILLED_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_line_items_price_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_line_items_price_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_line_items_price_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_line_items_total_discount_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_line_items_total_discount_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_line_items_total_discount_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_line_items {
  id: number;
  admin_graphql_api_id: string;
  attributed_staffs: Array<ORDERS_PARTIALLY_FULFILLED_line_items_attributed_staffs>;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: null | string;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: ORDERS_PARTIALLY_FULFILLED_line_items_price_set;
  product_exists: boolean;
  product_id: number;
  properties: Array<any>;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: ORDERS_PARTIALLY_FULFILLED_line_items_total_discount_set;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: null | string;
  vendor: null | string;
  tax_lines: Array<any>;
  duties: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_PARTIALLY_FULFILLED_shipping_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_shipping_lines_discounted_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_shipping_lines_discounted_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_shipping_lines_discounted_price_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_shipping_lines_discounted_price_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_shipping_lines_discounted_price_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_shipping_lines_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_shipping_lines_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_PARTIALLY_FULFILLED_shipping_lines_price_set {
  shop_money: ORDERS_PARTIALLY_FULFILLED_shipping_lines_price_set_shop_money;
  presentment_money: ORDERS_PARTIALLY_FULFILLED_shipping_lines_price_set_presentment_money;
}
export interface ORDERS_PARTIALLY_FULFILLED_shipping_lines {
  id: number;
  carrier_identifier: null | string;
  code: null | string;
  discounted_price: string;
  discounted_price_set: ORDERS_PARTIALLY_FULFILLED_shipping_lines_discounted_price_set;
  phone: null | string;
  price: string;
  price_set: ORDERS_PARTIALLY_FULFILLED_shipping_lines_price_set;
  requested_fulfillment_service_id: null | string;
  source: string;
  title: string;
  tax_lines: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_PARTIALLY_FULFILLED {
  id: number;
  admin_graphql_api_id: string;
  app_id: null | string;
  browser_ip: null | string;
  buyer_accepts_marketing: boolean;
  cancel_reason: string;
  cancelled_at: string;
  cart_token: null | string;
  checkout_id: null | string;
  checkout_token: null | string;
  client_details: null | string;
  closed_at: null | string;
  confirmation_number: null | string;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: ORDERS_PARTIALLY_FULFILLED_current_subtotal_price_set;
  current_total_additional_fees_set: null | string;
  current_total_discounts: string;
  current_total_discounts_set: ORDERS_PARTIALLY_FULFILLED_current_total_discounts_set;
  current_total_duties_set: null | string;
  current_total_price: string;
  current_total_price_set: ORDERS_PARTIALLY_FULFILLED_current_total_price_set;
  current_total_tax: string;
  current_total_tax_set: ORDERS_PARTIALLY_FULFILLED_current_total_tax_set;
  customer_locale: string;
  device_id: null | string;
  discount_codes: Array<any>;
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillment_status: string;
  landing_site: null | string;
  landing_site_ref: null | string;
  location_id: null | string;
  merchant_of_record_app_id: null | string;
  name: string;
  note: null | string;
  note_attributes: Array<any>;
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_additional_fees_set: null | string;
  original_total_duties_set: null | string;
  payment_gateway_names: Array<string>;
  phone: null | string;
  po_number: null | string;
  presentment_currency: string;
  processed_at: null | string;
  reference: null | string;
  referring_site: null | string;
  source_identifier: null | string;
  source_name: string;
  source_url: null | string;
  subtotal_price: string;
  subtotal_price_set: ORDERS_PARTIALLY_FULFILLED_subtotal_price_set;
  tags: string;
  tax_exempt: boolean;
  tax_lines: Array<any>;
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: ORDERS_PARTIALLY_FULFILLED_total_discounts_set;
  total_line_items_price: string;
  total_line_items_price_set: ORDERS_PARTIALLY_FULFILLED_total_line_items_price_set;
  total_outstanding: string;
  total_price: string;
  total_price_set: ORDERS_PARTIALLY_FULFILLED_total_price_set;
  total_shipping_price_set: ORDERS_PARTIALLY_FULFILLED_total_shipping_price_set;
  total_tax: string;
  total_tax_set: ORDERS_PARTIALLY_FULFILLED_total_tax_set;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: null | string;
  billing_address: ORDERS_PARTIALLY_FULFILLED_billing_address;
  customer: ORDERS_PARTIALLY_FULFILLED_customer;
  discount_applications: Array<any>;
  fulfillments: Array<any>;
  line_items: Array<ORDERS_PARTIALLY_FULFILLED_line_items>;
  payment_terms: null | string;
  refunds: Array<any>;
  shipping_address: ORDERS_PARTIALLY_FULFILLED_shipping_address;
  shipping_lines: Array<ORDERS_PARTIALLY_FULFILLED_shipping_lines>;
}
export interface DISPUTES_CREATE {
  id: number;
  order_id: number;
  type: string;
  amount: string;
  currency: string;
  reason: string;
  network_reason_code: string;
  status: string;
  evidence_due_by: string;
  evidence_sent_on: null | string;
  finalized_on: null | string;
  initiated_at: string;
}
export interface FULFILLMENT_EVENTS_CREATE {
  id: number;
  fulfillment_id: number;
  status: string;
  message: string;
  happened_at: string;
  city: null | string;
  province: null | string;
  country: string;
  zip: null | string;
  address1: null | string;
  latitude: null | string;
  longitude: null | string;
  shop_id: number;
  created_at: string;
  updated_at: string;
  estimated_delivery_at: null | string;
  order_id: number;
  admin_graphql_api_id: string;
}
type COMPANY_CONTACT_ROLES_ASSIGN = Object;
export interface CUSTOMER_GROUPS_CREATE {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  query: string;
}
export interface MARKETS_UPDATE_regions {
  country_code: string;
}
export interface MARKETS_UPDATE {
  id: number;
  name: string;
  enabled: boolean;
  regions: Array<MARKETS_UPDATE_regions>;
}
export interface DRAFT_ORDERS_CREATE_line_items {
  id: number;
  variant_id: number;
  product_id: number;
  title: string;
  variant_title: string;
  sku: string;
  vendor: string;
  quantity: number;
  requires_shipping: boolean;
  taxable: boolean;
  gift_card: boolean;
  fulfillment_service: string;
  grams: number;
  tax_lines: Array<any>;
  applied_discount: null | string;
  name: string;
  properties: Array<any>;
  custom: boolean;
  price: string;
  admin_graphql_api_id: string;
}
export interface DRAFT_ORDERS_CREATE_shipping_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface DRAFT_ORDERS_CREATE_billing_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface DRAFT_ORDERS_CREATE_applied_discount {
  description: string;
  value: string;
  title: string;
  amount: string;
  value_type: string;
}
export interface DRAFT_ORDERS_CREATE_shipping_line {
  title: string;
  custom: boolean;
  handle: null | string;
  price: string;
}
export interface DRAFT_ORDERS_CREATE_tax_lines {
  rate: number;
  title: string;
  price: string;
}
export interface DRAFT_ORDERS_CREATE_payment_terms_payment_schedules {
  id: number;
  created_at: string;
  updated_at: string;
  payment_terms_id: number;
  issued_at: string;
  due_at: string;
  completed_at: string;
  amount: string;
  currency: string;
}
export interface DRAFT_ORDERS_CREATE_payment_terms {
  id: number;
  payment_terms_name: string;
  payment_terms_type: string;
  due_in_days: number;
  created_at: string;
  updated_at: string;
  payment_schedules: Array<DRAFT_ORDERS_CREATE_payment_terms_payment_schedules>;
}
export interface DRAFT_ORDERS_CREATE_customer_email_marketing_consent {
  state: string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface DRAFT_ORDERS_CREATE_customer_default_address {
  id: null | string;
  customer_id: number;
  first_name: null | string;
  last_name: null | string;
  company: null | string;
  address1: string;
  address2: null | string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}
export interface DRAFT_ORDERS_CREATE_customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null | string;
  updated_at: null | string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: null | string;
  note: null | string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  tags: string;
  last_order_name: null | string;
  currency: string;
  phone: null | string;
  accepts_marketing_updated_at: null | string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  email_marketing_consent: DRAFT_ORDERS_CREATE_customer_email_marketing_consent;
  sms_marketing_consent: null | string;
  admin_graphql_api_id: string;
  default_address: DRAFT_ORDERS_CREATE_customer_default_address;
}
export interface DRAFT_ORDERS_CREATE {
  id: number;
  note: null | string;
  email: string;
  taxes_included: boolean;
  currency: string;
  invoice_sent_at: null | string;
  created_at: string;
  updated_at: string;
  tax_exempt: boolean;
  completed_at: null | string;
  name: string;
  status: string;
  line_items: Array<DRAFT_ORDERS_CREATE_line_items>;
  shipping_address: DRAFT_ORDERS_CREATE_shipping_address;
  billing_address: DRAFT_ORDERS_CREATE_billing_address;
  invoice_url: string;
  applied_discount: DRAFT_ORDERS_CREATE_applied_discount;
  order_id: null | string;
  shipping_line: DRAFT_ORDERS_CREATE_shipping_line;
  tax_lines: Array<DRAFT_ORDERS_CREATE_tax_lines>;
  tags: string;
  note_attributes: Array<any>;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  payment_terms: DRAFT_ORDERS_CREATE_payment_terms;
  admin_graphql_api_id: string;
  customer: DRAFT_ORDERS_CREATE_customer;
}
export interface ORDERS_CREATE_current_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_current_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_current_subtotal_price_set {
  shop_money: ORDERS_CREATE_current_subtotal_price_set_shop_money;
  presentment_money: ORDERS_CREATE_current_subtotal_price_set_presentment_money;
}
export interface ORDERS_CREATE_current_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_current_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_current_total_discounts_set {
  shop_money: ORDERS_CREATE_current_total_discounts_set_shop_money;
  presentment_money: ORDERS_CREATE_current_total_discounts_set_presentment_money;
}
export interface ORDERS_CREATE_current_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_current_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_current_total_price_set {
  shop_money: ORDERS_CREATE_current_total_price_set_shop_money;
  presentment_money: ORDERS_CREATE_current_total_price_set_presentment_money;
}
export interface ORDERS_CREATE_current_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_current_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_current_total_tax_set {
  shop_money: ORDERS_CREATE_current_total_tax_set_shop_money;
  presentment_money: ORDERS_CREATE_current_total_tax_set_presentment_money;
}
export interface ORDERS_CREATE_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_subtotal_price_set {
  shop_money: ORDERS_CREATE_subtotal_price_set_shop_money;
  presentment_money: ORDERS_CREATE_subtotal_price_set_presentment_money;
}
export interface ORDERS_CREATE_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_discounts_set {
  shop_money: ORDERS_CREATE_total_discounts_set_shop_money;
  presentment_money: ORDERS_CREATE_total_discounts_set_presentment_money;
}
export interface ORDERS_CREATE_total_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_line_items_price_set {
  shop_money: ORDERS_CREATE_total_line_items_price_set_shop_money;
  presentment_money: ORDERS_CREATE_total_line_items_price_set_presentment_money;
}
export interface ORDERS_CREATE_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_price_set {
  shop_money: ORDERS_CREATE_total_price_set_shop_money;
  presentment_money: ORDERS_CREATE_total_price_set_presentment_money;
}
export interface ORDERS_CREATE_total_shipping_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_shipping_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_shipping_price_set {
  shop_money: ORDERS_CREATE_total_shipping_price_set_shop_money;
  presentment_money: ORDERS_CREATE_total_shipping_price_set_presentment_money;
}
export interface ORDERS_CREATE_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_total_tax_set {
  shop_money: ORDERS_CREATE_total_tax_set_shop_money;
  presentment_money: ORDERS_CREATE_total_tax_set_presentment_money;
}
export interface ORDERS_CREATE_billing_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_CREATE_customer_email_marketing_consent {
  state: string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface ORDERS_CREATE_customer_default_address {
  id: number;
  customer_id: number;
  first_name: null | string;
  last_name: null | string;
  company: null | string;
  address1: string;
  address2: null | string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}
export interface ORDERS_CREATE_customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null | string;
  updated_at: null | string;
  first_name: string;
  last_name: string;
  state: string;
  note: null | string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  phone: null | string;
  email_marketing_consent: ORDERS_CREATE_customer_email_marketing_consent;
  sms_marketing_consent: null | string;
  tags: string;
  currency: string;
  accepts_marketing_updated_at: null | string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  admin_graphql_api_id: string;
  default_address: ORDERS_CREATE_customer_default_address;
}
export interface ORDERS_CREATE_line_items_attributed_staffs {
  id: string;
  quantity: number;
}
export interface ORDERS_CREATE_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_line_items_price_set {
  shop_money: ORDERS_CREATE_line_items_price_set_shop_money;
  presentment_money: ORDERS_CREATE_line_items_price_set_presentment_money;
}
export interface ORDERS_CREATE_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_line_items_total_discount_set {
  shop_money: ORDERS_CREATE_line_items_total_discount_set_shop_money;
  presentment_money: ORDERS_CREATE_line_items_total_discount_set_presentment_money;
}
export interface ORDERS_CREATE_line_items {
  id: number;
  admin_graphql_api_id: string;
  attributed_staffs: Array<ORDERS_CREATE_line_items_attributed_staffs>;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: null | string;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: ORDERS_CREATE_line_items_price_set;
  product_exists: boolean;
  product_id: number;
  properties: Array<any>;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: ORDERS_CREATE_line_items_total_discount_set;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: null | string;
  vendor: null | string;
  tax_lines: Array<any>;
  duties: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_CREATE_shipping_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_CREATE_shipping_lines_discounted_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_shipping_lines_discounted_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_shipping_lines_discounted_price_set {
  shop_money: ORDERS_CREATE_shipping_lines_discounted_price_set_shop_money;
  presentment_money: ORDERS_CREATE_shipping_lines_discounted_price_set_presentment_money;
}
export interface ORDERS_CREATE_shipping_lines_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_shipping_lines_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CREATE_shipping_lines_price_set {
  shop_money: ORDERS_CREATE_shipping_lines_price_set_shop_money;
  presentment_money: ORDERS_CREATE_shipping_lines_price_set_presentment_money;
}
export interface ORDERS_CREATE_shipping_lines {
  id: number;
  carrier_identifier: null | string;
  code: null | string;
  discounted_price: string;
  discounted_price_set: ORDERS_CREATE_shipping_lines_discounted_price_set;
  phone: null | string;
  price: string;
  price_set: ORDERS_CREATE_shipping_lines_price_set;
  requested_fulfillment_service_id: null | string;
  source: string;
  title: string;
  tax_lines: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_CREATE {
  id: number;
  admin_graphql_api_id: string;
  app_id: null | string;
  browser_ip: null | string;
  buyer_accepts_marketing: boolean;
  cancel_reason: string;
  cancelled_at: string;
  cart_token: null | string;
  checkout_id: null | string;
  checkout_token: null | string;
  client_details: null | string;
  closed_at: null | string;
  confirmation_number: null | string;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: ORDERS_CREATE_current_subtotal_price_set;
  current_total_additional_fees_set: null | string;
  current_total_discounts: string;
  current_total_discounts_set: ORDERS_CREATE_current_total_discounts_set;
  current_total_duties_set: null | string;
  current_total_price: string;
  current_total_price_set: ORDERS_CREATE_current_total_price_set;
  current_total_tax: string;
  current_total_tax_set: ORDERS_CREATE_current_total_tax_set;
  customer_locale: string;
  device_id: null | string;
  discount_codes: Array<any>;
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillment_status: string;
  landing_site: null | string;
  landing_site_ref: null | string;
  location_id: null | string;
  merchant_of_record_app_id: null | string;
  name: string;
  note: null | string;
  note_attributes: Array<any>;
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_additional_fees_set: null | string;
  original_total_duties_set: null | string;
  payment_gateway_names: Array<string>;
  phone: null | string;
  po_number: null | string;
  presentment_currency: string;
  processed_at: null | string;
  reference: null | string;
  referring_site: null | string;
  source_identifier: null | string;
  source_name: string;
  source_url: null | string;
  subtotal_price: string;
  subtotal_price_set: ORDERS_CREATE_subtotal_price_set;
  tags: string;
  tax_exempt: boolean;
  tax_lines: Array<any>;
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: ORDERS_CREATE_total_discounts_set;
  total_line_items_price: string;
  total_line_items_price_set: ORDERS_CREATE_total_line_items_price_set;
  total_outstanding: string;
  total_price: string;
  total_price_set: ORDERS_CREATE_total_price_set;
  total_shipping_price_set: ORDERS_CREATE_total_shipping_price_set;
  total_tax: string;
  total_tax_set: ORDERS_CREATE_total_tax_set;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: null | string;
  billing_address: ORDERS_CREATE_billing_address;
  customer: ORDERS_CREATE_customer;
  discount_applications: Array<any>;
  fulfillments: Array<any>;
  line_items: Array<ORDERS_CREATE_line_items>;
  payment_terms: null | string;
  refunds: Array<any>;
  shipping_address: ORDERS_CREATE_shipping_address;
  shipping_lines: Array<ORDERS_CREATE_shipping_lines>;
}
export interface DOMAINS_DESTROY_localization {
  country: null | string;
  default_locale: string;
  alternate_locales: Array<any>;
}
export interface DOMAINS_DESTROY {
  id: number;
  host: string;
  ssl_enabled: boolean;
  localization: DOMAINS_DESTROY_localization;
}
export interface FULFILLMENT_ORDERS_MOVED_original_fulfillment_order {
  id: string;
  status: string;
  assigned_location_id: string;
}
export interface FULFILLMENT_ORDERS_MOVED_moved_fulfillment_order {
  id: string;
  status: string;
  assigned_location_id: string;
}
export interface FULFILLMENT_ORDERS_MOVED_fulfillment_order_line_items_requested {
  id: string;
  quantity: number;
}
export interface FULFILLMENT_ORDERS_MOVED_source_location {
  id: string;
}
export interface FULFILLMENT_ORDERS_MOVED {
  original_fulfillment_order: FULFILLMENT_ORDERS_MOVED_original_fulfillment_order;
  moved_fulfillment_order: FULFILLMENT_ORDERS_MOVED_moved_fulfillment_order;
  destination_location_id: string;
  fulfillment_order_line_items_requested: Array<FULFILLMENT_ORDERS_MOVED_fulfillment_order_line_items_requested>;
  source_location: FULFILLMENT_ORDERS_MOVED_source_location;
}
export interface APP_SUBSCRIPTIONS_APPROACHING_CAPPED_AMOUNT_app_subscription {
  admin_graphql_api_id: string;
  name: string;
  balance_used: number;
  capped_amount: string;
  currency_code: string;
  admin_graphql_api_shop_id: string;
  created_at: string;
  updated_at: string;
}
export interface APP_SUBSCRIPTIONS_APPROACHING_CAPPED_AMOUNT {
  app_subscription: APP_SUBSCRIPTIONS_APPROACHING_CAPPED_AMOUNT_app_subscription;
}
export interface ORDERS_UPDATED_current_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_current_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_current_subtotal_price_set {
  shop_money: ORDERS_UPDATED_current_subtotal_price_set_shop_money;
  presentment_money: ORDERS_UPDATED_current_subtotal_price_set_presentment_money;
}
export interface ORDERS_UPDATED_current_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_current_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_current_total_discounts_set {
  shop_money: ORDERS_UPDATED_current_total_discounts_set_shop_money;
  presentment_money: ORDERS_UPDATED_current_total_discounts_set_presentment_money;
}
export interface ORDERS_UPDATED_current_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_current_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_current_total_price_set {
  shop_money: ORDERS_UPDATED_current_total_price_set_shop_money;
  presentment_money: ORDERS_UPDATED_current_total_price_set_presentment_money;
}
export interface ORDERS_UPDATED_current_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_current_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_current_total_tax_set {
  shop_money: ORDERS_UPDATED_current_total_tax_set_shop_money;
  presentment_money: ORDERS_UPDATED_current_total_tax_set_presentment_money;
}
export interface ORDERS_UPDATED_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_subtotal_price_set {
  shop_money: ORDERS_UPDATED_subtotal_price_set_shop_money;
  presentment_money: ORDERS_UPDATED_subtotal_price_set_presentment_money;
}
export interface ORDERS_UPDATED_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_discounts_set {
  shop_money: ORDERS_UPDATED_total_discounts_set_shop_money;
  presentment_money: ORDERS_UPDATED_total_discounts_set_presentment_money;
}
export interface ORDERS_UPDATED_total_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_line_items_price_set {
  shop_money: ORDERS_UPDATED_total_line_items_price_set_shop_money;
  presentment_money: ORDERS_UPDATED_total_line_items_price_set_presentment_money;
}
export interface ORDERS_UPDATED_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_price_set {
  shop_money: ORDERS_UPDATED_total_price_set_shop_money;
  presentment_money: ORDERS_UPDATED_total_price_set_presentment_money;
}
export interface ORDERS_UPDATED_total_shipping_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_shipping_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_shipping_price_set {
  shop_money: ORDERS_UPDATED_total_shipping_price_set_shop_money;
  presentment_money: ORDERS_UPDATED_total_shipping_price_set_presentment_money;
}
export interface ORDERS_UPDATED_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_total_tax_set {
  shop_money: ORDERS_UPDATED_total_tax_set_shop_money;
  presentment_money: ORDERS_UPDATED_total_tax_set_presentment_money;
}
export interface ORDERS_UPDATED_billing_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_UPDATED_customer_email_marketing_consent {
  state: string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface ORDERS_UPDATED_customer_default_address {
  id: number;
  customer_id: number;
  first_name: null | string;
  last_name: null | string;
  company: null | string;
  address1: string;
  address2: null | string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}
export interface ORDERS_UPDATED_customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null | string;
  updated_at: null | string;
  first_name: string;
  last_name: string;
  state: string;
  note: null | string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  phone: null | string;
  email_marketing_consent: ORDERS_UPDATED_customer_email_marketing_consent;
  sms_marketing_consent: null | string;
  tags: string;
  currency: string;
  accepts_marketing_updated_at: null | string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  admin_graphql_api_id: string;
  default_address: ORDERS_UPDATED_customer_default_address;
}
export interface ORDERS_UPDATED_line_items_attributed_staffs {
  id: string;
  quantity: number;
}
export interface ORDERS_UPDATED_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_line_items_price_set {
  shop_money: ORDERS_UPDATED_line_items_price_set_shop_money;
  presentment_money: ORDERS_UPDATED_line_items_price_set_presentment_money;
}
export interface ORDERS_UPDATED_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_line_items_total_discount_set {
  shop_money: ORDERS_UPDATED_line_items_total_discount_set_shop_money;
  presentment_money: ORDERS_UPDATED_line_items_total_discount_set_presentment_money;
}
export interface ORDERS_UPDATED_line_items {
  id: number;
  admin_graphql_api_id: string;
  attributed_staffs: Array<ORDERS_UPDATED_line_items_attributed_staffs>;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: null | string;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: ORDERS_UPDATED_line_items_price_set;
  product_exists: boolean;
  product_id: number;
  properties: Array<any>;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: ORDERS_UPDATED_line_items_total_discount_set;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: null | string;
  vendor: null | string;
  tax_lines: Array<any>;
  duties: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_UPDATED_shipping_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_UPDATED_shipping_lines_discounted_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_shipping_lines_discounted_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_shipping_lines_discounted_price_set {
  shop_money: ORDERS_UPDATED_shipping_lines_discounted_price_set_shop_money;
  presentment_money: ORDERS_UPDATED_shipping_lines_discounted_price_set_presentment_money;
}
export interface ORDERS_UPDATED_shipping_lines_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_shipping_lines_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_UPDATED_shipping_lines_price_set {
  shop_money: ORDERS_UPDATED_shipping_lines_price_set_shop_money;
  presentment_money: ORDERS_UPDATED_shipping_lines_price_set_presentment_money;
}
export interface ORDERS_UPDATED_shipping_lines {
  id: number;
  carrier_identifier: null | string;
  code: null | string;
  discounted_price: string;
  discounted_price_set: ORDERS_UPDATED_shipping_lines_discounted_price_set;
  phone: null | string;
  price: string;
  price_set: ORDERS_UPDATED_shipping_lines_price_set;
  requested_fulfillment_service_id: null | string;
  source: string;
  title: string;
  tax_lines: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_UPDATED {
  id: number;
  admin_graphql_api_id: string;
  app_id: null | string;
  browser_ip: null | string;
  buyer_accepts_marketing: boolean;
  cancel_reason: string;
  cancelled_at: string;
  cart_token: null | string;
  checkout_id: null | string;
  checkout_token: null | string;
  client_details: null | string;
  closed_at: null | string;
  confirmation_number: null | string;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: ORDERS_UPDATED_current_subtotal_price_set;
  current_total_additional_fees_set: null | string;
  current_total_discounts: string;
  current_total_discounts_set: ORDERS_UPDATED_current_total_discounts_set;
  current_total_duties_set: null | string;
  current_total_price: string;
  current_total_price_set: ORDERS_UPDATED_current_total_price_set;
  current_total_tax: string;
  current_total_tax_set: ORDERS_UPDATED_current_total_tax_set;
  customer_locale: string;
  device_id: null | string;
  discount_codes: Array<any>;
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillment_status: string;
  landing_site: null | string;
  landing_site_ref: null | string;
  location_id: null | string;
  merchant_of_record_app_id: null | string;
  name: string;
  note: null | string;
  note_attributes: Array<any>;
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_additional_fees_set: null | string;
  original_total_duties_set: null | string;
  payment_gateway_names: Array<string>;
  phone: null | string;
  po_number: null | string;
  presentment_currency: string;
  processed_at: null | string;
  reference: null | string;
  referring_site: null | string;
  source_identifier: null | string;
  source_name: string;
  source_url: null | string;
  subtotal_price: string;
  subtotal_price_set: ORDERS_UPDATED_subtotal_price_set;
  tags: string;
  tax_exempt: boolean;
  tax_lines: Array<any>;
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: ORDERS_UPDATED_total_discounts_set;
  total_line_items_price: string;
  total_line_items_price_set: ORDERS_UPDATED_total_line_items_price_set;
  total_outstanding: string;
  total_price: string;
  total_price_set: ORDERS_UPDATED_total_price_set;
  total_shipping_price_set: ORDERS_UPDATED_total_shipping_price_set;
  total_tax: string;
  total_tax_set: ORDERS_UPDATED_total_tax_set;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: null | string;
  billing_address: ORDERS_UPDATED_billing_address;
  customer: ORDERS_UPDATED_customer;
  discount_applications: Array<any>;
  fulfillments: Array<any>;
  line_items: Array<ORDERS_UPDATED_line_items>;
  payment_terms: null | string;
  refunds: Array<any>;
  shipping_address: ORDERS_UPDATED_shipping_address;
  shipping_lines: Array<ORDERS_UPDATED_shipping_lines>;
}
export interface ORDER_TRANSACTIONS_CREATE_payment_details {
  credit_card_bin: null | string;
  avs_result_code: null | string;
  cvv_result_code: null | string;
  credit_card_number: string;
  credit_card_company: string;
  buyer_action_info: null | string;
  credit_card_name: null | string;
  credit_card_wallet: null | string;
  credit_card_expiration_month: null | string;
  credit_card_expiration_year: null | string;
  payment_method_name: string;
}
type ORDER_TRANSACTIONS_CREATE_receipt = Object;
export interface ORDER_TRANSACTIONS_CREATE_total_unsettled_set_presentment_money {
  amount: string;
  currency: string;
}
export interface ORDER_TRANSACTIONS_CREATE_total_unsettled_set_shop_money {
  amount: string;
  currency: string;
}
export interface ORDER_TRANSACTIONS_CREATE_total_unsettled_set {
  presentment_money: ORDER_TRANSACTIONS_CREATE_total_unsettled_set_presentment_money;
  shop_money: ORDER_TRANSACTIONS_CREATE_total_unsettled_set_shop_money;
}
export interface ORDER_TRANSACTIONS_CREATE {
  id: number;
  order_id: number;
  kind: string;
  gateway: string;
  status: string;
  message: null | string;
  created_at: string;
  test: boolean;
  authorization: string;
  location_id: null | string;
  user_id: null | string;
  parent_id: null | string;
  processed_at: null | string;
  device_id: null | string;
  error_code: null | string;
  source_name: string;
  payment_details: ORDER_TRANSACTIONS_CREATE_payment_details;
  receipt: ORDER_TRANSACTIONS_CREATE_receipt;
  amount: string;
  currency: string;
  payment_id: string;
  total_unsettled_set: ORDER_TRANSACTIONS_CREATE_total_unsettled_set;
  admin_graphql_api_id: string;
}
export interface DOMAINS_CREATE_localization {
  country: null | string;
  default_locale: string;
  alternate_locales: Array<any>;
}
export interface DOMAINS_CREATE {
  id: number;
  host: string;
  ssl_enabled: boolean;
  localization: DOMAINS_CREATE_localization;
}
export interface FULFILLMENTS_CREATE_destination {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface FULFILLMENTS_CREATE_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface FULFILLMENTS_CREATE_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface FULFILLMENTS_CREATE_line_items_price_set {
  shop_money: FULFILLMENTS_CREATE_line_items_price_set_shop_money;
  presentment_money: FULFILLMENTS_CREATE_line_items_price_set_presentment_money;
}
export interface FULFILLMENTS_CREATE_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface FULFILLMENTS_CREATE_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface FULFILLMENTS_CREATE_line_items_total_discount_set {
  shop_money: FULFILLMENTS_CREATE_line_items_total_discount_set_shop_money;
  presentment_money: FULFILLMENTS_CREATE_line_items_total_discount_set_presentment_money;
}
export interface FULFILLMENTS_CREATE_line_items {
  id: number;
  variant_id: number;
  title: string;
  quantity: number;
  sku: string;
  variant_title: null | string;
  vendor: null | string;
  fulfillment_service: string;
  product_id: number;
  requires_shipping: boolean;
  taxable: boolean;
  gift_card: boolean;
  name: string;
  variant_inventory_management: string;
  properties: Array<any>;
  product_exists: boolean;
  fulfillable_quantity: number;
  grams: number;
  price: string;
  total_discount: string;
  fulfillment_status: null | string;
  price_set: FULFILLMENTS_CREATE_line_items_price_set;
  total_discount_set: FULFILLMENTS_CREATE_line_items_total_discount_set;
  discount_allocations: Array<any>;
  duties: Array<any>;
  admin_graphql_api_id: string;
  tax_lines: Array<any>;
}
type FULFILLMENTS_CREATE_receipt = Object;
export interface FULFILLMENTS_CREATE {
  id: number;
  order_id: number;
  status: string;
  created_at: string;
  service: null | string;
  updated_at: string;
  tracking_company: string;
  shipment_status: null | string;
  location_id: null | string;
  origin_address: null | string;
  email: string;
  destination: FULFILLMENTS_CREATE_destination;
  line_items: Array<FULFILLMENTS_CREATE_line_items>;
  tracking_number: string;
  tracking_numbers: Array<string>;
  tracking_url: string;
  tracking_urls: Array<string>;
  receipt: FULFILLMENTS_CREATE_receipt;
  name: string;
  admin_graphql_api_id: string;
}
export interface CUSTOMERS_DELETE {
  id: number;
  phone: null | string;
  addresses: Array<any>;
  accepts_marketing_updated_at: string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  email_marketing_consent: null | string;
  sms_marketing_consent: null | string;
  admin_graphql_api_id: string;
}
export interface CUSTOMERS_ENABLE {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: null | string;
  note: string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  tags: string;
  last_order_name: null | string;
  currency: string;
  phone: null | string;
  addresses: Array<any>;
  accepts_marketing_updated_at: string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  email_marketing_consent: null | string;
  sms_marketing_consent: null | string;
  admin_graphql_api_id: string;
}
export interface SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing_variants_option_values {
  option_id: number;
  name: string;
  value: string;
}
export interface SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing_variants {
  id: number;
  title: string;
  option_values: Array<SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing_variants_option_values>;
  price: string;
  formatted_price: string;
  compare_at_price: string;
  grams: number;
  requires_shipping: boolean;
  sku: string;
  barcode: null | string;
  taxable: boolean;
  position: number;
  available: boolean;
  inventory_policy: string;
  inventory_quantity: number;
  inventory_management: string;
  fulfillment_service: string;
  weight: number;
  weight_unit: string;
  image_id: null | string;
  created_at: null | string;
  updated_at: null | string;
}
export interface SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing_images {
  id: number;
  created_at: null | string;
  position: number;
  updated_at: null | string;
  product_id: number;
  src: string;
  variant_ids: Array<any>;
  width: number;
  height: number;
}
export interface SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing_options {
  id: number;
  name: string;
  product_id: number;
  position: number;
  values: Array<string>;
}
export interface SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing {
  product_id: number;
  created_at: null | string;
  updated_at: string;
  body_html: string;
  handle: string;
  product_type: string;
  title: string;
  vendor: string;
  available: boolean;
  tags: string;
  variants: Array<SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing_variants>;
  publish_at: null | string;
  images: Array<SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing_images>;
  options: Array<SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing_options>;
}
export interface SCHEDULED_PRODUCT_LISTINGS_ADD {
  scheduled_product_listing: SCHEDULED_PRODUCT_LISTINGS_ADD_scheduled_product_listing;
}
export interface PROFILES_DELETE {
  id: number;
}
export interface PRODUCTS_DELETE {
  id: number;
}
export interface CHECKOUTS_UPDATE_line_items {
  applied_discounts: Array<any>;
  discount_allocations: Array<any>;
  key: string;
  destination_location_id: number;
  fulfillment_service: string;
  gift_card: boolean;
  grams: number;
  origin_location_id: number;
  presentment_title: string;
  presentment_variant_title: string;
  product_id: number;
  properties: null | string;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  tax_lines: Array<any>;
  taxable: boolean;
  title: string;
  variant_id: null | string;
  variant_title: string;
  variant_price: null | string;
  vendor: string;
  user_id: null | string;
  unit_price_measurement: null | string;
  rank: null | string;
  compare_at_price: null | string;
  line_price: string;
  price: string;
}
export interface CHECKOUTS_UPDATE_billing_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface CHECKOUTS_UPDATE_shipping_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface CHECKOUTS_UPDATE_customer_email_marketing_consent {
  state: string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface CHECKOUTS_UPDATE_customer_default_address {
  id: null | string;
  customer_id: number;
  first_name: null | string;
  last_name: null | string;
  company: null | string;
  address1: string;
  address2: null | string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}
export interface CHECKOUTS_UPDATE_customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null | string;
  updated_at: null | string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: null | string;
  note: null | string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  tags: string;
  last_order_name: null | string;
  currency: string;
  phone: null | string;
  accepts_marketing_updated_at: null | string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  email_marketing_consent: CHECKOUTS_UPDATE_customer_email_marketing_consent;
  sms_marketing_consent: null | string;
  admin_graphql_api_id: string;
  default_address: CHECKOUTS_UPDATE_customer_default_address;
}
export interface CHECKOUTS_UPDATE {
  id: number;
  token: string;
  cart_token: string;
  email: string;
  gateway: null | string;
  buyer_accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  landing_site: null | string;
  note: null | string;
  note_attributes: Array<any>;
  referring_site: null | string;
  shipping_lines: Array<any>;
  taxes_included: boolean;
  total_weight: number;
  currency: string;
  completed_at: null | string;
  closed_at: null | string;
  user_id: null | string;
  location_id: null | string;
  source_identifier: null | string;
  source_url: null | string;
  device_id: null | string;
  phone: null | string;
  customer_locale: null | string;
  line_items: Array<CHECKOUTS_UPDATE_line_items>;
  name: string;
  source: null | string;
  abandoned_checkout_url: string;
  discount_codes: Array<any>;
  tax_lines: Array<any>;
  source_name: string;
  presentment_currency: string;
  buyer_accepts_sms_marketing: boolean;
  sms_marketing_phone: null | string;
  total_discounts: string;
  total_line_items_price: string;
  total_price: string;
  total_tax: string;
  subtotal_price: string;
  total_duties: null | string;
  billing_address: CHECKOUTS_UPDATE_billing_address;
  shipping_address: CHECKOUTS_UPDATE_shipping_address;
  customer: CHECKOUTS_UPDATE_customer;
}
export interface APP_SUBSCRIPTIONS_UPDATE_app_subscription {
  admin_graphql_api_id: string;
  name: string;
  status: string;
  admin_graphql_api_shop_id: string;
  created_at: string;
  updated_at: string;
  currency: string;
  capped_amount: string;
}
export interface APP_SUBSCRIPTIONS_UPDATE {
  app_subscription: APP_SUBSCRIPTIONS_UPDATE_app_subscription;
}
export interface SUBSCRIPTION_BILLING_CYCLE_EDITS_DELETE {
  subscription_contract_id: number;
  cycle_start_at: string;
  cycle_end_at: string;
  cycle_index: number;
  contract_edit: null | string;
  billing_attempt_expected_date: string;
  skipped: boolean;
  edited: boolean;
}
export interface FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_REJECTED_fulfillment_order {
  id: string;
  status: string;
  request_status: string;
}
export interface FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_REJECTED {
  fulfillment_order: FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_REJECTED_fulfillment_order;
  message: string;
}
export interface CUSTOMER_PAYMENT_METHODS_UPDATE_payment_instrument {
  last_digits: string;
  month: number;
  year: number;
  name: string;
  brand: string;
}
export interface CUSTOMER_PAYMENT_METHODS_UPDATE {
  admin_graphql_api_id: string;
  token: string;
  customer_id: number;
  admin_graphql_api_customer_id: string;
  instrument_type: string;
  payment_instrument: CUSTOMER_PAYMENT_METHODS_UPDATE_payment_instrument;
}
export interface COLLECTION_LISTINGS_ADD_collection_listing {
  collection_id: number;
  updated_at: null | string;
  body_html: string;
  default_product_image: null | string;
  handle: string;
  image: null | string;
  title: string;
  sort_order: null | string;
  published_at: string;
}
export interface COLLECTION_LISTINGS_ADD {
  collection_listing: COLLECTION_LISTINGS_ADD_collection_listing;
}
export interface FULFILLMENT_ORDERS_CANCELLATION_REQUEST_SUBMITTED_fulfillment_order {
  id: string;
  status: string;
  request_status: string;
}
export interface FULFILLMENT_ORDERS_CANCELLATION_REQUEST_SUBMITTED_fulfillment_order_merchant_request {
  id: string;
  message: string;
}
export interface FULFILLMENT_ORDERS_CANCELLATION_REQUEST_SUBMITTED {
  fulfillment_order: FULFILLMENT_ORDERS_CANCELLATION_REQUEST_SUBMITTED_fulfillment_order;
  fulfillment_order_merchant_request: FULFILLMENT_ORDERS_CANCELLATION_REQUEST_SUBMITTED_fulfillment_order_merchant_request;
}
export interface COMPANY_CONTACTS_UPDATE_company {
  name: string;
  note: string;
  external_id: string;
  main_contact_admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  customer_since: string;
  admin_graphql_api_id: string;
}
export interface COMPANY_CONTACTS_UPDATE {
  customer_admin_graphql_api_id: string;
  title: string;
  locale: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  company: COMPANY_CONTACTS_UPDATE_company;
}
export interface THEMES_UPDATE {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  role: string;
  theme_store_id: number;
  previewable: boolean;
  processing: boolean;
  admin_graphql_api_id: string;
}
export interface SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS {
  id: null | string;
  admin_graphql_api_id: null | string;
  idempotency_key: string;
  order_id: number;
  admin_graphql_api_order_id: string;
  subscription_contract_id: number;
  admin_graphql_api_subscription_contract_id: string;
  ready: boolean;
  error_message: null | string;
  error_code: null | string;
}
export interface LOCALES_UPDATE {
  locale: string;
  published: boolean;
}
export interface FULFILLMENT_ORDERS_RESCHEDULED_fulfillment_order {
  id: string;
  status: string;
  fulfill_at: string;
}
export interface FULFILLMENT_ORDERS_RESCHEDULED {
  fulfillment_order: FULFILLMENT_ORDERS_RESCHEDULED_fulfillment_order;
}
export interface SELLING_PLAN_GROUPS_UPDATE_selling_plans_billing_policy {
  interval: string;
  interval_count: number;
  min_cycles: null | string;
  max_cycles: null | string;
}
export interface SELLING_PLAN_GROUPS_UPDATE_selling_plans_delivery_policy {
  interval: string;
  interval_count: number;
  anchors: Array<any>;
  cutoff: null | string;
  pre_anchor_behavior: string;
}
export interface SELLING_PLAN_GROUPS_UPDATE_selling_plans {
  name: string;
  options: Array<string>;
  position: null | string;
  description: null | string;
  billing_policy: SELLING_PLAN_GROUPS_UPDATE_selling_plans_billing_policy;
  delivery_policy: SELLING_PLAN_GROUPS_UPDATE_selling_plans_delivery_policy;
  pricing_policies: Array<any>;
}
export interface SELLING_PLAN_GROUPS_UPDATE {
  admin_graphql_api_id: string;
  id: number;
  name: string;
  merchant_code: string;
  admin_graphql_api_app: string;
  app_id: null | string;
  description: null | string;
  options: Array<string>;
  position: null | string;
  summary: string;
  selling_plans: Array<SELLING_PLAN_GROUPS_UPDATE_selling_plans>;
  product_variants: Array<any>;
  products: Array<any>;
}
export interface MARKETS_CREATE_regions {
  country_code: string;
}
export interface MARKETS_CREATE {
  id: number;
  name: string;
  enabled: boolean;
  regions: Array<MARKETS_CREATE_regions>;
}
export interface DRAFT_ORDERS_UPDATE_line_items {
  id: number;
  variant_id: number;
  product_id: number;
  title: string;
  variant_title: string;
  sku: string;
  vendor: string;
  quantity: number;
  requires_shipping: boolean;
  taxable: boolean;
  gift_card: boolean;
  fulfillment_service: string;
  grams: number;
  tax_lines: Array<any>;
  applied_discount: null | string;
  name: string;
  properties: Array<any>;
  custom: boolean;
  price: string;
  admin_graphql_api_id: string;
}
export interface DRAFT_ORDERS_UPDATE_shipping_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface DRAFT_ORDERS_UPDATE_billing_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface DRAFT_ORDERS_UPDATE_applied_discount {
  description: string;
  value: string;
  title: string;
  amount: string;
  value_type: string;
}
export interface DRAFT_ORDERS_UPDATE_shipping_line {
  title: string;
  custom: boolean;
  handle: null | string;
  price: string;
}
export interface DRAFT_ORDERS_UPDATE_tax_lines {
  rate: number;
  title: string;
  price: string;
}
export interface DRAFT_ORDERS_UPDATE_payment_terms_payment_schedules {
  id: number;
  created_at: string;
  updated_at: string;
  payment_terms_id: number;
  issued_at: string;
  due_at: string;
  completed_at: string;
  amount: string;
  currency: string;
}
export interface DRAFT_ORDERS_UPDATE_payment_terms {
  id: number;
  payment_terms_name: string;
  payment_terms_type: string;
  due_in_days: number;
  created_at: string;
  updated_at: string;
  payment_schedules: Array<DRAFT_ORDERS_UPDATE_payment_terms_payment_schedules>;
}
export interface DRAFT_ORDERS_UPDATE_customer_email_marketing_consent {
  state: string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface DRAFT_ORDERS_UPDATE_customer_default_address {
  id: null | string;
  customer_id: number;
  first_name: null | string;
  last_name: null | string;
  company: null | string;
  address1: string;
  address2: null | string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}
export interface DRAFT_ORDERS_UPDATE_customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null | string;
  updated_at: null | string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: null | string;
  note: null | string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  tags: string;
  last_order_name: null | string;
  currency: string;
  phone: null | string;
  accepts_marketing_updated_at: null | string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  email_marketing_consent: DRAFT_ORDERS_UPDATE_customer_email_marketing_consent;
  sms_marketing_consent: null | string;
  admin_graphql_api_id: string;
  default_address: DRAFT_ORDERS_UPDATE_customer_default_address;
}
export interface DRAFT_ORDERS_UPDATE {
  id: number;
  note: null | string;
  email: string;
  taxes_included: boolean;
  currency: string;
  invoice_sent_at: null | string;
  created_at: string;
  updated_at: string;
  tax_exempt: boolean;
  completed_at: null | string;
  name: string;
  status: string;
  line_items: Array<DRAFT_ORDERS_UPDATE_line_items>;
  shipping_address: DRAFT_ORDERS_UPDATE_shipping_address;
  billing_address: DRAFT_ORDERS_UPDATE_billing_address;
  invoice_url: string;
  applied_discount: DRAFT_ORDERS_UPDATE_applied_discount;
  order_id: null | string;
  shipping_line: DRAFT_ORDERS_UPDATE_shipping_line;
  tax_lines: Array<DRAFT_ORDERS_UPDATE_tax_lines>;
  tags: string;
  note_attributes: Array<any>;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  payment_terms: DRAFT_ORDERS_UPDATE_payment_terms;
  admin_graphql_api_id: string;
  customer: DRAFT_ORDERS_UPDATE_customer;
}
export interface INVENTORY_ITEMS_DELETE {
  id: number;
  country_code_of_origin: null | string;
  province_code_of_origin: null | string;
  harmonized_system_code: null | string;
  country_harmonized_system_codes: Array<any>;
  admin_graphql_api_id: string;
}
export interface DISPUTES_UPDATE {
  id: number;
  order_id: number;
  type: string;
  amount: string;
  currency: string;
  reason: string;
  network_reason_code: string;
  status: string;
  evidence_due_by: string;
  evidence_sent_on: null | string;
  finalized_on: null | string;
  initiated_at: string;
}
export interface CUSTOMER_GROUPS_UPDATE {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  query: string;
}
export interface COLLECTIONS_DELETE {
  id: number;
  published_scope: string;
  admin_graphql_api_id: string;
}
export interface CUSTOMERS_EMAIL_MARKETING_CONSENT_UPDATE_email_marketing_consent {
  state: null | string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface CUSTOMERS_EMAIL_MARKETING_CONSENT_UPDATE {
  customer_id: number;
  email_address: null | string;
  email_marketing_consent: CUSTOMERS_EMAIL_MARKETING_CONSENT_UPDATE_email_marketing_consent;
}
export interface DOMAINS_UPDATE_localization {
  country: null | string;
  default_locale: string;
  alternate_locales: Array<any>;
}
export interface DOMAINS_UPDATE {
  id: number;
  host: string;
  ssl_enabled: boolean;
  localization: DOMAINS_UPDATE_localization;
}
export interface INVENTORY_LEVELS_CONNECT {
  inventory_item_id: number;
  location_id: number;
  available: null | string;
  updated_at: string;
  admin_graphql_api_id: string;
}
export interface FULFILLMENTS_UPDATE_destination {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface FULFILLMENTS_UPDATE_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface FULFILLMENTS_UPDATE_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface FULFILLMENTS_UPDATE_line_items_price_set {
  shop_money: FULFILLMENTS_UPDATE_line_items_price_set_shop_money;
  presentment_money: FULFILLMENTS_UPDATE_line_items_price_set_presentment_money;
}
export interface FULFILLMENTS_UPDATE_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface FULFILLMENTS_UPDATE_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface FULFILLMENTS_UPDATE_line_items_total_discount_set {
  shop_money: FULFILLMENTS_UPDATE_line_items_total_discount_set_shop_money;
  presentment_money: FULFILLMENTS_UPDATE_line_items_total_discount_set_presentment_money;
}
export interface FULFILLMENTS_UPDATE_line_items {
  id: number;
  variant_id: number;
  title: string;
  quantity: number;
  sku: string;
  variant_title: null | string;
  vendor: null | string;
  fulfillment_service: string;
  product_id: number;
  requires_shipping: boolean;
  taxable: boolean;
  gift_card: boolean;
  name: string;
  variant_inventory_management: string;
  properties: Array<any>;
  product_exists: boolean;
  fulfillable_quantity: number;
  grams: number;
  price: string;
  total_discount: string;
  fulfillment_status: null | string;
  price_set: FULFILLMENTS_UPDATE_line_items_price_set;
  total_discount_set: FULFILLMENTS_UPDATE_line_items_total_discount_set;
  discount_allocations: Array<any>;
  duties: Array<any>;
  admin_graphql_api_id: string;
  tax_lines: Array<any>;
}
type FULFILLMENTS_UPDATE_receipt = Object;
export interface FULFILLMENTS_UPDATE {
  id: number;
  order_id: number;
  status: string;
  created_at: string;
  service: null | string;
  updated_at: string;
  tracking_company: string;
  shipment_status: null | string;
  location_id: null | string;
  origin_address: null | string;
  email: string;
  destination: FULFILLMENTS_UPDATE_destination;
  line_items: Array<FULFILLMENTS_UPDATE_line_items>;
  tracking_number: string;
  tracking_numbers: Array<string>;
  tracking_url: string;
  tracking_urls: Array<string>;
  receipt: FULFILLMENTS_UPDATE_receipt;
  name: string;
  admin_graphql_api_id: string;
}
export interface REFUNDS_CREATE_total_duties_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_total_duties_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_total_duties_set {
  shop_money: REFUNDS_CREATE_total_duties_set_shop_money;
  presentment_money: REFUNDS_CREATE_total_duties_set_presentment_money;
}
export interface REFUNDS_CREATE_refund_line_items_subtotal_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_refund_line_items_subtotal_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_refund_line_items_subtotal_set {
  shop_money: REFUNDS_CREATE_refund_line_items_subtotal_set_shop_money;
  presentment_money: REFUNDS_CREATE_refund_line_items_subtotal_set_presentment_money;
}
export interface REFUNDS_CREATE_refund_line_items_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_refund_line_items_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_refund_line_items_total_tax_set {
  shop_money: REFUNDS_CREATE_refund_line_items_total_tax_set_shop_money;
  presentment_money: REFUNDS_CREATE_refund_line_items_total_tax_set_presentment_money;
}
export interface REFUNDS_CREATE_refund_line_items_line_item_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_refund_line_items_line_item_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_refund_line_items_line_item_price_set {
  shop_money: REFUNDS_CREATE_refund_line_items_line_item_price_set_shop_money;
  presentment_money: REFUNDS_CREATE_refund_line_items_line_item_price_set_presentment_money;
}
export interface REFUNDS_CREATE_refund_line_items_line_item_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_refund_line_items_line_item_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface REFUNDS_CREATE_refund_line_items_line_item_total_discount_set {
  shop_money: REFUNDS_CREATE_refund_line_items_line_item_total_discount_set_shop_money;
  presentment_money: REFUNDS_CREATE_refund_line_items_line_item_total_discount_set_presentment_money;
}
export interface REFUNDS_CREATE_refund_line_items_line_item {
  id: number;
  variant_id: number;
  title: string;
  quantity: number;
  sku: string;
  variant_title: null | string;
  vendor: null | string;
  fulfillment_service: string;
  product_id: number;
  requires_shipping: boolean;
  taxable: boolean;
  gift_card: boolean;
  name: string;
  variant_inventory_management: string;
  properties: Array<any>;
  product_exists: boolean;
  fulfillable_quantity: number;
  grams: number;
  price: string;
  total_discount: string;
  fulfillment_status: null | string;
  price_set: REFUNDS_CREATE_refund_line_items_line_item_price_set;
  total_discount_set: REFUNDS_CREATE_refund_line_items_line_item_total_discount_set;
  discount_allocations: Array<any>;
  duties: Array<any>;
  admin_graphql_api_id: string;
  tax_lines: Array<any>;
}
export interface REFUNDS_CREATE_refund_line_items {
  id: number;
  quantity: number;
  line_item_id: number;
  location_id: null | string;
  restock_type: string;
  subtotal: number;
  total_tax: number;
  subtotal_set: REFUNDS_CREATE_refund_line_items_subtotal_set;
  total_tax_set: REFUNDS_CREATE_refund_line_items_total_tax_set;
  line_item: REFUNDS_CREATE_refund_line_items_line_item;
}
export interface REFUNDS_CREATE {
  id: number;
  order_id: number;
  created_at: null | string;
  note: string;
  user_id: number;
  processed_at: null | string;
  restock: boolean;
  duties: Array<any>;
  total_duties_set: REFUNDS_CREATE_total_duties_set;
  return: null | string;
  admin_graphql_api_id: string;
  refund_line_items: Array<REFUNDS_CREATE_refund_line_items>;
  transactions: Array<any>;
  order_adjustments: Array<any>;
}
export interface PRODUCTS_UPDATE_variants {
  admin_graphql_api_id: string;
  barcode: null | string;
  compare_at_price: string;
  created_at: null | string;
  fulfillment_service: string;
  id: number;
  inventory_management: string;
  inventory_policy: string;
  position: number;
  price: string;
  product_id: number;
  sku: string;
  taxable: boolean;
  title: string;
  updated_at: null | string;
  option1: string;
  option2: null | string;
  option3: null | string;
  grams: number;
  image_id: null | string;
  weight: number;
  weight_unit: string;
  inventory_item_id: null | string;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
}
export interface PRODUCTS_UPDATE {
  admin_graphql_api_id: string;
  body_html: string;
  created_at: null | string;
  handle: string;
  id: number;
  product_type: string;
  published_at: string;
  template_suffix: null | string;
  title: string;
  updated_at: string;
  vendor: string;
  status: string;
  published_scope: string;
  tags: string;
  variants: Array<PRODUCTS_UPDATE_variants>;
  options: Array<any>;
  images: Array<any>;
  image: null | string;
}
export interface CUSTOMERS_DISABLE {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: null | string;
  note: string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  tags: string;
  last_order_name: null | string;
  currency: string;
  phone: null | string;
  addresses: Array<any>;
  accepts_marketing_updated_at: string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  email_marketing_consent: null | string;
  sms_marketing_consent: null | string;
  admin_graphql_api_id: string;
}
export interface CUSTOMER_PAYMENT_METHODS_REVOKE_payment_instrument {
  last_digits: string;
  month: number;
  year: number;
  name: string;
  brand: string;
}
export interface CUSTOMER_PAYMENT_METHODS_REVOKE {
  admin_graphql_api_id: string;
  token: string;
  customer_id: number;
  admin_graphql_api_customer_id: string;
  instrument_type: string;
  payment_instrument: CUSTOMER_PAYMENT_METHODS_REVOKE_payment_instrument;
}
export interface PROFILES_UPDATE {
  id: number;
}
export interface COLLECTION_LISTINGS_UPDATE_collection_listing {
  collection_id: number;
  updated_at: null | string;
  body_html: string;
  default_product_image: null | string;
  handle: string;
  image: null | string;
  title: string;
  sort_order: null | string;
  published_at: string;
}
export interface COLLECTION_LISTINGS_UPDATE {
  collection_listing: COLLECTION_LISTINGS_UPDATE_collection_listing;
}
export interface THEMES_DELETE {
  id: number;
}
export interface SUBSCRIPTION_CONTRACTS_UPDATE_billing_policy {
  interval: string;
  interval_count: number;
  min_cycles: number;
  max_cycles: number;
}
export interface SUBSCRIPTION_CONTRACTS_UPDATE_delivery_policy {
  interval: string;
  interval_count: number;
}
export interface SUBSCRIPTION_CONTRACTS_UPDATE {
  admin_graphql_api_id: string;
  id: number;
  billing_policy: SUBSCRIPTION_CONTRACTS_UPDATE_billing_policy;
  currency_code: string;
  customer_id: number;
  admin_graphql_api_customer_id: string;
  delivery_policy: SUBSCRIPTION_CONTRACTS_UPDATE_delivery_policy;
  status: string;
  admin_graphql_api_origin_order_id: string;
  origin_order_id: number;
  revision_id: string;
}
export interface COMPANY_CONTACTS_DELETE_company {
  name: string;
  note: string;
  external_id: string;
  main_contact_admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  customer_since: string;
  admin_graphql_api_id: string;
}
export interface COMPANY_CONTACTS_DELETE {
  customer_admin_graphql_api_id: string;
  title: string;
  locale: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  company: COMPANY_CONTACTS_DELETE_company;
}
export interface SHOP_UPDATE {
  id: number;
  name: string;
  email: string;
  domain: null | string;
  province: string;
  country: string;
  address1: string;
  zip: string;
  city: string;
  source: null | string;
  phone: string;
  latitude: null | string;
  longitude: null | string;
  primary_locale: string;
  address2: null | string;
  created_at: null | string;
  updated_at: null | string;
  country_code: string;
  country_name: string;
  currency: string;
  customer_email: string;
  timezone: string;
  iana_timezone: null | string;
  shop_owner: string;
  money_format: string;
  money_with_currency_format: string;
  weight_unit: string;
  province_code: string;
  taxes_included: null | string;
  auto_configure_tax_inclusivity: null | string;
  tax_shipping: null | string;
  county_taxes: null | string;
  plan_display_name: string;
  plan_name: string;
  has_discounts: boolean;
  has_gift_cards: boolean;
  myshopify_domain: null | string;
  google_apps_domain: null | string;
  google_apps_login_enabled: null | string;
  money_in_emails_format: string;
  money_with_currency_in_emails_format: string;
  eligible_for_payments: boolean;
  requires_extra_payments_agreement: boolean;
  password_enabled: null | string;
  has_storefront: boolean;
  finances: boolean;
  primary_location_id: number;
  checkout_api_supported: boolean;
  multi_location_enabled: boolean;
  setup_required: boolean;
  pre_launch_enabled: boolean;
  enabled_presentment_currencies: Array<string>;
  transactional_sms_disabled: boolean;
  marketing_sms_consent_enabled_at_checkout: boolean;
}
export interface BULK_OPERATIONS_FINISH {
  admin_graphql_api_id: string;
  completed_at: string;
  created_at: string;
  error_code: null | string;
  status: string;
  type: string;
}
export interface CHECKOUTS_DELETE {
  id: number;
  presentment_currency: string;
  buyer_accepts_sms_marketing: boolean;
  sms_marketing_phone: null | string;
  total_discounts: string;
  total_line_items_price: string;
  total_price: string;
  total_tax: string;
  subtotal_price: string;
  total_duties: null | string;
}
export interface SUBSCRIPTION_BILLING_CYCLE_EDITS_UPDATE {
  subscription_contract_id: number;
  cycle_start_at: string;
  cycle_end_at: string;
  cycle_index: number;
  contract_edit: null | string;
  billing_attempt_expected_date: string;
  skipped: boolean;
  edited: boolean;
}
export interface FULFILLMENT_EVENTS_DELETE {
  id: number;
  fulfillment_id: number;
  status: string;
  message: string;
  happened_at: string;
  city: null | string;
  province: null | string;
  country: string;
  zip: null | string;
  address1: null | string;
  latitude: null | string;
  longitude: null | string;
  shop_id: number;
  created_at: string;
  updated_at: string;
  estimated_delivery_at: null | string;
  order_id: number;
  admin_graphql_api_id: string;
}
export interface PRODUCT_LISTINGS_UPDATE_product_listing_variants_option_values {
  option_id: number;
  name: string;
  value: string;
}
export interface PRODUCT_LISTINGS_UPDATE_product_listing_variants {
  id: number;
  title: string;
  option_values: Array<PRODUCT_LISTINGS_UPDATE_product_listing_variants_option_values>;
  price: string;
  formatted_price: string;
  compare_at_price: string;
  grams: number;
  requires_shipping: boolean;
  sku: string;
  barcode: null | string;
  taxable: boolean;
  position: number;
  available: boolean;
  inventory_policy: string;
  inventory_quantity: number;
  inventory_management: string;
  fulfillment_service: string;
  weight: number;
  weight_unit: string;
  image_id: null | string;
  created_at: null | string;
  updated_at: null | string;
}
export interface PRODUCT_LISTINGS_UPDATE_product_listing_images {
  id: number;
  created_at: null | string;
  position: number;
  updated_at: null | string;
  product_id: number;
  src: string;
  variant_ids: Array<any>;
  width: number;
  height: number;
}
export interface PRODUCT_LISTINGS_UPDATE_product_listing_options {
  id: number;
  name: string;
  product_id: number;
  position: number;
  values: Array<string>;
}
export interface PRODUCT_LISTINGS_UPDATE_product_listing {
  product_id: number;
  created_at: null | string;
  updated_at: string;
  body_html: string;
  handle: string;
  product_type: string;
  title: string;
  vendor: string;
  available: boolean;
  tags: string;
  published_at: string;
  variants: Array<PRODUCT_LISTINGS_UPDATE_product_listing_variants>;
  images: Array<PRODUCT_LISTINGS_UPDATE_product_listing_images>;
  options: Array<PRODUCT_LISTINGS_UPDATE_product_listing_options>;
}
export interface PRODUCT_LISTINGS_UPDATE {
  product_listing: PRODUCT_LISTINGS_UPDATE_product_listing;
}
export interface CUSTOMER_GROUPS_DELETE {
  id: number;
}
export interface INVENTORY_ITEMS_UPDATE {
  id: number;
  sku: string;
  created_at: string;
  updated_at: string;
  requires_shipping: boolean;
  cost: null | string;
  country_code_of_origin: null | string;
  province_code_of_origin: null | string;
  harmonized_system_code: null | string;
  tracked: boolean;
  country_harmonized_system_codes: Array<any>;
  admin_graphql_api_id: string;
}
type CARTS_UPDATE_line_items_properties = Object;
export interface CARTS_UPDATE_line_items_discounted_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_discounted_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_discounted_price_set {
  shop_money: CARTS_UPDATE_line_items_discounted_price_set_shop_money;
  presentment_money: CARTS_UPDATE_line_items_discounted_price_set_presentment_money;
}
export interface CARTS_UPDATE_line_items_line_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_line_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_line_price_set {
  shop_money: CARTS_UPDATE_line_items_line_price_set_shop_money;
  presentment_money: CARTS_UPDATE_line_items_line_price_set_presentment_money;
}
export interface CARTS_UPDATE_line_items_original_line_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_original_line_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_original_line_price_set {
  shop_money: CARTS_UPDATE_line_items_original_line_price_set_shop_money;
  presentment_money: CARTS_UPDATE_line_items_original_line_price_set_presentment_money;
}
export interface CARTS_UPDATE_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_price_set {
  shop_money: CARTS_UPDATE_line_items_price_set_shop_money;
  presentment_money: CARTS_UPDATE_line_items_price_set_presentment_money;
}
export interface CARTS_UPDATE_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_UPDATE_line_items_total_discount_set {
  shop_money: CARTS_UPDATE_line_items_total_discount_set_shop_money;
  presentment_money: CARTS_UPDATE_line_items_total_discount_set_presentment_money;
}
export interface CARTS_UPDATE_line_items {
  id: number;
  properties: CARTS_UPDATE_line_items_properties;
  quantity: number;
  variant_id: number;
  key: string;
  discounted_price: string;
  discounts: Array<any>;
  gift_card: boolean;
  grams: number;
  line_price: string;
  original_line_price: string;
  original_price: string;
  price: string;
  product_id: number;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  vendor: string;
  discounted_price_set: CARTS_UPDATE_line_items_discounted_price_set;
  line_price_set: CARTS_UPDATE_line_items_line_price_set;
  original_line_price_set: CARTS_UPDATE_line_items_original_line_price_set;
  price_set: CARTS_UPDATE_line_items_price_set;
  total_discount_set: CARTS_UPDATE_line_items_total_discount_set;
}
export interface CARTS_UPDATE {
  id: string;
  token: string;
  line_items: Array<CARTS_UPDATE_line_items>;
  note: null | string;
  updated_at: string;
  created_at: string;
}
export interface DRAFT_ORDERS_DELETE_payment_terms_payment_schedules {
  id: number;
  created_at: string;
  updated_at: string;
  payment_terms_id: number;
  issued_at: string;
  due_at: string;
  completed_at: string;
  amount: string;
  currency: string;
}
export interface DRAFT_ORDERS_DELETE_payment_terms {
  id: number;
  payment_terms_name: string;
  payment_terms_type: string;
  due_in_days: number;
  created_at: string;
  updated_at: string;
  payment_schedules: Array<DRAFT_ORDERS_DELETE_payment_terms_payment_schedules>;
}
export interface DRAFT_ORDERS_DELETE {
  id: number;
  payment_terms: DRAFT_ORDERS_DELETE_payment_terms;
  admin_graphql_api_id: string;
}
export interface SELLING_PLAN_GROUPS_DELETE {
  admin_graphql_api_id: string;
  id: number;
}
export interface COMPANY_LOCATIONS_CREATE_company {
  name: string;
  note: string;
  external_id: string;
  main_contact_admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  customer_since: string;
  admin_graphql_api_id: string;
}
export interface COMPANY_LOCATIONS_CREATE_billing_address {
  address1: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  recipient: string;
  address2: null | string;
  phone: string;
  zone_code: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  company_admin_graphql_api_id: string;
}
export interface COMPANY_LOCATIONS_CREATE_shipping_address {
  address1: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  recipient: string;
  address2: null | string;
  phone: string;
  zone_code: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  company_admin_graphql_api_id: string;
}
export interface COMPANY_LOCATIONS_CREATE_tax_registration {
  tax_id: string;
}
export interface COMPANY_LOCATIONS_CREATE {
  name: string;
  external_id: string;
  phone: string;
  locale: string;
  created_at: string;
  updated_at: string;
  note: string;
  buyer_experience_configuration: null | string;
  admin_graphql_api_id: string;
  tax_exemptions: Array<string>;
  company: COMPANY_LOCATIONS_CREATE_company;
  billing_address: COMPANY_LOCATIONS_CREATE_billing_address;
  shipping_address: COMPANY_LOCATIONS_CREATE_shipping_address;
  tax_registration: COMPANY_LOCATIONS_CREATE_tax_registration;
}
export interface PRODUCT_FEEDS_CREATE {
  id: string;
  country: string;
  language: string;
  status: string;
}
export interface TENDER_TRANSACTIONS_CREATE {
  id: number;
  order_id: number;
  amount: string;
  currency: string;
  user_id: null | string;
  test: boolean;
  processed_at: null | string;
  remote_reference: string;
  payment_details: null | string;
  payment_method: string;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_metadata {
  action: string;
  type: string;
  resource: string;
  truncatedFields: Array<any>;
  occured_at: string;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_productFeed {
  id: string;
  shop_id: string;
  language: string;
  country: string;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_images_edges_node {
  id: string;
  url: string;
  height: number;
  width: number;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_images_edges {
  node: PRODUCT_FEEDS_INCREMENTAL_SYNC_product_images_edges_node;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_images {
  edges: Array<PRODUCT_FEEDS_INCREMENTAL_SYNC_product_images_edges>;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_options {
  name: string;
  values: Array<string>;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants_edges_node_price {
  amount: string;
  currencyCode: string;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants_edges_node_selectedOptions {
  name: string;
  value: string;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants_edges_node {
  id: string;
  title: string;
  price: PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants_edges_node_price;
  compareAtPrice: null | string;
  barcode: null | string;
  weight: number;
  weightUnit: string;
  requireShipping: boolean;
  image: null | string;
  selectedOptions: Array<PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants_edges_node_selectedOptions>;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants_edges {
  node: PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants_edges_node;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants {
  edges: Array<PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants_edges>;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_seo {
  title: string;
  description: string;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product_metafields {
  namespace: string;
  key: string;
  value: string;
  type: string;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC_product {
  id: string;
  title: string;
  description: string;
  onlineStoreUrl: string;
  updatedAt: string;
  productType: string;
  vendor: string;
  handle: string;
  isPublished: boolean;
  publishedAt: string;
  images: PRODUCT_FEEDS_INCREMENTAL_SYNC_product_images;
  options: Array<PRODUCT_FEEDS_INCREMENTAL_SYNC_product_options>;
  variants: PRODUCT_FEEDS_INCREMENTAL_SYNC_product_variants;
  seo: PRODUCT_FEEDS_INCREMENTAL_SYNC_product_seo;
  metafields: Array<PRODUCT_FEEDS_INCREMENTAL_SYNC_product_metafields>;
}
export interface PRODUCT_FEEDS_INCREMENTAL_SYNC {
  metadata: PRODUCT_FEEDS_INCREMENTAL_SYNC_metadata;
  productFeed: PRODUCT_FEEDS_INCREMENTAL_SYNC_productFeed;
  product: PRODUCT_FEEDS_INCREMENTAL_SYNC_product;
}
export interface SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE {
  id: null | string;
  admin_graphql_api_id: null | string;
  idempotency_key: string;
  order_id: number;
  admin_graphql_api_order_id: string;
  subscription_contract_id: number;
  admin_graphql_api_subscription_contract_id: string;
  ready: boolean;
  error_message: null | string;
  error_code: null | string;
}
export interface LOCATIONS_CREATE {
  id: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  phone: string;
  created_at: string;
  updated_at: string;
  country_code: string;
  country_name: string;
  province_code: string;
  legacy: boolean;
  active: boolean;
  admin_graphql_api_id: string;
}
export interface CUSTOMERS_CREATE {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  orders_count: number;
  state: string;
  total_spent: string;
  last_order_id: null | string;
  note: string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  tags: string;
  last_order_name: null | string;
  currency: string;
  phone: null | string;
  addresses: Array<any>;
  accepts_marketing_updated_at: string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  email_marketing_consent: null | string;
  sms_marketing_consent: null | string;
  admin_graphql_api_id: string;
}
type COMPANY_CONTACT_ROLES_REVOKE = Object;
export interface COLLECTIONS_UPDATE {
  id: number;
  handle: string;
  title: string;
  updated_at: string;
  body_html: string;
  published_at: string;
  sort_order: null | string;
  template_suffix: null | string;
  published_scope: string;
  admin_graphql_api_id: string;
}
export interface ORDERS_DELETE {
  id: number;
}
export interface FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_ACCEPTED_fulfillment_order {
  id: string;
  status: string;
  request_status: string;
}
export interface FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_ACCEPTED {
  fulfillment_order: FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_ACCEPTED_fulfillment_order;
  message: string;
}
export interface FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_LOCAL_DELIVERY_fulfillment_order_delivery_method {
  method_type: string;
}
export interface FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_LOCAL_DELIVERY_fulfillment_order {
  id: string;
  status: string;
  preparable: boolean;
  delivery_method: FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_LOCAL_DELIVERY_fulfillment_order_delivery_method;
}
export interface FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_LOCAL_DELIVERY {
  fulfillment_order: FULFILLMENT_ORDERS_LINE_ITEMS_PREPARED_FOR_LOCAL_DELIVERY_fulfillment_order;
}
export interface PRODUCTS_CREATE_variants {
  admin_graphql_api_id: string;
  barcode: null | string;
  compare_at_price: string;
  created_at: null | string;
  fulfillment_service: string;
  id: number;
  inventory_management: string;
  inventory_policy: string;
  position: number;
  price: string;
  product_id: number;
  sku: string;
  taxable: boolean;
  title: string;
  updated_at: null | string;
  option1: string;
  option2: null | string;
  option3: null | string;
  grams: number;
  image_id: null | string;
  weight: number;
  weight_unit: string;
  inventory_item_id: null | string;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
}
export interface PRODUCTS_CREATE {
  admin_graphql_api_id: string;
  body_html: string;
  created_at: null | string;
  handle: string;
  id: number;
  product_type: string;
  published_at: string;
  template_suffix: null | string;
  title: string;
  updated_at: string;
  vendor: string;
  status: string;
  published_scope: string;
  tags: string;
  variants: Array<PRODUCTS_CREATE_variants>;
  options: Array<any>;
  images: Array<any>;
  image: null | string;
}
export interface ORDERS_CANCELLED_current_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_current_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_current_subtotal_price_set {
  shop_money: ORDERS_CANCELLED_current_subtotal_price_set_shop_money;
  presentment_money: ORDERS_CANCELLED_current_subtotal_price_set_presentment_money;
}
export interface ORDERS_CANCELLED_current_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_current_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_current_total_discounts_set {
  shop_money: ORDERS_CANCELLED_current_total_discounts_set_shop_money;
  presentment_money: ORDERS_CANCELLED_current_total_discounts_set_presentment_money;
}
export interface ORDERS_CANCELLED_current_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_current_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_current_total_price_set {
  shop_money: ORDERS_CANCELLED_current_total_price_set_shop_money;
  presentment_money: ORDERS_CANCELLED_current_total_price_set_presentment_money;
}
export interface ORDERS_CANCELLED_current_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_current_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_current_total_tax_set {
  shop_money: ORDERS_CANCELLED_current_total_tax_set_shop_money;
  presentment_money: ORDERS_CANCELLED_current_total_tax_set_presentment_money;
}
export interface ORDERS_CANCELLED_subtotal_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_subtotal_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_subtotal_price_set {
  shop_money: ORDERS_CANCELLED_subtotal_price_set_shop_money;
  presentment_money: ORDERS_CANCELLED_subtotal_price_set_presentment_money;
}
export interface ORDERS_CANCELLED_total_discounts_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_discounts_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_discounts_set {
  shop_money: ORDERS_CANCELLED_total_discounts_set_shop_money;
  presentment_money: ORDERS_CANCELLED_total_discounts_set_presentment_money;
}
export interface ORDERS_CANCELLED_total_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_line_items_price_set {
  shop_money: ORDERS_CANCELLED_total_line_items_price_set_shop_money;
  presentment_money: ORDERS_CANCELLED_total_line_items_price_set_presentment_money;
}
export interface ORDERS_CANCELLED_total_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_price_set {
  shop_money: ORDERS_CANCELLED_total_price_set_shop_money;
  presentment_money: ORDERS_CANCELLED_total_price_set_presentment_money;
}
export interface ORDERS_CANCELLED_total_shipping_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_shipping_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_shipping_price_set {
  shop_money: ORDERS_CANCELLED_total_shipping_price_set_shop_money;
  presentment_money: ORDERS_CANCELLED_total_shipping_price_set_presentment_money;
}
export interface ORDERS_CANCELLED_total_tax_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_tax_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_total_tax_set {
  shop_money: ORDERS_CANCELLED_total_tax_set_shop_money;
  presentment_money: ORDERS_CANCELLED_total_tax_set_presentment_money;
}
export interface ORDERS_CANCELLED_billing_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_CANCELLED_customer_email_marketing_consent {
  state: string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
}
export interface ORDERS_CANCELLED_customer_default_address {
  id: number;
  customer_id: number;
  first_name: null | string;
  last_name: null | string;
  company: null | string;
  address1: string;
  address2: null | string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
  name: string;
  province_code: string;
  country_code: string;
  country_name: string;
  default: boolean;
}
export interface ORDERS_CANCELLED_customer {
  id: number;
  email: string;
  accepts_marketing: boolean;
  created_at: null | string;
  updated_at: null | string;
  first_name: string;
  last_name: string;
  state: string;
  note: null | string;
  verified_email: boolean;
  multipass_identifier: null | string;
  tax_exempt: boolean;
  phone: null | string;
  email_marketing_consent: ORDERS_CANCELLED_customer_email_marketing_consent;
  sms_marketing_consent: null | string;
  tags: string;
  currency: string;
  accepts_marketing_updated_at: null | string;
  marketing_opt_in_level: null | string;
  tax_exemptions: Array<any>;
  admin_graphql_api_id: string;
  default_address: ORDERS_CANCELLED_customer_default_address;
}
export interface ORDERS_CANCELLED_line_items_attributed_staffs {
  id: string;
  quantity: number;
}
export interface ORDERS_CANCELLED_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_line_items_price_set {
  shop_money: ORDERS_CANCELLED_line_items_price_set_shop_money;
  presentment_money: ORDERS_CANCELLED_line_items_price_set_presentment_money;
}
export interface ORDERS_CANCELLED_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_line_items_total_discount_set {
  shop_money: ORDERS_CANCELLED_line_items_total_discount_set_shop_money;
  presentment_money: ORDERS_CANCELLED_line_items_total_discount_set_presentment_money;
}
export interface ORDERS_CANCELLED_line_items {
  id: number;
  admin_graphql_api_id: string;
  attributed_staffs: Array<ORDERS_CANCELLED_line_items_attributed_staffs>;
  fulfillable_quantity: number;
  fulfillment_service: string;
  fulfillment_status: null | string;
  gift_card: boolean;
  grams: number;
  name: string;
  price: string;
  price_set: ORDERS_CANCELLED_line_items_price_set;
  product_exists: boolean;
  product_id: number;
  properties: Array<any>;
  quantity: number;
  requires_shipping: boolean;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  total_discount_set: ORDERS_CANCELLED_line_items_total_discount_set;
  variant_id: number;
  variant_inventory_management: string;
  variant_title: null | string;
  vendor: null | string;
  tax_lines: Array<any>;
  duties: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_CANCELLED_shipping_address {
  first_name: string;
  address1: string;
  phone: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  last_name: string;
  address2: null | string;
  company: string;
  latitude: null | string;
  longitude: null | string;
  name: string;
  country_code: string;
  province_code: string;
}
export interface ORDERS_CANCELLED_shipping_lines_discounted_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_shipping_lines_discounted_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_shipping_lines_discounted_price_set {
  shop_money: ORDERS_CANCELLED_shipping_lines_discounted_price_set_shop_money;
  presentment_money: ORDERS_CANCELLED_shipping_lines_discounted_price_set_presentment_money;
}
export interface ORDERS_CANCELLED_shipping_lines_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_shipping_lines_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface ORDERS_CANCELLED_shipping_lines_price_set {
  shop_money: ORDERS_CANCELLED_shipping_lines_price_set_shop_money;
  presentment_money: ORDERS_CANCELLED_shipping_lines_price_set_presentment_money;
}
export interface ORDERS_CANCELLED_shipping_lines {
  id: number;
  carrier_identifier: null | string;
  code: null | string;
  discounted_price: string;
  discounted_price_set: ORDERS_CANCELLED_shipping_lines_discounted_price_set;
  phone: null | string;
  price: string;
  price_set: ORDERS_CANCELLED_shipping_lines_price_set;
  requested_fulfillment_service_id: null | string;
  source: string;
  title: string;
  tax_lines: Array<any>;
  discount_allocations: Array<any>;
}
export interface ORDERS_CANCELLED {
  id: number;
  admin_graphql_api_id: string;
  app_id: null | string;
  browser_ip: null | string;
  buyer_accepts_marketing: boolean;
  cancel_reason: string;
  cancelled_at: string;
  cart_token: null | string;
  checkout_id: null | string;
  checkout_token: null | string;
  client_details: null | string;
  closed_at: null | string;
  confirmation_number: null | string;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: ORDERS_CANCELLED_current_subtotal_price_set;
  current_total_additional_fees_set: null | string;
  current_total_discounts: string;
  current_total_discounts_set: ORDERS_CANCELLED_current_total_discounts_set;
  current_total_duties_set: null | string;
  current_total_price: string;
  current_total_price_set: ORDERS_CANCELLED_current_total_price_set;
  current_total_tax: string;
  current_total_tax_set: ORDERS_CANCELLED_current_total_tax_set;
  customer_locale: string;
  device_id: null | string;
  discount_codes: Array<any>;
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillment_status: string;
  landing_site: null | string;
  landing_site_ref: null | string;
  location_id: null | string;
  merchant_of_record_app_id: null | string;
  name: string;
  note: null | string;
  note_attributes: Array<any>;
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_additional_fees_set: null | string;
  original_total_duties_set: null | string;
  payment_gateway_names: Array<string>;
  phone: null | string;
  po_number: null | string;
  presentment_currency: string;
  processed_at: null | string;
  reference: null | string;
  referring_site: null | string;
  source_identifier: null | string;
  source_name: string;
  source_url: null | string;
  subtotal_price: string;
  subtotal_price_set: ORDERS_CANCELLED_subtotal_price_set;
  tags: string;
  tax_exempt: boolean;
  tax_lines: Array<any>;
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: ORDERS_CANCELLED_total_discounts_set;
  total_line_items_price: string;
  total_line_items_price_set: ORDERS_CANCELLED_total_line_items_price_set;
  total_outstanding: string;
  total_price: string;
  total_price_set: ORDERS_CANCELLED_total_price_set;
  total_shipping_price_set: ORDERS_CANCELLED_total_shipping_price_set;
  total_tax: string;
  total_tax_set: ORDERS_CANCELLED_total_tax_set;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: null | string;
  billing_address: ORDERS_CANCELLED_billing_address;
  customer: ORDERS_CANCELLED_customer;
  discount_applications: Array<any>;
  fulfillments: Array<any>;
  line_items: Array<ORDERS_CANCELLED_line_items>;
  payment_terms: null | string;
  refunds: Array<any>;
  shipping_address: ORDERS_CANCELLED_shipping_address;
  shipping_lines: Array<ORDERS_CANCELLED_shipping_lines>;
}
export interface INVENTORY_LEVELS_UPDATE {
  inventory_item_id: number;
  location_id: number;
  available: null | string;
  updated_at: string;
  admin_graphql_api_id: string;
}
export interface PROFILES_CREATE {
  id: number;
}
export interface THEMES_PUBLISH {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  role: string;
  theme_store_id: number;
  previewable: boolean;
  processing: boolean;
  admin_graphql_api_id: string;
}
export interface COMPANIES_UPDATE {
  name: string;
  note: string;
  external_id: string;
  main_contact_admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  customer_since: string;
  admin_graphql_api_id: string;
}
export interface PRODUCT_LISTINGS_ADD_product_listing_variants_option_values {
  option_id: number;
  name: string;
  value: string;
}
export interface PRODUCT_LISTINGS_ADD_product_listing_variants {
  id: number;
  title: string;
  option_values: Array<PRODUCT_LISTINGS_ADD_product_listing_variants_option_values>;
  price: string;
  formatted_price: string;
  compare_at_price: string;
  grams: number;
  requires_shipping: boolean;
  sku: string;
  barcode: null | string;
  taxable: boolean;
  position: number;
  available: boolean;
  inventory_policy: string;
  inventory_quantity: number;
  inventory_management: string;
  fulfillment_service: string;
  weight: number;
  weight_unit: string;
  image_id: null | string;
  created_at: null | string;
  updated_at: null | string;
}
export interface PRODUCT_LISTINGS_ADD_product_listing_images {
  id: number;
  created_at: null | string;
  position: number;
  updated_at: null | string;
  product_id: number;
  src: string;
  variant_ids: Array<any>;
  width: number;
  height: number;
}
export interface PRODUCT_LISTINGS_ADD_product_listing_options {
  id: number;
  name: string;
  product_id: number;
  position: number;
  values: Array<string>;
}
export interface PRODUCT_LISTINGS_ADD_product_listing {
  product_id: number;
  created_at: null | string;
  updated_at: string;
  body_html: string;
  handle: string;
  product_type: string;
  title: string;
  vendor: string;
  available: boolean;
  tags: string;
  published_at: string;
  variants: Array<PRODUCT_LISTINGS_ADD_product_listing_variants>;
  images: Array<PRODUCT_LISTINGS_ADD_product_listing_images>;
  options: Array<PRODUCT_LISTINGS_ADD_product_listing_options>;
}
export interface PRODUCT_LISTINGS_ADD {
  product_listing: PRODUCT_LISTINGS_ADD_product_listing;
}
export interface SUBSCRIPTION_CONTRACTS_CREATE_billing_policy {
  interval: string;
  interval_count: number;
  min_cycles: number;
  max_cycles: number;
}
export interface SUBSCRIPTION_CONTRACTS_CREATE_delivery_policy {
  interval: string;
  interval_count: number;
}
export interface SUBSCRIPTION_CONTRACTS_CREATE {
  admin_graphql_api_id: string;
  id: number;
  billing_policy: SUBSCRIPTION_CONTRACTS_CREATE_billing_policy;
  currency_code: string;
  customer_id: number;
  admin_graphql_api_customer_id: string;
  delivery_policy: SUBSCRIPTION_CONTRACTS_CREATE_delivery_policy;
  status: string;
  admin_graphql_api_origin_order_id: string;
  origin_order_id: number;
  revision_id: string;
}
export interface SUBSCRIPTION_BILLING_CYCLE_EDITS_CREATE {
  subscription_contract_id: number;
  cycle_start_at: string;
  cycle_end_at: string;
  cycle_index: number;
  contract_edit: null | string;
  billing_attempt_expected_date: string;
  skipped: boolean;
  edited: boolean;
}
export interface PRODUCT_LISTINGS_REMOVE_product_listing {
  product_id: number;
}
export interface PRODUCT_LISTINGS_REMOVE {
  product_listing: PRODUCT_LISTINGS_REMOVE_product_listing;
}
export interface MARKETS_DELETE {
  id: number;
}
type CARTS_CREATE_line_items_properties = Object;
export interface CARTS_CREATE_line_items_discounted_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_discounted_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_discounted_price_set {
  shop_money: CARTS_CREATE_line_items_discounted_price_set_shop_money;
  presentment_money: CARTS_CREATE_line_items_discounted_price_set_presentment_money;
}
export interface CARTS_CREATE_line_items_line_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_line_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_line_price_set {
  shop_money: CARTS_CREATE_line_items_line_price_set_shop_money;
  presentment_money: CARTS_CREATE_line_items_line_price_set_presentment_money;
}
export interface CARTS_CREATE_line_items_original_line_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_original_line_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_original_line_price_set {
  shop_money: CARTS_CREATE_line_items_original_line_price_set_shop_money;
  presentment_money: CARTS_CREATE_line_items_original_line_price_set_presentment_money;
}
export interface CARTS_CREATE_line_items_price_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_price_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_price_set {
  shop_money: CARTS_CREATE_line_items_price_set_shop_money;
  presentment_money: CARTS_CREATE_line_items_price_set_presentment_money;
}
export interface CARTS_CREATE_line_items_total_discount_set_shop_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_total_discount_set_presentment_money {
  amount: string;
  currency_code: string;
}
export interface CARTS_CREATE_line_items_total_discount_set {
  shop_money: CARTS_CREATE_line_items_total_discount_set_shop_money;
  presentment_money: CARTS_CREATE_line_items_total_discount_set_presentment_money;
}
export interface CARTS_CREATE_line_items {
  id: number;
  properties: CARTS_CREATE_line_items_properties;
  quantity: number;
  variant_id: number;
  key: string;
  discounted_price: string;
  discounts: Array<any>;
  gift_card: boolean;
  grams: number;
  line_price: string;
  original_line_price: string;
  original_price: string;
  price: string;
  product_id: number;
  sku: string;
  taxable: boolean;
  title: string;
  total_discount: string;
  vendor: string;
  discounted_price_set: CARTS_CREATE_line_items_discounted_price_set;
  line_price_set: CARTS_CREATE_line_items_line_price_set;
  original_line_price_set: CARTS_CREATE_line_items_original_line_price_set;
  price_set: CARTS_CREATE_line_items_price_set;
  total_discount_set: CARTS_CREATE_line_items_total_discount_set;
}
export interface CARTS_CREATE {
  id: string;
  token: string;
  line_items: Array<CARTS_CREATE_line_items>;
  note: null | string;
  updated_at: string;
  created_at: string;
}
export interface INVENTORY_ITEMS_CREATE {
  id: number;
  sku: string;
  created_at: string;
  updated_at: string;
  requires_shipping: boolean;
  cost: null | string;
  country_code_of_origin: null | string;
  province_code_of_origin: null | string;
  harmonized_system_code: null | string;
  tracked: boolean;
  country_harmonized_system_codes: Array<any>;
  admin_graphql_api_id: string;
}
export interface FULFILLMENT_ORDERS_ORDER_ROUTING_COMPLETE_fulfillment_order {
  id: string;
  status: string;
}
export interface FULFILLMENT_ORDERS_ORDER_ROUTING_COMPLETE {
  fulfillment_order: FULFILLMENT_ORDERS_ORDER_ROUTING_COMPLETE_fulfillment_order;
}
export interface APP_UNINSTALLED {
  id: number;
  name: string;
  email: string;
  domain: null | string;
  province: string;
  country: string;
  address1: string;
  zip: string;
  city: string;
  source: null | string;
  phone: string;
  latitude: null | string;
  longitude: null | string;
  primary_locale: string;
  address2: null | string;
  created_at: null | string;
  updated_at: null | string;
  country_code: string;
  country_name: string;
  currency: string;
  customer_email: string;
  timezone: string;
  iana_timezone: null | string;
  shop_owner: string;
  money_format: string;
  money_with_currency_format: string;
  weight_unit: string;
  province_code: string;
  taxes_included: null | string;
  auto_configure_tax_inclusivity: null | string;
  tax_shipping: null | string;
  county_taxes: null | string;
  plan_display_name: string;
  plan_name: string;
  has_discounts: boolean;
  has_gift_cards: boolean;
  myshopify_domain: null | string;
  google_apps_domain: null | string;
  google_apps_login_enabled: null | string;
  money_in_emails_format: string;
  money_with_currency_in_emails_format: string;
  eligible_for_payments: boolean;
  requires_extra_payments_agreement: boolean;
  password_enabled: null | string;
  has_storefront: boolean;
  finances: boolean;
  primary_location_id: number;
  checkout_api_supported: boolean;
  multi_location_enabled: boolean;
  setup_required: boolean;
  pre_launch_enabled: boolean;
  enabled_presentment_currencies: Array<string>;
  transactional_sms_disabled: boolean;
  marketing_sms_consent_enabled_at_checkout: boolean;
}
export interface FULFILLMENT_ORDERS_SCHEDULED_FULFILLMENT_ORDER_READY_fulfillment_order {
  id: string;
  status: string;
}
export interface FULFILLMENT_ORDERS_SCHEDULED_FULFILLMENT_ORDER_READY {
  fulfillment_order: FULFILLMENT_ORDERS_SCHEDULED_FULFILLMENT_ORDER_READY_fulfillment_order;
}
export interface COMPANY_LOCATIONS_UPDATE_company {
  name: string;
  note: string;
  external_id: string;
  main_contact_admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  customer_since: string;
  admin_graphql_api_id: string;
}
export interface COMPANY_LOCATIONS_UPDATE_billing_address {
  address1: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  recipient: string;
  address2: null | string;
  phone: string;
  zone_code: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  company_admin_graphql_api_id: string;
}
export interface COMPANY_LOCATIONS_UPDATE_shipping_address {
  address1: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  recipient: string;
  address2: null | string;
  phone: string;
  zone_code: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  company_admin_graphql_api_id: string;
}
export interface COMPANY_LOCATIONS_UPDATE_tax_registration {
  tax_id: string;
}
export interface COMPANY_LOCATIONS_UPDATE {
  name: string;
  external_id: string;
  phone: string;
  locale: string;
  created_at: string;
  updated_at: string;
  note: string;
  buyer_experience_configuration: null | string;
  admin_graphql_api_id: string;
  tax_exemptions: Array<string>;
  company: COMPANY_LOCATIONS_UPDATE_company;
  billing_address: COMPANY_LOCATIONS_UPDATE_billing_address;
  shipping_address: COMPANY_LOCATIONS_UPDATE_shipping_address;
  tax_registration: COMPANY_LOCATIONS_UPDATE_tax_registration;
}
export interface FULFILLMENT_ORDERS_CANCELLATION_REQUEST_ACCEPTED_fulfillment_order {
  id: string;
  status: string;
}
export interface FULFILLMENT_ORDERS_CANCELLATION_REQUEST_ACCEPTED {
  fulfillment_order: FULFILLMENT_ORDERS_CANCELLATION_REQUEST_ACCEPTED_fulfillment_order;
  message: string;
}
export interface CUSTOMERS_MARKETING_CONSENT_UPDATE_sms_marketing_consent {
  state: null | string;
  opt_in_level: null | string;
  consent_updated_at: null | string;
  consent_collected_from: string;
}
export interface CUSTOMERS_MARKETING_CONSENT_UPDATE {
  id: number;
  phone: null | string;
  sms_marketing_consent: CUSTOMERS_MARKETING_CONSENT_UPDATE_sms_marketing_consent;
}
export interface LOCATIONS_UPDATE {
  id: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  phone: string;
  created_at: string;
  updated_at: string;
  country_code: string;
  country_name: string;
  province_code: string;
  legacy: boolean;
  active: boolean;
  admin_graphql_api_id: string;
}
export interface COLLECTION_LISTINGS_REMOVE_collection_listing {
  collection_id: number;
}
export interface COLLECTION_LISTINGS_REMOVE {
  collection_listing: COLLECTION_LISTINGS_REMOVE_collection_listing;
}
export interface FULFILLMENT_ORDERS_CANCELLED_fulfillment_order {
  id: string;
  status: string;
}
export interface FULFILLMENT_ORDERS_CANCELLED_replacement_fulfillment_order {
  id: string;
  status: string;
}
export interface FULFILLMENT_ORDERS_CANCELLED {
  fulfillment_order: FULFILLMENT_ORDERS_CANCELLED_fulfillment_order;
  replacement_fulfillment_order: FULFILLMENT_ORDERS_CANCELLED_replacement_fulfillment_order;
}
export interface COLLECTIONS_CREATE {
  id: number;
  handle: string;
  title: string;
  updated_at: string;
  body_html: string;
  published_at: string;
  sort_order: null | string;
  template_suffix: null | string;
  published_scope: string;
  admin_graphql_api_id: string;
}
