---
title: 'Invoice Created Trigger (Failed)'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635795
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3028610279/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3028610279/edit)
*   **Workflow ID**: 3028610279
*   **Workflow Name**: Invoice Created Trigger (Failed)

### Overview

This workflow is designed to trigger when a new invoice is created in HubSpot. It was intended as a Proof of Concept (POC) to sync a source invoice to a cloned invoice, but this POC failed. Its primary function is to send data to an external system via a webhook.

### Trigger Conditions

This workflow enrolls an invoice record when the following event and properties are true:

*   **Event**: An **Invoice is created**.
*   **AND**
*   **Filter Criteria**: The invoice must meet all of the following conditions:
    *   The **Invoice Source** is 'Native Invoice'.
    *   The **Object Source** is 'CRM\_UI' OR 'CLONE\_OBJECTS'.

### Workflow Actions

Once an invoice is enrolled, it will immediately perform the following action:

*   **Send a Webhook**:
    *   A POST request is sent to the URL: `https://n8n.tools.energy/webhook/update-invoice-queue`.
    *   This action is intended to notify an external automation platform (n8n) that a new invoice has been created, likely adding it to a processing queue.
    *   The request is authenticated using a secret key sent in the 'Authorization' header.

### Re-enrollment

*   Re-enrollment is disabled. An invoice can only trigger this workflow one time.