---
title: '2036 | GrowthOps | invoice | “Scheduled to Send” | Update Invoice Phase from “Scheduled to Send” to “Invoice sent”'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633955
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3277586648/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3277586648/edit)
*   **Workflow ID:** 3277586648
*   **Workflow Name:** 2036 | GrowthOps | invoice | “Scheduled to Send” | Update Invoice Phase from “Scheduled to Send” to “Invoice sent”

**Purpose**
This workflow automates the processing of invoices that are scheduled for delivery. When an invoice's "Invoice Date" matches the current date and its status is "Scheduled to Send," this workflow triggers an external system (n8n) to handle the next steps, which likely include sending the invoice and updating its status in HubSpot.

**Enrollment Triggers**
This workflow enrolls Invoice objects when the following conditions are met simultaneously (AND logic):

*   **Invoice Date is Today:** The "Invoice Date" property is set to the current date. The workflow operates on the Europe/Zurich timezone.
*   **Invoice Stage is "Scheduled to Send":** The "Invoice Stage" property is exactly "Scheduled to Send".

**Workflow Actions**
Once an invoice is enrolled, the workflow performs a single action:

*   **Send Webhook to n8n:**
    *   **Method:** POST
    *   **URL:** `https://n8n.tools.energy/webhook/update-hs-invoice-state-queue`
    *   **Authentication:** The request includes a secret Authorization key in the header to ensure secure communication.
    *   **Purpose:** This action sends the invoice data to an external automation platform (n8n). The n8n workflow is then responsible for the subsequent logic, such as dispatching the invoice email and updating the "Invoice Stage" property in HubSpot to "Invoice sent".

**Settings**

*   **Re-enrollment:** Disabled. An invoice can only be processed by this workflow once.