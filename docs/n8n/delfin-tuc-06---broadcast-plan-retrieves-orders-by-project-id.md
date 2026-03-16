---
title: 'Delfin | TUC-06 - Broadcast Plan, Retrieves Orders By Project ID'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623535
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/zzawxwm9pWDS0oNq](https://n8n.tools.energy/workflow/zzawxwm9pWDS0oNq)
**Workflow ID:** zzawxwm9pWDS0oNq
**Workflow Name:** Delfin | TUC-06 - Broadcast Plan, Retrieves Orders By Project ID
**Status:** Active

# Purpose

This workflow serves as a technical integration to retrieve broadcast plan data. It accepts a Project ID via a webhook, fetches corresponding Project and Deal details from HubSpot CRM, and dynamically fetches related Order and Booking data from the Delfin system. It automatically distinguishes between "Standard" deals (with a known Delfin Order ID) and "Normal" deals (querying Delfin by Region) to assemble and return a unified JSON payload of orders and their bookings to the requester.

# Status and Runtime Controls

*   **Timeout:** Not explicitly defined in the active node settings.
*   **Retry behavior:** HTTP Requests to HubSpot have retries enabled automatically. Execute subworkflow nodes have wait times of 3000ms between retries.
*   **Error workflow:** Global error handling is configured to trigger an external error workflow upon failure (Workflow ID: Bu0X3AXE7asHOIpX).
*   **Execution settings:** Runs on `v1` execution order, and the caller policy is restricted to `workflowsFromSameOwner`.

# Triggers & Entry Points

*   **Webhook Trigger:** Acts as the primary entry point, listening on the path `defin-broadcast-plan-data`. It accepts GET requests and expects a query parameter named `projectID`. Cross-Origin Resource Sharing (CORS) is enabled (`allowedOrigins: *`) for external requests.

# Systems & Integrations

*   HubSpot CRM API (v3)
*   Delfin API (Custom internal or external order management system)
*   Subworkflows (Internal utilities for global variables and server authorization)
*   Webhooks (n8n Webhook functionality)

# Data Inputs & Key Fields

*   **Primary input fields:** `projectID` (Query parameter from the inbound webhook).
*   **Important properties used in the workflow:**
    *   `project_object_id` (Fetched from the Global Variables subworkflow).
    *   HubSpot Deal properties: `sales_channel`, `delfin_order_id`.
    *   Delfin API URL and authentication header (Fetched from Server Authorize subworkflow).

# Workflow Logic (Deep Analysis)

1. **Initial trigger:** The workflow is invoked via an inbound webhook call containing a `projectID` parameter.
2. **Data validation:** The workflow immediately checks if the `projectID` query parameter is empty. If missing, it immediately rejects the request.
3. **Data retrieval:** If valid, the execution calls the 'Global variables' subworkflow to retrieve dynamic environment variables (such as `project_object_id`), followed by the 'Server Authorize' subworkflow to obtain Delfin API credentials.
4. **External system calls:** It queries HubSpot CRM to fetch the Project object using the `projectID` and fetches its associated Deal ID. It then makes a second HubSpot call to retrieve the Deal's specific properties (`sales_channel` and `delfin_order_id`).
5. **Conditional logic:** It evaluates if the `delfin_order_id` from HubSpot is populated. This effectively splits the execution path into two distinct logical branches: "Standard Deal" or "Normal Deal".
6. **Branch execution:**
    *   **Standard Deal (Has Order ID):** Queries Delfin specifically by that exact Order Number. If the order exists, it executes an additional API call to fetch associated bookings, maps the data arrays together, and returns a success response.
    *   **Normal Deal (No Order ID):** Queries Delfin using the `projectID` as a Region identifier. It loops sequentially over all retrieved orders using a Split in Batches mechanism, fetching bookings for each individual order, aggregates the results into a single payload, and returns a success response.
7. **Final updates:** The workflow terminates by responding directly to the webhook, outputting the formatted JSON data.

# Branch Execution Details

**If valid query**

*   **Condition logic:** Evaluates if `$json.query.projectID` is not empty.
*   **TRUE path:** Proceeds to fetch global variables and continues standard execution.
*   **FALSE path:** Triggers the 'Validation Failed' node, returning an HTTP 400 Bad Request JSON response stating "Your request must include a valid orderID parameter."

**Check Delfin Order ID is not empty**

*   **Condition logic:** Evaluates if the `delfin_order_id` string from the HubSpot deal is not empty.
*   **TRUE path (Standard Deal):** Proceeds to execute 'Delfin - Get Orders By Order Number'.
*   **FALSE path (Normal Deal):** Proceeds to execute 'Delfin - Get Orders By Region'.

**If Orders Not Empty (Standard Branch)**

*   **Condition logic:** Checks if the returned Order JSON object from Delfin is not empty.
*   **TRUE path:** Moves to 'Delfin - Get Order Bookings1' to fetch booking details.
*   **FALSE path:** Routes to 'Failure Response', returning an HTTP 500 error.

**If Orders Empty (Normal Branch)**

*   **Condition logic:** Checks if the fetched Region orders object from Delfin is empty.
*   **TRUE path:** Routes to 'Failure Response', returning an HTTP 500 error.
*   **FALSE path:** Enters a 'Loop Over Items' node to iterate through each order, executing 'Delfin - Get Order Bookings' for each item, before aggregating them back into a single array.

# External Operations

*   **HubSpot API:**
    *   GET request to `/crm/v3/objects/{project_object_id}/{projectID}` to get Deal associations.
    *   GET request to `/crm/v3/objects/deal/{dealID}` to read properties.
*   **Delfin API:**
    *   GET `GetOrderByOrderNumber` to look up an order by its ID.
    *   GET `GetOrderByRegion` to look up orders associated with a Region code.
    *   GET `GetBookingsByOrderId` to fetch line items/bookings linked to order GUIDs.

# Subworkflows Used

*   **Global variables**
    *   **Workflow ID:** YTKoYUXPDy5OGV16
    *   **Purpose:** Supplies centralized environment constants (e.g., `project_object_id`).
    *   **Inputs:** None.
*   **Delfin | Server Authorize**
    *   **Workflow ID:** BIgOTMaifk7QSG1B
    *   **Purpose:** Generates or retrieves the active authentication token and base API URL required to communicate with Delfin servers securely.
    *   **Inputs:** None.

# Database Collections

*   No direct database query nodes are configured in this workflow. Information is processed strictly via REST API lookups to HubSpot and Delfin.

# Security Notes

*   **Credentials:** HubSpot API uses generic HTTP Header Auth configured via an n8n credential ID (`SmSUyv0Pf8gThTzV`), keeping secrets out of the node config.
*   **Sensitive operations:** Delfin API authentication tokens are fetched dynamically at runtime via a subworkflow.
*   **Risks detected:** Multiple Delfin HTTP request nodes are configured with `allowUnauthorizedCerts: true`, which overrides SSL certificate validation. This disables a layer of security and could pose a risk of man-in-the-middle attacks.

# Known Limitations / Risks

*   **Misleading Error Handling:** If a Delfin API lookup completes successfully but legitimately returns an empty array (meaning no orders exist yet), the workflow explicitly routes to a generic 500 "Internal Error" response. This might break downstream consumer logic that would expect a 404 or a 200 OK with an empty array.
*   **Timeout Risk from Sequential Loops:** The "Normal Deal" branch uses a sequential batch looping design for fetching bookings per order. If a project has an unusually high volume of orders, the repeated HTTP requests could exceed the webhook response timeout window before aggregating.
*   **SSL Certificate Risk:** Disabled unauthorized certificate validation (`allowUnauthorizedCerts: true`) on external API nodes should be remedied before long-term production use.

# Final Outputs

When executing successfully, the workflow responds to the webhook trigger with an HTTP 200 JSON payload (`status: true`) containing a structured `data` array of Orders embedded with their respective Bookings. If validation fails, it outputs a clean HTTP 400 Bad Request JSON. In case no data is found or structural errors occur, it halts execution and issues a generic HTTP 500 Internal Error response.