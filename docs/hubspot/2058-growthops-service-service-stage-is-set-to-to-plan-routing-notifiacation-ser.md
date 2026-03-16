---
title: '2058 | GrowthOps | Service | Service Stage is set to “To Plan"  | Routing & Notifiacation: Service Routing & Disposition Notification'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634335
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574037695/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574037695/edit)
*   **Workflow ID:** 3574037695
*   **Workflow Name:** 2058 | GrowthOps | Service | Service Stage is set to “To Plan" | Routing & Notifiacation: Service Routing & Disposition Notification

### Workflow Goal

This workflow automates the assignment and notification process for new 'Service' custom objects. When a Service for a specific product group enters the "To Plan" stage, it is automatically assigned to a designated user, and an email notification with key details is sent to that new owner.

### Enrollment Triggers

This workflow is for the 'Service' object.
A Service record enrolls when it meets **ALL** of the following criteria:

*   The **Service Stage** is set to "To Plan" (ID: 3563873492).
*   The **Product Group** is any of "Digital Spots" or "Radio Spots".
*   The Service record has a creation date (is not a newly created, unsaved record).

Re-enrollment is enabled, meaning a service can re-trigger this workflow if its properties are updated to meet the criteria again.

### Actions

Once a Service is enrolled, the workflow performs the following actions in order:

1. **Assign Service Owner**
    *   The workflow sets the **HubSpot Owner** property of the Service record to a specific, predefined user (ID: 31177619).
2. **Send Internal Notification Email**
    *   The workflow sends an internal email notification to the new HubSpot Owner assigned in the previous step.
    *   **Email Subject:** Neuer Service {{ Service Name }} ist erstellt (New Service {{ Service Name }} has been created)
    *   **Email Body:** The email informs the new owner of their assignment and provides the following details about the Service using personalization tokens:
        *   Project ID
        *   Service ID
        *   Service Name
        *   Campaign Start Date
        *   Campaign End Date
        *   Disposition & Briefing Details