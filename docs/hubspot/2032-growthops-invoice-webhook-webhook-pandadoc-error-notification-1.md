---
title: '2032 | GrowthOps | invoice | Webhook  | Webhook | PandaDoc Error Notification'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636055
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3217977542/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3217977542/edit)
*   **Workflow ID:** 3217977542
*   **Workflow Name:** 2032 | GrowthOps | invoice | Webhook | Webhook | PandaDoc Error Notification

### Purpose

This workflow is designed to automatically notify internal team members when an error occurs during the invoice creation process. It sends detailed error information through both email and in-app notifications to ensure swift investigation and resolution.

### Trigger Criteria

*   This is an event-based workflow that enrolls a contact when they complete one of the following custom behavioral events, which signify an invoice creation error:
    *   Event ID: `6-195364698`
    *   OR
    *   Event ID: `6-195077929`
*   Contacts will not be re-enrolled if they trigger the event again.

### Workflow Actions

*   **Step 1: Send Internal Email Notification**
    *   An internal email with the subject "Error | Creating Invoice" is sent to a specific user (ID: 46822518).
    *   The email body contains a detailed table with the following information pulled from the triggering event:
        *   Error Type
        *   Error Code
        *   Error Message
        *   Invoice ID
        *   Invoice URL
        *   Owner Name
        *   Owner Email
        *   Workflow Name
*   **Step 2: Send Internal In-App Notification**
    *   An in-app notification is sent to three specific users (IDs: 67115507, 24855941, 80040107).
    *   The notification provides a concise summary of the error, including the Error Type, Error Message, and the Invoice URL.