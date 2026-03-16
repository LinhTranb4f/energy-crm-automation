---
title: 'HubSpot | Update deal Amount to match new quote amount'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623335
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/2dNt9IGg7M3atctD](https://n8n.tools.energy/workflow/2dNt9IGg7M3atctD)
Workflow ID: 2dNt9IGg7M3atctD
Workflow Name: HubSpot | Update deal Amount to match new quote amount
Status: Active

# Purpose

This workflow calculates the accurate total value of a HubSpot Quote by aggregating its line items and applying percentage or fixed discounts. It then updates the associated Deal's amount to reflect this precise value. Additionally, it provides an asynchronous queuing mechanism utilizing a Redis stream producer to manage webhook traffic efficiently.

# Status and Runtime Controls

*   Timeout: Not explicitly defined.
*   Retry behavior: Multiple HTTP Request nodes (specifically the HubSpot API calls) are configured with `retryOnFail: true` and a wait time of `5000` milliseconds between attempts.
*   Error workflow: Execution errors are strictly routed to the designated error workflow ID `wT0xsVj2O6kGhRfD`.
*   Execution settings: Configured with `executionOrder: v1` and `callerPolicy: workflowsFromSameOwner`.

# Triggers & Entry Points

1. Webhook (callback-update-deal): A POST webhook that triggers the primary calculation and deal-updating logic. It is set to respond with data from the last executed node.
2. Webhook queue (update-deal-queue): A POST webhook configured with Header Auth (`Production | HubSpot | Header Auth...`) acting as an entry point to push quote IDs into a Redis processing queue.
3. Wait Node: Acts as a mid-flight suspend/resume trigger, halting the workflow until a specific callback webhook (`1bebadf7-9ebb-4698-8c1d-698db3461d34`) is received before updating the deal.

# Systems & Integrations

*   HubSpot CRM API
*   Redis (via Subworkflow)
*   n8n Subworkflows
*   Webhooks
*   Internal Utilities (Code blocks, Split in Batches, NoOp nodes)

# Data Inputs & Key Fields

*   Primary input fields: `quoteID` extracted from the incoming webhook JSON body.
*   Important properties used in the workflow:
    *   Quotes: `hs_sign_status`, `hs_status`, `hs_title`
    *   Line Items: `price`, `hs_total_discount`, `quantity`
    *   Discounts: `hs_type`, `hs_value`
    *   Deals: `amount`

# Workflow Logic (Deep Analysis)

1. Initial trigger: Execution begins at either the `callback-update-deal` webhook (Main Calculation Flow) or the `update-deal-queue` webhook (Queue Flow).
2. Data validation & Initialization: A Code node (`Global variables`) configures a Bearer token and isolates the `quoteID` for downstream use.
3. Data retrieval: The workflow fetches Quote details from HubSpot by ID, explicitly requesting associations for line items, deals, and discounts.
4. Conditional logic: An IF node (`If2`) inspects the quote data to determine if any quote-level discounts exist.
5. Branch execution: If discounts exist, it fetches the discount specifics (type and value) via the HubSpot API.
6. External system calls (Iterative): The workflow parses the line items array and processes it through a `Loop Over Items` (Split in Batches) node. Inside the loop, an HTTP request fetches individual line item properties (`price`, `quantity`, `hs_total_discount`).
7. Data validation (Loop): Each looped item passes through a NoOp node (`Replace Me`) before returning to the start of the batch.
8. Merge operations & Calculation: Once loop iteration finishes, a JavaScript Code node (`Get total_before_tax`) performs mathematical aggregations. It multiplies prices by quantities, subtracts line-level discounts, and computes quote-level discounts (handling both PERCENT and fixed values) to establish a final `total_before_tax`.
9. Final updates: The flow hits a Wait node, pausing execution. Once resumed via an external signal, a PATCH request updates the HubSpot Deal (`0-3` object) amount property with the newly calculated total.

# Branch Execution Details

IF Node: `If2`

*   Condition logic: Checks if `$json.associations.discounts.results` exists.
*   TRUE path: Routes to `Get discount by ID` to fetch the specific discount values, then proceeds to map out line items.
*   FALSE path: Unconnected. This branch has no downstream nodes mapped to it.

# External Operations

*   API calls:
    *   GET to HubSpot Quotes API to retrieve master object details and structural associations.
    *   GET to HubSpot Discounts API to fetch discount configurations.
    *   GET to HubSpot Line Items API (iterative inside a loop) to pull financial values per item.
    *   PATCH to HubSpot Deals API (Object type `0-3`) to write the updated financial calculation back to the CRM.
    *   POST to `n8n.tools.energy/webhook/energy-redis-stream` (configured but completely disconnected from the main flows).
*   Object updates: Overwrites the Deal `amount` parameter.

# Subworkflows Used

*   Workflow name: Subworkflow | Redis Stream Producer Workflow
*   Workflow ID: 1tiTZLzrMssZ4trX
*   Purpose: Acts as a queuing integration to push incoming webhook payloads into a Redis stream for decoupled, asynchronous processing.
*   Inputs: Passes `type` (hardcoded as "disposition"), `data` (containing the extracted `quoteID`), and a `callbackWebhook` URL referencing the main calculation trigger.

# Database Collections

While no external SQL/NoSQL databases are directly queried in the primary flow, the logic relies heavily on HubSpot's internal object schema representing collections:

*   `quotes`: The core object initiating the event.
*   `line_items`: Product/service level financial lines.
*   `discounts`: Collection holding quote modifier rules.
*   `0-3` (Deals): The parent sales object being manipulated.

# Security Notes

*   Hardcoded tokens: Several Code nodes and HTTP requests contain exposed, hardcoded Bearer tokens (`pat-eu1-7a350747...` and `dd3ca330...`). This represents a critical security risk; credentials should be migrated to n8n's encrypted credential manager.
*   Sensitive operations: Because the workflow directly manipulates CRM financial metrics (Deal Amount) via unauthenticated internal code blocks relying on hardcoded keys, unauthorized webhook POSTs could potentially manipulate pipeline revenue reporting.

# Known Limitations / Risks

*   Unprocessed branches: The FALSE branch on `If2` is entirely unconnected. If a Quote has no discounts attached, the condition evaluates to false, and the workflow silently stops executing, leaving the Deal amount un-updated.
*   Missing logic: A NoOp node explicitly named `Replace Me` sits mid-loop without any actual business logic assigned to it.
*   API Rate limits: The `Split in Batches` methodology fires individual HTTP GET requests for every single line item. Quotes with high line-item volumes risk hitting HubSpot API rate limit constraints.
*   Orphan Nodes: The `Send data to queue` HTTP node and its associated Sticky Note are completely disconnected from all flows and will never trigger.
*   Race conditions: Execution relies on a `Wait` node callback. If the webhook triggering resumption fails to fire or arrives before the wait node initializes, the execution will hang indefinitely.

# Final Outputs

When execution completes successfully, the workflow outputs a patched HubSpot Deal record where the Deal `amount` dynamically reflects the mathematically verified Quote value (accounting for all line-item quantities and layered discounts). Alternatively, when entering via the queue flow, it outputs a successful execution signal from the Redis stream producer subworkflow.