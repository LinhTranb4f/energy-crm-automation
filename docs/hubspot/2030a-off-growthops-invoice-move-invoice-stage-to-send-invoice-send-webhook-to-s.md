---
title: '2030a (OFF) | GrowthOps | invoice | move invoice stage to "send invoice" | send webhook to sync data to SAP'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633595
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3147855085/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3147855085/edit)
*   **Workflow ID**: 3147855085
*   **Workflow Name**: 2030a (OFF) | GrowthOps | invoice | move invoice stage to "send invoice" | send webhook to sync data to SAP

### Objective

This workflow's purpose is to trigger a webhook to an external system (n8n) when an Invoice object's stage is changed to "invoice\_sent". This action initiates a data synchronization process with SAP.

### Enrollment Triggers

An Invoice object is enrolled in this workflow when the following property change occurs:

*   The **Invoice Stage** (`invoice_stage`) property is updated to the value **Invoice Sent** (`invoice_sent`).

### Refinement Criteria

To proceed, the enrolled Invoice must meet all criteria in **either** Condition A **or** Condition B:

**Condition A**

*   The **Legal Entity** (`legal_entity`) property has a value.
*   The **Invoice Standard Pandadoc URL** (`invoice_standard_pandadoc_url`) property has a value.
*   The Invoice is associated with a Deal in the **Closed Won** stage.

**Condition B**

*   The **Legal Entity** (`legal_entity`) property has a value.
*   The **Kommissionsblatt Pandadoc URL** (`kommissionsblatt_pandadoc_url`) property has a value.
*   The Invoice is associated with a Deal in the **Closed Won** stage.

### Workflow Actions

If an Invoice meets the trigger and refinement criteria, the workflow performs one action:

*   **Send a Webhook**
    *   **Method:** POST
    *   **URL:** `https://n8n.tools.energy/webhook/send-invoice-to-sap-queue`
    *   **Authentication:** Uses a secret authorization key sent in the request header.
    *   **Purpose:** This sends the invoice data to an n8n automation, which queues it for synchronization with the SAP system.