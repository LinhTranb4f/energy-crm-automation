---
title: '2031 | GrowthOps | invoice | Update Invoice Phase to "Invoice Sent" | send invoice to customer'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633695
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3177356522/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3177356522/edit)
*   **Workflow ID:** 3177356522
*   **Workflow Name:** 2031 | GrowthOps | invoice | Update Invoice Phase to "Invoice Sent" | send invoice to customer

### Purpose

This workflow automates the process of sending an invoice notification to a customer. It triggers when an Invoice record is updated to the 'Invoice Sent' stage. The workflow then checks the sales channel of the associated deal to determine whether to send the notification via a standard HubSpot email or a custom process managed by an external system (n8n).

### Enrollment Triggers

An **Invoice** record is enrolled in this workflow when all of the following conditions are met:

*   The Invoice's **Invoice Stage** property is set to `Invoice Sent`.
*   The Invoice's **Invoice Error Generation Failed** property is not equal to `No` (this includes records where the property is empty or contains an error message).
*   The primary associated **Contact** has the property **Automated Mail?** set to `true`.

### Re-enrollment

Re-enrollment is enabled. An invoice can re-enter this workflow if it meets the trigger criteria again, specifically when either of the following properties are updated:

*   **Invoice Stage**
*   **Invoice Error Generation Failed**

### Workflow Actions

The workflow begins with an If/Then branch to check a property on the deal associated with the invoice.

**1\. If/Then Branch: Check Sales Channel**

*   The workflow checks the **Sales Channel** property of the deal associated with the invoice.

**Branch A: If Sales Channel is 'SRW'**

*   **Action:** A webhook is triggered.
*   **Details:** It sends a POST request to an external automation platform (`https://n8n.tools.energy/webhook/send-email-to-customer`). This external process is responsible for sending the invoice email to the customer for SRW deals.

**Branch B: Default (If Sales Channel is not 'SRW')**

*   **Action:** Send an internal HubSpot email.
*   **Details:** It sends the automated email with the internal ID `310187989235` to the customer. This is the standard notification for all non-SRW deals.