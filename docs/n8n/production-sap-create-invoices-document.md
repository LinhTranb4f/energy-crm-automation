---
title: 'Production | SAP | Create invoices document'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623295
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/u6fk6qWKPH7JAJVf](https://n8n.tools.energy/workflow/u6fk6qWKPH7JAJVf)
Workflow ID: u6fk6qWKPH7JAJVf
Workflow Name: Production | SAP | Create invoices document
Status: Active

# Purpose

The primary business goal of this workflow is to automate the creation of invoice documents, specifically generating QR codes and PandaDocs invoices. It also manages queuing tasks via Redis and updates the associated invoice stage to "qa" within the HubSpot CRM.

# Status and Runtime Controls

*   Timeout: Not explicitly defined in settings.
*   Retry behavior: Configured to retry on fail with a 5000ms wait between tries for key HTTP requests (Create QR code, Create Panda docs invoice, and Update invoice stage).
*   Error workflow: Global error handling is configured to trigger workflow ID `Bu0X3AXE7asHOIpX` upon failure.
*   Execution settings: Execution order is set to `v1`, time saved mode is `fixed`, and the caller policy is restricted to `workflowsFromSameOwner`.

# Triggers & Entry Points

This workflow has two independent entry points:

1. Webhook (acb4dfef-3d14-4f27-9888-d1cca58ab569)

Listens on the POST path `callback-create-invoice-document`. It acts as the trigger for the direct document generation and CRM update sequence.

2. Webhook queue (152bd8af-74f7-446c-8bcc-e312fff08381)

Listens on the POST path `create-invoice-document-queue` and requires Header Auth. It receives webhooks directly from a HubSpot workflow to queue invoice processing.

# Systems & Integrations

*   HubSpot CRM API
*   Internal API / Microservices (for QR code generation)
*   PandaDocs (via internal endpoint)
*   Redis Stream (via Subworkflow)
*   Webhooks

# Data Inputs & Key Fields

Primary input fields:

*   `invoiceID`: Captured from the JSON body of the incoming webhooks.
*   `token`: Generated via internal JavaScript node.

Important properties used:

*   `hs_object_id`: Mapped from `invoiceID` for PandaDocs.
*   `invoice_stage`: Hardcoded to update to `qa` in HubSpot.

# Workflow Logic (Deep Analysis)

The workflow operates in two distinct, parallel tracks depending on which webhook receives the payload.

Path 1: Direct Document Generation

1. Initial trigger: The `Webhook` node fires upon receiving a POST request containing the `invoiceID`.
2. External system calls: The `Create QR code for invoice` node sends a POST request to an internal n8n webhook, passing the `invoiceID` to generate a QR code.
3. External system calls: The `Create Panda docs invoice` node triggers a POST request to another internal endpoint (`generate-invoice`), mapping the `invoiceID` to `hs_object_id` to generate the PandaDocs document.
4. Final updates: The `Update invoice stage` node issues a PATCH request directly to the HubSpot CRM API (`/crm/v3/objects/invoices/{invoiceID}`), updating the invoice property `invoice_stage` to `qa`.

Path 2: Queue Processing

1. Initial trigger: The `Webhook queue` node receives a POST payload from a HubSpot workflow.
2. Data validation/preparation: The `Code in JavaScript1` node executes to define and return a static Bearer token.
3. External system calls (Subworkflow): The workflow executes the `Call 'Subworkflow | Redis Stream Producer Workflow` node. It passes a predefined payload including `type` ("new\_invoice"), `data` (containing the `invoiceID`), and a `callbackWebhook` URL to push the operation into a Redis stream.

# Branch Execution Details

There are no explicit conditional IF/THEN nodes in this workflow. Branching logic is achieved naturally by having two distinct Trigger Webhooks that execute their own independent sequences of nodes.

# External Operations

*   API Calls: Internal POST requests are made to `/callback-get-invoice-data-to-create-qr` and `/generate-invoice`.
*   Object Updates: A PATCH request modifies an existing invoice object in HubSpot to change its `invoice_stage`.

# Subworkflows Used

Workflow name: Subworkflow | Redis Stream Producer Workflow
Workflow ID: 1tiTZLzrMssZ4trX
Purpose: To act as a producer that sends the invoice task to a Redis Stream for asynchronous background processing.
Inputs:

*   `type`: String ("new\_invoice")
*   `data`: JSON object containing `invoiceID`
*   `callbackWebhook`: JSON object containing the method and URL for the callback.

# Database Collections

No direct database collections (e.g., MongoDB, PostgreSQL) are queried or modified within the context of this specific workflow.

# Security Notes

*   Hardcoded tokens: A severe security note is the presence of a hardcoded Bearer token (`dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`) directly within the `Code in JavaScript1` node.
*   Credentials: The workflow utilizes predefined n8n credentials (`Production | HubSpot | Header Auth to connect private app` and `Production | HubSpot | Header Auth to receive webhook from HubSpot workflow`) for secure API communication.

# Known Limitations / Risks

*   Hardcoded Credentials Risk: The hardcoded Bearer token in the JavaScript node should be migrated to n8n's credential manager or environment variables to prevent security risks and maintainability issues.
*   Disabled Nodes: There is a disabled node named `Send data to queue` left on the canvas. This could cause confusion for developers maintaining the workflow and should either be documented or removed.
*   Lack of Explicit Error Handling: While a global error workflow is attached, the execution paths themselves do not contain `Catch` nodes. If an internal API is down and exhausts its retries, the workflow will fail abruptly rather than handling the error gracefully on the canvas.

# Final Outputs

Depending on the entry point, the workflow successfully produces either:

1. A fully generated QR code, a PandaDocs invoice, and an updated invoice record in HubSpot (moved to the `qa` stage).
2. A task payload successfully handed off to the Redis Stream Producer Subworkflow for delayed queuing.