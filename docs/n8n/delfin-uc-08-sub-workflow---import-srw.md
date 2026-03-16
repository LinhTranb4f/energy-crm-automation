---
title: 'Delfin | UC-08  | Sub-Workflow - Import SRW'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623415
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/voqbwct4BC9IcV4t](https://n8n.tools.energy/workflow/voqbwct4BC9IcV4t)
Workflow ID: voqbwct4BC9IcV4t
Workflow Name: Delfin | UC-08 | Sub-Workflow - Import SRW
Status: Active

# Purpose

Explain the business goal of the workflow.
The primary objective of this workflow is to import SRW (Service/Booking) orders from the Delfin system into HubSpot. It automates the replication of the Delfin order structure within the HubSpot CRM environment by creating and associating multiple objects, including Deals, Line Items, Companies (Agencies/Advisors), Projects, Quotes, and Services. It ensures complex cross-object relationship mapping between different stakeholders during the import process.

# Status and Runtime Controls

Include:

*   Timeout: 120 seconds
*   Retry behavior: Enabled (`retryOnFail: true`) for almost all external HTTP request nodes.
*   Error workflow: Routed to workflow ID `Bu0X3AXE7asHOIpX` upon failure.
*   Execution settings: Execution order is `v1`, time saved mode is `fixed`, and caller policy restricts access to `workflowsFromSameOwner`.

# Triggers & Entry Points

Explain each webhook or trigger node separately.

1. Sub-workflow Trigger: An `executeWorkflowTrigger` node that serves as the direct entry point. It expects a JSON payload containing an `orderID` from the Delfin system.
2. Webhook: A POST webhook at the path `callback-import-srw`. This acts as an asynchronous callback listener to process the order import after the initial trigger queues the task.

# Systems & Integrations

List all detected systems such as:

*   HubSpot CRM API (Deals, Companies, Contacts, Line Items, Quotes, Discounts, Custom Objects, HubDB)
*   Delfin API (External system for Orders, Bookings, Addresses)
*   Redis (via a Stream Producer Subworkflow)
*   Webhooks (Internal Callback)
*   Subworkflows (Auth, Variables, Redis Producer)

# Data Inputs & Key Fields

List:

*   Primary input fields: `orderID`
*   Important properties used in the workflow: `auF_Kampagne`, `auF_ErlNETTO3`, `auF_Erstausstrahlung`, `auF_DatumBis`, `adR_KundeGUID`, `adR_AgenturGUID`, `adR_VermittlerGUID`, `buC_Verrechenbar`, `buC_ErlKombi`, `buC_ErlMengenrabatt`, `buC_ErlAgenturProv`.

# Workflow Logic (Deep Analysis)

Explain step-by-step:

1. Initial trigger: The workflow is triggered directly via the Sub-workflow Trigger passing an `orderID`. It immediately forwards this to a Redis Stream Producer subworkflow and completes. Concurrently, a Webhook listens for a callback to actually begin the heavy processing.
2. Data retrieval: Upon receiving the webhook callback, the workflow executes the `Global variables` and `Server Authorize` subworkflows to obtain API URLs, HubDB IDs, auth headers, and HubSpot pipeline identifiers. It then calls the Delfin API to fetch the full order using `Get Order By Order Number`.
3. Data validation: Checks if the Order Response is not empty. If valid, it further checks if `adR_VermittlerGUID` matches a specific hardcoded value and `externalID` is empty.
4. Conditional logic: Performs duplicate checks by querying HubSpot to see if a Deal (`HS - Search deal`) and a Service (`HS - Search service`) already exist with the matched `delfin_order_id`.
5. Branch execution: If no existing deals or services are found (Total == 0), the workflow proceeds into the main creation branch.
6. External system calls: Creates a new Deal in HubSpot. Then fetches associated internal orders and platforms from HubDB. Queries Delfin for `Get Bookings By Order ID`.
7. Data creation or update: Filters valid bookings, generates JSON payloads, and creates HubSpot Line Items. It conditionally evaluates Customer (Kunde), Agency (Agentur), and Advisor (Vermittler) records. For each, it queries Delfin for Address details, searches HubSpot for existing Companies, and either creates new HubSpot Companies or associates the new Deal to existing ones.
8. Merge operations: All company processing paths converge at a `Merge` node. The workflow then prepares discount data (Kombi, Mengenrabatt, etc.) and creates corresponding HubSpot Discount records. It also creates custom object records for Projects and Services.
9. Final updates: Aggregates the newly created Line Items and Discounts, generates a Quote payload, creates the Quote in HubSpot, creates Line Items specifically for the Quote, and finally returns a `{ "status": true }` payload.

# Branch Execution Details

For each IF node:

*   If Order Response Not Empty1:

Condition logic: Checks if the Delfin order JSON is not empty.

TRUE path: Proceeds to `Check adR_VermittlerGUID and externalID`.

FALSE path: Halts execution.

*   Check adR\_VermittlerGUID and externalID:

Condition logic: Checks if `adR_VermittlerGUID` equals `baa2bbbe-f643-40ee-a5f7-712f3e8da73d` AND `externalID` is empty.

TRUE path: Executes `HS - Search deal`.

FALSE path: Halts execution.

*   If total == 0 (Deal Search):

Condition logic: Checks if HubSpot returned 0 deals for the specific `delfin_order_id`.

TRUE path: Executes `HS - Search service` to double-check custom objects.

FALSE path: Halts execution (avoids duplication).

*   If total === 0 (Service Search):

Condition logic: Checks if HubSpot returned 0 services.

TRUE path: Triggers `HS - Create Deal` and continues the core import logic.

FALSE path: Halts execution.

*   Check KundeGUID / Check Vermittler / Check Agentur:

Condition logic: Verifies if respective GUIDs exist in the Delfin order data.

TRUE path: Fetches address from Delfin, checks HubSpot for the company, creates or updates association.

FALSE path: Bypasses the company specific creation, merging back to the main flow.

*   Check Primary Company / Advisor Company / Agency Company:

Condition logic: Verifies if the HubSpot company search returned a successful status code (200) indicating the company exists.

TRUE path: Associates the existing HubSpot Company to the Deal.

FALSE path: Creates a new Company in HubSpot.

*   Discount Checks (Check has auF\_ErlKombi1, etc.):

Condition logic: Checks if the specific financial discount values from Delfin are strictly greater than 0.

TRUE path: Executes a HubSpot HTTP request to create that specific discount object.

FALSE path: Skips discount creation.

# External Operations

Explain:

*   Database usage: Queries HubSpot HubDB for mapping Internal Orders (`internal_order_hubdb_id`) and Platforms (`platform_hubdb_id`).
*   API calls: Massive usage of HTTP requests. Interacts with Delfin (`/api/Orders/`, `/api/Address/`) to read source data. Interacts with HubSpot CRM v3/v4 API endpoints to search, read, and write data.
*   Object creation: Creates Deals, Line Items (Batch), Companies, Deals Associations, Quotes, Line Items for Quotes, Discounts, and Custom Objects (Operation projects and Services).
*   Object updates: Extensively updates associations via PUT requests to HubSpot CRM v4 association endpoints (linking Companies and Contacts to Deals).

# Subworkflows Used

List:

*   Workflow name: Global variables

Workflow ID: YTKoYUXPDy5OGV16

Purpose: Fetches centralized environment variables, HubDB IDs, pipeline IDs, and association type IDs.

Inputs: None specified directly.

*   Workflow name: Delfin | Server Authorize

Workflow ID: BIgOTMaifk7QSG1B

Purpose: Obtains bearer tokens and base URLs for authenticating with the Delfin API.

Inputs: None specified directly.

*   Workflow name: Subworkflow | Redis Stream Producer Workflow

Workflow ID: 1tiTZLzrMssZ4trX

Purpose: Pushes the incoming request to a Redis queue for asynchronous processing.

Inputs: `type` (disposition), `data` (orderID), `callbackWebhook`.

# Database Collections

Explain the purpose of each collection used:

*   internal\_order\_hubdb\_id: Maps text descriptions of spots/campaigns from Delfin to HubSpot internal order codes.
*   platform\_hubdb\_id: Maps Delfin platform identifiers to standardized HubSpot platform names.

# Security Notes

Detect:

*   Hardcoded tokens: A hardcoded Bearer token (`dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`) is present in `Code in JavaScript1`.
*   Credentials: Uses `httpHeaderAuth` via generic credential ID `SmSUyv0Pf8gThTzV` (Production | HubSpot | Header Auth to connect private app).
*   Sensitive operations: Direct financial data manipulation (discounts, net revenues, quotes) and batch creation of CRM records.

# Known Limitations / Risks

Detect issues such as:

*   Unprocessed branches: Many of the negative (FALSE) paths on the conditional IF statements simply dead-end. If an order fails a condition (like the hardcoded VermittlerGUID check), the workflow drops the process silently without logging a failure status.
*   Missing error handling: While HTTP requests have `retryOnFail`, logical failures (e.g., Delfin returning an empty booking array) might cause upstream code nodes to fail due to undefined array indices.
*   Race conditions: The heavy usage of separate HTTP requests to check and create records without locking could result in race conditions if the same webhook fires twice simultaneously.
*   Incomplete logic: A disabled node (`HS - Create tax for Quote`) exists, meaning tax calculation is currently manually managed or skipped. The script explicitly mentions `// No need to create Tax for Quote`.

# Final Outputs

Explain what the workflow produces when successful.
When successfully executed, the workflow results in a fully structured CRM entity within HubSpot. This includes a Deal with accurate financial line items, linked Customer/Agency/Advisor Companies, applied Discount records, associated Project and Service custom objects, and a generated Quote ready for approval. The final technical output of the workflow is a JSON object returning `{ "status": true }`.