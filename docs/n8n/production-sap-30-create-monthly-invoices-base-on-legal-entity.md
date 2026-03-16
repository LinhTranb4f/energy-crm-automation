---
title: 'Production | SAP | 3.0 | Create monthly invoices base on legal entity'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623355
---

# Summary

**Workflow URL**: [https://n8n.tools.energy/workflow/5QVnw8q55mAwXYCX](https://n8n.tools.energy/workflow/5QVnw8q55mAwXYCX)
**Workflow ID**: 5QVnw8q55mAwXYCX
**Workflow Name**: Production | SAP | 3.0 | Create monthly invoices base on legal entity
**Status**: Active

# Purpose

This workflow automates the monthly invoice generation process for SAP and HubSpot billing cycles. It supports multi-entity routing by separating data based on legal entities (1710 and 1711). It synchronizes associated line items, services, contacts, and companies, updates internal accounting sequences stored in MongoDB, generates custom tax objects if applicable, and finalizes drafted invoices within HubSpot.

# Status and Runtime Controls

*   **Timeout**: 1800 seconds (30 minutes).
*   **Retry behavior**: Enabled on external HTTP requests (e.g., HubSpot API calls) with a specified wait time of 3000 to 5000 milliseconds between attempts.
*   **Error workflow**: Configured to trigger workflow `wT0xsVj2O6kGhRfD` upon failure.
*   **Execution settings**: Configured to run in execution order `v1`. Time saved mode is set to `fixed`.

# Triggers & Entry Points

*   **Get invoice data**: An inbound webhook (`POST /create-monthly-invoice`) acting as the primary trigger from HubSpot when a deal meets the "Billing Run" criteria.
*   **Callback get invoice data**: A secondary webhook (`POST /callback-create-monthly-invoice`) triggered after the initial payload is queued via a Redis stream.

# Systems & Integrations

*   **HubSpot CRM API**: Interfaces with Deals, Companies, Contacts, Line Items, Products, Services, Taxes, and Invoices.
*   **MongoDB**: Manages centralized sequencing (customer numbers, accounting documents) and tax code references.
*   **External APIs**: Custom endpoint interactions (`n8n.tools.energy/webhook/*`) for discount, tax processing, and queuing.
*   **Subworkflows**: Calls global variable fetchers, Redis queue streams, and line-item creation subworkflows.
*   **Webhooks**: Entry and exit points for asynchronous task queues.

# Data Inputs & Key Fields

*   **Primary input fields**: `dealID` (from webhook body).
*   **Important properties used in the workflow**: `billing_cycle`, `legal_entity`, `tax_rate`, `company_number`, `accounting_document_number`, `hs_pipeline_stage`, `product_group`, `hs_v2_date_entered_3565446370` (close date), `deal_currency_code`.

# Workflow Logic (Deep Analysis)

1. **Initial trigger**: The workflow is initiated via the `Get invoice data` webhook.
2. **Queueing**: The payload is sent to a Redis Stream via an HTTP POST request and a Subworkflow, then returned to the `Callback get invoice data` webhook to decouple ingestion from actual processing.
3. **Data retrieval**: The workflow retrieves global variables, Deal properties, Company properties, Contact properties, Product schemas, and Associated Line Items. It additionally searches for HubSpot Services associated with the Deal.
4. **Data validation**: The workflow queries MongoDB for the standard `customer_number`. The `If1` node checks if the retrieved HubSpot Company lacks a `company_number`. If empty, it assigns the database sequence, increments the database, and updates the HubSpot Company.
5. **Conditional processing & Split**: The `Split invoice data` JS code node filters non-radio services based on realisations in the previous month and aggregates radio spots. It then structures the items grouped by the `legal_entity` variable (1710 vs 1711).
6. **Branch execution**: Dedicated filter nodes (`Get 1710 data` and `Get 1711 data`) divide the flow into parallel branches. Each path fetches its respective `accounting_document_number` from MongoDB, increments it, and replaces the old value in the database.
7. **External system calls**: If a non-zero tax rate is detected (`If5` and `If6`), the workflow performs POST requests to HubSpot to generate one-time Tax objects based on the deal parameters.
8. **Data creation or update**: The workflow formulates the final HubSpot invoice payloads (`Create invoice data for legal entity 1710 / 1711`), mapping associations between the Deal, Company, Contact, and Tax elements. Following a `Wait` step, it triggers the creation of the invoices in HubSpot.
9. **Merge operations**: The workflow captures the newly generated invoice IDs and invokes subworkflows (`Create invoices line item base on deal payment type 1710 / 1711`) to append the structured line items. It then calls external webhooks to transfer discount values from the quoted Deal to the Invoices.
10. **Final updates**: The process culminates by sending a PATCH request to HubSpot, updating the generated invoices to `hs_invoice_status: "open"` and `invoice_stage: "draft"`.

# Branch Execution Details

*   **If1 (Check Company Number)**:
    *   **Condition logic**: Evaluates if the `company_number` from the HubSpot company fetch is not empty.
    *   **TRUE path**: Skips updating the company number and proceeds directly to fetching the tax code from MongoDB.
    *   **FALSE path**: Queries `Get customer number`, runs the `Increase customer number` script, updates MongoDB, and executes an HTTP PATCH (`Update company number`) to write the value to HubSpot.
*   **If5 & If6 (Check Tax Rate)**:
    *   **Condition logic**: Evaluates if the Deal's mapped `tax_rate` is strictly greater than 0.
    *   **TRUE path**: Sends an HTTP request to create a specific one-time tax object within HubSpot.
    *   **FALSE path**: Bypasses the tax object creation and proceeds to data mapping for the invoice.

# External Operations

*   **Database usage**: Queries, replaces (`findOneAndReplace`), and updates (`findOneAndUpdate`) documents in MongoDB collections to manage safe auto-incrementing counters for accounting documents and customers.
*   **API calls**: Utilizes multiple GET, POST, and PATCH operations against the HubSpot CRM API (`/crm/v3/objects/*` and `/crm-object-schemas/v3/schemas/*`), and custom webhook endpoints.
*   **Object creation**: Dynamically generates Tax objects and custom Invoice objects inside HubSpot.
*   **Object updates**: Modifies HubSpot Companies (appending generated company numbers) and Invoices (transitioning statuses to draft).

# Subworkflows Used

*   **Workflow Name**: Subworkflow | Redis Stream Producer Workflow
    *   **Workflow ID**: 1tiTZLzrMssZ4trX
    *   **Purpose**: Offloads webhook payload data to a Redis queue to ensure reliable execution state.
    *   **Inputs**: `type` (disposition), `data` (dealID), and `callbackWebhook` URL.
*   **Workflow Name**: Global variables
    *   **Workflow ID**: YTKoYUXPDy5OGV16
    *   **Purpose**: Fetches system-wide operational variables (pipeline stage definitions, testing record rules, portal IDs).
    *   **Inputs**: None.
*   **Workflow Name**: SAP | 3.0 | Create invoices line item base on deal payment type
    *   **Workflow ID**: 7WuHiChP2XeoGoY3
    *   **Purpose**: Transforms and attaches the filtered arrays of line items directly into the newly drafted HubSpot invoices.
    *   **Inputs**: `paymentType`, `deal_line_items`, `invoiceID`, `projectID`, and `legal_entity`.

# Database Collections

*   **customer\_number**: Stores the global auto-incrementing integer sequence for generating internal customer identification numbers.
*   **accounting\_document\_number\_1710**: Retains the sequence counter for document IDs mapped to Legal Entity 1710.
*   **accounting\_document\_number\_1711**: Retains the sequence counter for document IDs mapped to Legal Entity 1711.
*   **tax\_code**: Functions as a lookup directory mapping Deal percentage rates to formal VAT formats and system tax codes.

# Security Notes

*   **Hardcoded tokens**: A bearer token string is explicitly hardcoded in the `Code in JavaScript1` node (`const token = "Bearer dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a";`). This poses a significant security vulnerability.
*   **Credentials**: Relies safely on standard n8n credentials for Header Auth (`SmSUyv0Pf8gThTzV`) and MongoDB (`DvhNAsGpXjnr2mJt`).
*   **Sensitive operations**: Real-time manipulation of accounting sequence numbers in MongoDB. Erroneous testing against production collections could cause sequence desynchronization.

# Known Limitations / Risks

*   **Missing error handling**: High usage of `.first().json` array methods in Code nodes without pre-checking array length or object existence. If properties or associations do not exist on the HubSpot Deal, the script will throw unhandled exceptions and fail the execution.
*   **Hardcoded Logic**: The node `Split invoice data` contains commented out manual date overrides (`closedDate = new Date("2026-01-30");`). Such manual adjustments in script execution pose a risk for ongoing maintenance.
*   **Race conditions**: The workflow forces arbitrary `Wait` nodes (amount 2) preceding invoice creation. Depending on API latency or indexing speed within HubSpot, these waits might not be adequate to ensure dependent associations are fully resolved.
*   **Execute Once flags**: End-of-flow nodes like `Update invoice 1710` are configured with `executeOnce: true`. If the logic expects bulk deal batching instead of individual webhooks, this will only process the first item.

# Final Outputs

Upon successful execution, the workflow will yield drafted, pre-populated HubSpot Invoices segregated by their respective Legal Entities (1710 and/or 1711). These invoices will contain validated discounts, accurate tax metrics, correct sequence document numbers, and complete native associations to the originating Deal, Company, and Contacts.