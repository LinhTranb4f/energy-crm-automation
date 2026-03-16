---
title: '2056 | GrowthOps | Service | Service = completed | Notify Disposition when Audio Production is completed'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634275
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3567016179/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3567016179/edit)
*   **Workflow ID**: 3567016179
*   **Workflow Name**: 2056 | GrowthOps | Service | Service = completed | Notify Disposition when Audio Production is completed

### Workflow Purpose

This workflow automates the final steps for an Audio Production service. When all creative 'spots' associated with the service have been approved, this workflow marks the service as complete and notifies the Disposition team that the files are ready for the next step.

### Trigger and Enrollment Criteria

A Service object is enrolled in this workflow when **ALL** of the following conditions are met:

*   The 'Product Group' property is 'Audio Production'.
*   The 'Count of Spots Not Approved' property is equal to 0.
*   The 'Count of Associated Spots' property is not equal to 0 (meaning there is at least one spot associated with the service).

**Re-enrollment**: Re-enrollment is turned off. An object can only go through this workflow once.

### Workflow Actions

Once a Service object is enrolled, the workflow performs the following actions in order:

1. **Update Pipeline Stage**: The Service object's pipeline stage is updated to 'Completed' (internal ID: 3565446370).
2. **Send Internal Notification**: An email notification is sent to the Disposition Team.
    *   **Subject**: "Audio Production File(s) Ready for Disposition"
    *   **Body**: The email informs the team that the production is finished and ready for disposition. It includes the associated **Project ID** and **Project Name** for reference.