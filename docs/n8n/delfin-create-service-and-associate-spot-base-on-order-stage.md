---
title: 'Delfin | Create service and associate spot base on order stage'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623255
---

# Summary

*   Workflow URL: [https://n8n.tools.energy/workflow/Xvrt8HPgsSe6m13P](https://n8n.tools.energy/workflow/Xvrt8HPgsSe6m13P)
*   Workflow ID: Xvrt8HPgsSe6m13P
*   Workflow Name: Delfin | Create service and associate spot base on order stage
*   Status: Active

# Purpose

The business goal of this workflow is to automate the creation of project service records inside HubSpot based on deal stages. It dynamically associates these newly created services with related spots, companies, contacts, and projects. It implements an asynchronous queueing pattern to handle processing reliably, and maps specific line item groupings (e.g., aggregating 'Radio Spots' versus looping individually over 'Digital Spots' or 'Audio Production') to keep the CRM records accurate and organized.

# Status and Runtime Controls

*   Timeout: Relies on standard n8n execution timeouts; no specific node-level timeout overrides exist.
*   Retry behavior: HubSpot API HTTP Request nodes (Get properties, Update error, Create service) are explicitly configured to retry on failure (`retryOnFail: true`) with a 5000ms wait between tries.
*   Error workflow: Executions failing unexpectedly are routed to a dedicated subworkflow with ID `Bu0X3AXE7asHOIpX`.
*   Execution settings: Runs on `executionOrder: v1` with `timeSavedMode: fixed`.

# Triggers & Entry Points

*   Webhook queue (POST): Listens at path `create-service-and-spot`. It receives the initial event payload directly from HubSpot, containing the `dealID`. Requires Header Authentication.
*   Callback create project service (POST): Listens at path `callback-create-service-spot`. This webhook acts as the secondary trigger that continues the actual business logic once the queue system executes the callback.

# Systems & Integrations

*   HubSpot CRM API: Used heavily for querying objects (Deals, Line Items), creating custom objects (Services / 0-162), updating Deal properties, and establishing User-Defined Associations.
*   Redis Stream: Interacted with via an internal webhook (`https://n8n.tools.energy/webhook/energy-redis-stream`) to queue operations.
*   Subworkflows: Executes other internal utilities for modular processes.
*   Webhooks: Acts as the primary entry point and callback mechanism.

# Data Inputs & Key Fields

*   Primary input fields: `dealID` is passed from the triggers.
*   Key Properties Used:
    *   Deal Properties: `amount`, `deal_currency_code`, `dealname`, `campaign_start`, `campaign_end`, `billing_cycle`, `dealstage`, `disposition_briefing`, `spot_motive_quantity`.
    *   Line Item Properties: `amount`, `quantity`, `description`, `product_group`, `plattform`, `hs_pre_discount_amount`, `hs_total_discount`, `spot_count`, `spot_duration`, `production_type`, `week_type`, `time_category`, `kw`, `laufzeit`.
    *   Custom Object IDs: Deals (0-3), Services (0-162), Projects (`p48268320_operations_projects`), Spots (`p48268320_spots`).

# Workflow Logic (Deep Analysis)

1. Initial trigger: `Webhook queue` receives the `dealID` from HubSpot.
2. External system call (Queueing): A Javascript node hardcodes a Bearer token and triggers the `Call Subworkflow | Redis Stream Producer Workflow` and `Send data to queue` to push the job to a Redis queue. The queue payload includes a callback URL pointing to the second webhook.
3. Secondary trigger (Callback): `Callback create project service` receives the queued `dealID` to begin processing.
4. Delay: A `Wait` node introduces a 10-unit delay to ensure CRM data consistency before fetching.
5. Global Variables Load: Executes subworkflow `Call Global variables WF` to fetch system constants (e.g., pipeline IDs, association type IDs).
6. Data retrieval (Deal): `Get deal properties` calls HubSpot to fetch deep details about the deal, including associations for contacts, companies, line items, projects, and spots.
7. Data validation (Line Items): `If2` checks if line item associations exist. If false, it patches the Deal with an error message. If true, it proceeds to fetch associated Company, Contact, and Project IDs via JavaScript nodes.
8. Conditional logic (Spots): `If` node checks if spot associations exist to extract them for later linkage.
9. Data retrieval (Line Items Detail): `Get all properties of line items` executes a bulk search in HubSpot to get rich details for the retrieved line item IDs.
10. Branch execution (Deal Stage): A `Switch` node routes execution based on `dealstage` (Order Clarification vs. Order Confirmed).
11. Filter Logic: Subsequent nodes filter line items into 'Radio Spots' and 'Non-Radio Spots'.
12. Data creation (Radio): Aggregates all radio spots into a single service object payload and creates it via HubSpot API.
13. Data creation (Non-Radio): Loops through each non-radio line item, generates a specific payload per item, and creates separate service objects via HubSpot API.

# Branch Execution Details

*   If2 (Check Line Items):
    *   Condition: Checks if `associations['line items'].results` exists.
    *   TRUE path: Moves to extract Company, Contact, and Project IDs.
    *   FALSE path: Executes `Update error to deal3` which updates `error_message_for_projectservice_records` to "No Line items exist".
*   If (Check Spots):
    *   Condition: Checks if `associations["p48268320_spots"].results` exists.
    *   TRUE path: Extracts Spot IDs using the `Get all Spot ID` code node, then flows to line item extraction.
    *   FALSE path: Skips spot extraction and directly flows to line item extraction.
*   Switch (Deal Stage Check):
    *   Condition: Evaluates the Deal Stage ID.
    *   Route 1 (Order Clarification): `dealstage` == 4636861648. Proceeds to line item filters.
    *   Route 2 (Order Confirmed): `dealstage` == 4636861649. Proceeds to line item filters.
*   Filter Radio spot line items:
    *   Condition: `product_group` equals `radio_spots`.
    *   Flow: Aggregates properties (discounts, quantities) and builds ONE service record via `Combine all Radio spot data`.
*   Filter non Radio spot line items:
    *   Condition: `product_group` does not equal `radio_spots`.
    *   Flow: Uses a `SplitInBatches` node (`Loop Over Items`) to process each item individually, building and pushing individual service records.

# External Operations

*   API Calls:
    *   GET to `crm/v3/objects/0-3/{dealID}` for deal data.
    *   POST to `crm/v3/objects/line_items/search` to fetch deep line item properties.
    *   POST to `crm/v3/objects/0-162` to create the final Service records.
    *   PATCH to `crm/v3/objects/0-3/{dealID}` to log errors.
    *   POST to `n8n.tools.energy/webhook/energy-redis-stream` for message queueing.
*   Object Creation: Creates HubSpot records under object type `0-162` (Custom Object: Services).
*   Object Updates: Updates HubSpot Deal objects (0-3) on validation failure.

# Subworkflows Used

*   Workflow Name: Global variables
    *   Workflow ID: YTKoYUXPDy5OGV16
    *   Purpose: Returns standard IDs used in HubSpot payload generation (Pipeline IDs, Association Label IDs).
    *   Inputs: None mapped explicitly.
*   Workflow Name: Subworkflow | Redis Stream Producer Workflow
    *   Workflow ID: 1tiTZLzrMssZ4trX
    *   Purpose: Serves as a producer to push data to a Redis stream for asynchronous processing.
    *   Inputs: `type` (disposition), `data` (DealID object), `callbackWebhook` (URL).

# Database Collections

No direct traditional database collections are used. However, it deeply leverages HubSpot's custom object architecture:

*   0-3: Deals
*   0-162: Project Services
*   p48268320\_spots: Custom Object representing "Spots"
*   p48268320\_operations\_projects: Custom Object representing "Operations Projects"

# Security Notes

*   Hardcoded Tokens: The `Code in JavaScript1` node contains a hardcoded Bearer token (`dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`). This presents a security risk if the workflow is exported or accessed by unauthorized users.
*   Credentials: The workflow utilizes securely stored n8n credentials for HubSpot communication (`Production | HubSpot | Header Auth to connect private app` and webhook listeners).

# Known Limitations / Risks

*   Unprocessed Branches: If the `dealstage` in the Switch node is neither `4636861648` nor `4636861649`, the workflow stops silently. There is no fallback or error logging for unexpected deal stages.
*   Data Extraction Risks: The JavaScript nodes parsing deep JSON associations (e.g., Contacts, Companies, Projects) assume the associations exist if `If2` passes. If a deal has line items but lacks a project or company, the `.filter` and `.map` arrays might fail or generate empty arrays that later cause API rejection during the Association payload build.
*   Looping Execution: The `Loop Over Items` for non-radio spots processes sequentially. A large number of line items could encounter rate limiting on the HubSpot API without an internal wait/delay inside the loop.

# Final Outputs

When successful, the workflow creates one or more Service objects (HubSpot Custom Object 0-162). These objects are strictly populated with product logic (Radio aggregated vs. Digital individual) and are highly associated to the original Deal, associated Companies (applying precise association labels like Agency, Broker), associated Contacts (Primary, Advisor), Projects, and related Spots.