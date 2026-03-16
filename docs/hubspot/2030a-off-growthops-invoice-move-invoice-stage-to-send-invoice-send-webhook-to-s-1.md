---
title: '2030a (OFF) | GrowthOps | invoice | move invoice stage to "send invoice" | send webhook to sync data to SAP'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635915
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3147855085/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3147855085/edit)
*   **Workflow ID:** 3147855085
*   **Workflow Name:** 2030a (OFF) | GrowthOps | invoice | move invoice stage to "send invoice" | send webhook to sync data to SAP

**Objective**
This workflow automates the process of sending invoice data to an SAP system. It is triggered when an invoice's stage is updated to "Sent" within HubSpot, initiating a data sync via a webhook.

**Trigger**
This workflow is based on the **Invoice** object and enrolls records when the following property change occurs:

*   The "Invoice Stage" (`invoice_stage`) property is set to "Invoice Sent" (`invoice_sent`).

**Enrollment Criteria**
In addition to the trigger, an Invoice will only be enrolled if it is associated with a Deal in the "Closed Won" stage AND it meets **ONE** of the following two conditions:

*   **Condition 1:**
    *   The "Legal Entity" (`legal_entity`) property has a value.
    *   The "Invoice Standard PandaDoc URL" (`invoice_standard_pandadoc_url`) property has a value.
*   **OR**
*   **Condition 2:**
    *   The "Legal Entity" (`legal_entity`) property has a value.
    *   The "Kommissionsblatt PandaDoc URL" (`kommissionsblatt_pandadoc_url`) property has a value.

**Actions**
Once an Invoice is enrolled, the workflow immediately performs the following action:

*   **Send a Webhook:**
    *   **Method:** POST
    *   **URL:** `https://n8n.tools.energy/webhook/send-invoice-to-sap-queue`
    *   **Purpose:** This sends the invoice data to an n8n automation, which then queues it for synchronization with the SAP system. The request includes an authorization key in the header for authentication.

**Re-enrollment**

*   Re-enrollment is **disabled**. An Invoice can only go through this workflow once.