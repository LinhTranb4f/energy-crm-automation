---
title: '2036 | GrowthOps | invoice | “Scheduled to Send” | Update Invoice Phase from “Scheduled to Send” to “Invoice sent”'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636275
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3277586648/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3277586648/edit)
*   **Workflow ID:** 3277586648
*   **Workflow Name:** 2036 | GrowthOps | invoice | “Scheduled to Send” | Update Invoice Phase from “Scheduled to Send” to “Invoice sent”

### Purpose

This workflow automates the processing of invoices that are due to be sent. When an invoice's scheduled send date is today and its status is “Scheduled to Send,” this workflow triggers an external automation service ([n8n.io](http://n8n.io)) to handle the subsequent steps, which ultimately leads to updating the invoice's phase to “Invoice sent.”

### Trigger (Enrollment Criteria)

This is an Invoice-based workflow. An invoice will be automatically enrolled when it meets ALL of the following conditions:

*   The **Invoice Stage** property is exactly “Scheduled to Send”.
*   The **Invoice Date** property is today's date. The workflow checks for invoices with a date between today and tomorrow (exclusive), based on the Europe/Zurich timezone.

### Re-enrollment

Re-enrollment is turned **OFF**. An invoice can only go through this workflow once.

### Actions

Once an invoice is enrolled, the workflow immediately performs the following action:

*   **Action 1: Send a Webhook**
    *   A POST request is sent to an external automation service at the URL: `https://n8n.tools.energy/webhook/update-hs-invoice-state-queue`.
    *   This action signals the external system to begin its process, which likely involves sending the invoice email and then updating the invoice record's status in HubSpot.