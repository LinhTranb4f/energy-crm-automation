---
title: '7003 |   Delfin | Event Trigger Delfin for UC-02 | Update Campaign Start & End  date from Delfin to HubSpot'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623835
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/e4E4eBpDZZiBt8iz](https://n8n.tools.energy/workflow/e4E4eBpDZZiBt8iz)
**Workflow ID:** e4E4eBpDZZiBt8iz
**Workflow Name:** 7003 | Delfin | Event Trigger Delfin for UC-02 | Update Campaign Start & End date from Delfin to HubSpot
**Status:** Active

# Purpose

This workflow synchronizes campaign timing directly from the scheduling system (Delfin) to HubSpot. It automates the update of actual Start and End dates of a campaign from Delfin to HubSpot custom/service records (object type 0-162) and maintains an audit trail of synchronization activities via HubSpot logs.

# Status and Runtime Controls

*   **Timeout:** No explicit workflow timeout defined.
*   **Retry behavior:** Enabled on external API calls. The Delfin GET request has retries enabled. The HubSpot PATCH request has retries enabled with a 3000ms wait between attempts.
*   **Error workflow:** Execution errors are routed to a global error workflow (ID: Bu0X3AXE7asHOIpX).
*   **Execution settings:** Uses executionOrder v1, restricted callerPolicy (workflowsFromSameOwner), and a fixed timeSavedMode.

# Triggers & Entry Points

*   **Sub-workflow Trigger:** Acts as the initial entry point, receiving an `orderID` from a parent process to start the queueing phase.
*   **Webhook Trigger:** Listens for a POST request at `/callback-update-campaign-dates`. This is utilized as a callback endpoint from a Redis queue system to process the actual update asynchronously.

# Systems & Integrations

*   HubSpot CRM API (v3 Objects API)
*   Delfin API
*   Subworkflows (Redis Queue Producer, Authorization services)
*   Webhooks
*   Internal utilities (Custom JavaScript execution)

# Data Inputs & Key Fields

*   **Primary input fields:** `orderID`
*   **Important properties used:** `externalID` (HubSpot record ID), `auF_Erstausstrahlung` (Delfin Start Date), `auF_DatumBis` (Delfin End Date), `campaign_start_date`, `campaign_end_date`, `delfin_error_message`.

# Workflow Logic (Deep Analysis)

1. **Initial trigger (Queue Enqueueing):** A parent process triggers the sub-workflow trigger, passing an `orderID`.
2. **Token Generation:** A hardcoded token is passed via a JavaScript node.
3. **Queue Dispatch:** The system calls the Redis Stream Producer subworkflow, passing the `orderID` and a callback webhook URL, then completes the initial synchronous run.
4. **Callback Trigger (Processing):** The Redis queue fires the Webhook node, passing back the `orderID` for asynchronous processing.
5. **Authentication:** The workflow calls a Server Authorize subworkflow to retrieve valid Delfin API credentials.
6. **Data retrieval:** The Delfin API is queried (`GetOrderByOrderNumber`) to fetch detailed order information using the provided `orderID`.
7. **Data validation:** An IF node checks if the required fields (`externalID`, `auF_Erstausstrahlung`, `auF_DatumBis`) are present and not empty.
8. **Data Formatting:** If valid, a JavaScript node formats the raw Delfin date-time strings by extracting just the `YYYY-MM-DD` portion.
9. **HubSpot Update:** A PATCH request is sent to HubSpot to update the `campaign_start_date` and `campaign_end_date` properties.
10. **Error Handling & Logs:** If the HubSpot update fails, an error logic branch catches the failure and sends a secondary PATCH request to HubSpot to update the `delfin_error_message` log property with failure details.

# Branch Execution Details

**Node: Valid campaign start and end dates (IF)**

*   **Condition logic:** Validates that `externalID`, `auF_Erstausstrahlung`, and `auF_DatumBis` are all strictly not empty (AND combinator).
*   **TRUE path:** Executes a JavaScript code node to format the dates, then proceeds to update the HubSpot CRM record.
*   **FALSE path:** Routes to a "Do nothing" No-Op node, silently ending the execution for incomplete data without throwing a system error.

# External Operations

*   **Delfin API Call:** GET request to `/api/Orders/GetOrderByOrderNumber` to retrieve campaign dates.
*   **HubSpot Object Update (Success):** PATCH request to `https://api.hubapi.com/crm/v3/objects/0-162/{externalID}` to update campaign dates. Uses Header Auth.
*   **HubSpot Object Update (Error):** PATCH request to the same endpoint to update the `delfin_error_message` if the primary update fails.

# Subworkflows Used

*   **Workflow Name:** Subworkflow | Redis Stream Producer Workflow
    *   **Workflow ID:** 1tiTZLzrMssZ4trX
    *   **Purpose:** Pushes the orderID processing task to a Redis queue for asynchronous execution.
    *   **Inputs:** `orderID`, `callbackWebhook` URL.
*   **Workflow Name:** Production | Delfin | Server Authorize
    *   **Workflow ID:** BIgOTMaifk7QSG1B
    *   **Purpose:** Retrieves authentication headers for the Delfin API.
    *   **Inputs:** None explicitly defined.
*   **Workflow Name:** Global Error Workflow
    *   **Workflow ID:** Bu0X3AXE7asHOIpX
    *   **Purpose:** Catches global workflow execution failures at the system level.
    *   **Inputs:** n8n standard error payload.

# Database Collections

No direct database collections (like MongoDB) are queried or modified within this specific workflow structure. All data persistence is handled via the HubSpot CRM API and Delfin API.

# Security Notes

*   **Hardcoded tokens detected:** The node "Code in JavaScript1" contains a hardcoded Bearer token (`dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`). This is a security risk and should be migrated to n8n's credential management system.
*   **Webhook Exposure:** The callback webhook operates without apparent authentication validation, meaning any external service could theoretically POST to the `/callback-update-campaign-dates` endpoint if the URL is discovered.

# Known Limitations / Risks

*   **Hardcoded Credentials:** The hardcoded Bearer token in the JavaScript node could expire or be exposed, causing pipeline failures.
*   **Unauthenticated Webhook:** The callback webhook lacks a verification step to ensure the payload originates securely from the internal Redis Stream Producer.
*   **Partial Error Handling:** While the HubSpot update node handles HTTP errors gracefully by updating a log field on the object, if the initial Delfin GET request fails, the workflow relies entirely on the global error workflow. This means HubSpot won't receive a detailed error log for initial fetch failures.

# Final Outputs

When successful, the workflow produces an updated HubSpot Service record (Object Type 0-162) reflecting the exact `campaign_start_date` and `campaign_end_date` mapped from the Delfin system. If the update operation encounters a payload error, it produces an updated `delfin_error_message` log on that same HubSpot record.