---
title: '2029 |   GrowthOps | invoice | create invoice document | send webhook to create  invoice document / pandadoc (new)'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636255
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3266411738/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3266411738/edit)
*   **Workflow ID:** 3266411738
*   **Workflow Name:** 2029 | GrowthOps | invoice | create invoice document | send webhook to create invoice document / pandadoc (new)

### Purpose

This workflow automates the initial step of the invoice document generation process. When an Invoice custom object record is updated to the "Create Invoice" stage, this workflow sends a notification to an external automation platform (n8n) to begin creating the corresponding document.

### Trigger (Enrollment Criteria)

This workflow enrolls records based on the properties of a custom object.

*   **Object Type:** Invoice (Custom Object)
*   **Trigger Conditions:**

A record is enrolled when **all** of the following conditions are met:
*   The property "Invoice Stage" is equal to "Create Invoice".
*   The property "Record Type" is equal to "Invoice".

*   **Re-enrollment:**

Re-enrollment is **enabled**. A record will re-enter this workflow every time the "Invoice Stage" property is updated to "Create Invoice".

### Actions

This workflow consists of a single action that executes immediately after enrollment.

*   **Action 1: Send Webhook to n8n**
    *   **Description:** The workflow sends a POST request to a specific webhook URL. This action triggers an external automation in n8n, which queues the task to generate the invoice document.
    *   **Method:** POST
    *   **Webhook URL:** `https://n8n.tools.energy/webhook/create-invoice-document-queue`
    *   **Authentication:** The request is authenticated using a secret "Authorization" key sent in the request header.