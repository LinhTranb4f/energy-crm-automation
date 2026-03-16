---
title: 'SAP | Get invoice schedule table'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623435
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/qsnIMUVV3yxcIbK1](https://n8n.tools.energy/workflow/qsnIMUVV3yxcIbK1)
Workflow ID: qsnIMUVV3yxcIbK1
Workflow Name: SAP | Get invoice schedule table
Status: Active

# Purpose

This workflow is designed to retrieve the invoice and payment schedule associated with a specific deal. It acts as an API endpoint that external systems (such as SAP) can call to fetch structured financial scheduling data directly from the internal MongoDB database.

# Status and Runtime Controls

*   Timeout: Not explicitly defined in the settings.
*   Retry behavior: Not configured at the workflow level.
*   Error workflow: Execution errors trigger a dedicated, centralized error workflow (ID: wT0xsVj2O6kGhRfD).
*   Execution settings: Runs on execution order v1. The caller policy is strictly restricted to workflows from the same owner.

# Triggers & Entry Points

*   Webhook: Acts as the primary entry point. It listens on the path `get-invoice-schedule-table` and is configured to hold the connection open until a dedicated response node replies.
*   Manual Trigger ("When clicking ‘Execute workflow’"): An administrative entry point used for manual testing and debugging directly from the n8n interface.

# Systems & Integrations

*   MongoDB (Database)
*   Webhooks (Internal n8n HTTP request/response handling)

# Data Inputs & Key Fields

*   Primary input fields: `deal_id` (passed via the query parameters of the incoming Webhook request, e.g., `?deal_id=378594143466`).
*   Important properties used in the workflow: `$json.query.deal_id` is the dynamic variable utilized to filter the database records.

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow executes when an HTTP request is made to the Webhook URL or when an administrator clicks the execute button in the UI.
2. Data retrieval: The workflow immediately transitions to the "Find documents" node. Using securely stored MongoDB credentials, it prepares to query the database.
3. Data validation: No explicit data validation nodes are present. The workflow assumes the query string contains a valid `deal_id`.
4. Conditional logic: The logic is purely linear; no conditional validation is applied before executing the database query.
5. External system calls: A MongoDB search operation is executed. The node constructs a JSON query searching for records where the `deal_id` matches the input variable. The node is configured to `alwaysOutputData`, meaning execution will continue even if no matching records are found.
6. Final updates: The retrieved database records are passed to the "Respond to Webhook" node. This node sends an HTTP response back to the original caller, outputting `allIncomingItems`, which translates to returning the complete JSON array of the documents found in the database.

# Branch Execution Details

There are no IF/THEN or Switch nodes in this workflow. It follows a single, linear execution path from the trigger to the final response.

# External Operations

*   Database usage: Reads from the MongoDB database using a simple key-value match query on the `deal_id` field.
*   API calls: Receives and responds to inbound HTTP requests via the native Webhook configuration.

# Subworkflows Used

*   Workflow name: Unknown (configured globally as the Error Workflow)
*   Workflow ID: wT0xsVj2O6kGhRfD
*   Purpose: Automatically captures and handles execution failures globally for this workflow.
*   Inputs: Standard n8n error execution payload.

# Database Collections

*   `deal_payment_schedule`: This MongoDB collection stores the payment milestones, financial timelines, and invoice schedules linked to corresponding CRM/SAP deals.

# Security Notes

*   Credentials: Uses securely stored credentials named "MongoDB Energy" (ID: DvhNAsGpXjnr2mJt).
*   Hardcoded tokens: None detected.
*   Sensitive operations: Exposes financial schedule data. Authentication/authorization is not explicitly handled within the workflow nodes, implying security is handled upstream via network rules, headers, or a reverse proxy.

# Known Limitations / Risks

*   Missing error handling: There is no fallback logic or custom error response if the `deal_id` is missing or invalid; it relies entirely on the global error workflow which may lead to generic timeout responses for the caller.
*   Missing input validation: The workflow does not verify if the `deal_id` parameter exists in the webhook query before attempting to query the database.

# Final Outputs

When successful, the workflow produces and returns a JSON payload containing an array of invoice schedule records from the MongoDB database back to the external system that triggered the webhook.