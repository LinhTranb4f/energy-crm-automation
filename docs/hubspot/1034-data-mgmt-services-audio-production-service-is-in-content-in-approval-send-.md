---
title: '1034 | Data-Mgmt | Services | Audio Production Service is in "content in approval" | send internal notification to project owner and/or customer with info "ready for approval"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634215
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3556508921/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3556508921/edit)
*   **Workflow ID:** 3556508921
*   **Workflow Name:** 1034 | Data-Mgmt | Services | Audio Production Service is in "content in approval" | send internal notification to project owner and/or customer with info "ready for approval"

### Workflow Goal

This workflow automates the internal and final approval process for "Audio Production" services. It triggers when a service's content is ready for review, notifies the project owner, waits for approvals from different teams, and sends a reminder if the final approval is delayed.

### Enrollment Triggers

A Service record is enrolled in this workflow when **both** of the following conditions are met:

*   The Service's "Product Group" is "Audio Production".
*   The Service's "Pipeline Stage" is updated to "Content in Approval".

### Workflow Actions

**Phase 1: Initial Notification & Internal Approval**

*   **Step 1: Notify Project Owner**
    *   An internal email is immediately sent to the owner of the Service record.
    *   **Subject:** `[Service Name] ist bereit für die Freigabe` (is ready for approval).
    *   **Content:** Informs the owner that the audio motifs are ready and provides a link to the service record.
*   **Step 2: Wait for Internal Audio Team Approval**
    *   The workflow pauses and waits for up to 5 days (7200 minutes) for an event signifying that the internal audio production team has approved all associated audio spots.
*   **Step 3: Confirm Internal Approval**
    *   **If Approved:** If the audio team approves all spots within 5 days, an internal notification is sent to the owner of the associated Deal, confirming the approval. The workflow then proceeds to the final approval phase.
    *   **If Not Approved:** If the audio team does not approve all spots within 5 days, the workflow ends for that service record.

**Phase 2: Final Approval & Reminder**

*   **Step 4: Wait for Final Approval**
    *   The workflow pauses and waits for up to 24 hours (1440 minutes) for a separate event that signifies all spots have received final customer approval.
*   **Step 5: Final Check and Reminder Logic**
    *   **If Approved:** If final approval is received within 24 hours, the workflow concludes successfully.
    *   **If Not Approved (Send Reminder):** If final approval is not received within 24 hours, a reminder notification is sent to the Service Owner.
        *   **Subject:** `Reminder: [Service Name] ist bereit für die Freigabe`.
        *   **Content:** A message stating that the motifs still require approval.
    *   After the reminder is sent, the workflow ends. It does not loop or wait again.

### Execution Schedule

*   This workflow only executes its actions on weekdays (Monday to Friday) between 7:00 AM and 5:00 PM.
*   Actions scheduled to occur outside of this window (e.g., on a weekend) will be paused until the next available time slot.

### Re-enrollment

*   Re-enrollment is disabled. A service record can only go through this specific approval workflow once.