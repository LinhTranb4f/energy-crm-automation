---
title: '2061 | GrowthOps | Service | All Radio Spot Motifs Available | If validation is successful: Move Service Stage to “Ready for Realization”'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634415
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574599907/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574599907/edit)
*   **Workflow ID:** 3574599907
*   **Workflow Name:** 2061 | GrowthOps | Service | All Radio Spot Motifs Available | If validation is successful: Move Service Stage to “Ready for Realization”

### Purpose

This workflow automates the process of verifying the completion of creative assets for "Radio Spot" services. Its primary goal is to check if all required radio spot files have been uploaded. If they are, it moves the service to the "Ready for Realization" stage and notifies the appropriate team. If files are missing, it initiates a follow-up and reminder process.

### Enrollment Trigger

*   **Object Type:** Service
*   **Condition:** A service object is enrolled in this workflow when its "Product Group" property is set to "Radio Spots".
*   **Re-enrollment:** Disabled. A service will only go through this workflow once.

### Workflow Logic and Steps

The workflow begins 2 minutes after a service is enrolled.

#### Step 1: Initial Check

*   The workflow immediately checks the value of the "Open Spot Files Count" property on the service record.
*   It then follows one of two paths based on this value.

#### Path A: All Files Present (Success Path)

*   This path is taken if "Open Spot Files Count" is 0.
    *   **Update Service Stage:** The service's pipeline stage is immediately updated to "Ready for Realization" (ID: 3563873494).
    *   **Notify Team:** An internal email and an in-app notification are sent to the service owner.
        *   **Subject:** "Service is officially ready for realization and execution"
        *   **Content:** The message informs the "Dispo Team" that all creative assets are complete and the service is ready for execution, providing details of the service record.
    *   The workflow then ends for this service.

#### Path B: Files are Missing (Reminder Path)

*   This path is taken if "Open Spot Files Count" is 1 or more, or if the value is unknown.
    *   **Wait for 1 Day:** The workflow pauses for up to 24 hours (1440 minutes), waiting for an event that signals the "Open Spot Files Count" has become 0.
    *   **Re-evaluation after 1 Day:**
        *   **If the files are uploaded within 24 hours:** The workflow jumps to Path A (Update Service Stage, Notify Team).
        *   **If files are still missing after 24 hours:** The workflow proceeds to the escalation step.

#### Escalation: Files Still Missing After 1 Day

*   If files are still missing, the workflow sends a reminder notification and waits again.
    *   **Send Reminder Email:** An email is sent to the service owner.
        *   **Subject:** "Spot motives still missing for \[Service Name\]"
        *   **Content:** A notification that assets are still missing and a request to upload the corresponding spot files.
    *   **Wait for 5 Days:** The workflow pauses again for up to 5 days (7200 minutes), waiting for the "Open Spot Files Count" to become 0.
    *   **Final Re-evaluation:**
        *   **If the files are uploaded within these 5 days:** The workflow jumps to Path A (Update Service Stage, Notify Team).
        *   **If files are still missing after 5 days:** The workflow ends without taking further action.