---
title: 'Send notification when an invoice creation error occurs.'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633575
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3114172647/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3114172647/edit)
*   Workflow ID: 3114172647
*   Workflow Name: Send notification when an invoice creation error occurs.

### Objective

This workflow automatically notifies specific team members via an in-app HubSpot notification whenever an Invoice object enters an error state during its creation or sending process.

### Trigger (Enrollment Criteria)

*   **Object Type:** Invoice (Custom Object ID: 0-53)
*   **Trigger Condition:** The workflow enrolls an Invoice object when its 'Invoice Stage' property is set exactly to 'Invoice Error'.
*   **Re-enrollment:** Re-enrollment is disabled. An Invoice object can only trigger this workflow once.

### Actions

1. **Send In-App Notification**
    *   **Description:** An immediate in-app notification is sent to alert the team about the failure.
    *   **Recipients:** The notification is sent to two specific HubSpot users (User IDs: 4329166, 24855941).
    *   **Notification Subject:** Invoice Error
    *   **Notification Body:** The message provides specific details about the error, including:
        *   The internal ID of the invoice record.
        *   The error message from the QR invoice generation process (from the 'invoice\_error\_generation\_failed' property).
        *   The error message from the SAP integration (from the 'invoice\_send\_status' property).