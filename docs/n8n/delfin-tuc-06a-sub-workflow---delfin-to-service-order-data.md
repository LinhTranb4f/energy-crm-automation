---
title: 'Delfin| TUC-06a | Sub-Workflow -  Delfin to Service / Order Data'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623475
---

# Summary

**Workflow URL**: [https://n8n.tools.energy/workflow/iRJDhmLQoRz8EFTy](https://n8n.tools.energy/workflow/iRJDhmLQoRz8EFTy)
**Workflow ID**: iRJDhmLQoRz8EFTy
**Workflow Name**: Delfin| TUC-06a | Sub-Workflow - Delfin to Service / Order Data
**Status**: Active

# Purpose

The business goal of this workflow is to deeply synchronize order and booking data from Delfin into HubSpot. It automates the extraction of spot information, calculates delivery metrics, and manages Line Item records (Spot records) in HubSpot. The process ensures cross-system data integrity by validating the existence of associated Deals, Projects, and Services before executing any destructive or creation events.

# Status and Runtime Controls

*   **Timeout**: Standard default workflow execution limits apply.
*   **Retry behavior**: Critical API calls to HubSpot feature built-in retry mechanisms (e.g., max 3 retries with a 3000ms wait interval) to handle rate limiting and temporary network issues.
*   **Error workflow**: Failures are automatically routed to a designated error handling workflow (`Bu0X3AXE7asHOIpX`).
*   **Execution settings**: Configured to run sequentially (`v1` execution order) and calculate time saved via a fixed mode.

# Triggers & Entry Points

*   **Sub-workflow Trigger**: Receives a direct JSON payload containing an `orderID`. This branch sets up authorization and immediately pushes the payload into a Redis stream processing queue.
*   **Webhook Node**: Listens at the path `callback-delfin-to-service` (POST request). This is the primary entry point for the data synchronization logic, acting as the callback from the Redis stream processing.

# Systems & Integrations

*   **HubSpot CRM API**: Managing Service objects, Deals, Projects, and Line Items.
*   **HubSpot HubDB API**: Used for querying mapping data (Internal Orders and Platform mappings).
*   **Delfin API**: Source of truth for Order Details, Region information, and Bookings.
*   **Subworkflows**: Reusing modular logic for Global Variables and Authorization.
*   **Webhooks**: For async event processing.
*   **Redis Stream**: Handled via external HTTP/Queue posting to manage processing load.

# Data Inputs & Key Fields

*   **Primary input fields**: `orderID`.
*   **Important properties**: `externalID` (Order reference), `sales_channel`, `operations_project_record_id`, `buC_Verrechenbar` (Billable status), and `isDeleted`.

# Workflow Logic (Deep Analysis)

1. **Initial trigger**: The payload enters via the `callback-delfin-to-service` Webhook.
2. **Configuration Load**: The workflow fetches global variables and server authorization headers using subworkflows.
3. **Data retrieval (Order)**: Calls the Delfin API to get the Order details based on the provided `orderID`.
4. **Validation Chain**: Checks if the Order is valid, then consecutively fetches and verifies the existence of the related HubSpot Service, Project, and Deal records.
5. **Data retrieval (Bookings)**: Using the region ID from the HubSpot Service, it fetches Regional Orders from Delfin, validates they exist, and then retrieves all associated Order Bookings.
6. **Data Filtering & Aggregation**: Filters out non-billable and deleted bookings, then aggregates them into a single array for easier processing.
7. **HubDB Lookups**: Queries HubDB for internal order references and platform mapping details to ensure proper formatting.
8. **Data Preparation**: A custom JavaScript code node maps the raw Delfin booking data into HubSpot Line Item schemas, organizing them by Radio Station/Platform and calculating durations, pricing, and discount percentages.
9. **Line Item Management**: If line items are generated, it collects existing Line Items from the Deal, isolates the ones meant for deletion (Radio Spots), deletes them, and maps the newly prepared items for creation.
10. **Final updates**: Creates the new Line Items in HubSpot. Finally, it checks the Deal Stage and updates it to "Order in Delivery" if it doesn't already match that stage.

# Branch Execution Details

*   **IF Order Valid**
    *   **Condition logic**: Checks if the JSON object exists and the `externalID` is not empty.
    *   **TRUE path**: Proceeds to fetch the HubSpot Service.
    *   **FALSE path**: Terminates smoothly into a `No action` node.
*   **If Project Valid**
    *   **Condition logic**: Verifies the Service has a related Operations Project association.
    *   **TRUE path**: Fetches the HubSpot Project details.
    *   **FALSE path**: Terminates smoothly into a `No action` node.
*   **If Deal Valid**
    *   **Condition logic**: Verifies the Project has an associated Deal.
    *   **TRUE path**: Fetches the HubSpot Deal details.
    *   **FALSE path**: Terminates smoothly into a `No action` node.
*   **IF Orders Not Empty**
    *   **Condition logic**: Checks if the response from the Delfin Region Orders is not empty.
    *   **TRUE path**: Fetches the specific Order Bookings from Delfin.
    *   **FALSE path**: Terminates smoothly into a `No action1` node.
*   **IF Line Items Not Empty**
    *   **Condition logic**: Checks if the mapping logic successfully produced an array of Line Items to create.
    *   **TRUE path**: Initiates the Line Item replacement sequence (Search -> Delete -> Map -> Create).
    *   **FALSE path**: Terminates smoothly into a `No action2` node.
*   **IF Deal Stage Not "Order in Delivery"**
    *   **Condition logic**: Compares the current `dealstage` against the Delivery Stage ID (`4636861650`).
    *   **TRUE path**: Calls HubSpot to patch the Deal stage.
    *   **FALSE path**: Process concludes without an update API call.

# External Operations

*   **Database usage**: Uses HubSpot HubDB API to translate Delfin Station names to HubSpot Platform names and align internal order numbers.
*   **API calls**:
    *   GET requests to Delfin for Order, Region, and Booking data.
    *   GET requests to HubSpot for Services, Projects, and Deals (utilizing Custom Object IDs).
    *   POST request to Redis Stream webhook to queue operations.
*   **Object creation**: Creates new Line Item records via the HubSpot Batch Create Line Items API.
*   **Object updates**: Updates the HubSpot Deal Stage using a PATCH request. Deletes old Line Items using the Delete API to keep the system clean before creating the updated spots.

# Subworkflows Used

*   **Global variables**
    *   **Workflow ID**: `YTKoYUXPDy5OGV16`
    *   **Purpose**: Retrieves static environment variables such as portal IDs, custom object IDs, and HubDB table IDs.
    *   **Inputs**: None.
*   **Production | Delfin | Server Authorize**
    *   **Workflow ID**: `BIgOTMaifk7QSG1B`
    *   **Purpose**: Generates and returns the active Authorization header needed for Delfin API calls.
    *   **Inputs**: None.
*   **Subworkflow | Redis Stream Producer Workflow**
    *   **Workflow ID**: `1tiTZLzrMssZ4trX`
    *   **Purpose**: Receives the initial trigger payload and safely queues it via Redis to prevent rate limiting or dropped webhooks.
    *   **Inputs**: JSON containing `type: disposition`, `data` (orderID), and the `callbackWebhook` URL.

# Database Collections

*   **Platform HubDB**: Used to standardize radio station names coming from Delfin into the official Hubspot Platform values.
*   **Internal Order HubDB**: Used to align billing accounts and tracking references based on the station name and sales channel (Direct vs. Indirect).

# Security Notes

*   **Hardcoded Tokens**: A hardcoded Bearer token (`Bearer dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`) is visible inside the `Code in JavaScript1` node. This poses a potential security risk and should ideally be moved to n8n Credentials or the Global Variables subworkflow.
*   **Credentials**: Standard HTTP Header Auth is used safely for HubSpot interactions via the internal n8n credential vault (`Production | HubSpot | Header Auth to connect private app`).

# Known Limitations / Risks

*   **Unprocessed branches**: There are isolated draft nodes (e.g., `HS - Batch Delete Line Items`, `Filter Radio Spots`, and backup mapping nodes) present in the canvas that are disconnected. While they don't break the active execution, they create canvas clutter.
*   **Hardcoded values**: Deal stage ID (`4636861650`) is hardcoded in the IF node condition instead of being dynamically fetched from the global variables node, which could break if the pipeline is rebuilt.
*   **Race conditions**: If multiple updates for the same `orderID` are triggered simultaneously, the sequence of deleting and recreating line items could potentially overlap, though the Redis queue mitigates this heavily.

# Final Outputs

Upon successful execution, the workflow ensures the HubSpot Deal contains a perfectly synced list of Radio Spot Line Items representing the latest Delfin Bookings. The Line Items will reflect accurately calculated duration, amounts, and discount percentages. The parent Deal is also safely progressed to the "Order in Delivery" pipeline stage.