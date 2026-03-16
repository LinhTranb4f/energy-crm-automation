---
title: 'Production | SAP | Cancel invoices from SAP'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623555
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/ksZnvNncDNDHDOTB](https://n8n.tools.energy/workflow/ksZnvNncDNDHDOTB)
Workflow ID: ksZnvNncDNDHDOTB
Workflow Name: Production | SAP | Cancel invoices from SAP
Status: Active

# Purpose

This workflow automates the cancellation (storno) process of invoices, bridging HubSpot and the Amily SAP system. It retrieves invoice, deal, and line item data from HubSpot, verifies the invoice in SAP, calculates net amounts, discounts, and taxes, generates a cancellation document via PandaDoc, updates internal accounting counters in MongoDB based on the legal entity, and pushes the finalized cancellation payload to the SAP system. Finally, it archives the process payload for auditing.

# Status and Runtime Controls

*   Timeout: Relying on system default settings (no explicit timeout defined in workflow settings).
*   Retry behavior: High resilience; almost all HTTP Request nodes are configured with `retryOnFail: true` and a `waitBetweenTries` of 5000 milliseconds.
*   Error workflow: Automatically triggers error workflow ID `Bu0X3AXE7asHOIpX` upon unhandled failures.
*   Execution settings: Configured with `executionOrder: v1` and restricted via `callerPolicy: workflowsFromSameOwner`.

# Triggers & Entry Points

*   Webhook: `send-storno-to-sap-queue` (POST). Accepts an `invoiceID` and passes it to a Redis stream producer subworkflow.
*   Webhook: `send-storno-to-SAP` (POST). The primary trigger for the main processing pipeline. Expects an `invoiceID` in the request body.
*   Manual Trigger: `When clicking ‘Execute workflow’`. A manual entry point specifically connected to test nodes for querying SAP endpoints (Get customer, Get invoice).

# Systems & Integrations

*   HubSpot CRM API: Core system for retrieving Invoice, Deal, Line Items, Company, Contact, Tax, and Discount properties.
*   Amily SAP (Neptune API): The target ERP system for validating existing invoices and creating cancellation invoices.
*   MongoDB: Internal database for managing unique accounting document numbers per legal entity and referencing tax codes.
*   Webhooks (Internal utilities): Used for generating PandaDoc cancellation documents and payload archiving.
*   Redis (via Subworkflow): Used as a message broker for queueing invoice processing.

# Data Inputs & Key Fields

*   Primary input fields: `invoiceID` (from webhook payload).
*   Key properties used:
    *   Invoice: `legal_entity` (1710 or 1711), `hs_number`, `accounting_document_number`, `invoice_cancellation_date`, `iban`, `iban_reference`.
    *   Deal: `tax_rate`, `discount`, `commission_type`.
    *   Line Items: `amount`, `payment_term`, `revenue_accounts`, `cost_center`, `transaction_type`.
    *   Companies/Contacts: Addresses and localized references.

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow starts when the `/send-storno-to-SAP` webhook receives an `invoiceID`.
2. Data retrieval: Fetches the Invoice properties from HubSpot and validates its existence in SAP (`Check invoice in SAP`). It then fetches the associated Deal properties.
3. Line Item extraction: A Code node extracts the IDs of associated line items, followed by an API call to fetch full line item details.
4. Tax validation: Queries MongoDB to match the deal's `tax_rate` with the internal `tax_code`.
5. Conditional logic (Tax & Discounts): Checks if the tax rate is greater than 0 (If3). If true, retrieves tax details. Next, it checks if discounts exist on the invoice (If2). If true, retrieves discount details.
6. Company/Contact retrieval: Fetches associated Company and Contact information to gather necessary billing fields (IBAN, Address).
7. Branch execution (Legal Entity): A Switch node evaluates the `legal_entity` (1710 vs 1711). This dictates which MongoDB collection to query for the next available accounting document number.
8. Number Generation & Document Creation: Increments the accounting number in MongoDB, patches the HubSpot invoice with the new cancellation number, triggers the PandaDoc creation webhook, and waits 25 seconds for the document to generate.
9. External system calls: Retrieves the newly generated PandaDoc URL from HubSpot.
10. Data creation: A complex Code node (`Create cancel data to send to SAP`) calculates net totals, distributes discounts proportionally, calculates taxes, and formats the extensive JSON payload required by SAP.
11. SAP Sync: Pushes the formatted payload to SAP via a POST request to `create_single_invoice`.
12. Final updates: Formats the request and response data, then sends it to a payload archiving webhook for logging.

# Branch Execution Details

*   If3 (Tax Check):
    *   Condition: Evaluates if `tax_rate` > 0.
    *   TRUE path: Executes `Get all taxes in the invoice1` (HubSpot API search) then proceeds to If2.
    *   FALSE path: Skips tax retrieval and goes straight to If2.
*   If2 (Discount Check):
    *   Condition: Checks if the array of discount IDs on the invoice is not empty.
    *   TRUE path: Executes `Get all discount in the invoice1` (HubSpot API search) then proceeds to Company Retrieval.
    *   FALSE path: Skips discount retrieval and goes straight to Company Retrieval.
*   Switch (Legal Entity):
    *   Condition: Checks `legal_entity` value.
    *   Branch 1711: Retrieves accounting doc number from `accounting_document_number_1711`, increments it, updates MongoDB, and patches HubSpot Invoice using the 1711 identifier.
    *   Branch 1710: Retrieves accounting doc number from `accounting_document_number_1710`, increments it, updates MongoDB, and patches HubSpot Invoice using the 1710 identifier.

# External Operations

*   Database usage: MongoDB is used for `findOneAndUpdate` operations to lock and increment sequential document counters to prevent overlapping invoice numbers. It also reads from the `tax_code` collection.
*   API calls: Extensive usage of HubSpot API (fetching associations, searching line items/taxes, patching invoices) and Amily SAP Neptune API (getting customer/invoice, creating single invoices).
*   Object updates: HubSpot invoices are actively patched with `cancellation_accounting_document_number`.

# Subworkflows Used

*   Workflow Name: Subworkflow | Redis Stream Producer Workflow
*   Workflow ID: 1tiTZLzrMssZ4trX
*   Purpose: Acts as a queuing mechanism to push incoming `send-storno-to-sap-queue` requests into a Redis stream before hitting the main processor.
*   Inputs: `type` (new\_invoice), `data` (invoiceID), and a `callbackWebhook` URL to return to this workflow.

# Database Collections

*   `tax_code`: Used as a lookup table to map HubSpot tax rates to specific ERP tax codes.
*   `accounting_document_number_1710`: Stores and increments the running sequence for cancellation document numbers for legal entity 1710.
*   `accounting_document_number_1711`: Stores and increments the running sequence for cancellation document numbers for legal entity 1711.

# Security Notes

*   Hardcoded tokens: The workflow contains hardcoded authorization headers.
    *   `Code in JavaScript1` contains a hardcoded Bearer token (`Bearer dd3ca330-6f3e...`).
    *   SAP nodes (`Send cancel data to SAP`, `Check invoice in SAP`) utilize hardcoded Basic Auth credentials (`Basic V1NfSFVCU1BPVDp...`).
*   Credentials should be moved to n8n's secure credential management system to prevent security risks and simplify rotation.

# Known Limitations / Risks

*   Race conditions: The `Wait` node statically pauses for 25 seconds while the PandaDoc cancellation invoice generates. If the third-party service is slow and takes 26+ seconds, the subsequent `get_invoice_cancellation_url` node will retrieve an empty or old URL, breaking the SAP payload.
*   Incomplete logic: `Check invoice in SAP` has `onError: continueErrorOutput`. If the invoice doesn't exist in SAP, it might silently push errors down the pipeline leading to malformed computations.
*   Unprocessed branches: The `Send cancel data to SAP test server` is currently disabled but holds legacy logic and different credentials.

# Final Outputs

When successful, the workflow ensures the accounting document number is incremented in MongoDB, the HubSpot invoice is updated with the cancellation reference, a PDF cancellation document is generated, the storno record is officially created in the SAP system, and the entire transaction trace (request and response payload) is archived for auditing.