---
title: 'HubSpot | PandaDoc | Create Cancellation Invoice PDF | Giu'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623915
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/WUi6M5wRCGH4uJ0h](https://n8n.tools.energy/workflow/WUi6M5wRCGH4uJ0h)
**Workflow ID:** WUi6M5wRCGH4uJ0h
**Workflow Name:** HubSpot | PandaDoc | Create Cancellation Invoice PDF | Giu
**Status:** Active

# Purpose

The business goal of this workflow is to automatically generate a cancellation invoice PDF using PandaDoc based on data originating from HubSpot. When a cancellation is initiated, the workflow aggregates comprehensive data from the HubSpot Invoice, Deal, Contact, Company, Line Items, Discounts, and Taxes. It calculates the necessary negated amounts specifically for cancellation purposes, structures the data into PandaDoc tables, generates the document, and finally uploads the generated PDF back into HubSpot, linking it directly to the source invoice.

# Status and Runtime Controls

*   **Execution Settings:** Runs in fixed time-saved mode. Concurrent caller policy is restricted to workflows from the same owner.
*   **Retry Behavior:** Configured with `retryOnFail: true` on the majority of HTTP Request nodes (both HubSpot and PandaDoc API calls) to ensure resilience against transient network or API errors.
*   **Error Workflow:** Any uncaught errors trigger a dedicated error handling workflow with ID `Bu0X3AXE7asHOIpX`.
*   **Stop & Error Handling:** The workflow utilizes numerous `stopAndError` nodes explicitly designed to catch HTTP request failures at specific execution stages, packaging context (like workflow ID, error message, and Deal/Owner info) before halting.

# Triggers & Entry Points

*   **Webhook Trigger:** Listens for incoming POST requests at the path `genereate-cancellation-invoice`. It utilizes header-based authentication ensuring secure invocation by HubSpot workflows.
*   **Manual Trigger:** Allows project managers or developers to execute the workflow manually from the n8n interface for testing and debugging purposes.

# Systems & Integrations

*   **HubSpot CRM API:** Used extensively to fetch CRM objects (Invoices, Deals, Contacts, Companies, Line Items, Owners, Discounts, Taxes) and upload files.
*   **PandaDoc API:** Used to create documents, retrieve document status, update document metadata, change document status to finalized, and download the resulting PDF.
*   **Internal Utilities:** Custom JavaScript Code nodes used to transform arrays, calculate financial data, format pricing, and build JSON payloads for the APIs.
*   **Webhooks:** For receiving the initial trigger and responding back to the caller system upon completion.

# Data Inputs & Key Fields

*   **Primary Input Fields:** `invoiceID` or `hs_object_id` (passed via the webhook payload).
*   **Important Properties:**
    *   Deal Properties: `commission_type`, `commission_rate`, `tax_rate`, `campaign_start`, `campaign_end`, `hubspot_owner_id`, `billing_cycle`.
    *   Line Item Properties: `price`, `quantity`, `hs_tax_amount`, `amount`, `hs_total_discount`, `quote_product_group`, `spot_duration`.
    *   Invoice Properties: `legal_entity`, `create_brutto_invoice`, `hs_number`, `hs_invoice_date`.

# Workflow Logic (Deep Analysis)

1. **Initial Trigger:** The workflow begins when a webhook is received from HubSpot containing the target Invoice ID.
2. **Initialization:** The "Global variables" Code node extracts the Invoice ID and initializes API tokens and base URLs for subsequent nodes.
3. **Data Retrieval (HubSpot):** The workflow fetches the primary Invoice object. It uses a series of HTTP Request and Splitter nodes to parallelly retrieve associated Line Items, Contacts, the main Company, the Deal, Discounts, Taxes, and the Deal Owner. Further lookups extract specific associated companies like the Broker, Agency, and Invoice Recipient.
4. **Data Validation & Formatting:** Data from all HubSpot GET requests funnel into the `invoice_data_merge` node.
5. **Payload Construction:** The `content_payload` Code node takes the merged data, categorizes line items (Radio Spots, Digital Spots, etc.), calculates total discounts, and processes taxes. Crucially, it negates amounts for the cancellation invoice format.
6. **Table Generation:** The `generate_pandadoc_tables` Code node formats the financial numbers into Swiss formats (e.g., 1'234.56) and builds the exact JSON table structures required by the PandaDoc template.
7. **Conditional Logic & Payload Finalization:** The `invoiceTypeSwitch` evaluates what type of invoice payload to pass forward, followed by `pandadoc_paylod_invoice` compiling the final PandaDoc request body containing tokens and tables.
8. **External System Calls (PandaDoc Creation):** The payload is sent to PandaDoc to create the document. The workflow then polls the PandaDoc document status.
9. **Document Processing Loop:** The `invoiceStatusSwitch` checks if the document is still a draft. If so, it waits and retrieves document infos, prepares image payloads, and updates the document until it is ready.
10. **Finalization & Document Fetching:** Once ready, the document status is changed to completed/sent, and the generated PDF is downloaded to the n8n instance.
11. **Data Update (HubSpot):** The downloaded file is uploaded via multipart-form-data to the HubSpot Files API. Finally, the target HubSpot Invoice is patched with the resulting `invoice_cancellation_doc_url`.
12. **Webhook Response:** The workflow gracefully ends by returning a `{ "status": true }` response to the original webhook caller.

# Branch Execution Details

*   **invoiceTypeSwitch Node:**
    *   **Condition:** Checks if `invoiceId` exists, if `create_commission_invoice` is true, or if `create_brutto_invoice` is true.
    *   **Execution:** Determines which specific metadata parameters are required for the PandaDoc payload. All paths converge into generating the PandaDoc payload.
*   **invoiceStatusSwitch Node:**
    *   **Condition:** Checks the status returned by the PandaDoc polling node.
    *   **Draft Path:** If status equals `document.draft`, it routes to fetch document info, updates the document details, and eventually progresses to document state change.
    *   **Error Path:** If status equals `document.error`, it hits the `error_pandadoc_create_status` node which halts execution and logs the error.
    *   **Extra/Fallback Path:** Routes back to the Wait node to continue polling the PandaDoc API.

# External Operations

*   **HubSpot API Calls:**
    *   **GET:** Retrieves Invoice, Contact, Company, Line Items Search (POST), Deal, Deal Owner, specific Associations (Primary, Broker, Agency, Recipient), Discounts, and Taxes.
    *   **POST:** Uploads binary file to the `/v3/files` endpoint.
    *   **PATCH:** Updates the Invoice object at `/v3/objects/invoices/{id}` with the newly uploaded file URL.
*   **PandaDoc API Calls:**
    *   **POST:** Creates a new document at `/public/v1/documents`.
    *   **GET:** Polls document status and retrieves document details.
    *   **PATCH:** Updates document payload data and updates document status (e.g., changing status to "2" to complete the document).
    *   **GET (Download):** Downloads the generated document payload as a binary PDF.

# Subworkflows Used

*   **Workflow Name:** Error Notification / Handling (inferred)
*   **Workflow ID:** `Bu0X3AXE7asHOIpX`
*   **Purpose:** Acts as the designated error workflow natively triggered by n8n if this main workflow fails unexpectedly.
*   **Inputs:** Receives default n8n error execution data payload.

# Database Collections

*   No direct internal databases (like MongoDB or SQL) are utilized in this workflow. All data is handled in-memory and synced between the HubSpot CRM and PandaDoc platforms.

# Security Notes

*   **Hardcoded Credentials Detected:** The Code node named "Global variables" contains hardcoded sensitive tokens including `PANDADOC_API_KEY`, `PANDADOC_API_KEY_SANDBOX`, and `HS_TOKEN`. This poses a significant security risk. These should be moved to n8n's secure internal credential management system.
*   **Public URLs:** Uploaded files to HubSpot are set with `"access": "PUBLIC_NOT_INDEXABLE"`, meaning they are publicly accessible via direct link but hidden from search engines.

# Known Limitations / Risks

*   **Hardcoded Secrets:** As mentioned above, hardcoded tokens will break the workflow immediately if the tokens expire or are rotated in the source systems.
*   **Polling Timeout Risk:** The PandaDoc status check uses a fixed Wait node. If PandaDoc experiences heavy latency during generation, the polling cycle could exceed typical webhook timeout windows.
*   **API Rate Limiting:** The workflow makes a very large volume of rapid sequential HTTP requests to the HubSpot CRM API to fetch relational data. Without a batch-fetch strategy or a delay queue, running this workflow concurrently for multiple invoices could easily trigger HubSpot API rate limits (HTTP 429).
*   **Fragile Mapping Logic:** Table and block mappings in the JavaScript code rely on hardcoded template UUIDs (`zmpZ3tjJtBEMEuk3S54b34`) and Content Library Item IDs. If the PandaDoc template is recreated or updated, the workflow code must be manually adjusted.

# Final Outputs

Upon successful execution, the workflow generates a meticulously calculated Cancellation Invoice PDF via PandaDoc. This PDF is uploaded to HubSpot's file manager, and the targeted HubSpot Invoice record is updated with a direct link to the newly minted cancellation document. The invoking system is notified of success via a JSON `{ "status": true }` webhook response.