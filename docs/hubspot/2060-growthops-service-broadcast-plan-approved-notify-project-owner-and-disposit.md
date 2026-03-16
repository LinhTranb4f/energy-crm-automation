---
title: '2060 | GrowthOps | Service | Broadcast Plan = Approved | Notify Project Owner and Disposition Team of Approval'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634355
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574046907/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574046907/edit)
*   **Workflow ID:** 3574046907
*   **Workflow Name:** 2060 | GrowthOps | Service | Broadcast Plan = Approved | Notify Project Owner and Disposition Team of Approval

### Workflow Goal

This workflow automates the notification process for when a project's broadcast plan receives approval. Its purpose is to immediately inform the project owner via email and in-app notification, ensuring they are aware of the status change and can proceed with the next steps.

### Object Type

This workflow is based on a Custom Object (ID: 2-194493711), likely representing a 'Project'.

### Trigger / Enrollment Criteria

A project record is enrolled in this workflow when the following condition is met:

*   The project property 'Broadcast Plan Approval Status' is set to 'Approved'.

### Actions

Once a project is enrolled, the workflow executes the following actions in sequence:

1. **Send Internal Email Notification**
    *   **Recipient:** The HubSpot Owner assigned to the project record.
    *   **Email Subject:** Broadcast Plan has been approved
    *   **Email Body:** An email is sent to the project owner containing key details about the approved plan, including:
        *   Project Name
        *   Project ID
        *   Broadcast Plan URL
        *   Approval Confirmation Status
2. **Send In-App Notification**
    *   **Recipient:** The HubSpot Owner assigned to the project record.
    *   **Notification Subject:** Broadcast Plan Approved
    *   **Notification Body:** A notification is sent within the HubSpot application to alert the project owner of the approval.

### Settings

*   **Re-enrollment:** Disabled. A project can only be enrolled in this workflow one time.