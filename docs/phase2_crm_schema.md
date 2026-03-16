# Phase 2 CRM Schema and Line Item Mapping

## Deal Properties (Phase 2)

- `dealname`, `pipeline`, `dealstage`
- `billing_cycle`, `tax_rate`, `deal_currency_code`
- `product_group`, `revenue_stream`, `line_item_true`

## Line Item Properties (Phase 2)

- `name`, `quantity`, `price`, `amount`, `description`
- `product_group`, `spot_duration`, `spot_count`
- `plattform`, `time_category`, `week_type`, `laufzeit`, `kw`
- `jv_amount_of_digital_ads_per_second`, `hs_total_discount`, `original_line_item_id`

## Status Mapping (Internal Labels)

- `sales_in_progress` → active sales pipeline stages
- `quote_ready` → quote prepared and set to “Approval Not Needed”
- `sales_closed_won` → Closed Won stage
- `order_clarification` → Order Clarification in Order pipeline
- `order_confirmed` → Order Confirmed in Order pipeline

## Line Item Transformation Rules (from n8n Line Item Sync)

- **Radio Spots**: quantity = `spot_count * spot_duration`; price from Mongo rate card; description enriched with platform/time/week; `product_group = radio_spots`.
- **Audio Production**: price from production-type catalog; description reflects production configuration.
- **Digital Spots**: price and description depend on targeting count; more than three targetings is an explicit edge case; `product_group = digital_spots`.
- **Radio Sponsoring / JV**: quantity and price based on mentions, duration, and Laufzeit; JV uses HubDB tier discounts and stamps `hs_discount_percentage`.

