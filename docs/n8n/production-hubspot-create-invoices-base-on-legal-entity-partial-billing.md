---
title: 'Production | HubSpot | Create invoices base on legal entity | Partial Billing'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623635
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/ukqSOmwCVOQpldY9](https://n8n.tools.energy/workflow/ukqSOmwCVOQpldY9)
**Workflow ID:** ukqSOmwCVOQpldY9
**Workflow Name:** Production | HubSpot | Create invoices base on legal entity | Partial Billing
**Status:** Active

# Purpose

The primary business goal of this workflow is to automate the creation of partial billing invoices in HubSpot, segregating them based on the legal entity (1710 or 1711). It ensures that accurate customer numbers, tax codes, and accounting document numbers are applied. Furthermore, it precisely calculates partial billing amounts, verifies rounding discrepancies against original quotes, and patches line items or invoices to ensure financial accuracy.

# Status and Runtime Controls

*   **Timeout:** 300 seconds (5 minutes).
*   **Retry behavior:** Enabled on external HTTP requests (retries on failure with a 5000ms wait between tries).
*   **Error workflow:** Executed upon failure (ID: Bu0X3AXE7asHOIpX).
*   **Execution settings:** Order is set to v1, caller policy restricted to workflows from the same owner, and time saved mode is fixed.

# Triggers & Entry Points

*   **Get invoice data (Webhook):** A `POST` endpoint (`generate-invoice-partial`) using Header Auth. It receives the initial payload containing the Deal ID and passes it to the Redis queue.
*   **Callback get deal data (Webhook):** A `POST` endpoint (`callback-generate-invoice-partial`) serving as a callback to resume execution once the deal data is processed by the queue.

# Systems & Integrations

*   **HubSpot CRM API:** Used extensively for Deals, Companies, Contacts, Line Items, Taxes, Invoices, Quotes, and Object Schemas.
*   **MongoDB:** Connects to 'MongoDB Energy' to manage sequence numbers and tax configurations.
*   **External APIs / Webhooks:** Internal utility endpoints for copying discount taxes to partial invoices.
*   **Subworkflows:** Triggers utility and global variable subworkflows.

# Data Inputs & Key Fields

*   **Primary input fields:** `dealID`.
*   **Important properties used:** `legal_entity`, `partial_billing_count`, `tax_rate`, `billing_cycle`, `company_number`, `accounting_document_number`, `discount`, `hs_quote_amount`, and `hs_sign_status`.

# Workflow Logic (Deep Analysis)

1. **Initial trigger:** The workflow begins when `generate-invoice-partial` is hit. It immediately pushes the request into a Redis Stream Producer subworkflow. The logic then resumes via the `callback-generate-invoice-partial` webhook.
2. **Data retrieval:** The system calls HubSpot to fetch Deal properties, associated Line Items, Company properties, Contact properties, and pulls environmental values from the Global Variables subworkflow.
3. **Data validation:** The workflow verifies if the associated Company already has a `company_number`. If absent, it fetches the next sequential customer number from MongoDB.
4. **Conditional logic:** Line items are parsed and explicitly split into two groups based on the `legal_entity` property (1710 and 1711). It also checks if the deal's tax rate is greater than 0.
5. **Branch execution:** The workflow processes the 1710 and 1711 data in parallel. It calculates partial billing indexes, splits them into batches, and resolves sequential accounting document numbers from MongoDB.
6. **External system calls:** It creates one-time tax objects in HubSpot if applicable, creates the base Invoice records, and queries product and invoice schemas.
7. **Data creation or update:** Generates line items for the newly created invoices using a specialized subworkflow. It then applies a secondary check for fixed discounts and corrects any rounding issues natively through JavaScript calculations.
8. **Merge operations:** Data from both the 1710 and 1711 branches are merged. The workflow aggregates the created Invoice IDs and fetches their complete property sets from HubSpot.
9. **Final updates:** The total generated invoice amount is compared against the signed Quote amount. If a rounding difference exists, the invoice status is updated to `invoice_error` with a descriptive comment. Otherwise, invoices are safely updated to a `draft` or `open` stage.

# Branch Execution Details

*   **If1 (Company Number Check):**
    *   _Condition logic:_ Checks if `company_number` from the HubSpot company record is not empty.
    *   _TRUE path:_ Directly proceeds to fetch the tax code.
    *   _FALSE path:_ Queries MongoDB for the next customer number, increases it, and patches the HubSpot Company record.
*   **Check 1710 data / Check 1711 data:**
    *   _Condition logic:_ Verifies that the filtered payload for the specific legal entity is not empty.
    *   _TRUE path:_ Begins the batch splitting and partial invoice item generation for that entity.
    *   _FALSE path:_ Branch terminates silently.
*   **If5 / If6 (Tax Rate Check):**
    *   _Condition logic:_ Checks if the mapped tax rate > 0.
    *   _TRUE path:_ Creates a one-time tax object via the HubSpot API and attaches it to the invoice associations.
    *   _FALSE path:_ Bypasses tax creation and proceeds to create the invoice payload directly.
*   **If / If3 (Discount Validation):**
    *   _Condition logic:_ Checks if discount fixing is valid and if the `partial_billing_count` > 1.
    *   _TRUE path:_ Searches for existing discounts on the generated invoices to adjust them.
    *   _FALSE path:_ Skips discount correction.
*   **If2 / If4 (Rounding Issue - Discounts):**
    *   _Condition logic:_ Validates if the JavaScript node detected a mathematical rounding error across the partial discounts.
    *   _TRUE path:_ Executes a Batch Update to HubSpot to correct the discount values.
    *   _FALSE path:_ Proceeds without updates.
*   **If7 / If8 (Rounding Issue - Line Items):**
    *   _Condition logic:_ Verifies if the line item cent-level calculation resulted in a discrepancy.
    *   _TRUE path:_ Executes a Batch Update to HubSpot to align the line item prices.
    *   _FALSE path:_ Sets the invoice status to open/draft.
*   **If10 / If11 (Quote vs. Invoice Reconciliation):**
    *   _Condition logic:_ Evaluates if there is a discrepancy between the newly generated invoices' total amount and the signed quote total.
    *   _TRUE path:_ Patches the specific invoice with an `invoice_error` stage and comments the exact CHF difference.
    *   _FALSE path:_ Finishes the process without error flagging.

# External Operations

*   **Database usage:**
    *   MongoDB `findOneAndReplace` to atomically retrieve and increment `customer_number`.
    *   MongoDB `findOneAndUpdate` to increment `accounting_document_number_1710` and `1711`.
    *   MongoDB read for mapping the `tax_code`.
*   **API calls:**
    *   Extensive `GET`, `POST`, and `PATCH` requests to HubSpot endpoints (`/crm/v3/objects/...`) spanning Companies, Deals, Contacts, Taxes, Invoices, Line items, and Quotes.
*   **Object creation:** Generates custom tax definitions, base invoice shells, and partial line items.
*   **Object updates:** Fixes cent-level rounding issues on line items and discounts in bulk via HubSpot Batch API.

# Subworkflows Used

*   **Name:** Global variables
    *   **ID:** YTKoYUXPDy5OGV16
    *   **Purpose:** Retrieves portal and project-level IDs needed for associations.
    *   **Inputs:** None.
*   **Name:** Subworkflow | Redis Stream Producer Workflow
    *   **ID:** 1tiTZLzrMssZ4trX
    *   **Purpose:** Queues the incoming invoice request safely to prevent race conditions.
    *   **Inputs:** `type` (new\_invoice), `callbackWebhook`, `data` (dealID).
*   **Name:** SAP | 3.0 | Create invoices line item base on deal payment type
    *   **ID:** 7WuHiChP2XeoGoY3
    *   **Purpose:** Translates parsed deal line items into actual invoice line items mapped to payment terms.
    *   **Inputs:** `paymentType`, `deal_line_items` (divided by partial index), `invoiceID`, `legal_entity`, `projectID`.

# Database Collections

*   **customer\_number:** Stores and tracks the highest used customer number globally to ensure sequential assignment.
*   **tax\_code:** A reference collection mapping percentage numbers to specific tax labels/codes (e.g., standard vs reduced rates).
*   **accounting\_document\_number\_1710 / 1711:** Independent counters ensuring invoice numbers for different legal entities remain perfectly sequential and gapless.

# Security Notes

*   **Hardcoded tokens:** Node `Code in JavaScript1` contains a hardcoded Bearer token (`dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`). This poses a critical security risk and should be migrated to proper n8n credentials.
*   **Credentials:** Uses highly privileged predefined credential types (`hubspotAppToken`) scoped specifically for Companies, Deals, Contacts, Invoices, Line Items, and Quotes.
*   **Sensitive operations:** Creation and modification of financial data (invoices, taxes) are executed autonomously. Proper auditing on the target system is recommended.

# Known Limitations / Risks

*   **Hardcoded Secrets:** The hardcoded JS bearer token could expire or be compromised.
*   **Concurrency constraints:** Despite using the Redis queue subworkflow, heavy parallel modification of identical deals might result in object lock issues in HubSpot if webhooks stack up.
*   **Name-matching fragility:** The JS logic handling rounding issues relies on regex string manipulation of line item names (e.g., removing trailing "s"). This could break if product naming conventions change abruptly.

# Final Outputs

Upon successful execution, the workflow generates distinct Draft or Open invoices in HubSpot for the associated Deal, correctly split by Legal Entity (1710/1711). Each invoice contains correctly scaled partial line items, accurately calculated one-time taxes, sequentially updated customer and accounting numbers, and is securely reconciled against the original signed quote to prevent cent-level financial leakage.