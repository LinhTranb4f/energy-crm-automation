---
title: '2032 | GrowthOps | invoice | Webhook  | Webhook | PandaDoc Error Notification'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633735
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3217977542/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3217977542/edit)
*   Workflow ID: 3217977542
*   Workflow Name: 2032 | GrowthOps | invoice | Webhook | Webhook | PandaDoc Error Notification

### Overview

This workflow's purpose is to send internal email and in-app notifications with detailed error information whenever an invoice creation error event occurs. This ensures that relevant team members are immediately alerted to issues in the invoicing process, likely related to a PandaDoc integration, allowing for quick investigation and resolution.

### Trigger (Enrollment Criteria)

This is a Deal-based workflow that enrolls records when a specific event occurs.

*   **Trigger Type**: Event-based. A deal is enrolled when it completes one of the following custom events:
    *   Custom Event ID: `6-195364698`
    *   Custom Event ID: `6-195077929`
*   **Re-enrollment**: Re-enrollment is disabled, meaning a deal will only trigger this workflow once.

### Actions

The workflow executes the following actions in sequence for each enrolled deal:

1. **Send Internal Email Notification**
    *   **Description**: An email with a detailed breakdown of the error is sent to a primary contact.
    *   **Recipients**: User ID `46822518`.
    *   **Email Subject**: "Error | Creating Invoice"
    *   **Email Content**: The email contains a table with the following information pulled from the triggering event:
        *   Error Type
        *   Error Code
        *   Error Message
        *   Invoice ID
        *   Invoice URL
        *   Owner Name
        *   Owner Email
        *   Workflow Name
2. **Send In-App Notification**
    *   **Description**: A concise in-app notification is sent to a wider group of users for immediate awareness.
    *   **Recipients**: User IDs `67115507`, `24855941`, and `80040107`.
    *   **Notification Subject**: "Error | Creating Invoice"
    *   **Notification Content**: The notification body includes a summary of the error:
        *   Error Type
        *   Error Message
        *   Invoice URL