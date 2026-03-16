---
title: '2029 |   GrowthOps | invoice | create invoice document | send webhook to create  invoice document / pandadoc (new)'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633935
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3266411738/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3266411738/edit)
*   **Workflow ID:** 3266411738
*   **Workflow Name:** 2029 | GrowthOps | invoice | create invoice document | send webhook to create invoice document / pandadoc (new)

### Workflow Goal

This workflow automates the creation of an invoice document. It triggers an external process by sending invoice data to an automation platform (n8n) whenever an invoice record is moved to the 'Create Invoice' stage.

### Object Type

*   This workflow is based on a HubSpot object where the 'Record Type' property is set to 'Invoice'.

### Enrollment Triggers

An Invoice record is enrolled in this workflow when it meets the following criteria:

*   The property 'Record Type' is equal to 'Invoice'.
*   AND the property 'Invoice Stage' is equal to 'Create Invoice'.

### Re-enrollment

*   Re-enrollment is **ON**.
*   A record will re-enter this workflow every time its 'Invoice Stage' property is updated to 'Create Invoice'. This allows for the regeneration of invoice documents if necessary.

### Workflow Actions

Once an invoice record is enrolled, the workflow immediately performs a single action:

*   **Action 1: Send a Webhook**
    *   **Type:** POST Request
    *   **Destination URL:** `https://n8n.tools.energy/webhook/create-invoice-document-queue`
    *   **Purpose:** This webhook sends the enrolled invoice record's data to an n8n automation workflow. This external system is responsible for queuing the request and generating the formal invoice document, potentially using a service like PandaDoc. The request is authenticated with a secret authorization key.