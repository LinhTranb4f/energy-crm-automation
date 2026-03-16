---
title: '2031 | GrowthOps | invoice | Update Invoice Phase to "Invoice Sent" | send invoice to customer'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636015
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3177356522/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3177356522/edit)
*   **Workflow ID:** 3177356522
*   **Workflow Name:** 2031 | GrowthOps | invoice | Update Invoice Phase to "Invoice Sent" | send invoice to customer

### Purpose

This workflow automates the process of sending invoices to customers. It is triggered when an Invoice record is marked as "Invoice Sent" and meets specific criteria. The workflow differentiates the sending process based on the sales channel of the associated deal.

### Trigger and Enrollment

This workflow enrolls **Invoice** records when all of the following conditions are met:

*   The Invoice's **Invoice Stage** property is set to "Invoice Sent".
*   The Invoice's **Invoice Error Generation Failed** property is not equal to "No". This includes records where the property is empty or has any other value.
*   The associated **Contact** has the property **Automated Mail** (`mail__automated_`) set to "true".

### Re-enrollment

Re-enrollment is **enabled**. An invoice can re-enter this workflow if its **Invoice Stage** is updated to "Invoice Sent" or if its **Invoice Error Generation Failed** property is updated to a value that is not "No".

### Workflow Actions

The workflow begins with a conditional split based on the associated deal's sales channel.

**Step 1: Check Sales Channel**
The workflow checks the **Sales Channel** property on the deal associated with the invoice.

*   **If/then Branch 1: SRW Channel**
    *   **Condition:** If the associated deal's **Sales Channel** is "SRW".
    *   **Action:** It triggers a webhook to an external system (n8n) to send the invoice email to the customer.
        *   **Method:** POST
        *   **Webhook URL:** `https://n8n.tools.energy/webhook/send-email-to-customer`
*   **Default Branch: Non-SRW Channel**
    *   **Condition:** If the sales channel is anything other than "SRW".
    *   **Action:** It sends an internal email notification. This likely alerts a team member to handle the invoice manually for non-SRW deals.