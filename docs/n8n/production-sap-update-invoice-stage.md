---
title: 'Production | SAP | Update Invoice Stage'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623595
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/9fOkBwwUWWpS7nwk](https://n8n.tools.energy/workflow/9fOkBwwUWWpS7nwk)
Workflow ID: 9fOkBwwUWWpS7nwk
Workflow Name: Production | SAP | Update Invoice Stage
Status: Active

# Purpose

This workflow acts as a middleware bridge to handle asynchronous invoice stage updates between an external system (likely SAP) and HubSpot CRM. It achieves this by receiving an initial payload, dispatching it to a Redis stream queue via a subworkflow for processing, and later handling a callback request to safely retrieve and update the corresponding invoice record within HubSpot.

# Status and Runtime Controls

*   Execution Settings: Configured to use execution order 'v1' and caller policy 'workflowsFromSameOwner'.
*   Timeout: No explicit timeout parameters are configured on the workflow level.
*   Retry behavior: The 'Update Invoice State' action automatically retries on failure (retryOnFail: true) with a 5000ms wait between attempts. The 'Get Invoice' action does not retry on fail but is configured to continue regular output on error.
*   Error workflow: Any uncaught errors are routed to a designated error workflow (ID: wT0xsVj2O6kGhRfD).

# Triggers & Entry Points

This workflow is driven by two independent webhooks functioning as entry points for two separate execution flows:

1. Webhook queue: A POST webhook at the path 'update-hs-invoice-state-queue'. This is the primary entry point expecting incoming invoice data. It is secured via header authentication.
2. Webhook (Callback): A POST webhook at the path 'callback-update-hs-invoice-state'. This acts as the listener for the queued task's completion, triggering the actual HubSpot data update. It operates in a 'lastNode' response mode.

# Systems & Integrations

*   n8n Webhooks (Incoming HTTP Triggers)
*   HubSpot CRM API (Invoices Object)
*   Redis Stream Producer (Internal Subworkflow)
*   Custom Internal API (Noted in a disabled node targeting [n8n.tools.energy/webhook/energy-redis-stream](http://n8n.tools.energy/webhook/energy-redis-stream))

# Data Inputs & Key Fields

Primary input fields extracted from incoming payloads:

*   invoiceID: Used to identify and fetch the invoice record from HubSpot.
*   invoiceStage: The new status to be applied to the invoice.

Important properties requested from HubSpot:

*   hs\_number
*   invoice\_stage

# Workflow Logic (Deep Analysis)

The workflow is split into two disconnected functional paths:

Queueing Phase (Path 1):

1. Initial trigger: The process starts when the 'Webhook queue' node receives a POST request containing invoice details.
2. Data preparation: The 'Code in JavaScript1' node executes, injecting a hardcoded Bearer token into the workflow data.
3. External delegation: The payload is passed to the 'Call Subworkflow | Redis Stream Producer Workflow' node. It formats the input as a 'new\_invoice' type, maps the data, and appends the callback webhook URL. This enqueues the task asynchronously.

Execution Phase (Path 2):

1. Callback trigger: Once the external queue processes the task, it sends a POST request to the 'Webhook' node.
2. Data retrieval: The 'Get Invoice' HTTP Request node queries the HubSpot CRM v3 API using the provided invoiceID to fetch the current invoice properties (specifically hs\_number and invoice\_stage).
3. Data validation & Conditional logic: The workflow uses an 'If' node to verify that a valid HubSpot ID was returned from the previous step.
4. Final updates: If validated, the 'Update Invoice State' HTTP Request node executes a PATCH request to the HubSpot API, updating the invoice\_stage property with the value initially provided in the callback.

# Branch Execution Details

The 'If' node evaluates whether the HubSpot API successfully found the invoice:

*   Condition logic: Checks if the string property 'id' exists in the JSON output from the 'Get Invoice' node.
*   TRUE path: Execution proceeds to the 'Update Invoice State' node to finalize the stage modification in HubSpot.
*   FALSE path: No nodes are connected. If the ID is missing (e.g., invoice not found), the workflow halts silently.

# External Operations

*   API Calls:
    *   GET request to HubSpot CRM v3 API to fetch the invoice by ID.
    *   PATCH request to HubSpot CRM v3 API to update the existing invoice properties.
*   Subworkflow Calls: Executes a remote integration to push data to a Redis stream.

# Subworkflows Used

*   Workflow Name: Subworkflow | Redis Stream Producer Workflow
*   Workflow ID: 1tiTZLzrMssZ4trX
*   Purpose: Acts as a generic producer to safely enqueue incoming data payloads into a Redis Stream for asynchronous processing.
*   Inputs:
    *   type: 'new\_invoice'
    *   data: The full JSON body received from 'Webhook queue'
    *   callbackWebhook: A JSON object defining the method (POST) and URL for the callback webhook.

# Database Collections

No direct database collections (like MongoDB or SQL nodes) are queried within this specific workflow structure.

# Security Notes

*   Hardcoded tokens: The 'Code in JavaScript1' node contains a raw, hardcoded Bearer token (dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a). This should be moved to n8n's secure credential vault.
*   Credentials: The HubSpot HTTP requests correctly utilize a managed 'hubspotAppToken' (N8N Invoice Scope).
*   Webhook Security: The 'Webhook queue' trigger uses Header Auth for validation. However, the 'Webhook' (Callback) node lacks explicit authentication in its node parameters, potentially exposing it to unverified requests.

# Known Limitations / Risks

*   Unprocessed FALSE branch: If the 'Get Invoice' action fails to locate an invoice in HubSpot, the execution hits the FALSE path of the 'If' node and stops entirely without logging the failure or notifying administrators.
*   Security Risk: The hardcoded Bearer token in the code node poses a credential leakage risk.
*   Orphaned / Disabled Logic: There is a disabled 'Send data to queue' node. It should be removed if the subworkflow completely replaces its functionality to maintain clean technical debt.

# Final Outputs

Upon successful completion of the queuing path, the workflow outputs a success receipt from the Redis Stream Subworkflow. Upon successful completion of the callback path, the workflow successfully updates the targeted invoice in HubSpot and outputs the patched JSON record of the HubSpot invoice.