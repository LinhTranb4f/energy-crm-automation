---
title: 'Check all the draft invoices which created since 01-March-2026'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-624035
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/kQIPxKh8iUdxk5My](https://n8n.tools.energy/workflow/kQIPxKh8iUdxk5My)
Workflow ID: kQIPxKh8iUdxk5My
Workflow Name: Check all the draft invoices which created since 01-March-2026
Status: Inactive

# Purpose

The primary business goal of this workflow is to manually search for HubSpot draft invoices generated on a specific date (March 1, 2026) for a designated sales channel, and systemically update their stage to flag them as an invoice error.

# Status and Runtime Controls

*   Timeout: No custom workflow timeout limits are defined; relies on platform defaults.
*   Retry behavior: Specific HTTP Request nodes (like the invoice updater) have `retryOnFail` enabled, configured to wait 5000ms between attempts.
*   Error workflow: There is no global or dedicated error trigger workflow configured.
*   Execution settings: The workflow uses the standard `v1` execution order setting.

# Triggers & Entry Points

*   Manual Trigger: The workflow relies entirely on a "When clicking ‘Execute workflow’" node. It requires a user to manually start the execution from the n8n interface.

# Systems & Integrations

*   HubSpot CRM API
*   Internal utilities (n8n native JS Code node)

# Data Inputs & Key Fields

Primary input fields:

*   `hs_createdate` (Hardcoded to filter for March 1, 2026)
*   `sales_channel` (Hardcoded to match "SRW")

Important properties used in the workflow:

*   `hs_invoice_status` (Fetched during the search phase)
*   `invoice_stage` (Updated during the PATCH operation)

# Workflow Logic (Deep Analysis)

1. Initial trigger

The workflow execution begins when a user clicks the manual execution button.

2. Data retrieval

The execution moves to the "Get all yesterday invoices" HTTP Request node. This node sends a POST request to the HubSpot CRM API (`/crm/v3/objects/invoices/search`). It filters specifically for invoices where `hs_createdate` is between `2026-03-01T00:00:00Z` and `2026-03-01T23:59:59Z` and the `sales_channel` is exactly "SRW". It retrieves a maximum of 200 records.

3. Data validation & transformation

The retrieved data is passed to a Custom Code node named "Return all invoices". This node runs a JavaScript snippet (`const invoices = $input.first().json.results; return invoices;`) to extract the nested `results` array of invoices from HubSpot's standard response format, returning them as individual manageable items for the next node.

4. Final updates

The workflow ends at the "Update invoice 1710" node. It iterates through the individual invoice items passed from the code node and makes a PATCH request to the HubSpot API (`/crm/v3/objects/invoices/{{ $json.id }}`). It targets the specific invoice ID and updates the `invoice_stage` property to `invoice_error`.

(Note: The workspace contains several disconnected nodes including "Convert to File", "Get invoice properties", and "Get all 28-02-2026 invoices". Since they are not connected to the trigger path, they are ignored during execution.)

# Branch Execution Details

There are no conditional IF/THEN nodes in this workflow. Execution follows a strict linear path from start to finish.

# External Operations

*   Database usage: No direct database connections or queries are executed.
*   API calls: Executes internal POST requests to HubSpot for querying data and PATCH requests for updating records.
*   Object creation: No new records are created.
*   Object updates: Modifies existing HubSpot Invoice objects by mutating the `invoice_stage` property.

# Subworkflows Used

None.

# Database Collections

Not applicable. No direct database interactions exist in this flow.

# Security Notes

*   Credentials: The workflow securely utilizes predefined n8n credentials (`Production | HubSpot | Header Auth to connect private app` and `N8N Invoice Scope`).
*   Hardcoded tokens: No sensitive authentication tokens or plaintext passwords are leaked or hardcoded within the node parameters or JSON bodies.

# Known Limitations / Risks

*   Hardcoded Variables: The search queries rely entirely on strictly hardcoded date strings. This means the workflow is not dynamically evaluating "yesterday" and will only ever process March 1, 2026, unless manually edited.
*   Unprocessed branches/Orphaned Nodes: The workflow canvas contains unused nodes that are completely disconnected from the main thread, which can cause confusion for developers attempting to maintain the flow.
*   Missing error handling: If the final HubSpot update fails continuously (beyond the node's built-in retry parameter), the workflow will crash without notifying the administrative team.

# Final Outputs

When successfully executed, the workflow produces updated HubSpot invoice records. Specifically, any SRW channel invoice created on March 1, 2026, will have its `invoice_stage` successfully changed to `invoice_error`.