---
title: '2034 | GrowthOps | invoice | Comission rate is know | send webhook to create new invoice record "credit note"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636215
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3265171695/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3265171695/edit)
*   **Workflow ID:** 3265171695
*   **Workflow Name:** 2034 | GrowthOps | invoice | Comission rate is know | send webhook to create new invoice record "credit note"

### Objective

The primary goal of this workflow is to automatically trigger an external process via a webhook whenever a commission rate is added or updated for an 'Invoice' record. This external process is responsible for creating a corresponding credit note record.

### Enrollment Triggers

An Invoice record will be enrolled in this workflow when the following conditions are met:

*   The record's type is 'Invoice'.
*   The 'Commission Rate' property has a value (is known).

### Re-enrollment

*   Re-enrollment is enabled for this workflow.
*   A record will re-enroll each time the 'Commission Rate' property is updated with a new value.

### Workflow Actions

*   **Action 1: Send Webhook to n8n**
    *   **Type:** POST Request
    *   **Endpoint URL:** `https://n8n.tools.energy/webhook/create-commission-invoice-queue`
    *   **Purpose:** This action sends the invoice data to an n8n automation workflow. This external workflow is designed to receive the data and create a new record, specifically a 'credit note', based on the invoice and its commission rate.
    *   **Authentication:** The request is secured by sending an 'Authorization' key in the request header.