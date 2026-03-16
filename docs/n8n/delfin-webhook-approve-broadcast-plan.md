---
title: 'Delfin | Webhook Approve Broadcast Plan'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623515
---

# Summary

**Workflow URL**: [https://n8n.tools.energy/workflow/nuaGKpcOav5I0ZC5](https://n8n.tools.energy/workflow/nuaGKpcOav5I0ZC5)
**Workflow ID**: nuaGKpcOav5I0ZC5
**Workflow Name**: Delfin | Webhook Approve Broadcast Plan
**Status**: Active

# Purpose

This workflow automates the status update of custom Project records in HubSpot following a broadcast plan approval. It streamlines the transition from the planning phase to the execution phase by ensuring HubSpot reflects the real-time approval state triggered from an external system.

# Status and Runtime Controls

*   **Timeout**: Standard execution time limit (no specific timeout configured).
*   **Retry behavior**: The HubSpot API requests are configured to retry on failure with a 2000ms wait between attempts.
*   **Error workflow**: Configured to trigger workflow ID `Bu0X3AXE7asHOIpX` upon critical errors.
*   **Execution settings**: Execution order is set to `v1`. The HTTP node "HS - Get Project" is configured to continue on error (`continueErrorOutput`) to allow manual error handling and routing to failure responses.

# Triggers & Entry Points

**Webhook Trigger**
The workflow initiates via a POST HTTP request to the path `approve-broadcast-plan`. It is configured to respond back to the caller using a Response Node, allowing synchronous feedback to the requesting system (HubSpot).

# Systems & Integrations

*   HubSpot CRM API (Interacts with custom object `2-194493711`)
*   n8n Incoming Webhooks

# Data Inputs & Key Fields

*   **Primary input fields**: `projectID` (Received as a number in the webhook body payload).
*   **Important properties used**: `project_name`, `campaign_start`, `campaign_end`, `broadcast_plan_approval_status`, `hs_pipeline_stage`.

# Workflow Logic (Deep Analysis)

1. **Initial trigger**: The workflow receives a POST request containing the target `projectID`.
2. **Data validation**: The "Input Validate" node verifies that the provided `projectID` is not empty.
3. **Data retrieval**: The "HS - Get Project" node queries the HubSpot API to fetch the specific project properties and associations based on the provided ID.
4. **Conditional logic**: The "If Project Exists" node validates if the HubSpot API returned a valid JSON object containing an `id` field.
5. **External system calls**: If the project exists, the "HS - Update Project" node sends a PATCH request back to HubSpot.
6. **Data update**: The PATCH request updates the `broadcast_plan_approval_status` property directly to "Approved".
7. **Final updates**: A Webhook Response node returns either a JSON success message or a failure payload with an HTTP 400 status code, depending on the execution path taken.

# Branch Execution Details

**Input Validate (IF Node)**

*   **Condition logic**: Evaluates if `{{ $json.body.projectID }}` is not empty.
*   **TRUE path**: Proceeds to retrieve the project data from HubSpot via the "HS - Get Project" node.
*   **FALSE path**: Routes to the "Failure Response" node to return an HTTP 400 error.

**If Project Exists (IF Node)**

*   **Condition logic**: Evaluates if the returned `$json` is an object AND if `$json.id` is not empty.
*   **TRUE path**: Proceeds to the "HS - Update Project" node to apply the approval status.
*   **FALSE path**: Routes to the "Failure Response" node to return an error message to the webhook caller.

# External Operations

**HubSpot CRM API**

*   **API calls**:
    *   GET request to `https://api.hubapi.com/crm/v3/objects/2-194493711/{{ $json.body.projectID }}` to retrieve existing project details.
    *   PATCH request to `https://api.hubapi.com/crm/v3/objects/2-194493711/{{ $json.id }}` to apply updates.
*   **Object updates**: Modifies the `broadcast_plan_approval_status` property of the target custom object to strictly equal "Approved".

# Subworkflows Used

No subworkflows are directly triggered within the executable nodes of this workflow sequence.

# Database Collections

No internal database collections are used directly in this workflow.

# Security Notes

*   The workflow safely utilizes a secure credential store (`Production | HubSpot | Header Auth to connect private app` / ID: `SmSUyv0Pf8gThTzV`) rather than hardcoding API keys in the HTTP requests.
*   Input validation is strictly performed before any external API execution occurs, preventing malformed requests to HubSpot.

# Known Limitations / Risks

*   **Type strictness**: The `projectID` is validated strictly as a number type. If the source system accidentally sends it as a string, the input validation will fail and route to the error response.
*   **Missing error handling details**: While "HS - Get Project" is set to continue on error, unhandled 500 errors from HubSpot in the "HS - Update Project" node could cause the webhook to time out rather than returning a clean "Failure Response" if not properly caught by the global error workflow.

# Final Outputs

Upon successful execution, the workflow updates the targeted record in HubSpot and returns a synchronous JSON response to the triggering system:
`{ "success": true, "message": "Approval status updated." }`

In case of missing inputs or if the project lookup fails, it safely halts execution and returns:
`{ "success": false, "message": "Oops, something went wrong!" }`