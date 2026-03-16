---
title: 'Production | SAP | Line items sync'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623195
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/7Gdvjgto7RT2iF0j](https://n8n.tools.energy/workflow/7Gdvjgto7RT2iF0j)
Workflow ID: 7Gdvjgto7RT2iF0j
Workflow Name: Production | SAP | Line items sync
Status: Active

# Purpose

The primary business goal of this workflow is to synchronize and dynamically calculate line item data between HubSpot CRM and an external SAP system. It automatically determines correct pricing, quantities, discounts, and formatted descriptions for various product types (e.g., Radio Spots, Audio Production, Digital Spots, and Joint Ventures) by cross-referencing live CRM data with MongoDB rate cards and HubDB discount tables. It also offloads syncing tasks to a Redis Stream queue for asynchronous processing.

# Status and Runtime Controls

*   Timeout: 300 seconds execution timeout limit.
*   Retry behavior: Multiple HTTP request nodes (like HubSpot API calls) are configured to retry on failure (`retryOnFail: true`), typically with a 5000ms wait between tries.
*   Error workflow: Dedicated error handling is routed to workflow ID `Bu0X3AXE7asHOIpX`.
*   Execution settings: Runs on `v1` execution order, restricted to `workflowsFromSameOwner`, with a `fixed` time-saved mode.

# Triggers & Entry Points

*   Received HubSpot data: A POST webhook endpoint (`/get-internal-line-item`) acting as the primary entry point for HubSpot CRM changes.
*   Get triggered data from Hubspot: A callback POST webhook (`/callback-get-internal-line-item`) triggered after queued items are processed.
*   Get triggered data from Hubspot1: A callback POST webhook (`/callback-update-original-line-item-id`) handling the specific flow for stamping original IDs on newly created line items.

# Systems & Integrations

*   HubSpot CRM API: For querying and patching Line Items and Deals.
*   HubSpot CMS API (HubDB): For retrieving the Annual Agreement Discount Table.
*   MongoDB: For querying specific rate cards and product catalogs.
*   External APIs: HTTP endpoints interacting with `n8n.tools.energy/webhook/energy-redis-stream`.
*   Subworkflows: Used to modularize the Redis Stream producing tasks.
*   Webhooks: For internal async callbacks.
*   Internal utilities: Extensive JavaScript Code nodes to perform complex data aggregations and text parsing.

# Data Inputs & Key Fields

*   Primary input fields: Line item payload data including `hs_object_id`, `quantity`, `amount`, `price`, `name`, `targeting`, `spot_duration`, `spot_count`, `plattform`, `time_category`, `week_type`, `rubric`, `production_type`, `laufzeit`, `kw`, `jv_amount_of_digital_ads_per_second`, and `product_group`.
*   Important properties used: Event metadata like `changeSource` and `subscriptionType`.
*   Associated Objects: HubSpot Deal and Quote associations.

# Workflow Logic (Deep Analysis)

1. Initial trigger: Webhooks receive real-time line item payloads from HubSpot.
2. Data validation: The system checks the `subscriptionType` and `changeSource` fields to verify if the event was a creation event or triggered via the CRM UI.
3. Conditional logic: Line items are categorized through multiple IF nodes evaluating the product name (Radio Spots, Audio Produktion, Radio Sponsoring, Digital Spots, or JV products).
4. Data retrieval: The workflow fetches rate cards concurrently from 4 different MongoDB collections and retrieves any necessary discount tiers from HubDB.
5. Merge operations: A Merge node waits for all MongoDB dataset queries to complete before combining them for down-stream processing.
6. Branch execution: Based on the product category, specific JavaScript nodes execute to calculate `price`, `quantity`, and generate rich `description` strings.
7. External system calls: Processed payloads are formatted and passed via execute workflow nodes or HTTP requests to a Redis Stream producer for SAP consumption.
8. Data creation or update: HubSpot is patched with the recalculated line item values (prices, percentages, and descriptions).
9. Final updates: Original line item IDs are checked and stamped onto new records to maintain data lineage.

# Branch Execution Details

*   Check subscriptionType:
    *   Condition logic: Evaluates if any item has `subscriptionType == 'line_item.creation'`.
    *   TRUE path: Filters created line items and triggers the Redis Stream Producer subworkflow specifically for creation events, then checks if the original ID needs updating.
    *   FALSE path: Routes to the standard update logic.
*   If change source is CRM\_UI:
    *   Condition logic: Evaluates if `changeSource == 'CRM_UI'`.
    *   TRUE path: Extracts an authorization token and POSTs to the Redis stream endpoint.
    *   FALSE path: Halts execution on this branch to prevent loopbacks from API/Integration changes.
*   Check if line item is Radio Spots:
    *   Condition logic: Checks if product\_group is 'radio\_spots' or name is 'Radio Spots'.
    *   TRUE path: Runs 'Adjust the Radio Spots properties', recalculating quantity as count \* duration, fetching unit price, and patching the line item.
    *   FALSE path: Forwards to Audio Produktion check.
*   Check if line item is Audio Produktion:
    *   Condition logic: Checks if name equals 'Audio Produktion'.
    *   TRUE path: Runs 'Adjust the Audio Produktion properties', fetching matching production type prices, then updates the line item.
    *   FALSE path: Forwards to Radio Sponsoring check.
*   Check if line item is Radio Sponsoring:
    *   Condition logic: Checks if name equals 'Radio Sponsoring'.
    *   TRUE path: Runs 'Adjust the Radio Sponsoring properties', calculating total mentions and adjusting price based on 'laufzeit', then updates the item.
    *   FALSE path: Forwards to Digital Spots check.
*   Check if line item is Digital Spots:
    *   Condition logic: Checks if name equals 'Digital Spots'.
    *   TRUE path: Runs 'Adjust the Digital Spots properties', counting targetings. If targetings > 3, sets price to 0. Otherwise, fetches unit price from Mongo, formatting the description. Updates the item.
    *   FALSE path: Forwards to JV regex check.
*   Check if line item is Digital Spots1 (JV Check):
    *   Condition logic: Uses Regex `/^JV (Pool|National|ohne Digital|Einzelsender)$/` to identify Joint Venture products.
    *   TRUE path: Fetches the 'Annual Agreement Discount Table' from HubDB, runs 'Adjust the JV properties1' to apply tier-based percentage discounts, and updates the line item.
    *   FALSE path: Execution completes without modification.

# External Operations

*   Database usage: MongoDB is used purely as a reference catalog for 4 specific product types. HubDB is used to store tiered discount percentages for JV products.
*   API calls: HubSpot API `PATCH /crm/v3/objects/line_items/{id}` is used extensively to write calculated data back to the CRM. `POST /crm/v3/objects/line_items/search` is used for batch querying.
*   Object creation: No direct object creation occurs; operations are purely updates (PATCH) or queue pushes.
*   Object updates: Modifies `price`, `description`, `quantity`, `count_of_targetings`, `hs_discount_percentage`, and `original_line_item_id`.

# Subworkflows Used

*   Workflow name: Subworkflow | Redis Stream Producer Workflow
*   Workflow ID: 1tiTZLzrMssZ4trX
*   Purpose: Acts as an abstraction layer to queue standard webhooks into a Redis Stream.
*   Inputs: `type` (string identifying payload), `data` (the raw JSON payload), and `callbackWebhook` (URL pointing back to parent workflow webhooks).

# Database Collections

*   article\_db\_digital\_spots: Stores pricing based on targeting configurations and platform.
*   article\_db\_radio\_sponsoring: Stores standard unit prices and weekly mention parameters.
*   article\_db\_radio\_spots: Stores unit prices segmented by platform, time category (prime vs. day), and week type.
*   article\_db\_audio\_production: Stores internal orders, revenue accounts, and unit prices for production items.

# Security Notes

*   Hardcoded tokens: A serious security flag is present in node "Code in JavaScript3" where a raw Bearer token (`dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`) is hardcoded.
*   Credentials: The workflow securely utilizes predefined N8N credentials for MongoDB (`DvhNAsGpXjnr2mJt`) and HubDB/CRM API scopes (`SmSUyv0Pf8gThTzV`, `Xnr7t1KxvHzAfTu8`, `hkNMSENJ4wCVIBGP`).
*   Sensitive operations: Syncing financial data (prices and discounts) between systems. Requires strict access controls on the Webhook endpoints.

# Known Limitations / Risks

*   Unprocessed branches: Multiple nodes are currently disabled (e.g., "Update deal amount", "Get line items associated with the current deal", "Get amount"), meaning deal-level aggregations are bypassing execution.
*   Missing error handling: While HTTP requests have retries and an overarching error workflow is set, inline failure handling (fallback logic if MongoDB is down) inside JS Code nodes is sparse and might crash the node.
*   Race conditions: Running multiple updates simultaneously from rapid UI changes (`changeSource == CRM_UI`) could create race conditions for patching HubSpot if webhooks arrive out of order.
*   Hardcoded Secrets: The presence of a hardcoded Bearer Token limits rotation security and poses a leak risk.

# Final Outputs

When successful, the workflow ensures that a HubSpot line item is perfectly formatted with the correct computed price, tiered discount, exact quantity, and a concatenated human-readable description. Furthermore, it confirms that this synchronized state is securely transmitted to the SAP-bound Redis stream, stamping the original line item ID for future traceability.