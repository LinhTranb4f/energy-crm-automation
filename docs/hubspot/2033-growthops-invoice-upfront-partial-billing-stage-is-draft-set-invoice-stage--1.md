---
title: '2033 | GrowthOps | invoice | Upfront & Partial Billing Stage is "draft" | Set Invoice Stage to "create invoice"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636195
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3263474921/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3263474921/edit)
*   Workflow ID: 3263474921
*   Workflow Name: 2033 | GrowthOps | invoice | Upfront & Partial Billing Stage is "draft" | Set Invoice Stage to "create invoice"

### Objective

This workflow automates the initial step of the invoice creation process. When a HubSpot Invoice object is marked as "draft" for specific payment types, it triggers an external system (n8n) to queue the invoice for further processing and creation.

### Trigger

This workflow enrolls records from the **Invoice** object when all of the following conditions are met:

*   The **Invoice Stage** property is exactly **draft**.
*   AND
*   The **Payment Type** property is one of the following:
    *   monthly\_actual\_effort
    *   end\_of\_campaign
*   **Re-enrollment:** Re-enrollment is turned OFF. An invoice can only trigger this workflow once.

### Actions

Immediately after an invoice is enrolled, the workflow performs the following action:

*   **Action 1: Send a Webhook**
    *   A POST request is sent to an external service to queue the invoice for processing.
    *   **Webhook URL:** [https://n8n.tools.energy/webhook/update-hs-invoice-state-queue](https://n8n.tools.energy/webhook/update-hs-invoice-state-queue)
    *   This action hands off the invoice to an external automation platform (n8n) to handle the subsequent steps of the invoice creation lifecycle.