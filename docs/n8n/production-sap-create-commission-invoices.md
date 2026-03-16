---
title: 'Production | SAP | Create commission invoices'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623155
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/VLxesJb2S8TwS9n0](https://n8n.tools.energy/workflow/VLxesJb2S8TwS9n0)
Workflow ID: VLxesJb2S8TwS9n0
Workflow Name: Production | SAP | Create commission invoices
Status: Active

# Purpose

The primary business goal of this workflow is to automate the generation of commission invoices (credit notes) within HubSpot, likely for syncing with an SAP ERP system. It triggers via webhook, retrieves related deal, company, and contact data, manages sequential customer and accounting document numbers using a MongoDB database, calculates complex proportional discounts and commission amounts for line items, and generates a finalized "open" invoice in HubSpot with all corresponding associations.

# Status and Runtime Controls

*   Timeout: Not explicitly defined in the settings.
*   Retry behavior: Critical HubSpot API nodes (httpRequest) are configured with `retryOnFail: true` and a `waitBetweenTries: 5000` (5 seconds) to handle transient API limits or network issues.
*   Error workflow: Executions failing will trigger a designated error workflow (ID: Bu0X3AXE7asHOIpX).
*   Execution settings: Execution order is set to "v1", with time saved mode set to "fixed". Caller policy restricts access to workflows from the same owner.

# Triggers & Entry Points

This workflow features two separate entry points via Webhook nodes:

1. Webhook (callback-create-commission-invoice): The primary trigger. It listens for a POST request containing an `invoiceID` in the body payload.
2. Webhook queue (create-commission-invoice-queue): An alternative entry point that captures an `invoiceID` and formats it to be pushed into a Redis stream via a subworkflow.

# Systems & Integrations

*   HubSpot CRM API: Deeply integrated to read/write Invoices, Deals, Contacts, Companies, Line Items, Discounts, and Taxes.
*   MongoDB: Used as a sequence generator and lookup table (MongoDB Energy credentials).
*   Custom Webhooks: Acting as entry points.
*   External APIs: HTTP Request node configured to communicate with an internal Redis stream service (currently disabled).
*   Subworkflows: Used to retrieve global variables and to push messages to a Redis queue.

# Data Inputs & Key Fields

Primary input fields:

*   `invoiceID` (from webhook body)

Important properties used:

*   Deal properties: `commission_type`, `commision_rate_percentage`, `deal_currency_code`, `tax_rate`
*   Company properties: `iban`, `company_number`, `legal_entity`
*   Invoice properties: `commission_rate_`, `accounting_document_number`, `associations` (discounts, line items)
*   Calculated fields: `netTotal`, `commissionAmount`

# Workflow Logic (Deep Analysis)

1. Initial trigger: The webhook receives an `invoiceID`.
2. Data retrieval: The workflow fetches Global Variables via a subworkflow, then retrieves the trigger Invoice from HubSpot. Using associations, it sequentially fetches the Deal, the associated Contact (advisor), and the associated Company (agency).
3. Data validation & generation: It checks if the Company has a `company_number`. If empty, it generates a new sequential number via MongoDB and updates the Company in HubSpot. Next, it determines the legal entity and fetches the next available `accounting_document_number` from MongoDB, updating the sequence.
4. Conditional logic for Discounts: It checks the invoice properties to see if discounts are associated. If they exist, it fetches the discount details from HubSpot.
5. External system lookup: It queries a MongoDB `tax_code` collection to match the deal's tax rate with the internal/SAP tax code system.
6. Conditional logic for Taxes: If the calculated tax rate is greater than 0, it creates a one-time tax rate object in HubSpot.
7. Data creation: It constructs a massive payload and creates the parent Commission Invoice (Credit Note) in HubSpot in a "draft" stage, attaching the Deal, Company, Contact, and newly created Tax associations.
8. Line Item Processing: It retrieves all original line items associated with the trigger invoice. It splits these items into batches (Loop Over Items). For each item, custom JavaScript calculates proportional fixed and percentage discounts, calculates the net subtotal, applies the commission rate, and formats the currency properly.
9. External system calls: It creates the new calculated line items in HubSpot for the commission invoice.
10. Final updates: Once all line items are processed and aggregated, a final PATCH request updates the new Commission Invoice status to "open".

# Branch Execution Details

If3 (Check Company Number):

*   Condition: Checks if the Company's `company_number` property is empty.
*   TRUE path: Queries MongoDB `customer_number`, increments it via code, replaces the value in MongoDB, and patches the HubSpot Company record. Moves to Accounting Document generation.
*   FALSE path: Bypasses the generation steps and moves directly to Accounting Document generation.

If (Check for Discounts):

*   Condition: Checks if the initial invoice payload contains associated discount IDs.
*   TRUE path: Triggers a Wait node, then fetches all related discount properties from HubSpot via a search API. Then evaluates If2.
*   FALSE path: Bypasses discount retrieval and proceeds to the tax code lookup.

If2 (Verify Total):

*   Condition: Checks if the total items returned from the discount search is greater than 0.
*   TRUE / FALSE path: Both currently route directly to the tax code lookup.

If1 (Tax Rate Check):

*   Condition: Checks if the tax rate fetched from the Deal/MongoDB is greater than 0.
*   TRUE path: Makes a POST request to HubSpot to create a new tax record. Passes data to invoice creation.
*   FALSE path: Bypasses tax creation and passes data to invoice creation.

# External Operations

Database usage (MongoDB):

*   Reads and updates the `customer_number` collection to maintain a single source of truth for customer IDs.
*   Reads and updates dynamically named collections based on entity (e.g., `accounting_document_number_1710`) to generate incrementing document codes.
*   Queries the `tax_code` collection to map CRM tax percentages to internal tax codes.

API calls (HubSpot):

*   GET / Search requests to retrieve Invoices, Deals, Contacts, Companies, Line Items, and Discounts.
*   POST requests to create new Invoices, Taxes, and Line Items.
*   PATCH requests to update Company properties and Final Invoice Status.

# Subworkflows Used

1. Global variables

*   ID: YTKoYUXPDy5OGV16
*   Purpose: Retrieves standardized environment or global configurations (e.g., test modes).
*   Inputs: None required.

1. Subworkflow | Redis Stream Producer Workflow

*   ID: 1tiTZLzrMssZ4trX
*   Purpose: Accepts webhook payloads and pushes them into an external Redis stream.
*   Inputs: Type ("new\_invoice"), data (Invoice ID), and a callbackWebhook URL.

# Database Collections

*   `customer_number`: Maintains the latest integer used for agency/company IDs to ensure unique customer creation across systems.
*   `accounting_document_number_{legal_entity}`: Maintains a running sequence of invoice/credit note numbers specific to different legal entities (e.g., Switzerland vs Germany).
*   `tax_code`: A reference table aligning standard vat rates to internal financial codes required for SAP billing.

# Security Notes

*   Hardcoded tokens detected: The node `Code in JavaScript1` contains a hardcoded Bearer token (`Bearer dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`). This is a security risk and should be migrated to n8n's credential management system.
*   Standard HTTP Header Authentication and HubSpot App Tokens are used appropriately for the rest of the external calls.

# Known Limitations / Risks

*   Hardcoded Credentials: The Bearer token in the JavaScript node represents a security risk if the workflow is exported or shared.
*   Disabled Nodes: The node `Send data to queue` is currently disabled, which might indicate incomplete feature development or temporary debugging.
*   Complex Mathematical Logic: The Code node `Create properties for commission line item 1710` parses floats heavily. If HubSpot returns non-standard strings or nulls for prices, this node may fail with NaN (Not a Number) errors.
*   Unhandled Logic Branches: The `If2` node executes the exact same next node regardless of whether the condition is true or false, making the node somewhat redundant in its current state.

# Final Outputs

Upon successful execution, the workflow generates a fully populated "Credit Note" (Commission Invoice) inside HubSpot. This invoice is assigned a generated accounting document number, linked to the appropriate Deal, Contact, and Company, populated with mathematically adjusted line items representing exact commission cuts (accounting for proportional discounts), and is ultimately transitioned to an "open" status.