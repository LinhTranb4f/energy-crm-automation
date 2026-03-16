---
title: 'Delfin | Manual Transfer Old Order from Delfin'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623615
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/uHt11jIWP9lHb4za](https://n8n.tools.energy/workflow/uHt11jIWP9lHb4za)
Workflow ID: uHt11jIWP9lHb4za
Workflow Name: Delfin | Manual Transfer Old Order from Delfin
Status: Active

# Purpose

The primary business goal of this workflow is to migrate historical order data from the legacy Delfin system into HubSpot CRM. It automates the complex extraction of order and booking data, validates it against existing HubSpot records, and orchestrates the creation of a complete hierarchical record structure including Deals, Line Items, Discounts, Quotes, Projects, Services, and Spots.

# Status and Runtime Controls

*   Timeout: 1800 seconds (30 minutes)
*   Retry behavior: Enabled on external API calls (HubSpot and Delfin API requests), with some nodes containing a 5000ms wait interval between retries.
*   Error workflow: Executed automatically on failure (ID: Bu0X3AXE7asHOIpX)
*   Execution settings: Caller policy is restricted to workflows from the same owner. Time saved mode is fixed.

# Triggers & Entry Points

*   Sub-workflow Trigger: Acts as the manual entry point, receiving a JSON payload containing the specific `orderID` to be migrated.
*   Webhook: A POST webhook (`callback-manual-transfer-old-order`) that serves as the entry point for the actual processing pipeline once the job has been queued.

# Systems & Integrations

*   HubSpot CRM API: Used extensively for searching, creating, and associating Deals, Line Items, Quotes, Discounts, and Companies.
*   HubSpot CMS (HubDB): Utilized for lookup tables to map Delfin data to HubSpot standard properties.
*   Delfin API: Fetches Order details, Bookings, and Address/Company records.
*   Internal Subworkflows: Triggered to fetch global variables, generate authentication headers, queue tasks, and handle final object creations.
*   Redis: Targeted via HTTP Request and subworkflow for stream processing.

# Data Inputs & Key Fields

*   Primary input fields: `orderID` from the incoming payload.
*   Important properties: `adR_VermittlerGUID` (mediator ID), `externalID` (used for duplication checks), `buC_Verrechenbar` (billable flag), and `isDeleted` flag on bookings.

# Workflow Logic (Deep Analysis)

1. Initial trigger: The flow initiates manually via the Sub-workflow Trigger, which passes the `orderID` to a queuing mechanism (Redis Stream Producer and an HTTP POST to an energy queue). Subsequently, the main processing begins via the Webhook listener.
2. Data retrieval: The workflow fetches environment specifics using the "Global variables" subworkflow and acquires API authorization via the "Server Authorize" subworkflow. It then queries the Delfin API to pull the full Order details based on the `orderID`.
3. Data validation: The order is evaluated in the "IF Order Valid" node. It verifies that the JSON is not empty, checks that a specific mediator GUID is not matched, and confirms the `externalID` is empty (ensuring it hasn't been migrated already).
4. Conditional logic: To prevent duplicates, the workflow searches HubSpot for existing Deals and Services associated with the `delfin_order_id`.
5. Branch execution: If no pre-existing Deal or Service is found, the workflow generates the configuration payload and proceeds to create a new HubSpot Deal.
6. External system calls: With the deal created, the flow references HubDB to get platform and internal order IDs. It then fetches related order bookings from Delfin, filtering specifically for items that are billable (`buC_Verrechenbar` == "True") and not deleted.
7. Data creation or update: Billable bookings are aggregated, formatted, and pushed to HubSpot as Deal Line Items. The workflow iterates through relevant Delfin addresses, looks them up in HubSpot, and associates the matching Company with the new Deal. Discounts are then processed and pushed as HubSpot objects.
8. Merge operations: The Quote Line Items and Discounts are aggregated. Data across the newly created Deal, Line Items, and Discounts is compiled to draft a highly structured Quote Payload.
9. Final updates: The Quote is created in HubSpot. Finally, external webhooks and subworkflows are fired to generate the downstream Project, Service, and Spot records linked to the original Deal.

# Branch Execution Details

IF Order Valid

*   Condition logic: Checks if input exists, `adR_VermittlerGUID` is not 'baa2bbbe-f643-40ee-a5f7-712f3e8da73d', and `externalID` is empty.
*   TRUE path: Passes the record to search for existing Deals in HubSpot.
*   FALSE path: Ends execution gracefully (no subsequent processing).

If total == 0 (Deal Search)

*   Condition logic: Validates if the HubSpot Deal search returned 0 results.
*   TRUE path: Passes to the Service search node.
*   FALSE path: Halts execution to prevent duplicate deal creation.

If total === 0 (Service Search)

*   Condition logic: Validates if the HubSpot Service search returned 0 results.
*   TRUE path: Triggers the payload preparation and generation of the new HubSpot Deal.
*   FALSE path: Halts execution.

IF Company Exists

*   Condition logic: Checks if the HubSpot Company search returned a 200 status code.
*   TRUE path: Executes the "HS - Associate Company to Deal" node.
*   FALSE path: Skips association and routes directly to the "Continue company loop" node.

# External Operations

*   Database usage: Fetches rows from HubDB for 'Internal Order' and 'Platform' mappings to cross-reference legacy Delfin identifiers with new HubSpot identifiers.
*   API calls: Executes numerous complex GET/POST/PUT requests to HubSpot (e.g., `/crm/v3/objects/deals`, `/crm/v3/objects/line_items/batch/create`, `/crm/v3/objects/quotes`, `/crm/v4/objects/companies/.../associations/...`) and Delfin systems (`GetOrderByOrderNumber`, `GetBookingsByOrderId`, `GetAddressByAddressGUID`).
*   Object creation: Creates Deals, Line Items, Discounts, Quotes directly via HTTP.
*   Object updates: Modifies object associations, tying Companies, Quotes, Line Items, and Discounts logically to the main Deal.

# Subworkflows Used

*   Workflow name: Global variables

Workflow ID: YTKoYUXPDy5OGV16

Purpose: Supplies environment identifiers, HubDB table IDs, and pipeline keys.

*   Workflow name: Delfin | Server Authorize

Workflow ID: BIgOTMaifk7QSG1B

Purpose: Handles secure token generation/retrieval for Delfin API requests.

*   Workflow name: Subworkflow | Redis Stream Producer Workflow

Workflow ID: 1tiTZLzrMssZ4trX

Purpose: Acts as a queuing layer to stagger legacy imports safely.

*   Workflow name: Delfin | Subworkflow to create project, service and spot

Workflow ID: hC4xq5uVOCFX1f0w

Purpose: Handles the creation of nested operational architecture inside HubSpot utilizing the newly created `dealID`.

# Database Collections

*   Internal Order HubDB: Maps specific Delfin internal billing/reference IDs to HubSpot equivalents.
*   Platform HubDB: Translates raw Delfin platform text entries into recognized HubSpot structured properties.

# Security Notes

*   Hardcoded tokens: A plain text Bearer token (`dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`) is hardcoded directly inside the "Code in JavaScript1" node.
*   Credentials: API connections to HubSpot safely utilize the configured credential `Production | HubSpot | Header Auth to connect private app`.
*   Sensitive operations: Operations mapping company addresses and financial quotes are heavily automated and rely strictly on correct token permissions.

# Known Limitations / Risks

*   Hardcoded Security Asset: The hardcoded token in the JavaScript node represents a critical security and maintenance risk. If the destination system rotates this key, the initial queue phase will silently fail.
*   Disconnected Logic: The node "HS - Create Company" is present on the canvas but has no incoming connections. If a company does not exist in HubSpot, the integration will fail to create it, skipping association entirely.
*   Unprocessed Branches: Records failing validation (e.g., existing Deal or Service found) fall into branches with no error reporting, logging, or notification handling, making silent failures difficult to track.
*   Race Conditions: Pushing to a Redis stream queue and simultaneously relying on an asynchronous webhook call to process the exact same item could result in execution conflicts if the queue processor picks up the task concurrently.

# Final Outputs

Upon successful execution, the workflow produces a fully migrated Deal in HubSpot with accurately translated custom properties. Attached directly to this deal are structured Line Items, specific fixed Discounts, mapped HubSpot Companies, and a valid Draft Quote. Additionally, it ensures downstream creation of Project, Service, and Spot associations via callbacks.