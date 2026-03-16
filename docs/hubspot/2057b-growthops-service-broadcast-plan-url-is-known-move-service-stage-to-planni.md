---
title: '2057b | GrowthOps | Service | Broadcast Plan URL is known | Move Service Stage to “Planning Completed / in Approval ”'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634455
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3602173176/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3602173176/edit)
*   **Workflow ID:** 3602173176
*   **Workflow Name:** 2057b | GrowthOps | Service | Broadcast Plan URL is known | Move Service Stage to “Planning Completed / in Approval ”

### Purpose

This workflow automates the service delivery pipeline. It updates the pipeline stage to "Planning Completed / in Approval" for items with a known Broadcast Plan URL and belonging to the "Radio Spots" product group. This signifies that the initial planning phase for a radio spot service is complete and ready for the next step.

### Enrollment Triggers

A service record will automatically enroll in this workflow and trigger the actions when **all** of the following conditions are met:

*   The property "Broadcast Plan URL" has a value.
*   The property "Product Group" is "Radio Spots".

### Workflow Actions

Once a record is enrolled, the workflow will perform the following single action:

*   **Set Property Value:** It updates the "Service Stage" property to "Planning Completed / in Approval".

### Enrollment Settings

*   **Re-enrollment:** Disabled. A record can only go through this workflow once.