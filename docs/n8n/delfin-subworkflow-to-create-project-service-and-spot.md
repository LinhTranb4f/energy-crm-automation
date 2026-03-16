---
title: 'Delfin | Subworkflow to create project, service and spot'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623575
---

# Summary

*   Workflow URL: [https://n8n.tools.energy/workflow/hC4xq5uVOCFX1f0w](https://n8n.tools.energy/workflow/hC4xq5uVOCFX1f0w)
*   Workflow ID: hC4xq5uVOCFX1f0w
*   Workflow Name: Delfin | Subworkflow to create project, service and spot
*   Status: Active

# Purpose

The primary business goal of this workflow is to automate the creation and association of dependent CRM records in HubSpot. Specifically, it uses a triggering Deal to generate a custom Project record, a Radio Spots Service record, and multiple Spot objects, ensuring that all financial and operational data is linked correctly to the Deal and Company.

# Status and Runtime Controls

*   Timeout: Not explicitly configured (default behavior).
*   Retry behavior: Enabled for HTTP API nodes (Retry on fail: true, Wait between tries: 5000ms).
*   Error workflow: Triggers workflow ID `Bu0X3AXE7asHOIpX` upon unhandled failures.
*   Execution settings: Configured with `v1` execution order and uses `continueErrorOutput` on the Custom Project creation node to handle HTTP errors gracefully rather than immediately crashing.

# Triggers & Entry Points

*   Webhook (Callback create project): Listens for POST requests at `/webhook/callback-create-project-service-and-spot` expecting a `dealID` in the body.
*   Execute Workflow Trigger (When Executed by Another Workflow): Allows parent workflows to trigger this process programmatically by passing the `dealID` in the input JSON.

# Systems & Integrations

*   HubSpot CRM API (v3)
*   n8n Subworkflows
*   Webhooks
*   Internal utilities (Code/JavaScript nodes, Wait operations, Split in Batches loops, IF/Filter conditions)

# Data Inputs & Key Fields

*   Primary input fields: `dealID`.
*   Important properties used in the workflow: `amount`, `deal_currency_code`, `dealname`, `campaign_start`, `campaign_end`, `billing_cycle`, `product_group`, `revenue_stream`, `spot_motive_quantity`, `dealstage`, `disposition_briefing`, `sales_channel`.

# Workflow Logic (Deep Analysis)

1. Initial trigger: A `dealID` is received via Webhook or Subworkflow trigger.
2. Data retrieval: The workflow executes a Global Variables subworkflow to get configuration IDs, then waits before making an HTTP call to HubSpot to fetch the Deal's properties and associations.
3. Data validation: JavaScript nodes parse the returned Deal payload to extract associated Company IDs. (Note: Contact ID mapping is currently disabled in the flow).
4. Conditional logic: A data mapping node formats the properties and associations required to construct the Project object payload.
5. Branch execution: The workflow makes an HTTP POST request to HubSpot to create the Project. If it fails, the error is caught, parsed by a custom JS node, and written back to the Deal record.
6. External system calls: If the Project succeeds, an IF node validates the existence of Line Item associations on the Deal.
7. Data creation or update: If Line Items are present, the HubSpot Search API fetches their detailed properties. A Filter node restricts processing to items where `product_group` is `radio_spots`. The script combines quantities, prices, and descriptions to push a new Service record to HubSpot.
8. Merge operations: The workflow checks if a `spot_motive_quantity` property exists on the Deal.
9. Final updates: If spots are required, a JavaScript node arrays the configurations. A "Split in Batches" node loops over this array, executing a HubSpot API call to create each individual Spot record sequentially.

# Branch Execution Details

*   If2 (Line Items Check):
    *   Condition logic: Checks if `associations['line items'].results` exists.
    *   TRUE path: Gathers Line Item IDs and calls the HubSpot API to retrieve their extended properties.
    *   FALSE path: Executes an HTTP PATCH to the Deal, writing "No Line items exist" to the `error_message_for_projectservice_records` property.
*   Filter Radio spot line items:
    *   Condition logic: Validates if `properties.product_group` equals `radio_spots`.
    *   TRUE path: Passes the filtered payload to be aggregated and formatted into a Service object.
    *   FALSE path: Discards non-radio spot line items, halting their Service creation.
*   If (Spot Creation Check):
    *   Condition logic: Checks if `spot_motive_quantity` exists on the retrieved Deal.
    *   TRUE path: Generates the Spot payloads and enters the creation loop.
    *   FALSE path: Workflow terminates successfully without creating Spot records.

# External Operations

*   Database usage: All data operations rely purely on HubSpot CRM; no external SQL/NoSQL databases are queried directly.
*   API calls:
    *   GET: HubSpot Deal properties and associations.
    *   POST: Create Custom Project (using dynamic object ID from Global Variables).
    *   PATCH: Update Deal with error messages.
    *   POST: Search Line Items via HubSpot `objects/line_items/search` endpoint.
    *   POST: Create Radio Spots Service (Object 0-162).
    *   POST: Create Spot record (Custom Object 2-196234143).

# Subworkflows Used

*   Workflow name: Global variables
*   Workflow ID: YTKoYUXPDy5OGV16
*   Purpose: Provides centralized environment variables, including pipeline IDs, stage IDs, and association type labels (e.g., deal-to-company types, test record flags).
*   Inputs: None required; outputs global JSON configuration.

# Database Collections

*   This workflow does not interface directly with external database collections (e.g., MongoDB). It uses HubSpot as its primary system of record.

# Security Notes

*   Credentials: Utilizes centralized n8n HTTP Header Auth (`Production | HubSpot | Header Auth to connect private app`).
*   Sensitive operations: Direct creation and linking of financial Service records and Custom Objects inside the CRM.
*   Hardcoded tokens: None detected. API connectivity is securely managed via stored credentials.

# Known Limitations / Risks

*   Unprocessed branches: The 'Get contact id' and 'Get all Spot ID' nodes are present but disabled. Logic referencing Contact associations inside the creation nodes is commented out.
*   Missing error handling: While Project creation has a robust error-catching flow that updates the Deal, the Service and Spot creation HTTP nodes do not catch errors gracefully to notify the Deal if they fail.
*   Race conditions: Fixed Wait nodes are utilized. If the HubSpot API index lags and takes longer than the static wait duration, subsequent lookups or creation associations could fail.
*   Incomplete logic: Custom JavaScript parsing for HubSpot errors relies on exact string splitting (`indexOf(' - ')`). Any unannounced change by HubSpot to their error response schema could crash this parser.

# Final Outputs

The successful execution of this workflow produces up to three distinct CRM layers in HubSpot:

1. A Custom Project Record linked to the Deal and Company.
2. A Service Record (for Radio Spots) aggregating Line Item financials.
3. Multiple Spot Records created in a loop, mapping to the exact quantity specified on the original Deal, all cross-associated for CRM reporting.