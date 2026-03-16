---
title: '1032b | Data-Mgmt | Services | Spot / Motive Quantity is known | check uploaded files and set stage to content in approval or send internal notification '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634535
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3611124946/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3611124946/edit)
*   **Workflow ID:** 3611124946
*   **Workflow Name:** 1032b | Data-Mgmt | Services | Spot / Motive Quantity is known | check uploaded files and set stage to content in approval or send internal notification

### Objective

This workflow automates the management of creative assets (referred to as "Spots" or "Motives") for services in the "Audio Production" product group. Its primary function is to verify that all required asset files have been uploaded and approved. If all assets are complete, the service's pipeline stage is updated. If assets are missing or pending approval, the workflow sends internal reminder notifications to the service owner.

### Enrollment Triggers

*   **Object Type:** Service
*   **Trigger Condition:** A service is enrolled when its "Product Group" property is set to "Audio Production".
*   **Re-enrollment:** Re-enrollment is enabled. A service will re-enter this workflow if its "Product Group" property is updated to "Audio Production" again.

### Workflow Steps

**Step 1: Initial Asset Check**

The workflow begins by branching based on the status of the service's assets.

*   **Path A - All Assets Complete:** This path is taken if both of the following conditions are true:
    *   The property `count_of_spots_not_approved` is 0.
    *   The property `open_spot_files_count` is 0.
*   **Path B - Assets Incomplete:** This path is taken if either of the following is true:
    *   The `open_spot_files_count` is 1 or more.
    *   The `count_of_spots_not_approved` is 1 or more.

**Step 2: Path A - Process Complete**

*   If all assets are uploaded and approved, the workflow immediately updates the service's `Pipeline Stage` to "Content in Approval".
*   The workflow then ends for this service.

**Step 3: Path B - Waiting for Real-time Approval**

*   If assets are incomplete, the workflow first waits for up to 2 minutes.
*   It checks if the `count_of_spots_not_approved` property becomes 0 within this time frame.
*   **If Approved:** The service's `Pipeline Stage` is set to "Content in Approval", and the workflow ends.
*   **If Not Approved:** The workflow proceeds to the scheduled reminder loop.

**Step 4: Path B - Evening Reminder Process**

*   The workflow waits until 9:00 PM on the same day.
*   It performs another check on the asset status. If the assets are still incomplete, it proceeds.
*   **Action:** An internal email notification is sent to the service owner.
    *   **Subject (German):** `Reminder: Fehlende Spots Motive / Approval nötig {{ enrolled_object.hs_name }}`
    *   **Translation:** `Reminder: Missing Spot Motives / Approval needed [Service Name]`
    *   **Body:** A message asking the owner to upload the missing files and provide their approval.

**Step 5: Path B - Post-Notification Check**

*   After sending the evening reminder, the workflow waits again for up to 2 minutes to see if the `count_of_spots_not_approved` property becomes 0.
*   **If Approved:** The service's `Pipeline Stage` is set to "Content in Approval", and the workflow ends.
*   **If Not Approved:** The workflow continues to the next reminder step.

**Step 6: Path B - Morning Reminder**

*   The workflow waits until 7:00 AM.
*   **Action:** It sends a second, identical internal reminder email to the service owner.
*   After this final notification, this branch of the workflow concludes.