---
title: '2030b | GrowthOps | invoice | move invoice stage to "send invoice" | send webhook to sync data to SAP (cloned)'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633975
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3288548582/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3288548582/edit)
*   **Workflow ID:** 3288548582
*   **Workflow Name:** 2030b | GrowthOps | invoice | move invoice stage to "send invoice" | send webhook to sync data to SAP (cloned)

### Objective

This workflow automates the synchronization of invoice data from HubSpot to an external system (likely SAP, via n8n). It is triggered when an invoice's stage is updated to "Sent," ensuring that only finalized, accounting-relevant invoices are processed for synchronization.

### Enrollment Triggers

An **Invoice** record enters this workflow when the following conditions are met:

*   The Invoice's "Invoice Stage" property is set to **invoice\_sent**.
*   The Invoice is associated with a Deal where the "Non-accounting Relevant" property is not "Non-Accounting Relevant".
*   Re-enrollment is enabled, allowing an invoice to re-enter the workflow if its stage is updated to "invoice\_sent" again.

### Workflow Actions

Once an invoice is enrolled, it proceeds through the following steps:

**Step 1: Data Completeness Check (If/then branch)**
The workflow first checks if the invoice record contains all the necessary information for processing. It proceeds down the 'Yes' path if the invoice meets **EITHER** of the two condition sets below.

*   **Condition Set A (Standard Invoice):**
    *   Invoice Standard Pandadoc URL is known
    *   Tax Rate is known
    *   IBAN is known
    *   Accounting Document Number is known
    *   Non-accounting Relevant is unknown
    *   Customer Number is known
    *   QR Code is known
    *   Payment Type is known
    *   Legal Entity is known
*   **Condition Set B (Commission Sheet Invoice):**
    *   Kommissionsblatt Pandadoc URL is known
    *   Tax Rate is known
    *   IBAN is known
    *   Accounting Document Number is known
    *   Non-accounting Relevant is unknown
    *   Customer Number is known
    *   Payment Type is known
    *   Legal Entity is known

**Step 2: Process Based on Data Completeness**

*   **If YES (Invoice data is complete):**
    *   A webhook is sent to sync the data to the SAP queue.
    *   **Action Type:** Send Webhook (POST)
    *   **Endpoint:** `https://n8n.tools.energy/webhook/send-invoice-to-sap-queue`
    *   **Purpose:** This triggers an automation to push the complete invoice data into the SAP system.
*   **If NO (Invoice data is incomplete):**
    *   A different webhook is sent to an update/review queue.
    *   **Action Type:** Send Webhook (POST)
    *   **Endpoint:** `https://n8n.tools.energy/webhook/update-hs-invoice-state-queue`
    *   **Purpose:** This triggers a process to handle the incomplete invoice, likely flagging it for manual review and completion before it can be synced.