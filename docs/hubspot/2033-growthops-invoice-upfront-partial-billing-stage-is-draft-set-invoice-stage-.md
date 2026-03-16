---
title: '2033 | GrowthOps | invoice | Upfront & Partial Billing Stage is "draft" | Set Invoice Stage to "create invoice"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633875
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3263474921/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3263474921/edit)
*   **Workflow ID:** 3263474921
*   **Workflow Name:** 2033 | GrowthOps | invoice | Upfront & Partial Billing Stage is "draft" | Set Invoice Stage to "create invoice"

### Objective

The purpose of this workflow is to automatically trigger an external process when an Invoice record is in the 'draft' stage and has a payment type that is not 'upfront' or 'partial'. This external process is responsible for advancing the invoice to the next stage.

### Object Type

This workflow operates on the **Invoice** object (Object Type ID: 0-53).

### Enrollment Criteria (Triggers)

An Invoice record will be enrolled in this workflow when it meets **ALL** of the following conditions:

*   The **Invoice Stage** property is `draft`.
*   The **Payment Type** property is one of the following: `monthly_actual_effort` OR `end_of_campaign`.
*   **Re-enrollment:** Disabled. Records will only run through this workflow once, even if they meet the trigger criteria again.

### Actions

**Step 1: Send a Webhook**

*   Immediately after enrollment, the workflow sends a `POST` request to an external n8n automation tool.
*   **Webhook URL:** `https://n8n.tools.energy/webhook/update-hs-invoice-state-queue`
*   **Purpose:** This action notifies the external system to queue an update for the HubSpot invoice, likely to process it and move its stage from 'draft' to 'create invoice'.