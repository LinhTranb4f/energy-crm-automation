---
title: '2057 | GrowthOps | Operations Projects | Radio Spot Services = "Planning Completed / In Approval" | Create Broadcast Plan URL '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636615
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3572251847/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3572251847/edit)
*   **Workflow ID:** 3572251847
*   **Workflow Name:** 2057 | GrowthOps | Operations Projects | Radio Spot Services = "Planning Completed / In Approval" | Create Broadcast Plan URL

### Workflow Goal

This workflow automates the initial setup for a broadcast plan when a new Radio Spot Service is associated with an Operations Project. It sets the plan's approval status to 'Open' and generates a unique URL for the media schedule.

### Enrollment Triggers

This workflow enrolls an **Operations Project** record when the following condition is met:

*   The project's "Number of associated Radio Spot Services" property is greater than or equal to 1.

### Enrollment Settings

*   **Re-enrollment:** Disabled. A project can only go through this workflow once.

### Actions

The workflow executes the following steps in order for each enrolled project:

1. **Set Approval Status:**
    *   Sets the project's "Broadcast Plan Approval Status" property to the value "Open". This indicates that the new broadcast plan is ready for review.
2. **Create Broadcast Plan URL:**
    *   Sets the project's "Broadcast Plan URL" property to a dynamically generated link.
    *   The URL is constructed as: `https://kb.energy.ch/media-schedule/[Project ID]`, where `[Project ID]` is the unique HubSpot Object ID of the enrolled project record.