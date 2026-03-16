---
title: 'Update Operational Project Start & End Date'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634495
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3605330152/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3605330152/edit)
*   **Workflow ID**: 3605330152
*   **Workflow Name**: Update Operational Project Start & End Date

### Workflow Goal

This workflow automatically synchronizes the start and end dates of an "Operational Project" object with its associated "Service" objects. Its purpose is to ensure the Project's overall date range is always wide enough to encompass the full duration of all its related Services. It achieves this by updating the Project's start date to the earliest start date and its end date to the latest end date found among all associated services.

### Enrollment Triggers

A Service record is enrolled or re-enrolled in this workflow whenever one of the following properties is set or updated:

*   `Campaign Start Date`
*   `Campaign End Date`

### Workflow Actions

Once a Service record is enrolled, the workflow performs a sequence of checks and updates on its associated Operational Project:

#### Part 1: Check and Update the Project End Date

1. The workflow begins by comparing the enrolled Service's `Campaign End Date` with the associated Project's `Operations Project Campaign End Date`.
2. **Condition**: If the Service's end date is **LATER THAN** the Project's current end date.
3. **Action**: The workflow copies the Service's `Campaign End Date` over to the Project's `Campaign End` property. This extends the project's overall duration.
4. If the Service's end date is not later, no action is taken, and the workflow proceeds to the next part.

#### Part 2: Check and Update the Project Start Date

1. Next, the workflow compares the enrolled Service's `Campaign Start Date` with the associated Project's `Operations Project Campaign Start Date`.
2. **Condition**: If the Service's start date is **EARLIER THAN** the Project's current start date.
3. **Action**: The workflow copies the Service's `Campaign Start Date` over to the Project's `Campaign Start` property. This moves the project's start date to an earlier point in time.
4. If the Service's start date is not earlier, no action is taken.

After these checks are complete, the workflow for this record concludes.