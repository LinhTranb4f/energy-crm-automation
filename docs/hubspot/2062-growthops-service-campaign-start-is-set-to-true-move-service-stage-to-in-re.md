---
title: '2062 | GrowthOps | Service | Campaign Start is set to true | Move Service Stage to “In Realization”'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634375
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574060252/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574060252/edit)
*   **Workflow ID:** 3574060252
*   **Workflow Name:** 2062 | GrowthOps | Service | Campaign Start is set to true | Move Service Stage to “In Realization”

### Purpose

This workflow automates the process of updating the service stage for specific campaigns. When a campaign for a Digital or Radio Spot is scheduled to begin today, this workflow automatically moves the corresponding service ticket into the "In Realization" stage to signify that work has commenced.

### Enrollment Triggers

This workflow enrolls Service Tickets when **ALL** of the following conditions are met:

*   The **Campaign Start Date** property is today (based on the Europe/Zurich timezone).
*   The **Product Group** property is any of the following:
    *   digital\_spots
    *   radio\_spots

### Workflow Actions

Once a service ticket is enrolled, the following action is performed immediately:

*   **Set Property Value:** The ticket's **Pipeline Stage** is set to "In Realization".

### Settings

*   **Re-enrollment:** Disabled. A ticket will only be processed by this workflow once.