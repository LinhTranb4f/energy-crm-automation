---
title: '2057 | GrowthOps | Operations Projects | Radio Spot Services = "Planning Completed / In Approval" | Create Broadcast Plan URL '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634295
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3572251847/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3572251847/edit)
*   **Workflow ID:** 3572251847
*   **Workflow Name:** 2057 | GrowthOps | Operations Projects | Radio Spot Services = "Planning Completed / In Approval" | Create Broadcast Plan URL

### Workflow Goal

This workflow automates the initial setup for the broadcast plan approval process for an Operations Project. When a related radio spot service's planning is marked as complete, this workflow prepares the project record by setting an approval status and generating a unique URL for the broadcast plan.

### Trigger (Enrollment Criteria)

An **Operations Project** record is enrolled in this workflow when the following conditions are met:

*   The project has one or more associated Radio Spot Services.
*   _Based on the workflow name, the implied trigger is that the status of an associated Radio Spot Service is updated to "Planning Completed / In Approval"._

### Actions

Once a project is enrolled, the workflow performs the following actions in sequence:

1. **Set Approval Status:** It updates the "Broadcast Plan Approval Status" property on the project record to the value "Open". This indicates that the plan is ready for review.
2. **Create Broadcast Plan URL:** It generates a unique URL for the broadcast plan and saves it to the "Broadcast Plan URL" property. The URL is created using the formula: `https://kb.energy.ch/media-schedule/[Project's HubSpot Object ID]`.