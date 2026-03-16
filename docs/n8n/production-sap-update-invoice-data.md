---
title: 'Production | SAP | Update Invoice data'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623375
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/nUB5rdXPnpOlpgE2](https://n8n.tools.energy/workflow/nUB5rdXPnpOlpgE2)
Workflow ID: nUB5rdXPnpOlpgE2
Workflow Name: Production | SAP | Update Invoice data
Status: Active

# Purpose

The primary business goal of this workflow is to manage the synchronization of invoice data between SAP and HubSpot CRM. It acts as an asynchronous bridge by first receiving raw invoice payloads, pushing them to a Redis stream queue for processing, and later handling a callback to update the matched invoice records directly within HubSpot.

# Status and Runtime Controls

*   Timeout: No specific timeout is configured at the workflow level.
*   Retry behavior: The 'Get Invoice' action does not retry on failure. However, the 'Update Invoice' action is configured to retry on failure with a 5000ms wait between attempts.
*   Error workflow: Execution errors are routed to a dedicated error workflow with the ID 'wT0xsVj2O6kGhRfD'.
*   Execution settings: The workflow uses 'v1' execution order and restricts the caller policy to 'workflowsFromSameOwner'.

# Triggers & Entry Points

*   Webhook queue: A POST webhook at the path 'update-invoice-queue'. This acts as the initial entry point for incoming SAP invoice data and is secured using header authentication.
*   Webhook: A POST webhook at the path 'callback-update-invoice'. This serves as the callback entry point triggered by the Redis stream once the queued data is ready to be processed into HubSpot.

# Systems & Integrations

*   HubSpot CRM API (Invoices Object)
*   Subworkflows (Redis Stream Producer)
*   Webhooks (Internal triggering mechanism)

# Data Inputs & Key Fields

*   Primary input fields: 'invoiceID' is the critical identifier used to look up and validate the exact invoice in HubSpot.
*   Important properties used in the workflow include: 'accounting\_document\_number', 'hs\_title', 'record\_type', 'customer\_number', 'payment\_type', 'tax\_rate', 'nonaccounting\_relevant', and 'original\_purchase\_order'.

# Workflow Logic (Deep Analysis)

This workflow is split into two distinct asynchronous phases: Queue Ingestion and Callback Processing.

1. Initial trigger (Ingestion): Data arrives via the 'Webhook queue' POST request.
2. Data preparation: The 'Code in JavaScript1' node injects a Bearer authorization token into the payload.
3. External system calls (Queueing): The 'Call Subworkflow | Redis Stream Producer Workflow' node sends the payload, categorizing the type as 'new\_invoice', to a Redis stream for queued processing. A callback URL is also attached.
4. Initial trigger (Callback): Once processed by the queue, a POST request hits the secondary 'Webhook' node with the necessary payload.
5. Data retrieval: The 'Get Invoice' HTTP request queries the HubSpot CRM v3 API to find the existing invoice using the provided 'invoiceID'.
6. Conditional logic: The 'If' node evaluates whether the invoice lookup was successful by checking if a valid ID was returned from HubSpot.
7. Data validation and formatting: If the invoice exists, the 'Code in JavaScript' node prepares the payload for HubSpot. It clones the incoming webhook body and explicitly deletes the 'invoiceID' property to prevent attempting to update the object's primary key.
8. Final updates: The 'Update Invoice' HTTP request sends a PATCH call to HubSpot with the sanitized payload, successfully updating the invoice record.

# Branch Execution Details

For the 'If' node:

*   Condition logic: Evaluates if '{{ $[json.id](http://json.id) }}' (the HubSpot ID) exists and is not strictly empty.
*   TRUE path: Execution moves to the 'Code in JavaScript' payload sanitization step, followed directly by the 'Update Invoice' API call.
*   FALSE path: There are no nodes attached to this branch. If the invoice is not found in HubSpot, the execution silently stops.

# External Operations

*   API calls: The workflow relies heavily on the HubSpot CRM v3 API, utilizing a GET request to retrieve invoice details and a PATCH request to update invoice properties.
*   Object updates: Modifies existing Invoice objects directly in the HubSpot CRM.
*   Subworkflow execution: Initiates an external workflow to handle pushing data to a Redis stream message broker.

# Subworkflows Used

*   Workflow name: Subworkflow | Redis Stream Producer Workflow
*   Workflow ID: 1tiTZLzrMssZ4trX
*   Purpose: Abstracts the queuing logic by publishing the incoming invoice payload to a Redis stream.
*   Inputs: Requires 'type' (set to "new\_invoice"), 'data' (the JSON payload), and 'callbackWebhook' (the destination URL for the system to hit once processed).

# Database Collections

There are no direct MongoDB or SQL collections queried within this workflow. HubSpot serves as the primary system of record (CRM database), and Redis serves as the message broker (accessed via the subworkflow).

# Security Notes

*   Hardcoded tokens: A significant security consideration is present in the 'Code in JavaScript1' node, which contains a hardcoded Bearer token. This should ideally be moved to n8n credentials.
*   Credentials: The workflow correctly uses configured n8n credentials ('httpHeaderAuth' and 'hubspotAppToken') for secure HubSpot authentication.
*   The initial 'Webhook queue' correctly enforces Header Authentication to prevent unauthorized payload ingestion.

# Known Limitations / Risks

*   Unprocessed branches: The FALSE branch of the 'If' node is unhandled. Missing invoices will fail silently without triggering an alert or logging mechanism.
*   Hardcoded credentials: The token inside the JavaScript node creates an exposure risk and maintenance debt.
*   Disabled nodes: There is an abandoned/disabled HTTP request node ('Send data to queue') left on the canvas which might cause confusion for future developers.
*   Error handling edge cases: The 'Get Invoice' node is set to continue on error, which passes potentially missing or malformed data to the 'If' node. While the 'If' node handles the missing ID safely, explicit error routing would make the workflow more robust.

# Final Outputs

Upon successful execution of both phases, the workflow queues an incoming SAP invoice payload, validates its existence in HubSpot CRM via a callback, and performs a clean PATCH update to sync the latest invoice properties into the corresponding HubSpot record.