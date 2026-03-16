---
title: 'Production | SAP | Create and associate discount tax from Quote to invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623135
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/LD5VgPdttenMTPep](https://n8n.tools.energy/workflow/LD5VgPdttenMTPep)
Workflow ID: LD5VgPdttenMTPep
Workflow Name: Production | SAP | Create and associate discount tax from Quote to invoice
Status: Active

# Purpose

This workflow automates the process of transferring and calculating discount records from a HubSpot Quote to a HubSpot Invoice. It acts as an integration point between SAP-generated invoice data (sent via webhook) and HubSpot CRM, ensuring that applicable fixed or percentage-based discounts from a signed quote are accurately prorated and applied to the final invoice based on the specific legal entity's financial proportion (e.g., legal entities 1710 vs 1711).

# Status and Runtime Controls

*   Timeout: Not explicitly defined in the workflow settings.
*   Retry behavior: All external API requests to HubSpot are configured with automated retries on failure (`retryOnFail: true`, with a 5000ms wait between tries).
*   Error workflow: Execution errors are routed to a dedicated error management workflow (ID: Bu0X3AXE7asHOIpX).
*   Execution settings: Operates on execution order v1, utilizes fixed time-saved mode, and enforces a same-owner caller policy.

# Triggers & Entry Points

*   Webhook: A POST request to the `add-quote-discount-tax-to-invoice` endpoint, operating in a `responseNode` mode. It receives the primary payload including the invoice ID and detailed itemized invoice properties.
*   Manual Trigger: A "When clicking Execute workflow" node available for testing and ad-hoc executions by administrators.

# Systems & Integrations

*   HubSpot CRM API: Extensive use of CRM v3 endpoints for Invoices, Deals, Quotes, and Discounts.
*   Webhooks: n8n incoming webhooks and multiple outgoing webhook response nodes to acknowledge completion or failure.
*   Internal utilities: n8n Code nodes for advanced JavaScript data manipulation, math calculations, and IF nodes for conditional routing.

# Data Inputs & Key Fields

Primary input fields:

*   `invoiceID` (from webhook body)
*   `invoicesProps` (array of items with their respective amounts from the webhook body)

Important properties used in the workflow:

*   Invoice: `legal_entity` (e.g., 1710 or 1711), `amount`
*   Quote: `hs_sign_status`, `hs_status`, `hs_title`, `hs_esign_date`, `hs_lastmodifieddate`
*   Discount: `hs_label`, `hs_duration`, `hs_type`, `hs_value`, `hs_sort_order`

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow initiates when a webhook payload is received containing an invoice ID and property details.
2. Data retrieval: It fetches the HubSpot Invoice properties to determine its associated deals and the legal entity. Following this, it fetches the Deal properties to find any associated quotes.
3. Conditional logic: An IF node checks if there are quotes associated with the deal. If missing, it immediately terminates and responds with an empty message.
4. Data validation: Extracts the Quote IDs and dynamically fetches the Quote schema properties. It then searches for these specific quotes via API, strictly filtering out any quotes with a "DRAFT" status or that are archived.
5. Branch execution: Another IF condition verifies that valid quotes were found. If true, a Code node executes complex sorting logic to identify the most relevant "Signed" quote (prioritizing completed/manually signed quotes over pending or published ones based on date).
6. External system calls: Retrieves the complete properties of the identified signed quote, specifically looking for associated discounts.
7. Data creation or update: An IF node checks if existing discounts are present on the quote. If found, it fetches the deep properties of these discounts through a search API call.
8. Merge operations: A specialized Code node calculates a holding ratio. It evaluates the invoice items associated with legal entities 1710 and 1711, sums their respective values, and determines the proportionate ratio for the current invoice's legal entity. It then iterates over the quote's discounts, updates their sort order, and mathematically prorates the `hs_value` for any 'FIXED' type discounts using the calculated ratio.
9. Final updates: The workflow issues a POST request to HubSpot to create the newly calculated discount records and immediately associates them with the original invoice. Finally, it sends a successful webhook response.

# Branch Execution Details

If (Check Deal Quotes):

*   Condition logic: Checks if the deal has the `associations.quotes.results` array.
*   TRUE path: Passes the data to extract quote IDs.
*   FALSE path: Terminates and triggers "Response empty2" returning `{ "status": true, "message": "No quote" }`.

If1 (Check Valid Quotes Exist):

*   Condition logic: Checks if the total quotes returned from the search is greater than 0.
*   TRUE path: Proceeds to filter and select the specific signed quote.
*   FALSE path: Terminates and triggers "Response empty" returning `{ "status": true, "message": "No quote" }`.

Check existing discounts:

*   Condition logic: Verifies that the quote has discount associations and the results array length is greater than 0.
*   TRUE path: Continues to fetch the detailed discount properties.
*   FALSE path: Terminates and triggers "Response empty1" returning `{ "status": true, "message": "No discount quote" }`.

# External Operations

*   API calls: Executes multiple GET and POST requests to `api.hubapi.com/crm/v3/` for fetching Invoices, Deals, Quotes, and running Search queries for both Quotes and Discounts.
*   Object creation: Posts to `/crm/v3/objects/discounts` to create brand new discount objects.
*   Object updates: Associates the newly created discounts to the target Invoice using HubSpot Association Category `HUBSPOT_DEFINED` and Association Type ID `412`.

# Subworkflows Used

*   Workflow Name: Error Handler
*   Workflow ID: Bu0X3AXE7asHOIpX
*   Purpose: To catch and manage any unexpected execution errors during runtime.
*   Inputs: System error data automatically passed by n8n upon workflow failure.

# Database Collections

No external database collections (like MongoDB) are utilized. The workflow relies entirely on HubSpot's internal CRM objects (Invoices, Deals, Quotes, Discounts) as its source of truth and data storage.

# Security Notes

*   Hardcoded tokens: None detected.
*   Credentials: The workflow correctly utilizes predefined n8n credential types (`hubspotAppToken` and `httpHeaderAuth`) scoped appropriately (e.g., "N8N Invoice Scope", "N8N Quote scope"). This ensures sensitive API tokens are kept out of the workflow logic.
*   Sensitive operations: Modifying financial discount records requires precise handling. The dynamic ratio calculation prevents over-discounting across split invoices.

# Known Limitations / Risks

*   Unprocessed branches: If the incoming `invoicesProps` payload in the webhook is poorly formatted or missing expected item amounts, the code node `Return all discounts` may result in a mathematical error (e.g., NaN or division by zero) when calculating the holding ratio.
*   Missing error handling: While an error workflow is defined globally, specific HTTP nodes lack targeted fallback routes within the logic if the API rate limit is hit after all 5000ms retries fail.
*   Incomplete logic: Pagination is not dynamically handled for HubSpot search results. If a quote has an unusually high number of discounts, it might exceed standard API return limits.

# Final Outputs

When completely successful, the workflow generates new Discount objects in HubSpot appropriately prorated for the target legal entity, associates them with the specified Invoice, and returns an HTTP 200 JSON response to the webhook sender acknowledging the transmission of the discount data.