---
title: 'HubSpot | PandaDoc | Create Invoice PDF | Giu'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623875
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/aHp1HOKZj4nMAv93](https://n8n.tools.energy/workflow/aHp1HOKZj4nMAv93)
Workflow ID: aHp1HOKZj4nMAv93
Workflow Name: HubSpot | PandaDoc | Create Invoice PDF | Giu
Status: Active

# Purpose

This workflow automates the generation of Invoice PDFs via PandaDoc using data extracted from HubSpot CRM. It fetches complex relational data (Invoices, Deals, Contacts, Companies, Line Items, Taxes, Discounts), processes it into structured tables and payloads, generates the document in PandaDoc, waits for the document to render, downloads the final PDF, and uploads it back to HubSpot as an attachment while updating the invoice record.

# Status and Runtime Controls

*   Timeout: Not explicitly defined in global settings, but relies on HubSpot webhook timeouts.
*   Retry behavior: Multiple HTTP Request nodes (HubSpot and PandaDoc) have "Retry On Fail" set to true to handle transient API errors.
*   Error workflow: Configured to trigger workflow ID `Bu0X3AXE7asHOIpX` on errors. Custom error nodes (`stopAndError`) halt execution and format explicit error payloads containing the exact step, deal ID, invoice ID, and owner details.
*   Execution settings: Execution Order v1, Caller Policy restricts to workflows from the same owner, Time Saved Mode is fixed.

# Triggers & Entry Points

*   Webhook Trigger (`Webhook`): Listens for a POST request at `/generate-invoice`. It receives the payload containing the initial `hs_object_id` representing the Invoice.
*   Manual Trigger (`When clicking ‘Execute workflow’`): Allows manual execution for testing and debugging purposes.

# Systems & Integrations

*   HubSpot CRM API: Used to fetch Invoices, Contacts, Companies, Deals, Line Items, Discounts, Taxes, and Owners. Also used to upload the final PDF file and patch the Invoice object.
*   PandaDoc API: Used to generate the document from a template, poll for document status, update document metadata, change status to "sent", and download the generated PDF.
*   Webhooks: Used for the initial entry point and the final response back to the caller.
*   Internal Custom Code: Multiple JavaScript nodes used to transform HubSpot data into complex PandaDoc table objects, mapping logic, and dynamic token generation.

# Data Inputs & Key Fields

*   Primary input fields: `hs_object_id` (Invoice ID).
*   Important properties used:
    *   HubSpot Invoice: `hs_number`, `hs_invoice_date`, `qr_code`, `create_brutto_invoice`, `legal_entity`, `iban`, `iban_reference`.
    *   HubSpot Deal: `commission_type`, `commission_rate`, `campaign_start`, `campaign_end`, `tax_rate`, `billing_cycle`.
    *   HubSpot Line Items: `price`, `quantity`, `description`, `quote_product_group`, `hs_total_discount`, `amount`.

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow starts via a Webhook POST request or a Manual Trigger, injecting the `hs_object_id`.
2. Data retrieval: A `Global variables` code node establishes base tokens. The workflow then fetches the primary Invoice object. Using the associations, it splits out and fetches related HubSpot data in a massive parallel execution: Deal, Primary Company, Broker Company, Invoice Recipient Company, Agency Company, Contact, Owner, Line Items, Discounts, and Taxes.
3. Merge operations: The `invoice_data_merge` node waits for 7 branches to complete, aggregating all the disparate HubSpot relational data into a single stream.
4. Data validation & transformation: The `content_payload` Code node maps the line items, grouping them into "Radio Spots", "Digital Spots", "Radio Sponsoring", and "Other". It calculates discounts, handles 0% VAT rules, and computes net and gross totals. The `generate_pandadoc_tables` node converts this into PandaDoc's proprietary table JSON structure.
5. Conditional logic: `invoiceTypeSwitch` evaluates the transformed payload to determine if it is a default, commission, or brutto invoice branch.
6. Payload Generation: `pandadoc_paylod_invoice` builds the final PandaDoc request, injecting variables (Tokens) like names, dates, standard and advanced cost overviews, and QR codes for payment slips.
7. External system calls (PandaDoc Creation): The `create_invoice_doc` node sends the payload to PandaDoc.
8. Polling Loop: The workflow enters a polling loop to ensure the document finishes rendering. `poll_invoice_doc_status` checks the status. `invoiceStatusSwitch` evaluates the response. If not complete, it goes to a `Wait` node (Wait 30s) and loops back to polling.
9. External system calls (PandaDoc Finalization): Once draft status is reached, it updates the document details via `update_document`, adds the QR code via `pd_paylod_images`, changes the document status to sent (status: 2), and downloads the PDF (`download_doc`).
10. Data update (HubSpot): The PDF is uploaded to HubSpot files (`upload_file_to_hs`). The original Invoice record is patched with the generated PandaDoc URL and the stage is set to "qa" (`update_invoice`).
11. Final updates: A successful response (`{"status": true}`) is returned to the original webhook caller via `Respond to Webhook`.

# Branch Execution Details

*   invoiceTypeSwitch:
    *   Condition logic: Checks payload fields from the transform step.
    *   TRUE path (invoice\_default): If `invoiceId` is not empty. Proceeds to `pandadoc_paylod_invoice`.
    *   TRUE path (invoice\_commission): If `create_commission_invoice` is true. Proceeds to `pandadoc_paylod_invoice`.
    *   TRUE path (invoice\_brutto): If `create_brutto_invoice` is true. Proceeds to `pandadoc_paylod_invoice`.
*   invoiceStatusSwitch:
    *   Condition logic: Evaluates the PandaDoc `status` string.
    *   Draft path: If `status` equals 'document.draft'. Proceeds to `get_doc_infos` to finalize the document.
    *   Error path: If `status` equals 'document.error'. Triggers the `error_pandadoc_create_status` node, halting the workflow with a precise error log.
    *   Fallback path: If status is still processing, routes to the `Wait` node to pause before looping back to re-poll the status.

# External Operations

*   Database usage: Interacts purely with HubSpot CRM as the primary database source of truth.
*   API calls:
    *   HubSpot: GET requests to multiple `/crm/v3/objects/...` endpoints. POST to `/crm/v3/objects/line_items/search`. POST to `/files/v3/files`. PATCH to `/crm/v3/objects/invoices/...`.
    *   PandaDoc: POST to `/public/v1/documents`, GET to `/public/v1/documents/{id}/details` and `/download`, PATCH to update document and status.
*   Object creation: Creates a Document object in PandaDoc. Creates a File object in HubSpot.
*   Object updates: Updates the existing HubSpot Invoice object properties.

# Subworkflows Used

*   Workflow name: Unknown (Triggered automatically by ID via settings)
*   Workflow ID: Bu0X3AXE7asHOIpX
*   Purpose: Designated Error Workflow to handle execution failures gracefully across the system.
*   Inputs: n8n error object and custom error payloads built by various `stopAndError` nodes.

# Database Collections

*   HubSpot Invoices: Source of billing details, dates, and QR codes.
*   HubSpot Deals: Source of campaign dates, commission logic, and company associations.
*   HubSpot Contacts: Source of billing recipient names.
*   HubSpot Companies: Source of addresses and routing (Broker, Agency, Primary).
*   HubSpot Line Items: Source of product quantities, descriptions, and base prices.
*   HubSpot Discounts & Taxes: Source of calculations to achieve final net/gross amounts.

# Security Notes

*   Hardcoded tokens: The `Global variables` code node contains hardcoded, plaintext API keys for PandaDoc (`PANDADOC_API_KEY`) and HubSpot (`HS_TOKEN`). This is a severe security vulnerability. Credentials should be migrated to the built-in n8n credentials manager.
*   Credentials: API Keys are passed directly as header variables in HTTP request nodes.
*   Sensitive operations: Processing financial data, invoice details, and client PII. The system creates files in HubSpot set to "PUBLIC\_NOT\_INDEXABLE", relying entirely on the platform's security mechanisms.

# Known Limitations / Risks

*   Infinite Polling Loop: The `invoiceStatusSwitch` -> `Wait` -> `poll_invoice_doc_status` loop lacks a maximum retry counter. If the PandaDoc API hangs or returns an undocumented status perpetually, the workflow will loop indefinitely until it hits a hard platform timeout.
*   Code Node Complexity: The JavaScript transform nodes (`content_payload` and `generate_pandadoc_tables`) are monolithic and carry heavy, complex business logic. Any changes to HubSpot product grouping, line item logic, or tax rules require raw code updates rather than visual mapping.
*   Missing Error Mapping: While there are dedicated Stop and Error nodes, some HTTP nodes do not explicitly map "Continue On Fail" branches into these error handlers, potentially causing unhandled raw API crashes.
*   Hardcoded IDs: PandaDoc content library template IDs are hardcoded directly within the JS scripts, making template maintenance brittle.

# Final Outputs

When successful, the workflow generates a fully compiled Invoice PDF in PandaDoc, downloads it, uploads the PDF to the HubSpot File Manager, updates the HubSpot Invoice record (setting `invoice_stage` to "qa" and attaching the generated file URL), and returns a standard `{"status": true}` payload to the webhook caller.