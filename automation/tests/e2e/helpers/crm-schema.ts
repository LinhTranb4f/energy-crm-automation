/**
 * Phase 1 CRM schema and constants.
 * Copied from the previous deal-invoice-qa/helpers/crm-schema.ts location.
 */

export const COMPANY_MANDATORY_FIELDS = [
  "name",
  "address",
  "city",
  "zip",
  "country",
  "original_country",
  "industry",
  "status",
  "company_number",
  "company_code",
  "customer_account_group",
  "phone",
  "website",
  "e_mail",
] as const;

export const COMPANY_PROPERTIES = [...COMPANY_MANDATORY_FIELDS] as const;

export type CompanyPropertyName = (typeof COMPANY_PROPERTIES)[number];

export const COMPANY_REQUIRED_FOR_CREATE: readonly string[] = [
  ...COMPANY_MANDATORY_FIELDS,
];

export const COMPANY_INDUSTRY_EXAMPLE = "MARKETING_AND_ADVERTISING";

export const COUNTRY_TO_CODE: Record<string, string> = {
  Switzerland: "CH",
  Germany: "DE",
};

export const CONTACT_PROPERTIES = [
  "firstname",
  "lastname",
  "email",
  "hs_lifecyclestage",
  "hs_language",
  "jobtitle",
] as const;

export type ContactPropertyName = (typeof CONTACT_PROPERTIES)[number];

export const CONTACT_REQUIRED_FOR_CREATE: readonly string[] = [
  "firstname",
  "lastname",
  "email",
];

export const ORDER_PIPELINE_ID = "3387257046";

export const DEAL_PROPERTY_TEST_GATE = "test_record_b4you";

export const PHASE2_DEAL_PROPERTIES: readonly string[] = [
  "dealname",
  "pipeline",
  "dealstage",
  "billing_cycle",
  "tax_rate",
  "deal_currency_code",
  "product_group",
  "revenue_stream",
  "line_item_true",
] as const;

export const PHASE2_LINE_ITEM_PROPERTIES: readonly string[] = [
  "name",
  "quantity",
  "price",
  "amount",
  "description",
  "product_group",
  "spot_duration",
  "spot_count",
  "plattform",
  "time_category",
  "week_type",
  "laufzeit",
  "kw",
  "jv_amount_of_digital_ads_per_second",
  "hs_total_discount",
  "original_line_item_id",
] as const;

export const PHASE2_DEAL_STATUS_LABELS = {
  salesInProgress: "sales_in_progress",
  quoteReady: "quote_ready",
  salesClosedWon: "sales_closed_won",
  orderClarification: "order_clarification",
  orderConfirmed: "order_confirmed",
} as const;

export const ASSOCIATION_CONTACT_TO_COMPANY_TYPE_ID = 1;

export interface Phase1CompanySnapshot {
  status: string;
  name: string;
  country: string;
}

export interface Phase1ContactSnapshot {
  lifecycle_stage: string | null;
  email: string;
}

export interface Phase1GoldenRecord {
  companyId: string;
  contactId: string;
  company: Phase1CompanySnapshot;
  contact: Phase1ContactSnapshot;
}

