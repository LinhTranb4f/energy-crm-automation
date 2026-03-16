---
title: '1034 | Data-Mgmt | Services | Audio Production Service is in "content in approval" | send internal notification to project owner and/or customer with info "ready for approval"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636535
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3556508921/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3556508921/edit)
*   **Workflow ID:** 3556508921
*   **Workflow Name:** 1034 | Data-Mgmt | Services | Audio Production Service is in "content in approval" | send internal notification to project owner and/or customer with info "ready for approval"

### Purpose

This workflow automates the notification and approval process for Audio Production services. When an audio production service enters the "Content in Approval" stage, this workflow notifies the internal project owner, waits for internal team approval, and then manages the final approval process, sending reminders if necessary.

### Trigger and Enrollment Criteria

A Service record is enrolled in this workflow when it meets all of the following criteria:

*   **Product Group:** Is 'audio\_production'.
*   **Pipeline Stage:** Is 'Content in Approval'.

### Execution Schedule

This workflow will only execute actions on the following days and times:

*   Monday to Friday, from 7:00 AM to 5:00 PM.

### Workflow Steps

**Phase 1: Initial Notification & Internal Approval**

1. **Send Initial Notification to Service Owner:**
    *   Immediately after enrollment, an internal notification email is sent to the HubSpot owner of the Service record.
    *   **Subject:** _\[Service Name\]_ ist bereit für die Freigabe
    *   **Body:** Informs the owner that the motifs in the service are ready for approval and provides a link to the service record.
2. **Wait for Internal Audio Team Approval:**
    *   The workflow pauses and waits for up to **5 days (7200 minutes)** for a specific event to happen: The property `count_of_spots_not_approved_by_audio_production_team` on the service record becomes `0`.
    *   This indicates that the internal audio production team has approved all associated audio spots.
3. **Check Internal Approval Status (If/Then Branch):**
    *   **If YES (All spots are approved by the audio team within 5 days):** The workflow proceeds to the next step.
    *   **If NO (Timeout is reached):** The workflow ends for this service record.
4. **Send Internal Confirmation Notification:**
    *   An internal notification is sent to the **Deal Owner** associated with the service.
    *   **Subject:** Audio Spots
    *   **Body:** Confirms that all spots have been approved by the internal audio team.

**Phase 2: Final Customer Approval & Reminders**

1. **Check for Automated Customer Email Setting (If/Then Branch):**
    *   The workflow checks the associated Deal record to see if the property `automated_customer_email` is set to 'Yes'.
    *   _Note: Both the 'Yes' and 'No/Empty' branches currently lead to the same next step._
2. **Wait for Final Approval:**
    *   The workflow pauses and waits for up to **24 hours (1440 minutes)** for the event where the property `count_of_spots_not_approved` on the service record becomes `0`.
    *   This indicates that the customer or project owner has given final approval for all spots.
3. **Check Final Approval Status (If/Then Branch):**
    *   **If YES (All spots are approved within 24 hours):** The workflow successfully completes and ends.
    *   **If NO (Timeout is reached):** The workflow proceeds to send a reminder.
4. **Send Reminder Notification:**
    *   An internal reminder notification is sent to the HubSpot Owner of the service.
    *   **Subject:** Reminder: _\[Service Name\]_ ist bereit für die Freigabe
    *   **Body:** Reminds the owner that the motifs for the service still require final approval.
5. **Final Check & End:**
    *   The workflow performs a final, identical check for the `automated_customer_email` setting on the associated deal.
    *   The workflow then ends, regardless of the outcome of this final check.