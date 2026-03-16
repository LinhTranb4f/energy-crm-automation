---
title: '2037 | GrowthOps | invoice | Invoice Stage is "RG Storniert" | send webhook to cancel invoice record to SAP'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635955
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3158896827/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3158896827/edit)
*   **Workflow ID:** 3158896827
*   **Workflow Name:** 2037 | GrowthOps | invoice | Invoice Stage is "RG Storniert" | send webhook to cancel invoice record to SAP

### Overview

This workflow automates the process of notifying an external system (likely SAP via an n8n intermediary) to cancel an invoice. The process is initiated when an invoice record in HubSpot is moved to the 'Cancelled' stage, ensuring that financial records are synchronized between HubSpot and SAP.

### Trigger and Enrollment Criteria

This workflow triggers for an **Invoice** record when it is updated and meets **ALL** of the following conditions simultaneously:

*   The **Invoice Stage** is set to `RG Storniert` (Cancelled).
*   The **Invoice Record SAP Status** is `Successfully created in SAP`. This is a critical check to ensure that the workflow only attempts to cancel invoices that have been confirmed to exist in SAP.
*   The **Customer Number** property has a value (is known).
*   The **Legal Entity** property has a value (is known).
*   The **Accounting Document Number** property has a value (is known).
*   The **Tax Rate** property has a value (is known).

### Re-enrollment

*   Re-enrollment is **enabled**. This means an invoice record can enter this workflow more than once if its properties are updated to meet the trigger criteria again.

### Actions

Once an invoice record is enrolled, the workflow immediately performs the following action:

*   **Action 1: Send Webhook to n8n**
    *   **Type:** Webhook (POST request)
    *   **Purpose:** To send a notification to an n8n automation queue, which then processes and forwards the cancellation request to SAP.
    *   **Webhook URL:** `https://n8n.tools.energy/webhook/send-storno-to-sap-queue`
    *   **Authentication:** The request includes a secret `Authorization` key in the header to ensure it is secure and valid.