---
title: 'Webhook | Create Pandadoc Documents'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635975
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3159786692/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3159786692/edit)
*   Workflow ID: 3159786692
*   Workflow Name: Webhook | Create Pandadoc Documents

### Objective

This workflow automates the creation of documents (likely invoices or contracts via PandaDoc) by sending deal data to an external automation service (n8n). It is triggered when a deal completes a specific event.

### Enrollment Triggers

*   Object Type: Deal (ID: 0-53)
*   Trigger Type: Event-based. The workflow starts when a deal record completes a specific event (Event ID: 4-1463224).
*   Re-enrollment: Disabled. A deal can only go through this workflow once.

### Workflow Actions

This workflow follows a linear, three-step process:

**Step 1: Send Data to Set Tax, Discount, and Fee**

*   Action Type: Webhook (POST Request)
*   Target URL: `https://test.n8n.tools.energy/webhook/set-tax-discount-fee`
*   Description: Immediately after a deal is enrolled, the workflow sends a POST request to an n8n webhook. This initial step is intended to send data that will be used to calculate or set financial details like taxes, discounts, or fees for the final document.

**Step 2: Delay**

*   Action Type: Delay
*   Duration: 1 Minute
*   Description: The workflow pauses for one minute. This delay is likely implemented to ensure the first webhook has had sufficient time to process the financial data before the next step is initiated.

**Step 3: Send Data to Generate Document**

*   Action Type: Webhook (POST Request)
*   Target URL: `https://test.n8n.tools.energy/webhook/generate-invoice`
*   Description: After the 1-minute delay, the workflow sends a final POST request to a second n8n webhook. This action triggers the actual generation of the invoice or PandaDoc document using the data sent in the previous step.