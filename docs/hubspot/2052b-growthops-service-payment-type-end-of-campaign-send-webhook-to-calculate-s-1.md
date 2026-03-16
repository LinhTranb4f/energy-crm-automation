---
title: '2052b | GrowthOps | Service | payment type = end of campaign  | send webhook to calculate service for end of campaign '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636415
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3391011047/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3391011047/edit)
*   **Workflow ID:** 3391011047
*   **Workflow Name:** 2052b | GrowthOps | Service | payment type = end of campaign | send webhook to calculate service for end of campaign

### Purpose

This workflow automates the process of calculating delivered services for specific campaigns after they have concluded. It is designed for services that are paid at the end of the campaign. When a "Radio Spots" campaign's end date has passed, this workflow triggers an external system (via a webhook) to perform necessary calculations or updates.

### Enrollment Triggers

A Service object is enrolled in this workflow when **all** of the following conditions are met:

*   **Product Group:** The service's "Product Group" is "Radio Spots".
*   **Campaign End Date:** The service's "Campaign End Date" is in the past (more than one day ago).
*   **Associated Payment Type:** The service is associated with another object (e.g., a Deal) where the "Payment Type" property is set to "End of Campaign".

### Re-enrollment

*   Re-enrollment is **enabled**. This allows a service object to enter the workflow again if its properties are updated and meet the trigger criteria a second time.

### Workflow Actions

1. **Send Webhook to External System**
    *   **Action Type:** A POST webhook is sent to an external service.
    *   **Endpoint URL:** `https://n8n.tools.energy/webhook/update-hs-delivered-services`
    *   **Purpose:** This action notifies an external automation platform (n8n) to start a process for updating or calculating the delivered services related to the enrolled service object.