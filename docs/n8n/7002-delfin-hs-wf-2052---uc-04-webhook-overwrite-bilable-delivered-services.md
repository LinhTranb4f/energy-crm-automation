---
title: '7002 | Delfin | HS-WF: 2052 - UC-04 Webhook | Overwrite bilable / Delivered Services'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623815
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/nGDXcIj9j4KY3TAv](https://n8n.tools.energy/workflow/nGDXcIj9j4KY3TAv)
**Workflow ID:** nGDXcIj9j4KY3TAv
**Workflow Name:** 7002 | Delfin | HS-WF: 2052 - UC-04 Webhook | Overwrite bilable / Delivered Services
**Status:** Active

# Purpose

The primary business goal of this workflow is to calculate delivered service metrics based on a specific payment type (Monthly or End of Campaign) and Delfin bookings, and subsequently update the HubSpot service billing counters. It overwrites "count\_of\_service\_ready\_for\_billing" and "count\_of\_spots\_delivered" properties in HubSpot to ensure accurate billing records based on real-time data from the Delfin system.

# Status and Runtime Controls

*   **Timeout:** Uses standard instance default (no custom timeout specified).
*   **Retry behavior:** The "HS - Get Service" node is configured to automatically retry on failure (`retryOnFail: true`). Delfin API nodes explicitly have retry disabled.
*   **Error workflow:** Yes, errors are routed to a dedicated error workflow with ID: `Bu0X3AXE7asHOIpX`.
*   **Execution settings:** Runs on `v1` execution order policy, limited to callers from workflows with the same owner (`workflowsFromSameOwner`), and time saved mode is marked as `fixed`.

# Triggers & Entry Points

*   **Webhook Trigger:** Listens for a POST request at the path `update-hs-delivered-services`. This is triggered by external HubSpot workflows. It expects a JSON payload containing `serviceID` and `paymentType`.

# Systems & Integrations

*   **HubSpot CRM API:** Used to fetch Service details (Object `0-162`) and push updated property counters and error logs via PATCH requests.
*   **Delfin External API:** Queried to fetch specific Order details and retrieve booking records matching date parameters.
*   **Webhooks:** Inbound webhook for triggering, and outbound responses (success/failure) returned to the calling application.
*   **Subworkflows:** Uses a dedicated authorization workflow to obtain Delfin API credentials dynamically.

# Data Inputs & Key Fields

*   **Primary input fields:** `serviceID` (Numeric), `paymentType` (String: "Monthly" or "End of Campaign").
*   **Important properties used:** `delfin_order_id`, `campaign_start_date`, `campaign_end_date`, `buC_Verrechenbar` (Billable status), `isDeleted` (Record state), `buC_Sekunden` (Booking duration in seconds).

# Workflow Logic (Deep Analysis)

1. **Initial trigger:** The workflow starts when an external system (HubSpot) hits the Webhook Trigger with an active service ID and a payment type.
2. **Data validation:** The "Input Validate" IF node checks if `serviceID` is present and if `paymentType` is exactly "Monthly" or "End of Campaign".
3. **Data retrieval (HubSpot):** The "HS - Get Service" node calls the HubSpot API to retrieve properties associated with the provided `serviceID`, extracting metrics like the associated `delfin_order_id`, start/end dates, and spot details.
4. **Conditional logic:** The "If service exists" node validates that the retrieved service actually exists in HubSpot and possesses a non-empty `delfin_order_id`.
5. **External system calls (Auth):** Triggers the "Call Server Authorize WF" subworkflow to retrieve valid HTTP authorization headers for the Delfin API.
6. **External system calls (Delfin Orders):** Calls the Delfin API `/api/Orders/GetOrderByOrderNumber` to get the internal `auF_GUID` reference.
7. **Branch execution (Date Math):** A Switch node routes processing based on `paymentType`. "Monthly" calculates the first and last day of the previous calendar month. "End of Campaign" formats the HubSpot campaign start and end dates.
8. **Data retrieval (Delfin Bookings):** Calls the Delfin `/api/Orders/GetBookingsByParameters` API using the `auF_GUID` and the previously calculated date range.
9. **Data validation:** Evaluates if any bookings were returned using the "If bookings exist" node.
10. **Data filtering & Merge operations:** The "Filter Billable" node passes only bookings where `buC_Verrechenbar` is "True" and `isDeleted` is "False". The "Aggregate" node then bundles these filtered items into a unified array.
11. **Data calculation:** The "Prepare Delivered Services Data" Code node processes the array to compute `totalSeconds` (sum of `buC_Sekunden`) and `countSpots` (total array length).
12. **Final updates:** Depending on whether the calculated totals are greater than zero, it either updates the HubSpot Service record with the new billing counts or updates a specific Delfin Error Log field in HubSpot.
13. **Final response:** Returns a JSON webhook response confirming success or delivering an explicit failure status and message.

# Branch Execution Details

*   **Input Validate:**
    *   _Condition:_ `serviceID` not empty AND `paymentType` in \['Monthly', 'End of Campaign'\].
    *   _TRUE path:_ Proceeds to fetch the HubSpot service.
    *   _FALSE path:_ Routes to "Throw Bad Response" NoOp node, followed by an immediate HTTP 400 Failure Response to the webhook.
*   **If service exists:**
    *   _Condition:_ HubSpot JSON response ID exists, properties object is not empty, and `delfin_order_id` is present.
    *   _TRUE path:_ Executes the Authorization Subworkflow.
    *   _FALSE path:_ Routes to "Throw Bad Response" and returns a Failure Response.
*   **Switch Payment Type:**
    *   _Monthly path:_ Executes the Code node "Get last month start & end date".
    *   _End of Campaign path:_ Executes the Code node "Get campaign start & end date".
*   **If bookings exist:**
    *   _Condition:_ Payload from Delfin API is not empty.
    *   _TRUE path:_ Proceeds to filter billable records.
    *   _FALSE path:_ Immediately returns a Failure Response.
*   **If Bookins Not Empty:**
    *   _Condition:_ Aggregated array `bookings` is not empty.
    *   _TRUE path:_ Proceeds to prepare the delivered service math calculations.
    *   _FALSE path:_ Returns a Failure Response.
*   **If No Results:**
    *   _Condition:_ `totalSeconds` != 0 OR `countSpots` != 0.
    *   _TRUE path:_ Updates the primary Service counters in HubSpot and returns a Success Response.
    *   _FALSE path:_ Updates the `delfin_error_message` log in HubSpot and returns a Failure Response.

# External Operations

*   **API calls:**
    *   `GET` to HubSpot CRM v3 API to fetch object `0-162` (Services).
    *   `GET` to Delfin Orders API (`GetOrderByOrderNumber`).
    *   `GET` to Delfin Bookings API (`GetBookingsByParameters`).
    *   `PATCH` to HubSpot CRM v3 API to update billing counters on object `0-162`.
    *   `PATCH` to HubSpot CRM v3 API to write error logs on object `0-162`.

# Subworkflows Used

*   **Workflow Name:** Production | Delfin | Server Authorize
*   **Workflow ID:** BIgOTMaifk7QSG1B
*   **Purpose:** Centralized secure subworkflow to fetch authentication tokens/headers for the Delfin API.
*   **Inputs:** No strict inputs mapped dynamically; relies on its own internal HTTP calls to generate the header output.

# Database Collections

*   No direct database nodes (like MongoDB or SQL) are utilized. The workflow interacts exclusively with HubSpot's CRM object structure, specifically treating Object `0-162` (Custom Object for Services/Line Items) as its primary data store.

# Security Notes

*   **Credentials:** Uses centralized generic header authentication via the n8n credential vault (`Production | HubSpot | Header Auth to connect private app`) for HubSpot calls.
*   **Sensitive operations:** Connects to the Delfin system by dynamically requesting authorization via a protected subworkflow, preventing API keys or hardcoded tokens from living inside the logic of this specific workflow.
*   HTTP requests are set to allow unauthorized certificates (`allowUnauthorizedCerts: true`) for Delfin connections, which is a potential security consideration if crossing public internet bounds.

# Known Limitations / Risks

*   **Strict Type Handling:** The script relies on precise case strings (`True` and `False`) for Delfin `buC_Verrechenbar` and `isDeleted` variables. Any changes in the upstream data type (e.g., lowercase booleans) will break the "Filter Billable" node logic.
*   **Zero Value Triggers Error:** If a campaign correctly delivered zero billable seconds during a given timeframe, the logic treats it as an "Execution Error" and routes to the False branch, appending an error message in HubSpot and returning a 400 Failure to the Webhook instead of confirming 0 items delivered.
*   **Date Timezone Reliance:** The code node for "Monthly" date calculation relies on the local server timezone running the n8n instance, which could cause slight discrepancies near midnight on the first/last day of the month.

# Final Outputs

*   **Successful Execution:** Updates the HubSpot service record's `count_of_service_ready_for_billing` and `count_of_spots_delivered`, and returns an HTTP 200 response (`{"success": true, "message": "Billable services overwrite completed successfully"}`).
*   **Failed Execution:** Updates the `delfin_error_message` inside HubSpot (if failure happens late in the flow) and returns an HTTP 400 response (`{"success": false, "message": "Delfin Order Booking failed. Please check the logs."}`).