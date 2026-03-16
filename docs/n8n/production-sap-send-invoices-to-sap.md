---
title: 'Production | SAP | Send invoices to SAP'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623235
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/32CSzNVixjOg3TD9](https://n8n.tools.energy/workflow/32CSzNVixjOg3TD9)
Workflow ID: 32CSzNVixjOg3TD9
Workflow Name: Production | SAP | Send invoices to SAP
Status: Active

# Purpose

The business goal of this workflow is to automate the synchronization of invoice and credit note data from HubSpot CRM to the SAP ERP system. It retrieves comprehensive financial and customer data (deals, line items, contacts, companies, taxes, and discounts), ensures the customer (debitor) exists and is validated in SAP, calculates accurate final totals, and securely transmits the financial document to SAP. It also incorporates a robust error-handling mechanism that updates HubSpot if SAP rejects the transaction.

# Status and Runtime Controls

*   Execution Settings: Executes sequentially (Execution Order: v1), caller policy is restricted to workflows from the same owner.
*   Error Workflow: Configured to trigger workflow ID `Bu0X3AXE7asHOIpX` upon systemic failures.
*   Retry Behavior: All external HTTP Request nodes are configured with `retryOnFail: true` and a `waitBetweenTries` of 5000 milliseconds (5 seconds).
*   Time Saved Mode: Fixed calculation.

# Triggers & Entry Points

*   Webhook Node (call-back-send-invoice): The primary entry point. A POST webhook configured to receive an `invoiceID` payload from external systems (likely HubSpot).
*   Webhook Node (send-invoice-to-sap-queue): A secondary POST entry point designed to push invoice IDs into a Redis queue system for asynchronous processing.
*   Manual Trigger (When clicking ‘Execute workflow’): Used for testing and manual interventions, routing to fetch predefined test invoice and customer data.

# Systems & Integrations

*   HubSpot CRM API: Used extensively for fetching object properties and associations (Invoices, Deals, Line Items, Contacts, Companies, Taxes, Discounts).
*   MongoDB: Used as a lookup database for internal configurations (Energy Database).
*   External APIs (SAP / Amily): `https://amily.ringier.ch/neptune/api/zconnectors/amily/` for creating debitors and single invoices.
*   Subworkflows: Executes a Redis Stream Producer Workflow to queue tasks.
*   Internal Utilities: Archiving webhooks (`n8n.tools.energy/webhook/payload-archiving`).

# Data Inputs & Key Fields

*   Primary Input Fields: `invoiceID` (from the initial webhook).
*   Important Properties:
    *   Invoice: `record_type`, `amount`, `hs_amount_billed`, `legal_entity`, `hs_currency`, `accounting_document_number`, `invoice_type`.
    *   Deal: `partner_company_id`, `tax_rate`.
    *   Line Items: `amount`, `revenue_accounts`, `internal_orders`, `description`.
    *   Company: `company_number`, `customer_account_group`, `iban`, `zip`, `city`.
    *   Contact: `original_salutation`, `phone`, `hs_inferred_language_codes`.

# Workflow Logic (Deep Analysis)

1. Initial Trigger: The workflow initiates when the `call-back-send-invoice` webhook receives an invoice ID.
2. Data Retrieval Phase 1: It calls HubSpot to fetch invoice properties and resolves the associated deal. From the deal, it identifies associated line item IDs using a custom JavaScript execution.
3. Data Retrieval Phase 2: Fetches detailed properties for all associated line items, followed by fetching the contact associated with the invoice.
4. Configuration Lookup: Queries the MongoDB `tax_code` collection and runs custom code to map the deal's tax rate to an internal tax code payload.
5. Conditional Tax Retrieval: Validates if the tax rate is greater than 0. If true, it fetches specific tax object details from HubSpot.
6. Data Retrieval Phase 3: Fetches the associated company properties.
7. Data Validation: Evaluates the company number. If the company number is not within the range of 9,000,000 to 10,000,000, the workflow determines that a debitor needs to be created in SAP.
8. External System Calls (Debitor): If required, formats debitor data and pushes it to the SAP API. The response from SAP is evaluated for error types ('E'). If an error occurs, it maps the error text and updates the HubSpot invoice status to `invoice_error`.
9. Conditional Logic (Document Type): If no SAP errors exist, it fetches valid posting dates from MongoDB, then splits logic based on the document type (`Invoice` vs `Credit Note`).
10. Discount Processing: For standard invoices, it checks if discounts exist. If they do, it fetches discount objects from HubSpot before calculating totals.
11. Data Assembly: Executes a massive custom JavaScript data transformation to calculate net totals, distribute fixed/percentage discounts across sub-line items, calculate taxes, and map HubSpot properties to SAP's specific `INVOICES` JSON schema.
12. External System Calls (Invoice): Posts the assembled JSON payload to the SAP endpoint (`create_single_invoice`).
13. Final Updates: Converts the SAP request/response into an archive format and posts it to the internal Payload Archiving webhook for audit logging.

# Branch Execution Details

*   If1 (Tax rate validation):
    *   Condition: Checks if the extracted `tax_rate` is greater than 0.
    *   TRUE Path: Executes a HubSpot search for specific tax objects linked to the invoice, then proceeds to fetch company properties.
    *   FALSE Path: Skips tax object retrieval and proceeds directly to fetching company properties.
*   If2 (Company Number Range Check):
    *   Condition: Checks a generated boolean `isBetween` (Company number is between 9M and 10M).
    *   TRUE Path (Number is valid): Skips debitor creation and proceeds to check for existing SAP errors.
    *   FALSE Path (Number is outside range): Executes the `Create debitor` mapping node, followed by `Send debitor data to SAP`.
*   Check SAP error:
    *   Condition: Scans the SAP response payload (`result.RETURN`) for any objects where `TYPE === "E"`.
    *   TRUE Path: Extracts the error message, routes to `Return data for store error in HubSpot`, and updates the invoice via PATCH request.
    *   FALSE Path: Proceeds to query the MongoDB `send_invoice_date` collection to continue processing.
*   Switch1 (Record Type Routing):
    *   Condition: Evaluates the invoice property `record_type`.
    *   Branch 1 (Invoice): Routes to an `If` node to check for associated discounts.
    *   Branch 2 (Credit Note): Routes to a dedicated `Create commission data to send to SAP` script to format a negative/commission payload.
*   If (Discount Existence Check):
    *   Condition: Checks if the array of discount IDs is not empty.
    *   TRUE Path: Fetches discount objects from HubSpot, then routes to invoice assembly.
    *   FALSE Path: Routes directly to invoice assembly without fetching discounts.

# External Operations

*   Database Usage: Reads from two MongoDB collections (`tax_code` for mapping VAT variables, and `send_invoice_date` for identifying valid financial posting periods).
*   API Calls: Extensive use of HubSpot API via App Tokens (`crm/v3/objects/...`) for reads and a PATCH update. Makes external POST requests to the Amily/SAP infrastructure for customer and invoice creation.
*   Object Creation: Triggers new Customer records and Invoice documents inside the SAP environment.
*   Object Updates: Modifies HubSpot Invoice properties with error statuses if the SAP synchronization fails.

# Subworkflows Used

*   Workflow Name: Subworkflow | Redis Stream Producer Workflow
*   Workflow ID: 1tiTZLzrMssZ4trX
*   Purpose: Accepts webhook requests and queues the `invoiceID` processing payload into a Redis stream for decoupled execution.
*   Inputs: `type` ("new\_invoice"), `callbackWebhook` URL, and `data` (containing the invoice ID).

# Database Collections

*   `tax_code`: Used to cross-reference the tax rate found on the HubSpot deal with the explicit internal tax code string expected by SAP.
*   `send_invoice_date`: Used to fetch approved financial posting periods. The custom script utilizes this to correctly adjust the `DOCDATE` and `PSTNGDATE` fields depending on current accounting month cutoffs.

# Security Notes

*   Hardcoded Tokens Detected:
    *   `Send invoice data to SAP` and `Send debitor data to SAP` nodes contain hardcoded Basic Auth headers (`Authorization: Basic V1NfSFVCU1BPVDpXRlVrTVYzYXFGQXpGM3F6QVFrbSE=`).
    *   A test server node contains a different hardcoded Basic Auth header.
    *   `Code in JavaScript` node explicitly defines a hardcoded Bearer token (`const token = "Bearer dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a";`) to authenticate the Redis queue webhook.
*   Credentials: The workflow correctly uses authenticated credential blocks for MongoDB (`MongoDB Energy`) and HubSpot (`N8N Invoice Scope`, `N8N Company scope`, etc.).

# Known Limitations / Risks

*   Missing Error Handling: While SAP errors for debitor creation are caught and logged back to HubSpot, there is no explicit catch block if the final `Send invoice data to SAP` node fails to execute or returns an error. The workflow simply archives whatever response it gets.
*   Hardcoded Logic: The JavaScript node calculating totals relies heavily on the rigid structure of arrays. If HubSpot returns a payload with missing attributes, the script may throw unhandled runtime exceptions (`TypeError`).
*   Disabled Nodes: Several nodes (e.g., `Send data to queue1`, `Send invoice data to SAP test server`, `HTTP Request` for sending emails) are left in the workflow but disabled, creating a cluttered canvas that could cause confusion during maintenance.

# Final Outputs

When successfully completed, the workflow ensures the target customer exists in SAP, generates a highly structured financial JSON array mapping the invoice or credit note, pushes this record into SAP ERP for financial tracking, and logs the entire request/response payload into an internal archiving system.