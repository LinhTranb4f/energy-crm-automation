---
title: '1032 | Data-Mgmt | Services | Spot / Motive Quantity is known | check uploaded files and set stage to content in approval or send internal notification'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636495
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3552743645/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3552743645/edit)
*   **Workflow ID:** 3552743645
*   **Workflow Name:** 1032 | Data-Mgmt | Services | Spot / Motive Quantity is known | check uploaded files and set stage to content in approval or send internal notification

### Purpose

This workflow automates the data management process for 'Audio Production' services. Its primary function is to verify that all required creative files (referred to as 'Spots' or 'Motives') have been uploaded for a given service. If all files are present, the service is automatically advanced to the 'Content in Approval' pipeline stage. If files are missing, the workflow waits for 24 hours for the files to be uploaded before sending an internal reminder notification to the service owner.

### Enrollment Triggers

A Service record is enrolled in this workflow when it meets the following criteria:

*   The 'Product Group' property is 'audio\_production'.
*   The 'Count of associated Spots' is 1 or greater.
*   The workflow allows for re-enrollment, meaning a record can re-trigger this workflow if its properties are updated to meet the criteria again.

### Workflow Steps

**1\. Initial File Check**

The workflow begins with an if/then branch that checks the 'Open Spot Files Count' property on the Service record.

*   **Branch A: All Files Present (****`Open Spot Files Count`** **is 0)**
    *   The workflow immediately proceeds to update the service's pipeline stage.
    *   **Action:** Sets the 'Pipeline Stage' to 'Content in Approval' (ID: de53e7d9-...).
    *   The workflow then ends for this record.
*   **Branch B: Files Are Missing (****`Open Spot Files Count`** **is 1 or more)**
    *   The workflow proceeds to a delay and notification path.

**2\. Delay for File Upload**

If files are missing, the workflow waits for a specific event to occur.

*   **Action:** It delays for a maximum of 24 hours (1440 minutes).
*   **Condition:** It waits for the 'Open Spot Files Count' to become 0. If this happens within the 24-hour window, the delay ends, and the workflow continues.

**3\. Check After Delay**

After the 24-hour delay period, another if/then branch checks if the files were uploaded.

*   **Branch A: Files Were Uploaded (Delay condition was met)**
    *   **Action:** Sets the 'Pipeline Stage' to 'Content in Approval' (ID: de53e7d9-...).
    *   The workflow then ends for this record.
*   **Branch B: Files Still Missing (Delay timed out)**
    *   The workflow performs a final check to confirm that files are still missing or not approved.
    *   If confirmed, it proceeds to send a notification.

**4\. Send Internal Notification**

If files are still missing after the 24-hour wait, an internal email notification is sent.

*   **Recipient:** The owner of the Service record ('HubSpot Owner').
*   **Subject:** Reminder: Fehlende Spots Motive {{ Service Name }}
*   **Body:** A message in German informing the owner that motives are missing for the specific service and asking them to upload the corresponding files.