---
title: 'Imported deal | Create monthly invoices base on legal entity with invoice date is today'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623975
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/81cAoZZ9kBgDCiCD](https://n8n.tools.energy/workflow/81cAoZZ9kBgDCiCD)
**Workflow ID:** 81cAoZZ9kBgDCiCD
**Workflow Name:** Imported deal | Create monthly invoices base on legal entity with invoice date is today
**Status:** Active

# Purpose

This workflow automates the creation of monthly invoices for the legal entity 1711 based on imported deals from HubSpot. It orchestrates data syncing between HubSpot CRM and an external system (Delfin) to fetch monthly booking data, calculates relevant taxes and discounts, handles internal accounting and customer numbering via MongoDB, and ultimately generates a fully itemized Draft Invoice within HubSpot.

# Status and Runtime Controls

*   **Timeout:** 1800 seconds (30 minutes)
*   **Retry behavior:** Multiple HTTP Request nodes are configured to retry on failure with a 5000ms wait between tries.
*   **Error workflow:** Bu0X3AXE7asHOIpX
*   **Execution settings:** Caller policy restricted to workflows from the same owner. Execution order is set to v1.

# Triggers & Entry Points

*   **Webhook (create-monthly-invoice-with-invoice-date-today):** The primary trigger that receives a dealID payload from HubSpot. It pushes this payload into a Redis stream via a subworkflow and an HTTP request.
*   **Callback (callback-create-monthly-invoice-with-invoice-date-today):** The secondary entry point triggered asynchronously. It receives the dealID and initiates the core invoice generation logic.
*   **Get invoice data:** A disabled Webhook node retained for historical or testing purposes.

# Systems & Integrations

*   **HubSpot CRM API:** Used to retrieve deals, companies, contacts, line items, and product schemas. Also used to create invoices, taxes, line items, and discounts.
*   **HubSpot HubDB:** Used to retrieve internal order configurations and platform mappings.
*   **MongoDB (Energy):** Acts as a persistence layer to manage sequential accounting document numbers, customer numbers, and tax code lookups.
*   **Delfin API:** External system used to fetch order details and specific booking data for the previous month.
*   **External APIs / Subworkflows:** Integrates with Redis Stream workflows, global variable workflows, and server authorization workflows.

# Data Inputs & Key Fields

*   **Primary input fields:** `dealID` (from Webhook body).
*   **Key Properties Used:** `delfin_order_id`, `company_number`, `tax_rate`, `billing_cycle`, `sales_channel`, `deal_currency_code`, `accounting_document_number_1711`.

# Workflow Logic (Deep Analysis)

1. **Initial trigger:** The initial Webhook receives the `dealID`, generates a token, and sends the data to a Redis queue. A separate `Callback` webhook picks up the execution.
2. **Data retrieval:** The Callback triggers the `Global Variable` subworkflow, then fetches Deal properties from HubSpot (`HS - Get deal properties`).
3. **Conditional logic (Deal Check):** An `If` node verifies if the deal contains a `delfin_order_id`.
4. **Data validation & Aggregation:** If valid, the workflow fetches the associated Company, Line Items, Contact properties, and overall Product Schema from HubSpot.
5. **Number Generation (MongoDB):** It checks if the Company has a `company_number`. If not, it retrieves and increments a sequence from the `customer_number` MongoDB collection. Concurrently, it grabs and increments the `accounting_document_number_1711` from another MongoDB collection.
6. **Tax Processing:** It looks up the correct tax configuration from the `tax_code` MongoDB collection based on the deal's `tax_rate`. If applicable, it registers a one-time tax object in HubSpot.
7. **Invoice Creation:** A base invoice object is generated in HubSpot associated with the Company, Contact, Deal, and Tax objects.
8. **External system calls (Delfin):** A subworkflow authorizes against the Delfin API. The workflow queries Delfin for the specific order and fetches bookings strictly bounded by the first and last day of the previous month.
9. **Data Creation & Itemization:** Billable bookings are filtered and aggregated. Code nodes process durations, gross amounts, and matching internal order IDs (from HubDB) to generate Line Item definitions. These line items are created in HubSpot in batches and linked to the new Invoice.
10. **Final updates:** Based on the aggregated bookings, various discount types (Kombirabatt, Mengenrabatt, etc.) are calculated. These discounts are posted to HubSpot, and finally, the Invoice status is patched to "open" with a stage of "draft".

# Branch Execution Details

*   **If (Check delfin\_order\_id):**
    *   **Condition:** `delfin_order_id` is not empty.
    *   **TRUE path:** Proceeds to fetch the Invoice recipient company ID and continues the main pipeline.
    *   **FALSE path:** Routes to a JavaScript code node returning an empty array, ending execution gracefully.
*   **If1 (Check company\_number):**
    *   **Condition:** Company property `company_number` is not empty.
    *   **TRUE path:** Bypasses DB increment and routes directly to Get Tax Code.
    *   **FALSE path:** Queries MongoDB to get and increment the `customer_number`, then patches the HubSpot Company record.
*   **Check contact:**
    *   **Condition:** Deal has associated contacts.
    *   **TRUE path:** Retrieves the primary contact ID via HubSpot API.
    *   **FALSE path:** Skips contact retrieval and moves to Product Schema fetching.
*   **If6 (Check tax\_rate):**
    *   **Condition:** `tax_rate` is greater than 0.
    *   **TRUE path:** Makes an API call to HubSpot to create a one-time tax based on the deal's rate.
    *   **FALSE path:** Bypasses tax creation and proceeds directly to creating the invoice data payload.
*   **If bookings exist:**
    *   **Condition:** Delfin bookings payload is not empty.
    *   **TRUE path:** Passes data to `Filter Billable` to process valid line items.
    *   **FALSE path:** Routes to a generic Code node returning an empty array.
*   **Check discount is not empty:**
    *   **Condition:** The compiled array of discount objects is not empty.
    *   **TRUE path:** Sends HTTP POST requests to HubSpot to register each discount against the invoice.
    *   **FALSE path:** Skips discount creation and jumps straight to updating the Invoice status.

# External Operations

*   **Database usage:** Utilizes MongoDB to track global sequential counters (Customer Numbers, Accounting Documents) using `findOneAndReplace` and `findOneAndUpdate` operations to ensure consistency.
*   **API calls:** Extensive use of the `api.hubapi.com` CRM endpoints for Deals, Companies, Contacts, Line Items, Invoices, Taxes, Discounts, and HubDB Rows.
*   **Object creation:** Batch creation of Line Items; individual creation of Invoices, Taxes, and Discounts.
*   **Object updates:** Patches Company records with generated customer numbers and updates finalized Invoices to Open/Draft status.

# Subworkflows Used

*   **Name:** Global variables
    *   **Workflow ID:** YTKoYUXPDy5OGV16
    *   **Purpose:** Fetches global environment constants for the platform.
*   **Name:** SAP | 3.0 | Create invoices line item base on deal payment type
    *   **Workflow ID:** 7WuHiChP2XeoGoY3
    *   **Purpose:** Specialized handling for generating specific line items based on HubSpot logic.
*   **Name:** Subworkflow | Redis Stream Producer Workflow
    *   **Workflow ID:** 1tiTZLzrMssZ4trX
    *   **Purpose:** Pushes initial Webhook payload to a Redis queue for asynchronous processing.
*   **Name:** Delfin | Server Authorize
    *   **Workflow ID:** BIgOTMaifk7QSG1B
    *   **Purpose:** Handles authentication and returns the required headers/tokens to query the Delfin external booking API.

# Database Collections

*   **customer\_number:** Stores the running integer used to assign unique identification numbers to new companies in HubSpot.
*   **accounting\_document\_number\_1711:** Stores the sequential identifier required for legal and compliance tracking of invoices generated under legal entity 1711.
*   **tax\_code:** A lookup dictionary mapping percentage-based tax rates to specific internal VAT codes.

# Security Notes

*   **Hardcoded tokens:** The node `Code in JavaScript1` contains a hardcoded Bearer token (`dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`) used for internal Redis stream authorization.
*   **Credentials:** Uses standard n8n credential objects (`MongoDB Energy`, `Production | HubSpot | Header Auth`) which securely inject secrets at runtime.
*   **Sensitive operations:** Batch data injection and direct financial document creation (Invoices, Taxes). Access controls should strictly monitor the `Callback` webhook URL.

# Known Limitations / Risks

*   **Missing error handling on DB increments:** MongoDB nodes use standard update operators. Without explicit atomic `$inc` operators in high-concurrency environments, race conditions could cause duplicate accounting or customer numbers.
*   **Hardcoded Test Logic:** The code node `Get last month start & end date` contains commented-out test code (`//const year = 2025;`). If uncommented accidentally, it will lock the workflow to fetching historical data regardless of current execution time.
*   **Strict Parsing Dependency:** Discount and Booking logic relies heavily on string mapping (e.g., `sales_channel == "SRW"`, `product_group: "radio_spots"`). Changes to HubDB schema names or Delfin string outputs will break invoice itemization.

# Final Outputs

When successful, this workflow produces a new Draft Invoice in HubSpot linked to the original Deal and Company. This invoice includes exact line items calculated from the previous month's Delfin bookings, applied percentage discounts mapped accurately, and a newly incremented Accounting Document number assigned for Legal Entity 1711.