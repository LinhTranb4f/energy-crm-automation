---
title: 'Admin - List Executions'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623795
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/6NGzuv6DR2Y5n2TT](https://n8n.tools.energy/workflow/6NGzuv6DR2Y5n2TT)
Workflow ID: 6NGzuv6DR2Y5n2TT
Workflow Name: Admin - List Executions
Status: Active

# Purpose

The primary business goal of this workflow is to provide an administrative API endpoint that lists and filters workflow executions stored in a MongoDB database. It allows external systems, administrative dashboards, or other integrations to query execution logs with built-in pagination, workflow ID filtering, and status filtering.

# Status and Runtime Controls

*   Execution settings: Execution Order v1 is active.
*   Timeout: Not explicitly defined (relies on system default).
*   Retry behavior: Not configured.
*   Error workflow: No global or node-level error workflows are configured.

# Triggers & Entry Points

*   Webhook Node (Admin-List-Executions): Listens on the path `admin-list-executions`. It is set to `responseNode` mode, meaning it holds the HTTP connection open until the execution completes and relies on a specific downstream node to issue the HTTP response.

# Systems & Integrations

*   Webhooks (n8n Webhook Engine)
*   MongoDB (using system credentials)
*   Internal utilities (Custom JavaScript Code Node)

# Data Inputs & Key Fields

The workflow actively processes and validates query parameters from the incoming webhook URL:

*   `limit`: Determines the maximum number of records to return. Defaults to 20, and is safely capped at 100.
*   `page`: Determines the pagination offset. Defaults to 1.
*   `workflowId`: An optional query parameter used to filter logs for a specific workflow.
*   `status`: An optional query parameter used to filter logs by execution status (e.g., success, error).

# Workflow Logic (Deep Analysis)

1. Initial trigger: The sequence begins when an external client makes an HTTP request to the `admin-list-executions` webhook.
2. Data validation: Within the MongoDB node, inline math operations validate and safely parse the query parameters. The `limit` is mathematically constrained to a maximum of 100 to prevent excessively large database requests, and the `skip` logic calculates the offset strictly enforcing a minimum value of 0 based on the provided `page`.
3. Data retrieval: Execution passes to the "MongoDB Find" node, which connects to the database via stored credentials. It builds a dynamic JSON query incorporating the `workflowId` and `status` only if they exist in the webhook input. It queries the `n8n_executions` collection, applies the pagination parameters, and sorts the resulting logs by `startTime` in descending order.
4. Merge operations & Data Formatting: The "Format Response" code node receives the raw array of database documents. It executes custom JavaScript to map over the array, isolating the core `.json` payload of each item. It wraps the cleaned array into a single payload alongside a `total` field representing the count of retrieved items.
5. Final updates: The "Respond to Webhook" node takes the formatted JSON object and returns it to the original caller as a structured HTTP response.

# Branch Execution Details

This workflow is completely linear. There are no IF/THEN branching nodes or switch conditions implemented. All data flows continuously from the Webhook through to the Response node.

# External Operations

*   Database usage: The workflow performs a strict read operation (Find) against a MongoDB instance.
*   API calls: The workflow functions as a synchronous HTTP API endpoint, handling inbound requests and serving outbound JSON responses.

# Subworkflows Used

There are no subworkflows triggered within this architecture.

# Database Collections

*   `n8n_executions`: This collection is queried to retrieve the historical records of workflow execution logs and metadata.

# Security Notes

*   Credentials: The MongoDB connection uses referenced credentials named "MongoDB Energy" (ID: DvhNAsGpXjnr2mJt). No raw passwords or sensitive tokens are hardcoded within the workflow parameters.
*   Access Control: The webhook configuration does not dictate specific authentication rules within the provided JSON, meaning the endpoint relies on standard n8n network accessibility or external reverse proxies for security.

# Known Limitations / Risks

*   Missing error handling: There are no explicit "Catch" or Error Trigger nodes. If the MongoDB connection drops or the search query fails, the request will likely timeout or return an unformatted 500 Internal Server Error to the client.
*   Pagination counting limitation: The `total` count generated in the "Format Response" node is based on `items.length` of the immediate query result. It reflects the number of records returned in the current page, not the absolute total of matching documents in the entire database.

# Final Outputs

When successful, the workflow provides an HTTP response containing a structured JSON object with two keys:

*   `data`: An array of JSON objects containing the retrieved execution logs.
*   `total`: An integer defining the number of logs returned in the current response block.