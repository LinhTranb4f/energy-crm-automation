---
title: '2063 | GrowthOps | Service | Campaign End Date is reached or End Campaign = true | Move Service Stage to “Realisation Closed”'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634395
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574061286/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3574061286/edit)
*   **Workflow ID:** 3574061286
*   **Workflow Name:** 2063 | GrowthOps | Service | Campaign End Date is reached or End Campaign = true | Move Service Stage to “Realisation Closed”

### Objective

This workflow automatically updates the stage of a Service object to "Realisation Closed" when its associated campaign has concluded, based on the campaign's end date.

### Object Type

*   This workflow operates on the **Service** object.

### Enrollment Triggers

A Service object will be enrolled in this workflow when the following conditions are met simultaneously (AND logic):

*   **Condition 1:** The 'Campaign End Date' property is today.
    *   This is checked daily based on the Europe/Zurich timezone.
*   **Condition 2:** The 'Product Group' property is any of the following:
    *   digital\_spots
    *   radio\_spots

### Re-enrollment

*   Re-enrollment is turned **OFF**. A Service object can only go through this workflow once.

### Actions

Once a Service object is enrolled, the workflow performs the following single action:

*   **Set Property Value:**
    *   **Property to update:** Service Stage (`hs_pipeline_stage`)
    *   **New Value:** The stage is set to "Realisation Closed" (Internal ID: 3565446370).

### Note

*   The workflow name suggests an alternative trigger condition ('End Campaign = true'). However, based on the provided data, the workflow only enrolls records based on the 'Campaign End Date' and 'Product Group' properties.