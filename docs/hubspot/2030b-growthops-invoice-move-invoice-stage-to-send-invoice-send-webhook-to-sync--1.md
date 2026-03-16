---
title: '2030b | GrowthOps | invoice | move invoice stage to "send invoice" | send webhook to sync data to SAP (cloned)'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636295
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3288548582/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3288548582/edit)
*   **Workflow ID:** 3288548582
*   **Workflow Name:** 2030b | GrowthOps | invoice | move invoice stage to "send invoice" | send webhook to sync data to SAP (cloned)

### Objective

This workflow automates the process of sending invoice data from HubSpot to an external system (SAP) via an n8n webhook. It triggers when an invoice is marked as "Sent," validates that all required data is present, and then sends the data to the appropriate endpoint for processing. It also handles cases where the invoice data is incomplete.

### Trigger

This workflow enrolls an **Invoice** record when the following conditions are met:

*   The Invoice's **Invoice Stage** property is set to **"Invoice Sent"**.
*   The associated Deal's **Non-Accounting Relevant** property is NOT marked as "Non-Accounting Relevant".
*   Invoices can re-enroll in this workflow each time the **Invoice Stage** is updated to **"Invoice Sent"**.

### Workflow Logic & Actions

Once an invoice is enrolled, the workflow proceeds with the following conditional logic:

**Step 1: Validate Invoice Data**

The workflow checks if the invoice record contains all the necessary fields for SAP synchronization. It will proceed down the 'Yes' path if the invoice meets the criteria for either a Standard Invoice OR a Commission Invoice.

*   **Condition A: Standard Invoice Data is Complete**
    *   Standard PandaDoc URL has a value
    *   Tax Rate has a value
    *   IBAN has a value
    *   Accounting Document Number has a value
    *   Customer Number has a value
    *   QR Code has a value
    *   Payment Type has a value
    *   Legal Entity has a value
    *   Non-accounting Relevant is empty
*   **OR**
*   **Condition B: Commission Invoice Data is Complete**
    *   Commission Sheet PandaDoc URL (`kommissionsblatt_pandadoc_url`) has a value
    *   Tax Rate has a value
    *   IBAN has a value
    *   Accounting Document Number has a value
    *   Customer Number has a value
    *   Payment Type has a value
    *   Legal Entity has a value
    *   Non-accounting Relevant is empty

**Step 2: Execute Action Based on Validation**

*   **If Yes (Invoice data is complete):**
    *   **Action:** Send a POST webhook to `https://n8n.tools.energy/webhook/send-invoice-to-sap-queue`.
    *   **Purpose:** This action queues the complete invoice data to be synced with SAP.
*   **If No (Invoice data is incomplete):**
    *   **Action:** Send a POST webhook to `https://n8n.tools.energy/webhook/update-hs-invoice-state-queue`.
    *   **Purpose:** This action sends the incomplete invoice to a separate queue, likely to flag it for manual review or to update its status in HubSpot, preventing it from being sent to SAP incorrectly.