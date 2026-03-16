---
title: 'Sync Executions to MongoDB'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623775
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/RHsPhjHqaNXZ5JXj](https://n8n.tools.energy/workflow/RHsPhjHqaNXZ5JXj)
Workflow ID: RHsPhjHqaNXZ5JXj
Workflow Name: Sync Executions to MongoDB
Status: Active

# Purpose

The primary business goal of this workflow is to retrieve execution logs from n8n and synchronize them into a MongoDB database. This allows for long-term auditing, tracking of workflow states, and searching for specific executions based on linked business reference IDs (such as HubSpot Object IDs, Deal IDs, or Invoice IDs).

# Status and Runtime Controls

*   Timeout: 300 seconds
*   Retry behavior: Standard default (no explicit node-level retries configured)
*   Error workflow: None explicitly defined
*   Execution settings: Execution order is v1, time saved mode is fixed, and caller policy allows workflows from the same owner.

# Triggers & Entry Points

*   Schedule Daily: A cron-based trigger set to run at 23:00 daily (Currently Disabled).
*   Webhook Sync: A POST webhook endpoint (`/sync-executions`) configured to return a response from a specific node at the end of the execution.

# Systems & Integrations

*   N8N API (Internal Execution Data)
*   MongoDB (Database Storage)
*   Webhooks (REST API endpoint for manual/external triggering)

# Data Inputs & Key Fields

*   Primary input fields: `from` (start date), `to` (end date), `workflowId` (optional identifier to filter executions).
*   Important properties used: `hs_object_id`, `objectid`, `dealID`, `invoiceID`, `quoteID`, `serviceID` (extracted from the execution payload to link external systems).

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow is initiated via a POST request to the Webhook Sync node or on a daily schedule (if enabled).
2. Data validation: A Code node explicitly calculates and sets the `from` and `to` date bounds. It defaults to fetching the last 24 hours of executions if no explicit dates are passed in the webhook body or query.
3. Conditional logic: An IF node (`IF workflowId`) checks if a specific `workflowId` was passed in the request.
4. Data retrieval: Depending on the condition, the workflow makes a paginated HTTP Request to the N8N API to fetch either all executions or executions restricted to the specific `workflowId`.
5. Data filtering: A custom Code node (`Return executions in array`) filters the retrieved executions, ensuring their `startedAt` timestamps fall strictly within the computed `from` and `to` ranges.
6. Loop iteration: The workflow uses a Split In Batches node (`Loop Over Pages`) to process each execution sequentially.
7. Database Check: For each execution, it queries MongoDB (`MongoDB Get`) to see if the record already exists based on the execution `id`.
8. Branch execution: An IF node (`Check it is in MongoDB`) checks if the database query returned an empty result.
9. Detailed Data Retrieval: If the record does not exist in MongoDB, it calls the N8N API again to get full execution details (`includeData=true`).
10. Data Transformation: A custom Code node (`Map to Documents`) parses the raw execution payload. It actively extracts any linked reference IDs (like CRM Object IDs) and formats the status, start time, end time, and errors.
11. Data creation or update: The parsed document is upserted into the `n8n_executions` MongoDB collection.
12. Final updates: Once the loop is complete, the workflow ends by responding to the webhook with a JSON payload indicating success and the total number of processed executions.

# Branch Execution Details

**IF workflowId**

*   Condition logic: Checks if the string value of `workflowId` is not empty.
*   TRUE path: Routes to the `Get executions for workflow` HTTP Request node, applying the `workflowId` as a query parameter.
*   FALSE path: Routes to the `Get all executions` HTTP Request node, fetching executions across all workflows.

**Check it is in MongoDB**

*   Condition logic: Evaluates if the output from the `MongoDB Get` node is empty (meaning the execution has not been synchronized yet).
*   TRUE path: Routes to `Get execution by ID` to fetch deep data, map it, and insert it into MongoDB.
*   FALSE path: Routes back to `Loop Over Pages` to skip processing and move to the next iteration.

# External Operations

*   API calls: Makes internal paginated GET requests to `https://n8n.tools.energy/api/v1/executions` using predefined `n8nApi` credentials.
*   Database usage: Interacts with MongoDB using the `mongoDb` credential setup.
*   Object updates: Performs an Upsert operation (Update with `upsert: true`) on MongoDB using the execution `id` as the primary key.

# Subworkflows Used

*   None detected in this workflow.

# Database Collections

*   `n8n_executions`: Used to store a permanent, easily searchable record of n8n execution histories. Fields saved include `id`, `workflowId`, `workflowName`, `status`, `startTime`, `endTime`, `payload`, `error`, `linkedIds`, and `linkedRefs`.

# Security Notes

*   Credentials: Uses managed credentials (`n8nApi` and `MongoDB Energy`). No hardcoded API keys or database connection strings are exposed in the workflow logic.
*   Sensitive operations: The webhook does not appear to have an explicit authentication method configured directly on the node. Ensure the `/sync-executions` endpoint is protected at the network or proxy layer to prevent unauthorized synchronization runs.

# Known Limitations / Risks

*   Timeout limits: The workflow has a strict 300-second timeout. If the time range (`from`/`to`) spans an unexpectedly large number of executions, the nested loop and deep API fetches might cause the execution to time out.
*   Missing error handling: There are no explicit Catch nodes or error triggers attached. If the MongoDB insert fails, the loop might break, causing the webhook to timeout or return a server error without syncing remaining items.
*   API Rate limits: Because `Get execution by ID` is called in a loop for every un-synced execution, running this over a massive historical date range could strain the n8n API.

# Final Outputs

When successfully triggered via webhook, the workflow produces a JSON response structured as `{ success: true, synced: <number_of_items> }` and ensures all relevant n8n execution logs for the specified period are securely mirrored in MongoDB.