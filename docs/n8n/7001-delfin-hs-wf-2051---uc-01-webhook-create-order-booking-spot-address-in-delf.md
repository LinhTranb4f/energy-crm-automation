---
title: '7001 | Delfin | HS-WF: 2051 - UC-01 Webhook | Create Order, Booking, Spot, Address in Delfin'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623715
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/XlYcZ8ABNG8u1uKv](https://n8n.tools.energy/workflow/XlYcZ8ABNG8u1uKv)
**Workflow ID:** XlYcZ8ABNG8u1uKv
**Workflow Name:** 7001 | Delfin | HS-WF: 2051 - UC-01 Webhook | Create Order, Booking, Spot, Address in Delfin
**Status:** Active

# Purpose

Automate the creation of Orders, Bookings, Spots, and Addresses in the Delfin system. The workflow synchronizes HubSpot Service records with Delfin to eliminate manual data entry, and updates HubSpot records with returned Delfin payloads to maintain cross-system data integrity.

# Status and Runtime Controls

*   **Status:** Active
*   **Timeout:** Not explicitly set in workflow parameters.
*   **Retry behavior:** HTTP Request nodes are configured with `retryOnFail: true`, with several configured to wait 5000ms between attempts.
*   **Error workflow:** Fails over to error workflow `Bu0X3AXE7asHOIpX` upon unhandled execution failure.
*   **Execution settings:** Caller policy is restricted to `workflowsFromSameOwner`.

# Triggers & Entry Points

*   **Webhook Trigger:** Listens for `POST /push-service-to-Delfin` requests from HubSpot. It receives a JSON payload containing the `hs_object_id` (HubSpot Service ID).
*   **Manual Trigger:** Provides an entry point named `When clicking ‘Execute workflow’` for manual testing and debugging.

# Systems & Integrations

*   **HubSpot CRM API:** Used for fetching and updating Objects (Services, Projects, Deals, Companies, Spots).
*   **Delfin API:** Used for initializing, creating, and committing Address, Order, Spot, and Booking records.
*   **n8n Subworkflows:** Interacts with internal utilities for variables and authentication.
*   **Webhooks:** Responds back to the invoking client (HubSpot) upon success or failure.

# Data Inputs & Key Fields

*   **Primary input fields:** `hs_object_id` (Service ID from HubSpot payload).
*   **Important properties used:** `spot_count`, `spot_duration`, `campaign_start`, `campaign_end`, `time_category`, `plattform`, `price`, `rubric`, `production_type`, Deal associations, and Company properties (name, phone, city, original\_country, zip, address, website).

# Workflow Logic (Deep Analysis)

1. **Initial trigger:** The workflow initiates via a Webhook carrying a HubSpot Service ID.
2. **Data retrieval:** Executes a subworkflow to fetch Global Variables (e.g., portal ID, object schemas). Then, sequentially queries HubSpot API to get Service details, Project associations, Deal information, and Company address data.
3. **Data validation:** Validates whether the Deal includes a secondary company of type `agency`.
4. **Conditional logic:** If an agency is present, it retrieves the agency company details and aggregates them with the primary company data to prepare an Address array.
5. **External system calls (Auth & Addresses):** Retrieves Delfin authorization headers via a Server Auth subworkflow. Iterates over the Address array to push data to Delfin using a three-step transaction pattern: Init Address Transaction -> Post Address -> Confirm Address Transaction.
6. **External system calls (Orders & Spots):** Following successful address sync, it initializes an Order Transaction. Maps HubSpot Service fields into a Delfin Order JSON and pushes it. Extracts Spot IDs and pushes Spot records to Delfin.
7. **Data creation or update (Bookings):** Employs custom JavaScript blocks to dynamically calculate booking schedules across the campaign dates. Generates batched payloads and pushes Order Bookings to Delfin.
8. **Final updates:** Commits the overarching Order Transaction in Delfin. Constructs a comprehensive success payload, patches the source HubSpot Service to mark `hs_status` as `succeeded_completed`, clears any old error messages, and responds to the webhook with a success signal.

# Branch Execution Details

*   **Check agency company (IF Node):**
    *   **Condition:** Checks if deal associations include a company type of "agency".
    *   **TRUE path:** Routes to `HS - Get Agency Company` to fetch agency data, then proceeds to authorization.
    *   **FALSE path:** Skips agency retrieval and moves directly to Server Auth.
*   **Address Transaction Lifecycle (If Init / Post / Confirm Address Success):**
    *   **Condition:** Evaluates if Delfin API returned `responseCode == 'OK'`.
    *   **TRUE path:** Progresses to the next step of the transaction loop.
    *   **FALSE path:** Triggers a code node to build an Address error payload, patches the HubSpot Service with failure details, invokes `Cancel Address Transaction`, and triggers a Failure Webhook Response.
*   **Order Transaction Lifecycle (If Init / Post / Create Spot / Confirm Order Success):**
    *   **Condition:** Evaluates if Delfin API returned `responseCode == 'OK'`.
    *   **TRUE path:** Progresses to the next node in the sequence (e.g., Post Order -> Post Spot -> Post Bookings).
    *   **FALSE path:** Compiles an Order/Spot error payload, writes the error back to HubSpot, calls `Cancel Order Transaction` in Delfin, and aborts with a Failure response.
*   **If Post Order Booking Success:**
    *   **Condition:** Uses array `.every()` to ensure all batched booking requests returned `OK`.
    *   **TRUE path:** Advances to finalize/commit the Order Transaction.
    *   **FALSE path:** Identifies the exact index of the failed booking, generates an error payload, updates HubSpot, rolls back via Order Cancellation, and fails.

# External Operations

*   **API Calls:** Heavy orchestration of HubSpot `GET` (retrieving nested associated objects) and `PATCH` requests.
*   **Object Creation:** Dynamically provisions Address, Order, Spot, and OrderBookings via REST endpoints in the Delfin ecosystem.
*   **Object Updates:** Maintains bidirectional sync by writing `delfin_payload` or `delfin_error_message` back to the origin HubSpot CRM Service.
*   **Transaction Management:** Employs a robust remote transaction mechanism (Init -> Post -> Commit / Cancel) ensuring database operations in Delfin remain atomic.

# Subworkflows Used

*   **Workflow Name:** Global variables
    *   **Workflow ID:** `YTKoYUXPDy5OGV16`
    *   **Purpose:** Acts as an environment variable store, returning HubSpot object IDs and testing configuration values.
*   **Workflow Name:** Production | Delfin | Server Authorize
    *   **Workflow ID:** `BIgOTMaifk7QSG1B`
    *   **Purpose:** Executes a secure auth flow to the Delfin server and returns the authentication token utilized in all subsequent Delfin API headers.

# Database Collections

*   No native n8n database or MongoDB nodes are executed in this specific workflow (despite the workspace tag `BACKUP-MONGODB`). HubSpot CRM acts as the primary data origin, and the remote Delfin SQL/System acts as the destination database.

# Security Notes

*   **Credentials:** Utilizes securely stored `Production | HubSpot | Header Auth to connect private app` credentials for CRM operations.
*   **API Security Risk:** Every `httpRequest` directed at the Delfin API has `allowUnauthorizedCerts: true` enabled. This bypasses SSL certificate validation and presents a potential vulnerability to Man-In-The-Middle (MITM) attacks if executed over public networks.
*   **Hardcoded Tokens:** No hardcoded tokens are visible; authentication relies dynamically on subworkflows and managed credentials.

# Known Limitations / Risks

*   **SSL Validation:** As noted above, `allowUnauthorizedCerts: true` is enabled on sensitive POST requests. This should be addressed for production security.
*   **Timeout Risks:** Processing extensive loops for Addresses, Spots, and Bookings synchronously could result in webhook timeouts from the originating HubSpot platform if data volumes are high.
*   **Race Conditions:** Webhook deduplication/idempotency keys are not actively verified prior to executing Delfin Init transactions. Repeated concurrent webhook firings could theoretically spawn duplicate transactions.

# Final Outputs

Upon a fully successful execution, the workflow commits complete Order and Booking schemas to Delfin. It subsequently constructs a stringified JSON summary of the synced addresses, orders, and spots, updates the HubSpot Service with this summary while marking `hs_status` as `succeeded_completed`, and closes the integration loop by returning a generic Success Response to the calling webhook.