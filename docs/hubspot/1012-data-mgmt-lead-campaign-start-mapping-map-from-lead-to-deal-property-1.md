---
title: '1012 | Data-Mgmt | lead | Campaign Start mapping | Map from Lead to Deal Property'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635575
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2691084506/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2691084506/edit)
*   **Workflow ID:** 2691084506
*   **Workflow Name:** 1012 | Data-Mgmt | lead | Campaign Start mapping | Map from Lead to Deal Property

### Purpose

This workflow is designed for data management. It copies the "Campaign start" property from a lead to its associated deal when both have a known "Campaign start" and the deal has a known name.

### Object Type

*   This workflow is based on the **Lead** object.

### Enrollment Triggers

A lead will be enrolled in this workflow when **all** of the following conditions are met:

*   The lead's property "Campaign start" is known (i.e., it is not empty).
*   The lead has an associated Deal where the "Deal name" property is known.

### Workflow Actions

Once a lead is enrolled, the workflow performs the following single action:

*   **Action:** Copy property value
*   **Source:** The value from the "Campaign start" property on the enrolled Lead.
*   **Target:** The "Campaign start" property on the associated Deal.

### Re-enrollment

*   Re-enrollment is turned **off**. A lead can only go through this workflow once.