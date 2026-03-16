---
title: 'HubSpot | PandaDoc | Create Commission PDF | Giu'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623895
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/Tn5Ejd3FZIrvLHyU](https://n8n.tools.energy/workflow/Tn5Ejd3FZIrvLHyU)
Workflow ID: Tn5Ejd3FZIrvLHyU
Workflow Name: HubSpot | PandaDoc | Create Commission PDF | Giu
Status: Active

# Purpose

This workflow automates the generation of a Commission PDF document using PandaDoc based on Invoice and Deal data retrieved from HubSpot. Once the PDF is assembled, configured, and processed in PandaDoc, the document is downloaded and uploaded back to the HubSpot CRM, linking the final file directly to the originating invoice and advancing the invoice stage.

# Status and Runtime Controls

*   Timeout: Not explicitly defined in the settings.
*   Retry behavior: Retries are enabled (`retryOnFail: true`) for almost all external API calls (e.g., retrieving HubSpot data, communicating with PandaDoc).
*   Error workflow: Execution errors are routed to a dedicated subworkflow (ID: `Bu0X3AXE7asHOIpX`).
*   Execution settings: Execution order is configured as `v1` and Caller Policy is restricted to `workflowsFromSameOwner`.

# Triggers & Entry Points

*   Webhook Trigger (`Webhook`): Listens for incoming POST requests to the `generate-commission` path. It utilizes a Header Authentication credential (`Production | HubSpot | Header Auth`) to secure the endpoint. The expected payload includes an `hs_object_id` representing the HubSpot Invoice ID.
*   Manual Trigger (`When clicking ‘Execute workflow’`): Allows operators to manually fire the workflow, bypassing the webhook for testing, debugging, or ad-hoc runs.

# Systems & Integrations

*   HubSpot CRM API: Used for reading extensive CRM data (Invoices, Deals, Contacts, Companies, Line Items, Owners, Taxes, Discounts) and writing files/updating objects.
*   PandaDoc API: Used for document creation, status polling, updating content placeholders, status advancement, and downloading the final PDF.
*   Webhooks: Inbound trigger to start the process and an outbound responder to acknowledge completion.

# Data Inputs & Key Fields

*   Primary input fields: `hs_object_id` (Invoice ID passed via webhook payload).
*   Important properties used in the workflow:
    *   HubSpot Invoice Properties: `hs_number`, `amount`, `legal_entity`, `invoice_stage`, `qr_code`, `kommissionsblatt_pandadoc_url`.
    *   HubSpot Line Item Properties: `name`, `description`, `amount`, `hs_tax_rate`, `price`.
    *   Deal Properties: `dealname`, `commission_type`, `commission_rate`, `billing_cycle`, `campaign_start`, `campaign_end`.
    *   Company Properties: Differentiates between various company associations (`agency`, `broker`, `rechnungsempfänger`).

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow starts when a HubSpot webhook sends an Invoice ID or when manually triggered.
2. Data retrieval: A Code node configures global variables (API keys, environments). The `get_invoice` node then fetches the main invoice record and its associated object IDs from HubSpot.
3. Deep Data Enrichment: Using Split nodes and parallel HTTP Request nodes, the workflow fetches all underlying relational data. This includes Line Items, Deals, Deal Owner, Contacts, Primary Company, Broker Company, Agency Company, Invoice Recipient Company, Taxes, and Discounts.
4. Merging and Payload Formatting: The `invoice_data_merge` node gathers the parallel paths. Two Code nodes (`content_payload` and `generate_pandadoc_tables`) process the HubSpot line items to calculate total brutto amounts, apply VAT, format commission structures, and parse HTML descriptions into clean PandaDoc table JSON formats.
5. Conditional logic (Invoice Type): A Switch node routes execution based on the specific type of invoice requested (Commission, Default, or Brutto).
6. Document Creation: The `pandadoc_paylod_invoice` node constructs the PandaDoc API payload mapping CRM variables to PandaDoc tokens. The `create_invoice_doc` node sends this payload to PandaDoc to generate the document.
7. Polling Mechanism: A Switch node (`invoiceStatusSwitch`) evaluates the document status. If it's not ready, it hits a Wait node, then polls `get_doc_infos` and loops back until the document reaches `document.draft` or `document.error`.
8. External system updates: Once in Draft status, the workflow updates the document with payment slip images, pushes the status to processing, and downloads the binary PDF via PandaDoc APIs.
9. Final updates: The downloaded PDF is uploaded to the HubSpot File Manager (`upload_file_to_hs`). The originating invoice is updated via a PATCH request (`update_invoice`), which writes the file URL into `kommissionsblatt_pandadoc_url` and updates the `invoice_stage` to `qa`. Finally, a `Respond to Webhook` node sends a success acknowledgment.

# Branch Execution Details

*   `invoiceTypeSwitch`:
    *   `invoice_default`: Checks if `invoiceId` exists. TRUE proceeds to payload generation.
    *   `invoice_commission`: Evaluates if `create_commission_invoice` is true.
    *   `invoice_brutto`: Evaluates if `create_brutto_invoice` is true.
*   `invoiceStatusSwitch` (Polling Logic):
    *   TRUE path (`Draft`): If status equals `document.draft`, the loop breaks, moving to update document parameters and downloading.
    *   FALSE path (`Error`): If status equals `document.error`, it hits an Error node and terminates.
    *   Fallback path: If processing, routes to a Wait node, then `poll_invoice_doc_status`, and loops back into the switch.

# External Operations

*   API Calls (HubSpot):
    *   GET requests to retrieve Invoice, Contact, Company, Deal, Owner, Line Items, Discounts, and Taxes.
    *   POST request to search/filter Line Items via `crm/v3/objects/line_items/search`.
    *   POST request to `files/v3/files` to upload the final document.
    *   PATCH request to `crm/v3/objects/invoices/{ID}` to update properties.
*   API Calls (PandaDoc):
    *   POST to `public/v1/documents` for creation.
    *   GET to retrieve status and details.
    *   PATCH to update document content placeholders/images.
    *   PATCH to `status` endpoint to advance the state.
    *   GET to `download` endpoint to pull the PDF payload.

# Subworkflows Used

*   Workflow Name: Error Handler
*   Workflow ID: `Bu0X3AXE7asHOIpX`
*   Purpose: Catches errors explicitly thrown by the `Stop And Error` nodes (e.g., `error_pandadoc_create`, `hubspot_error_update_invoice`, etc.) and formats them into standardized error telemetry containing workflow IDs, step names, and deal owner contexts.
*   Inputs: Inherits payload from `errorObject` definitions mapped inside the Stop and Error nodes.

# Database Collections

No external database collections (such as MongoDB or Postgres) are utilized. The workflow treats HubSpot CRM purely as the underlying operational database.

# Security Notes

*   Hardcoded tokens: The `Global variables` code node explicitly contains hardcoded, plain-text API keys for PandaDoc (`PANDADOC_API_KEY`) and HubSpot (`HS_TOKEN`). This poses a security risk. Best practice dictates migrating these variables into n8n native credentials.
*   Sensitive operations: Direct exposure of API keys in JS code nodes means anyone with viewer access to the workflow can extract these keys.

# Known Limitations / Risks

*   Unbounded Polling Loop: The PandaDoc status polling architecture (`invoiceStatusSwitch` -> `Wait` -> `poll_invoice_doc_status`) has no counter limitation. If PandaDoc becomes unresponsive or a document gets permanently stuck in a processing state, this creates an infinite loop condition that could consume execution memory over time.
*   API Key Hardcoding: Hardcoding credentials directly within a Code node creates maintenance bottlenecks if keys expire or are rotated.

# Final Outputs

Upon a successful run, the workflow yields:

1. A fully formatted Commission PDF stored natively inside HubSpot's file manager (`/Invoices` folder).
2. An updated HubSpot Invoice record linked to the newly generated document URL, with its operational stage updated to `qa`.
3. A successful `{"status": true}` HTTP response transmitted back to the initiating web system.