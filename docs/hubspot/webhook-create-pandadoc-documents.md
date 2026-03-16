---
title: 'Webhook | Create Pandadoc Documents'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633655
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3159786692/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3159786692/edit)
*   Workflow ID: 3159786692
*   Workflow Name: Webhook | Create Pandadoc Documents

### Workflow Goal

This workflow is designed to automate the creation of PandaDoc documents. It triggers when a specific event occurs in HubSpot and then sends data to an external n8n automation platform in two steps to generate the final document.

### Enrollment Triggers

_This section describes what causes a record to enter the workflow._

*   The workflow enrolls a record when a specific HubSpot event (ID: 4-1463224) has been completed.
*   Re-enrollment is turned off, meaning a record can only go through this workflow once.

### Workflow Actions

_This section describes the sequence of steps the workflow performs after a record is enrolled._

**Step 1: Send Webhook - Set Tax, Discount, Fee**

*   **Action Type:** Send a POST request to a webhook.
*   **Endpoint URL:** [https://test.n8n.tools.energy/webhook/set-tax-discount-fee](https://test.n8n.tools.energy/webhook/set-tax-discount-fee)
*   **Purpose:** Immediately after enrollment, this step sends initial financial data (like tax rates, discounts, or fees) to an external system (n8n) for pre-processing.

**Step 2: Delay**

*   **Action Type:** Delay
*   **Duration:** 1 minute
*   **Purpose:** The workflow pauses for one minute. This allows the external system sufficient time to process the data sent in the previous step before proceeding.

**Step 3: Send Webhook - Generate Invoice**

*   **Action Type:** Send a POST request to a webhook.
*   **Endpoint URL:** [https://test.n8n.tools.energy/webhook/generate-invoice](https://test.n8n.tools.energy/webhook/generate-invoice)
*   **Purpose:** After the delay, this step sends a final request to the external system (n8n) to trigger the generation of the PandaDoc invoice or document using the data from the initial step.