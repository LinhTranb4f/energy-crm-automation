---
title: 'Admin - Get Execution Detail'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623695
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/PKXWOmCIMAnDKIo0](https://n8n.tools.energy/workflow/PKXWOmCIMAnDKIo0)
**Workflow ID:** PKXWOmCIMAnDKIo0
**Workflow Name:** Admin - Get Execution Detail
**Status:** Active

# Purpose

This workflow serves as an internal administrative utility. Its primary business goal is to dynamically retrieve the full execution details and logs of a specific workflow run using the n8n REST API, and instantly return this comprehensive data back to the requesting application or service via an HTTP response.

# Status and Runtime Controls

**Status:** Active
**Execution Order Settings:** Evaluates using standard v1 execution order.
**Timeout:** No explicit timeout limits are configured in the workflow data.
**Retry Behavior:** Default system retry policies apply; no explicit node-level retries are defined.
**Error Workflow:** No dedicated error trigger or fallback workflow is connected to catch exceptions.

# Triggers & Entry Points

**Webhook Node (admin-get-execution-detail)**
The workflow is initiated by a POST request sent to the `/webhook/admin-get-execution-detail` endpoint. This webhook is uniquely configured in `responseNode` mode, meaning it will hold the HTTP connection open until a designated response node later in the workflow sends data back to the client.

# Systems & Integrations

The following systems are utilized within this workflow:

*   n8n Webhook Engine (Acts as the entry point and response handler)
*   n8n Internal REST API (External API called via HTTP Request to fetch execution data)

# Data Inputs & Key Fields

The workflow expects a JSON payload in the incoming webhook request. Based on the provided test/pin data, the critical input fields include:

*   `executionId`: The unique identifier of the specific workflow execution to be fetched.
*   `workflowId`: The identifier of the workflow associated with the execution.

# Workflow Logic (Deep Analysis)

The execution follows a strict linear process step-by-step:

1. **Initial Trigger:** The workflow begins when an external application sends a POST HTTP request to the webhook endpoint containing the execution parameters.
2. **Data Retrieval:** Upon receiving the payload, the flow progresses directly to the "Get execution by ID" HTTP Request node.
3. **External System Calls:** The HTTP node dynamically constructs a target URL (`https://n8n.tools.energy/api/v1/executions/{{ $json.body.executionId }}`) injecting the `executionId` from the webhook body. It executes an authenticated GET request to the n8n API and appends the query parameter `includeData=true` to ensure detailed execution history, including node inputs and outputs, is fully returned.
4. **Final Updates:** Once the API data is successfully retrieved, the workflow reaches the "Respond to Webhook" node. This node takes the exact JSON payload retrieved from the n8n API and outputs it as the HTTP response to the original webhook caller, successfully closing the connection.

# Branch Execution Details

This workflow follows a direct, linear execution path. There are no IF nodes, Switch nodes, or conditional routing logic present.

# External Operations

**API Calls:** The workflow performs a single internal GET request to the n8n execution API endpoint.
**Authentication:** The API request is securely authenticated using a predefined n8n API credential profile titled "N8N itself" (Credential ID: QkfYd6rNQ1r8Rh82).

# Subworkflows Used

There are no subworkflows utilized or referenced in this automation.

# Database Collections

There are no database collections (such as MongoDB or PostgreSQL) interacted with directly in this automation.

# Security Notes

*   **Credentials:** The HTTP Request node safely references stored API credentials (`n8nApi`) rather than exposing hardcoded API keys, tokens, or sensitive strings in the workflow structure.
*   **Endpoint Security:** The initial webhook trigger does not explicitly define authentication middleware in its node properties, relying on the platform's standard webhook accessibility.

# Known Limitations / Risks

*   **Missing Error Handling:** If the `executionId` provided in the payload is missing, malformed, or corresponds to a deleted execution, the HTTP Request will fail. Because there is no error catching logic, the workflow will throw an unhandled exception, potentially returning an unstructured timeout or 500 server error to the webhook client.
*   **Missing Data Validation:** There is no conditional logic or validation node to verify that the `executionId` is actually present in the request body before attempting the API call.

# Final Outputs

Upon successful execution, the workflow outputs a comprehensive JSON response containing the complete metadata, logs, and node data of the requested execution. This response is delivered directly back to the external system that originally triggered the webhook.