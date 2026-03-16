---
title: 'Admin - List Workflows'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623935
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/PbgUnlXpoemIpaPF](https://n8n.tools.energy/workflow/PbgUnlXpoemIpaPF)
Workflow ID: PbgUnlXpoemIpaPF
Workflow Name: Admin - List Workflows
Status: Active

# Purpose

This workflow serves as an internal administrative API endpoint. Its primary goal is to query a MongoDB database for all stored workflow configurations, format the retrieved data into a standardized structure, and return it to the requester via a synchronous HTTP response.

# Status and Runtime Controls

*   Execution settings: Configured with standard v1 execution order.
*   Timeout: No specific timeout logic is configured in the settings.
*   Retry behavior: No automated retry logic is defined for node failures.
*   Error workflow: No global error handling or fallback workflow is designated to catch execution failures.

# Triggers & Entry Points

*   Webhook Node: Triggers the execution when an HTTP request is made to the path `admin-list-workflows`. It is specifically configured with `responseMode` set to `responseNode`, meaning it will keep the HTTP connection open until a downstream node explicitly sends the response back to the client.

# Systems & Integrations

*   n8n Webhook System
*   MongoDB (Via stored credentials: `MongoDB Energy`)
*   Internal Utilities (Custom JavaScript Code execution)

# Data Inputs & Key Fields

*   Primary input fields: No incoming request body or query parameters are required to trigger the flow.
*   Important properties used: The workflow utilizes a MongoDB sorting configuration `{"name": 1}` to organize the database output alphabetically.

# Workflow Logic (Deep Analysis)

1. Initial trigger: The "Webhook" node actively listens for incoming HTTP requests on the `admin-list-workflows` path.
2. Data retrieval: Upon receiving a request, execution moves to the "MongoDB Find" node. This node connects to the database using the `MongoDB Energy` credentials and queries all documents from the `n8n_workflows` collection, sorting the results alphabetically by the `name` field.
3. Data validation: The workflow assumes the database response is valid; no explicit validation checks are performed on the returned data.
4. Conditional logic: Execution is strictly linear with no conditional logic utilized.
5. Branch execution: All operations proceed sequentially on a single main path.
6. External system calls: A single external read call is made to the MongoDB database instance.
7. Data creation or update: No data modification occurs; this is strictly a read-only data extraction process.
8. Merge operations: No data branching or merging occurs in this sequence.
9. Final updates: The database output is passed into a custom Code node named "Format list". This node executes a brief JavaScript snippet (`return [{ json: { data: $input.all().map(i => i.json) } }];`) to map through all retrieved items, stripping metadata and nesting the raw data into a clean array stored under a parent `data` key.
10. Response Generation: The "Respond to Webhook" node captures the formatted payload and returns it as a structured JSON response back to the originating client, effectively closing the HTTP loop.

# Branch Execution Details

No IF/THEN nodes or conditional branches are present in this linear workflow.

# External Operations

*   Database usage: Executes a 'Find' operation to retrieve documents from MongoDB.
*   API calls: Receives and responds to an incoming webhook; makes no outbound HTTP API requests.
*   Object creation: None.
*   Object updates: None.

# Subworkflows Used

No subworkflows are used in this configuration.

# Database Collections

*   `n8n_workflows`: This collection is queried to retrieve the full list of saved workflow documents and configurations stored by the system.

# Security Notes

*   Credentials: The workflow safely utilizes stored credentials (`MongoDB Energy` - ID: DvhNAsGpXjnr2mJt) to interact with the database.
*   Sensitive operations: Exposes internal workflow configurations and potentially sensitive logic metadata.
*   Authentication: The Webhook node configuration does not indicate explicit internal authentication routing, implying that access control must be managed externally (e.g., via an API gateway or reverse proxy).

# Known Limitations / Risks

*   Missing error handling: If the MongoDB query fails due to connectivity issues, the webhook might timeout or return a generic 500 error instead of a handled, user-friendly failure message.
*   Unpaginated query: The "MongoDB Find" node retrieves all documents without pagination or hard limits. If the `n8n_workflows` collection grows significantly large, this could result in high memory consumption and slow endpoint response times.

# Final Outputs

Upon successful execution, the workflow outputs a synchronous HTTP response structured as JSON. The payload consists of a single `data` object containing an alphabetically sorted array of all workflow configurations retrieved from the MongoDB collection.