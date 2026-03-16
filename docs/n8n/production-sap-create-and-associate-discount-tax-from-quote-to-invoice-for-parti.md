---
title: 'Production | SAP | Create and associate discount tax from Quote to invoice for partial billing'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623215
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/IySxCFJHxl40a384](https://n8n.tools.energy/workflow/IySxCFJHxl40a384)
**Workflow ID:** IySxCFJHxl40a384
**Workflow Name:** Production | SAP | Create and associate discount tax from Quote to invoice for partial billing
**Status:** Active

# Purpose

This workflow automates the process of extracting discount information from a signed quote and applying it correctly to a partial invoice. It calculates proportional discount values based on predefined legal entities (1710 and 1711) and the partial billing count, ultimately creating and associating a new discount record to the invoice in HubSpot CRM.

# Status and Runtime Controls

*   **Timeout:** Not explicitly set in the workflow settings.
*   **Retry behavior:** All HubSpot HTTP request nodes are configured to retry on failure with a 5000ms (5 seconds) wait time between tries.
*   **Error workflow:** Executions failing will trigger the designated error workflow (ID: Bu0X3AXE7asHOIpX).
*   **Execution settings:** Uses standard execution order (v1) and restricts caller policy to workflows from the same owner.

# Triggers & Entry Points

*   **Webhook:** Listens for POST requests at the path `add-quote-discount-tax-to-partial-invoice`. This is the primary entry point for external systems (like SAP) to trigger the process. It responds automatically using response nodes at various stages of the workflow.
*   **Manual Trigger:** Allows administrators and developers to execute the workflow manually for testing or ad-hoc processing.

# Systems & Integrations

*   **HubSpot CRM API:** Extensively used to fetch properties and associations for Invoices, Deals, Quotes, Object Schemas, and Discounts.
*   **External APIs:** N/A (Only HubSpot CRM API used as external service).
*   **Webhooks:** Used both to receive incoming execution payloads and to send synchronous JSON responses back to the caller.
*   **Internal Utilities:** Custom JavaScript execution blocks (Code nodes) are heavily utilized for advanced data manipulation, filtering, and financial value calculations.

# Data Inputs & Key Fields

*   **Primary input fields:**
    *   `invoiceID` (Trigger Payload)
    *   `invoicesProps` (Stringified JSON array containing legal entity billing items)
    *   `partialBillingCount` (Trigger Payload)
*   **Important properties used in the workflow:**
    *   Invoice: `legal_entity`
    *   Deal: `partial_billing_count`
    *   Quote: `hs_sign_status`, `hs_status`, `hs_title`
    *   Discount: `hs_label`, `hs_duration`, `hs_type`, `hs_value`, `hs_sort_order`

# Workflow Logic (Deep Analysis)

1. **Initial trigger:** The workflow initiates via a POST Webhook payload or a Manual trigger.
2. **Data retrieval (Invoice & Deal):** The workflow fetches the invoice properties (specifically `legal_entity`) and its associated deal using the provided `invoiceID`. It then fetches the deal properties to determine the `partial_billing_count` and associated quotes.
3. **Data retrieval (Quotes):** It extracts the Quote IDs associated with the deal, fetches the complete Quote Schema from HubSpot to map available fields, and performs a bulk search to get all properties of the identified quotes that are not in a 'DRAFT' or 'archived' status.
4. **Conditional logic:** An IF condition checks if any valid quotes were returned. If true, it proceeds; if false, it immediately responds to the webhook indicating failure.
5. **Branch execution & Sorting:** A code node evaluates the valid quotes to identify the most relevant "signed" quote, prioritizing quotes with "ESIGN\_COMPLETED" or "MANUALLY\_SIGNED" statuses based on their signature or last modification dates.
6. **Discount validation:** The workflow fetches the properties of the selected quote, specifically looking for associated discounts. A secondary IF condition checks if the quote actually contains discounts.
7. **Data calculation:** If discounts exist, their exact properties are searched. A custom code node calculates a financial holding ratio based on line items assigned to specific legal entities (1710 vs 1711). For fixed discounts, the value is mathematically adjusted according to the holding ratio and partial billing count.
8. **External system calls:** For each validated and calculated discount, an API call creates a new corresponding discount record in HubSpot and associates it directly with the original partial invoice.
9. **Final updates:** A final script refines the holding ratio on the discount objects, and a response node fires the finalized data back to the original caller.

# Branch Execution Details

**If1**

*   **Condition logic:** Checks if the total number of retrieved quotes is strictly greater than 0 (`$json.total > 0`).
*   **TRUE path:** Moves forward to identify the signed quote via a custom code node, retrieves its detailed properties, and checks for existing discounts.
*   **FALSE path:** Routes to the "Response empty" node, ending the workflow and returning a JSON payload: `{"status": false, "message": "No quote"}`.

**Check existing discounts**

*   **Condition logic:** Verifies that the `discounts` association object exists AND that the array length of `discounts.results` is strictly greater than 0.
*   **TRUE path:** Triggers a search for the properties of the associated discounts, processes calculations, creates new associated discounts via POST request, and responds with the successful discount data.
*   **FALSE path:** Routes to the "Response empty1" node, returning a JSON payload: `{"status": false, "message": "No discount quote"}`.

# External Operations

*   **Database usage:** Relies entirely on HubSpot CRM as the primary database source.
*   **API calls:**
    *   GET `/crm/v3/objects/invoices/{id}`
    *   GET `/crm/v3/objects/0-3/{id}`
    *   GET `/crm-object-schemas/v3/schemas/quotes`
    *   POST `/crm/v3/objects/quotes/search`
    *   GET `/crm/v3/objects/quotes/{id}`
    *   POST `/crm/v3/objects/discounts/search`
    *   POST `/crm/v3/objects/discounts`
*   **Object creation:** Creates new custom Discount objects inside HubSpot.
*   **Object updates:** Associates the newly created Discount objects to the target Invoice utilizing HubSpot's defined `associationTypeId`: 412.

# Subworkflows Used

*   **Workflow name:** Global Error Handler (Implied by ID)
*   **Workflow ID:** Bu0X3AXE7asHOIpX
*   **Purpose:** Set as the default error workflow in the settings to capture and manage unhandled node execution errors.
*   **Inputs:** Automatically inherits the failing execution context and error stack.

# Database Collections

No direct NoSQL/SQL database collections are queried or modified in this workflow. Data storage, retrieval, and schema definitions are handled dynamically via the HubSpot CRM API.

# Security Notes

*   **Credentials:** Securely utilizes predefined n8n credentials. It uses specific HubSpot App Tokens (`N8N Invoice Scope`, `N8N Deal Scope`, `N8N Quote scope`) and generic HTTP Header Auth (`Production | HubSpot | Header Auth to connect private app`).
*   **Sensitive operations:** Financial math, taxation ratios, and quote parsing logic are performed directly within uncompiled custom JavaScript blocks. These mathematical derivations must be carefully managed to avoid billing discrepancies.

# Known Limitations / Risks

*   **Hardcoded Entities:** The code nodes hardcode legal entity IDs ("1710" and "1711"). If the organization expands or changes legal entities, the workflow calculation logic will silently fail to account for them, leading to incorrect discount ratios.
*   **Data Parsing Risks:** The script attempts to parse `invoicesProps` from the Webhook body. If the upstream system (SAP) sends improperly escaped JSON or a structural anomaly, the `JSON.parse` function will throw a fatal error.
*   **Lack of Pagination:** The HubSpot search node for Quotes is limited to 200 items, which is generally safe for deals but could omit data in edge cases.

# Final Outputs

When successful, the workflow generates appropriately scaled discount records in HubSpot CRM, associates them to the target partial invoice, and replies to the original calling webhook with a JSON dataset containing the newly structured and calculated discount properties.