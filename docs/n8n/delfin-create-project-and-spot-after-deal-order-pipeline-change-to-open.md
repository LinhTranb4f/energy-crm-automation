---
title: 'Delfin | Create project and spot after deal order pipeline change to open'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623735
---

# Summary

*   **Workflow URL:** [https://n8n.tools.energy/workflow/qa9vrwXswL1AgoZj](https://n8n.tools.energy/workflow/qa9vrwXswL1AgoZj)
*   **Workflow ID:** qa9vrwXswL1AgoZj
*   **Workflow Name:** Delfin | Create project and spot after deal order pipeline change to open
*   **Status:** Active

# Purpose

The primary business goal of this workflow is to automate the creation of custom projects and associated "spot" records in HubSpot CRM when a deal's order pipeline changes to "open". To ensure reliable execution and handle API limits smoothly, the workflow securely queues the incoming HubSpot request via a Redis stream and performs the data processing and project creation asynchronously through a callback mechanism.

# Status and Runtime Controls

*   **Execution Settings:** Runs under the caller policy `workflowsFromSameOwner`.
*   **Error Workflow:** Configured to trigger error handling workflow `wT0xsVj2O6kGhRfD` upon critical failure.
*   **Retry Behavior:** HTTP Request nodes to HubSpot have "Retry On Fail" enabled with a standard `waitBetweenTries` of 5000ms.
*   **Timeout:** Relies on standard n8n execution timeouts. HubSpot API calls have inherent timeout boundaries.

# Triggers & Entry Points

*   **Webhook queue:** A POST webhook listening at `/create-project`. It uses Header Authentication and acts as the initial entry point, receiving payloads directly from a HubSpot workflow.
*   **Callback create project:** A POST webhook listening at `/callback-create-project`. This acts as the secondary entry point, triggered by a background Redis worker to continue processing the queued payload asynchronously.

# Systems & Integrations

*   HubSpot CRM API (Custom Objects, Deals, Associations)
*   Redis (via Producer Subworkflow for asynchronous message queuing)
*   Webhooks (n8n native triggers)
*   Internal Utilities (Global Variables subworkflows)

# Data Inputs & Key Fields

*   **Primary Input Fields:** `dealID`.
*   **Important Properties Used:**
    *   From Deal: `amount`, `deal_currency_code`, `dealname`, `campaign_start`, `campaign_end`, `billing_cycle`, `product_group`, `revenue_stream`, `spot_motive_quantity`.
    *   Derived Data: Associated Company IDs and Contact IDs.
    *   System Data: Environment variables, association type IDs, and pipeline stage IDs fetched from the Global Variables subworkflow.

# Workflow Logic (Deep Analysis)

1. **Initial trigger:** The workflow starts when `Webhook queue` receives a POST request containing a `dealID` from HubSpot.
2. **Data validation & Queuing:** A JavaScript Code node prepares an authentication token, then `Call 'Subworkflow | Redis Stream Producer Workflow'1` places the `dealID` and a `callbackWebhook` URL into a Redis queue.
3. **Callback Execution:** Once processed by Redis, the `Callback create project` webhook receives the queued event and resumes the business logic.
4. **Data retrieval (Configuration):** The `Call Global variables WF` subworkflow fetches global environment settings and label IDs.
5. **Data retrieval (HubSpot CRM):** `Get deal properties` requests the Deal's details and active associations (Companies, Contacts, Line items) from the HubSpot API.
6. **Data transformation:** Separate JavaScript nodes (`Get company id`, `Get contact id`) filter the association results to remove unlabeled edge cases.
7. **Data preparation:** The `Create project property` node cross-references the filtered associations with global variable Type IDs to map exact relational categories (e.g., Agency, Broker, Invoice Recipient) and structures the JSON payload.
8. **External system call:** `Create custom project` sends a POST request to HubSpot to generate the project object.
9. **Conditional logic:** Using "Continue On Error" behavior, the flow splits based on the HubSpot API response.
10. **Final updates (Success Branch):** The `Create Spot properties` code node calculates the number of spots based on `spot_motive_quantity`, formats their names, and sets associations. The payload passes through a `Wait` node into a Split In Batches loop (`Loop Over Items1`), where `HS - Create Spot` creates each individual spot in HubSpot iteratively.
11. **Final updates (Error Branch):** If project creation fails, `Code in JavaScript` intercepts the raw HubSpot error string, parsing it to identify specific validation failures (e.g., missing properties). It passes a cleaned string to `Update error to deal`, patching the originating Deal with an administrative error message.

# Branch Execution Details

While there is no explicit IF/THEN node, branching occurs inherently via the Error Handling settings on the `Create custom project` node:

*   **TRUE / Success Path:** If the HTTP request succeeds, execution continues to `Create Spot properties`. It loops through an array created based on the deal's motive quantity, batching API calls to create multiple Spot objects.
*   **FALSE / Error Path:** If the HubSpot POST request returns an error (e.g., 400 Bad Request), the built-in error object routes to the `Code in JavaScript` parser node. The parsed message is then sent to the `Update error to deal` HTTP node, ending the workflow.

# External Operations

*   **API calls:**
    *   GET to retrieve Deal properties.
    *   POST to create the primary custom project.
    *   POST (within a loop) to create associated Spot records.
    *   PATCH to update the Deal with error diagnostic text.
*   **Object creation:** Instantiates Custom Projects and Spots inside HubSpot.
*   **Object updates:** Updates Deals with custom property data.

# Subworkflows Used

*   **Workflow Name:** Subworkflow | Redis Stream Producer Workflow
    *   **Workflow ID:** 1tiTZLzrMssZ4trX
    *   **Purpose:** Offloads the request to a Redis queue to prevent timeouts during peak execution spikes.
    *   **Inputs:** `type`, `data` (containing `dealID`), `callbackWebhook`.
*   **Workflow Name:** Global variables
    *   **Workflow ID:** YTKoYUXPDy5OGV16
    *   **Purpose:** Centralized internal utility that returns environment-specific configuration parameters and HubSpot association IDs.
    *   **Inputs:** None.

# Database Collections

*   This workflow does not directly query database collections (like MongoDB) via standard nodes. It relies on **Redis Streams** via a Subworkflow pattern to act as an asynchronous message queue.

# Security Notes

*   **Hardcoded tokens:** The `Code in JavaScript1` node contains a hardcoded Bearer token (`Bearer dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`). This presents a security and maintenance risk.
*   **Credentials:** Uses properly vaulted credentials (`Production | HubSpot | Header Auth`) for authenticating inbound webhooks and outbound API calls to HubSpot.

# Known Limitations / Risks

*   **Hardcoded Credentials:** The Bearer token in the JavaScript code should be migrated to n8n's credential management system. If it expires, the queue mechanism will break silently.
*   **Loop Error Handling:** If the `HS - Create Spot` HTTP Request node fails mid-loop, there is no explicit error catch loop configured, potentially resulting in partially created spots without notifying the user.
*   **Orphaned Nodes:** The `Send data to queue` HTTP Request node is disconnected from the main flow logic but remains in the canvas, which could cause developer confusion.

# Final Outputs

When successful, the workflow produces:

1. A new Custom Project object in HubSpot, populated with financial/date data and appropriately associated to the Deal, multiple Contacts, and Companies.
2. One or multiple Spot objects in HubSpot (matching the Deal's requested quantity), associated to both the Deal and the new Project.

If project creation fails, the workflow produces an updated Deal record in HubSpot containing human-readable error validation details.