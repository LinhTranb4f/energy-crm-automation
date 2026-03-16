---
title: '2056 | GrowthOps | Service | Service = completed | Notify Disposition when Audio Production is completed'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636595
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3567016179/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3567016179/edit)
*   **Workflow ID:** 3567016179
*   **Workflow Name:** 2056 | GrowthOps | Service | Service = completed | Notify Disposition when Audio Production is completed

### Workflow Goal

This workflow automates the notification process to the Disposition team once an Audio Production service has been completed and all associated audio spots are approved.

### Object Type

This workflow is based on the **Service** custom object.

### Enrollment Triggers

A Service record enrolls in this workflow when all of the following conditions are met:

*   The Service's pipeline stage is updated to **Completed** (Stage ID: 3565446370).
*   **AND** The Service's **Product Group** property is **Audio Production**.
*   **AND** The **Count of Spots Not Approved** property is exactly **0**.
*   **AND** The **Count of Associated Spots** property is not **0** (meaning there is at least one spot).

### Re-enrollment

Re-enrollment is turned **OFF**. A service record can only be processed by this workflow once.

### Workflow Actions

Once a service record is enrolled, the following action occurs:

**Action 1: Send Internal Email Notification**

*   An email notification is sent to a specific user/team (User ID: 67115507), which is the Disposition Team.
*   **Email Subject:** `Audio Production File(s) Ready for Disposition`
*   **Email Body:** The email informs the team that all production spots are finished and the content is ready for disposition. It includes personalized information pulled from an associated Project object:
    *   **Project ID**
    *   **Project Name**