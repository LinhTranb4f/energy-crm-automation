---
title: '2038 | GrowthOps | invoice | bulk move invoices from QA to Sent Invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633995
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3322479854/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3322479854/edit)
*   **Workflow ID:** 3322479854
*   **Workflow Name:** 2038 | GrowthOps | invoice | bulk move invoices from QA to Sent Invoice

### Purpose

This workflow is a utility designed for the GrowthOps team to perform a bulk status update on Invoice objects. Its primary function is to trigger an external process that moves a batch of invoices from a "QA" (Quality Assurance) state to a "Sent Invoice" state.

### Enrollment Trigger

*   **Trigger Type:** Manual Enrollment
*   **Details:** This workflow does not trigger automatically based on property changes. Instead, a user must manually select a list of Invoice objects and enroll them into this workflow. This is ideal for controlled, bulk operations.
*   **Re-enrollment:** Re-enrollment is enabled, meaning the same invoice can be processed through this workflow multiple times if necessary.

### Workflow Actions

This workflow consists of a single action that executes immediately upon enrollment.

*   **Action 1: Send a Webhook**
    *   **Type:** POST Webhook
    *   **Endpoint URL:** `https://n8n.tools.energy/webhook/update-hs-invoice-state-queue`
    *   **Function:** When an invoice is enrolled, HubSpot sends a POST request to an external automation service (n8n). This service is responsible for receiving the signal and queuing the task to update the invoice's status within HubSpot. Using a queue (`-queue` in the URL) is a best practice for managing bulk updates to avoid hitting API rate limits.