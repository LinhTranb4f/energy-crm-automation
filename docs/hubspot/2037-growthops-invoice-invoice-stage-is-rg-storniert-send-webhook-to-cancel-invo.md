---
title: '2037 | GrowthOps | invoice | Invoice Stage is "RG Storniert" | send webhook to cancel invoice record to SAP'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633635
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3158896827/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3158896827/edit)
*   **Workflow ID:** 3158896827
*   **Workflow Name:** 2037 | GrowthOps | invoice | Invoice Stage is "RG Storniert" | send webhook to cancel invoice record to SAP

### Objective

This workflow automatically sends a notification to an external system (via an n8n webhook, destined for SAP) to cancel an invoice record. This is triggered when an Invoice record in HubSpot is updated to the "Cancelled" stage, provided it has already been successfully created in SAP.

### Based On

*   **Object Type:** Invoice (Custom Object ID: 0-53)

### Enrollment Triggers

An Invoice record will be enrolled in this workflow when **ALL** of the following conditions are met:

*   The **Invoice Stage** is "RG Storniert" (Cancelled).
*   The **Invoice Record SAP Status** is "Successfully created in SAP".
*   The **Customer Number** property has a value.
*   The **Legal Entity** property has a value.
*   The **Accounting Document Number** property has a value.
*   The **Tax Rate** property has a value.

### Re-enrollment

*   Re-enrollment is **enabled**. This means that if an Invoice record exits the workflow and its properties are later updated to meet the enrollment criteria again, it will be re-enrolled.

### Actions

1. **Send Webhook to n8n**
    *   **Action:** The workflow immediately sends a webhook (a data notification) to an external automation tool, n8n.
    *   **Purpose:** This webhook triggers a process in n8n that is responsible for queuing the request to cancel the corresponding invoice record in the SAP system.
    *   **Technical Details:**
        *   **Method:** POST
        *   **URL:** `https://n8n.tools.energy/webhook/send-storno-to-sap-queue`
        *   **Authentication:** Uses an API Key sent in the `Authorization` header.