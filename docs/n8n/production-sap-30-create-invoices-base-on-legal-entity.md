---
title: 'Production | SAP | 3.0 | Create invoices base on legal entity'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623655
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/JjMktteHQWHk9RBI](https://n8n.tools.energy/workflow/JjMktteHQWHk9RBI)
Workflow ID: JjMktteHQWHk9RBI
Workflow Name: Production | SAP | 3.0 | Create invoices base on legal entity
Status: Active

# Purpose

The primary business goal of this workflow is to automate the creation of invoices in HubSpot CRM based on signed quotes, deal properties, and specific legal entities (1710 and 1711). It ensures that associated companies are assigned a sequential customer number, generates legal-entity-specific accounting document numbers, calculates taxes, copies line items and discounts, and runs reconciliation checks to flag any rounding discrepancies between the signed quote and the generated invoices.

# Status and Runtime Controls

*   Timeout: 120 seconds
*   Retry behavior: HTTP Request nodes are configured to retry on failure with a 5000ms wait time between tries.
*   Error workflow: Tied to a specific error handling workflow (ID: Bu0X3AXE7asHOIpX).
*   Execution settings: Execution order is set to v1, and time-saved mode is fixed. Caller policy restricts execution to workflows from the same owner.

# Triggers & Entry Points

1. Get invoice data (Webhook): Listens for POST requests at the `get-deal-id` endpoint with header authentication. This is the initial entry point that receives the `dealID` from HubSpot.
2. Callback get deal data (Webhook): Listens for POST requests at the `callback-to-get-deal-id` endpoint. This acts as the continuation trigger after the initial deal payload is queued and processed through the Redis Stream subworkflow.

# Systems & Integrations

*   HubSpot CRM API: Used extensively for reading/updating Deals, Companies, Contacts, Quotes, Line Items, Taxes, and Invoices.
*   MongoDB (MongoDB Energy): Acts as the internal state manager for tracking sequential numbers (customer numbers, accounting documents) and mapping tax codes.
*   External APIs: Internal custom webhooks hosted at `n8n.tools.energy`.
*   Subworkflows: Executes global variable retrieval, Redis stream producing, and line-item specific processing.

# Data Inputs & Key Fields

*   Primary input fields: `dealID` (received via webhook body).
*   Important properties used:
    *   Company: `company_number`, `company_code`, `iban`, address details.
    *   Deal: `billing_cycle`, `tax_rate`, `deal_currency_code`, `dealname`, `billing_note`.
    *   Line Items: `legal_entity`, `amount`, `price`, `quantity`, `discount`.
    *   Quote: `hs_quote_amount`, `hs_sign_status`, `hs_amount_billed`.

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow starts when `Get invoice data` receives a deal ID. It formulates a Bearer token and passes the data to the Redis Stream Producer subworkflow to queue the job.
2. Callback execution: The system hits the `Callback get deal data` webhook, triggering the core processing loop.
3. Data retrieval: The workflow fetches Global Variables, followed by Deal properties, associations (Company, Contact, Line Items, Quotes, Projects). It subsequently fetches complete schemas and properties for the Company, Contact, and Products.
4. Data validation and Customer Number mapping: It checks if the primary Company has a `company_number`. If absent, it fetches the next available sequential number from MongoDB, updates the database, and patches the Company record in HubSpot.
5. Line Item splitting: Retrieves all associated line items and runs a custom JavaScript snippet to group them by the `legal_entity` property.
6. Branch execution (Legal Entities): The workflow routes data into two parallel tracks (for legal entity 1710 and 1711). For each valid group:
    *   It retrieves and increments the specific accounting document number from MongoDB.
    *   Checks if the deal includes a tax rate. If greater than 0, it fetches the appropriate tax code from MongoDB and generates a one-time tax object in HubSpot.
    *   Compiles a massive association payload mapping the Deal, Company, Contact, and Tax to a new Invoice.
7. External system calls: Posts the Invoice payload to HubSpot. Waits for 2 seconds to ensure data consistency, then executes a subworkflow to create the associated invoice line items.
8. Data updates: Calls an external webhook to copy discount/tax properties from the Signed Quote to the newly created invoice. Finally, patches the HubSpot Invoice status to "open" (stage: "draft").
9. Audit and Reconciliation: Retrieves all associated Quotes, identifies the officially signed quote (checking e-sign status), and calculates the expected total. It then fetches the properties of all generated invoices, sums their totals, and checks for rounding issues.
10. Error Flagging: If a rounding discrepancy (>= 0.01) is detected between the Quote and the Invoice(s), it updates the HubSpot Invoice stage to `invoice_error` and adds an explanatory comment.

# Branch Execution Details

*   If1 (Company Number Check):
    *   Condition: Checks if the Company's `company_number` is not empty.
    *   TRUE path: Bypasses sequential number generation and proceeds to Tax Code retrieval.
    *   FALSE path: Fetches the latest `customer_number` from MongoDB, increments it, replaces the document in DB, and patches the HubSpot Company record.
*   Check 1710 / 1711 data (Data existence checks):
    *   Condition: Validates if the split array contains objects for the respective legal entity.
    *   TRUE path: Proceeds with retrieving the accounting document number for that entity.
    *   FALSE path: Terminates that specific branch.
*   If5 & If6 (Tax Object Creation):
    *   Condition: Checks if `tax_rate` > 0.
    *   TRUE path: Creates a specific tax object in HubSpot via API using the derived tax code and rate.
    *   FALSE path: Skips tax object creation and proceeds to draft the Invoice payload.
*   If3 (Rounding Issue Check):
    *   Condition: Boolean check if `status` (rounding discrepancy >= 0.01) is true.
    *   TRUE path: Triggers an API PATCH to HubSpot updating the invoice stage to `invoice_error` with a descriptive comment.
    *   FALSE path: Workflow concludes successfully without altering the invoice status.

# External Operations

*   Database usage: Interacts with MongoDB collections `customer_number`, `accounting_document_number_1710`, `accounting_document_number_1711`, and `tax_code` using findOneAndReplace and findOneAndUpdate operations.
*   API calls: Executes numerous authenticated HTTP requests to HubSpot to read deals, search line items, read schemas, search quotes, and generate objects.
*   Object creation: Creates Taxes and Invoices natively inside HubSpot.
*   Object updates: Updates Companies (assigning customer numbers) and Invoices (updating stages and appending error comments).

# Subworkflows Used

*   Global variables
    *   Workflow ID: YTKoYUXPDy5OGV16
    *   Purpose: Retrieves environment/global context parameters (e.g., portal IDs, test record flags).
*   Subworkflow | Redis Stream Producer Workflow
    *   Workflow ID: 1tiTZLzrMssZ4trX
    *   Purpose: Acts as a queuing mechanism to prevent rate-limiting. Takes the raw deal data and a callback URL as inputs.
*   SAP | 3.0 | Create invoices line item base on deal payment type
    *   Workflow ID: 7WuHiChP2XeoGoY3
    *   Purpose: Creates individual line items natively on the generated HubSpot invoices. Passes invoice ID, payment type, array of line items, project ID, and legal entity as inputs.

# Database Collections

*   customer\_number: Maintains the central integer counter for unique company identification.
*   accounting\_document\_number\_1710: Maintains the running integer for SAP/accounting reference for entity 1710.
*   accounting\_document\_number\_1711: Maintains the running integer for SAP/accounting reference for entity 1711.
*   tax\_code: A reference collection mapping deal tax percentages to specific accounting VAT/Tax codes.

# Security Notes

*   Hardcoded tokens detected: The `Code in JavaScript1` node contains a hardcoded Bearer token (`Bearer dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`). This represents a security vulnerability and should be migrated to n8n's secure credentials manager.
*   Credentials mapping: Valid usage of pre-defined generic Header Auth credentials mapped for internal domain webhooks and HubSpot Private App tokens with specific granular scopes (Company, Line Item, Deal, Contact, Invoice, Quote).

# Known Limitations / Risks

*   Array out-of-bounds risks: Several Code nodes access arrays using `.results[0]` or array filters without strict length validation, which could cause the workflow to crash if associations are missing in HubSpot.
*   Concurrency issues: The MongoDB `findOneAndReplace` and `findOneAndUpdate` operations are used for sequential counters. Under high load, without strict atomic `$inc` operators, race conditions could potentially generate duplicate customer or accounting numbers.
*   Error handling: The final rounding check only patches the _first_ invoice found in the array (`$('Get all invoices props').first().json.id`), potentially leaving other invoices associated with the quote unflagged if multiple were generated.

# Final Outputs

When successful, the workflow ensures that the HubSpot Company has a synced customer number. It produces one or more draft Invoices in HubSpot (split by Legal Entity 1710/1711), complete with customized accounting document numbers, assigned tax objects, mapped line items, and copied discount properties. If mathematical deviations between the invoice and the signed quote are found, it flags the invoice with an error comment for manual review.