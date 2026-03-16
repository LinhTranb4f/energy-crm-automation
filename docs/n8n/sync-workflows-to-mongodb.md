---
title: 'Sync Workflows to MongoDB'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623755
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/vr3PLRtgcYIkLXGD](https://n8n.tools.energy/workflow/vr3PLRtgcYIkLXGD)
Workflow ID: vr3PLRtgcYIkLXGD
Workflow Name: Sync Workflows to MongoDB
Status: Active

# Purpose

The primary business goal of this workflow is to synchronize specific n8n workflow definitions and their daily execution logs into a MongoDB database. This acts as an automated backup and audit trail, allowing the business to query execution histories, track errors, and map execution payloads to external reference IDs (such as HubSpot objects or deals).

# Status and Runtime Controls

*   Timeout: 300 seconds
*   Retry behavior: Standard node-level execution (no specific retry configured)
*   Error workflow: None defined
*   Execution settings: Execution Order v1, Time Saved Mode fixed, Caller Policy restricted to workflows from same owner.

# Triggers & Entry Points

*   Webhook Node (admin-refresh-workflows): A POST HTTP webhook that acts as a manual trigger to immediately refresh the saved workflows in the database.
*   Schedule Daily Node: A time-based trigger set to run automatically every day at 23:00 (11:00 PM).

# Systems & Integrations

*   n8n API (Internal node and HTTP Request nodes)
*   MongoDB
*   Webhooks

# Data Inputs & Key Fields

*   Primary input fields: Workflows tagged with "BACKUP-MONGODB"
*   Key workflow properties: id, name, active, updatedAt
*   Key execution properties: id, workflowId, workflowName, status, startTime, endTime, payload, error
*   Important Reference IDs Extracted: hs\_object\_id, objectid, dealID, invoiceID, quoteID, serviceID

# Workflow Logic (Deep Analysis)

This workflow consists of two main operational flows based on the trigger:

Flow 1: Workflow Definition Sync (Webhook Trigger)

1. Initial trigger: The webhook receives a POST request.
2. Data deletion: Deletes all existing documents in the n8n\_workflows MongoDB collection to prepare for a fresh sync.
3. Data retrieval: Fetches all n8n workflows that have the "BACKUP-MONGODB" tag.
4. Data validation and mapping: A code node filters out archived workflows and formats the data to extract the workflow ID, name, status, and last updated timestamp.
5. Data creation: Inserts the formatted workflow definitions into the MongoDB collection.
6. Final updates: Responds to the triggering webhook with a JSON success payload indicating the number of synced workflows.

Flow 2: Execution Log Sync (Schedule Trigger)

1. Initial trigger: Runs daily at 23:00.
2. Data retrieval: Fetches the list of workflows tagged with "BACKUP-MONGODB" and maps their IDs and names.
3. Loop logic (Outer): Iterates through each fetched workflow using a Split In Batches node.
4. External API call: For each workflow, it calls the n8n API to retrieve a paginated list of its executions.
5. Data validation: Filters the execution list to only include executions that started within the last 24 hours.
6. Loop logic (Inner): Iterates through the filtered list of daily executions using a second Split In Batches node.
7. Database query: Queries MongoDB to check if the current execution ID has already been saved.
8. Conditional logic: Checks the database query result via an IF node.
9. Branch execution (If new): If the execution is missing in the database, it makes an HTTP request to fetch the full execution details (including payload data), maps the complex JSON to extract referenced business IDs, and upserts the record into the n8n\_executions collection.
10. Loop continuation: Both paths return to the inner loop until all executions are processed, then return to the outer loop to process the next workflow.

# Branch Execution Details

IF Node: Check it is in MongoDB

*   Condition logic: Evaluates if the result from the previous MongoDB Get operation is empty.
*   TRUE path: The execution does not exist in the database. The workflow fetches the full execution data via API, extracts specific linked reference keys (like dealID or hs\_object\_id), formats the payload, and upserts it into MongoDB. After upserting, it loops back to process the next item.
*   FALSE path: The execution already exists in the database. The workflow skips the API call and database insertion, looping back immediately to the next execution record.
*   Nodes executed in TRUE path: Get execution by ID, Map to Documents2, MongoDB Insert execution.
*   Nodes executed in FALSE path: None (returns directly to Loop Over Pages).

# External Operations

*   Database usage: MongoDB is used heavily for CRUD operations (Delete, Insert, Query, and Upsert).
*   API calls: The n8n API is queried via standard HTTP Request nodes to fetch paginated execution lists and deep execution payloads.
*   Object creation: Bulk inserts workflow definitions into the n8n\_workflows collection.
*   Object updates: Upserts specific execution records into the n8n\_executions collection.

# Subworkflows Used

*   No subworkflows are configured in this automation.

# Database Collections

*   n8n\_workflows: Used to store a mirror of active n8n workflows that require backup.
*   n8n\_executions: Used to store detailed, parsed execution logs, associating technical runs with actual business entity IDs for easier debugging and auditing.

# Security Notes

*   Credentials: The workflow safely utilizes stored credentials for MongoDB ("MongoDB Energy") and the n8n API ("N8N itself").
*   Hardcoded tokens: None detected. Environment parameters and internal reference IDs are utilized securely.
*   Sensitive operations: The Webhook trigger performs a destructive action (MongoDB Delete Workflows). Since there are no visible authentication checks on the Webhook node itself within this payload, an exposed webhook URL could allow unauthorized deletion of the workflow backup collection.

# Known Limitations / Risks

*   Unprocessed branches: A node named "MongoDB Delete Executions" exists in the JSON data but is completely disconnected from the active path. It acts as an orphaned utility.
*   Missing error handling: There are no explicit Error Trigger nodes or Continue On Fail settings for the API calls. If the n8n API rate-limits the HTTP requests inside the nested loops, the workflow execution will fail and halt processing for the remaining records.
*   Execution Timeout Risk: The workflow timeout is strictly set to 300 seconds. If there is an extraordinarily high volume of executions within the past 24 hours, the nested loops and individual API calls might exceed this 5-minute limit and fail.

# Final Outputs

When run via the webhook, the workflow successfully outputs a fresh copy of tracked workflow definitions in MongoDB and returns a JSON response to the caller. When run via the scheduled trigger, the workflow outputs updated historical logs into the n8n\_executions MongoDB collection, containing parsed error states, contextual payloads, and relational IDs (e.g., HubSpot IDs) for the past day.