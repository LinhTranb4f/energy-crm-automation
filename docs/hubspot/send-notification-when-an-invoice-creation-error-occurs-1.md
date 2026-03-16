---
title: 'Send notification when an invoice creation error occurs.'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635895
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3114172647/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3114172647/edit)
*   **Workflow ID:** 3114172647
*   **Workflow Name:** Send notification when an invoice creation error occurs.

### Purpose

This workflow automatically sends an internal, in-app notification to specific team members whenever a record (based on Object ID: 0-53, likely an Invoice or Deal) fails during the invoice creation or sending process. Its goal is to ensure that errors are flagged immediately for investigation and resolution.

### Trigger / Enrollment Criteria

A record is enrolled in this workflow when the following condition is met:

*   The record's property **Invoice Stage** is any of **Invoice Error**.

### Enrollment Settings

*   **Re-enrollment:** Disabled. A record can only trigger this workflow once.

### Actions

Once a record is enrolled, the workflow performs the following single action:

#### Action 1: Send In-App Notification

*   **Action Type:** Sends an internal notification within the HubSpot app.
*   **Recipients:** The notification is sent to a specific list of internal users (User IDs: 4329166, 24855941).
*   **Subject:** Invoice Error
*   **Body Content:** The notification message provides details about the specific error, using information from the enrolled record:
    *   `hi team. Invoice {{ enrolled_object.hs_object_id }} has error: QR Invoice Error {{ enrolled_object.invoice_error_generation_failed }}`
    *   `SAP invoice error: {{ enrolled_object.invoice_send_status }}`
*   **Personalization Tokens Used:**
    *   `{{ enrolled_object.hs_object_id }}`: Displays the unique HubSpot ID of the record that has the error.
    *   `{{ enrolled_object.invoice_error_generation_failed }}`: Displays the specific error message related to the QR invoice generation failure.
    *   `{{ enrolled_object.invoice_send_status }}`: Displays the status or error message from the attempt to send the invoice to SAP.