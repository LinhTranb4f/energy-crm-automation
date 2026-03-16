---
title: 'Production | SAP | Payload Archiving'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623315
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/3CelCQe0w4sLGMAB](https://n8n.tools.energy/workflow/3CelCQe0w4sLGMAB)
**Workflow ID:** 3CelCQe0w4sLGMAB
**Workflow Name:** Production | SAP | Payload Archiving
**Status:** Active

# Purpose

The primary business goal of this workflow is to reliably archive incoming SAP transaction payloads (both requests and responses) and accurately update the corresponding Invoice records in HubSpot. It ensures that sales and finance teams can view the real-time success or error status of invoice creations, commissions, and cancellations directly within the HubSpot CRM.

# Status and Runtime Controls

*   **Timeout:** Not explicitly defined in the execution settings.
*   **Retry behavior:** No node-level retry policies are configured.
*   **Error workflow:** Executions that fail will automatically trigger the designated error workflow ID `Bu0X3AXE7asHOIpX`.
*   **Execution settings:** Time saved mode is set to fixed. Caller policy restricts execution strictly to workflows from the same owner.

# Triggers & Entry Points

*   **Get SAP error (Webhook):** The workflow is triggered by an incoming HTTP POST request to the `/payload-archiving` endpoint. It expects a JSON payload from SAP containing an `invoiceID`, the raw `request` data, the raw `response` data, and the transaction `type`.

# Systems & Integrations

*   **HubSpot CRM API:** Used to update specific Invoice records with payload data and status properties.
*   **MongoDB:** Used for archiving the complete SAP transaction histories.
*   **External APIs:** SAP (Implicitly, as the sender of the webhook payload).
*   **Webhooks:** N8N webhook node acts as the entry point.
*   **Internal utilities:** Custom JavaScript Code nodes are used for data parsing, logical evaluation, and payload formatting.

# Data Inputs & Key Fields

*   **Primary input fields:**
    *   `invoiceID`: The unique identifier for the HubSpot invoice.
    *   `request`: The raw JSON string of the request sent to SAP.
    *   `response`: The raw JSON string of the response received from SAP.
    *   `type`: The type of SAP transaction (e.g., "storno", "invoice", "commission").
*   **Important properties used in the workflow:**
    *   HubSpot Properties: `cancel_payload`, `sap_payload`, `invoice_cancel_status`, `invoice_send_status`, `invoice_commission_status`, `invoice_reccord_sap_status`, `invoice_stage`, `invoice_cancellation_date`.

# Workflow Logic (Deep Analysis)

1. **Initial trigger:** The workflow initiates when a POST payload hits the "Get SAP error" webhook node.
2. **Conditional logic:** An IF node evaluates the transaction `type` provided in the webhook payload to check if the process is a cancellation ("storno").
3. **Branch execution:** Depending on the IF condition, an HTTP PATCH request is made to the HubSpot API to update either the `cancel_payload` or `sap_payload` property on the Invoice.
4. **Data validation & Merge operations:** Both branches converge into a Code node named "Return data for store error in HubSpot". This node parses the raw SAP `response` JSON and iterates through the `RETURN` array to categorize messages into `errors` (Type "E") and `successes` (Type "S").
5. **Data preparation:** Inside the same Code node, logic dynamically prepares a HubSpot properties payload. It maps the transaction type to specific HubSpot properties and assigns values based on whether errors were found. It handles status changes, updates the `invoice_stage` to "invoice\_error" if needed, and sets the cancellation date for stornos.
6. **External system calls (Status Update):** A second HTTP PATCH request ("Update error code to invoice") sends these calculated status properties to update the HubSpot Invoice.
7. **Data preparation (Archiving):** The next Code node ("Return data for MongoDB") extracts the initial `request` and `response` and generates an ISO timestamp (`created_at`).
8. **Final updates:** The "Insert documents" MongoDB node writes the newly formatted payload into the database for long-term storage.

# Branch Execution Details

*   **If Node (Check Transaction Type):**
    *   **Condition logic:** Evaluates if the incoming JSON body property `type` exactly equals the string "storno".
    *   **TRUE path:** Executed if `type` is "storno". It triggers the "Update payload to invoice" node, which patches the HubSpot Invoice's `cancel_payload` property using the SAP request data.
    *   **FALSE path:** Executed if `type` is anything else (e.g., "invoice", "commission"). It triggers the "Update payload to invoice1" node, which patches the HubSpot Invoice's `sap_payload` property using the SAP request data.

# External Operations

*   **API calls:**
    *   HubSpot CRM API: Executes HTTP PATCH requests targeting `/crm/v3/objects/invoices/{{invoiceID}}`. Authentication is handled via a predefined Hubspot App Token and Header Auth.
*   **Database usage:**
    *   MongoDB: Executes an insert operation into the database using the "MongoDB Energy" credentials.
*   **Object updates:** Updates specific standard and custom properties on HubSpot Invoice objects.

# Subworkflows Used

*   **Workflow Name:** Unnamed globally, specified by ID in settings.
*   **Workflow ID:** `Bu0X3AXE7asHOIpX`
*   **Purpose:** Functions as the global Error Workflow. It catches and processes any critical execution failures that occur within this workflow.
*   **Inputs:** Inherits the execution failure context from n8n natively.

# Database Collections

*   **SAPTransactionLogs:** This MongoDB collection is used to maintain an immutable, long-term archive of all SAP interactions. It stores the `request`, `response`, and a `created_at` timestamp. This allows engineers and operations teams to audit transactions and troubleshoot API discrepancies independently of the CRM.

# Security Notes

*   **Credentials:** Secure credential objects are used correctly (e.g., `Production | HubSpot | Header Auth to connect private app`, `N8N Invoice Scope`, and `MongoDB Energy`). No hardcoded tokens are visible in the HTTP nodes.
*   **Sensitive operations:** The workflow handles raw financial data, including invoice amounts and banking information (IBANs). This data is passed directly into HubSpot and MongoDB.

# Known Limitations / Risks

*   **Missing error handling:** There are no `Continue On Fail` parameters set on the HTTP Request nodes. If the HubSpot API experiences downtime or rate-limiting, the node will fail, halting the entire workflow before it reaches the MongoDB archiving step.
*   **Data Parsing Risks:** The Code node parsing the SAP response (`JSON.parse(data.response)`) assumes the response is always a valid stringified JSON. If SAP returns an HTML error page or an empty body due to a critical network error, this node will throw a JavaScript execution exception.

# Final Outputs

When successfully executed, the workflow produces:

1. An updated HubSpot Invoice record containing the raw SAP payload in the appropriate property (`cancel_payload` or `sap_payload`).
2. An updated HubSpot Invoice record reflecting the detailed success/error messages parsed from SAP, along with adjusted status properties and lifecycle stages.
3. A new document inserted into the `SAPTransactionLogs` MongoDB collection with the complete API context and timestamp.