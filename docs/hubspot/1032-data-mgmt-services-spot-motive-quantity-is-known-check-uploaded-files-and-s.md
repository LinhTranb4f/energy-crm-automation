---
title: '1032 | Data-Mgmt | Services | Spot / Motive Quantity is known | check uploaded files and set stage to content in approval or send internal notification'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634175
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3552743645/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3552743645/edit)
*   **Workflow ID:** 3552743645
*   **Workflow Name:** 1032 | Data-Mgmt | Services | Spot / Motive Quantity is known | check uploaded files and set stage to content in approval or send internal notification

### Workflow Goal

This workflow automates the data management process for 'Audio Production' services. When the required number of 'spots' (motives/files) for a service is known, this workflow checks if all necessary files have been uploaded. If all files are present, it moves the service to the 'Content in Approval' stage. If files are missing, it waits 24 hours before sending an internal reminder notification to the service owner.

### Enrollment Triggers

This workflow enrolls a custom 'Service' object when the following conditions are met:

*   The service's 'Product Group' is 'audio\_production'.
*   The 'Count of Associated Spots' is 1 or more.
*   The workflow allows for re-enrollment if the 'Product Group' property is updated.

### Workflow Steps

**Step 1: Initial Check for Uploaded Files**

The workflow begins with a branch to check if any spot files are missing.

*   **Path A: All Motives Present**
    *   **Condition:** The property 'Open spot files count' is equal to 0.
    *   **Action:** The service's pipeline stage is immediately updated to 'Content in Approval'. The workflow then ends for this service.
*   **Path B: Missing Motives**
    *   **Condition:** The property 'Open spot files count' is 1 or more.
    *   **Action:** The workflow proceeds to the next step.

**Step 2: Wait for Files to be Uploaded**

*   The workflow will pause and wait for up to 24 hours (1440 minutes).
*   It waits for a specific event to occur: the 'Open spot files count' property being updated to 0.

**Step 3: Check Status After 24-Hour Delay**

After the delay, the workflow checks if the required files were uploaded.

*   **Path A: Files Were Uploaded Within 24 Hours**
    *   **Condition:** The 'Open spot files count' was updated to 0 during the delay.
    *   **Action:** The service's pipeline stage is updated to 'Content in Approval'. The workflow then ends.
*   **Path B: Files Are Still Missing**
    *   **Condition:** The 'Open spot files count' was not updated to 0 during the delay.
    *   **Action:** The workflow sends an internal email notification to the HubSpot Owner of the service.
        *   **Subject:** Reminder: Fehlende Spots Motive {{ Service Name }}
        *   **Body:** A message in German reminding the owner that motives are missing for the specific service and asking them to upload the corresponding files.
    *   The workflow ends after sending the notification.