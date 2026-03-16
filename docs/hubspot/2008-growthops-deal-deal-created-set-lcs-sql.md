---
title: '2008 | GrowthOps | deal | Deal Created | Set LCS= SQL'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633095
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638573760/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638573760/edit)
*   **Workflow ID:** 2638573760
*   **Workflow Name:** 2008 | GrowthOps | deal | Deal Created | Set LCS= SQL

### Purpose

This workflow automates the initial lifecycle stage classification for all newly created deals. Its primary function is to set the 'Lifecycle Stage' of a deal to 'Sales Qualified Lead (SQL)' immediately upon its creation in HubSpot.

### Object Type

*   Deal

### Enrollment Triggers

Deals will enroll in this workflow when the following criteria are met:

*   A deal is created in HubSpot (The 'Create date' property has a known value).
*   Re-enrollment is enabled, meaning if a deal were to somehow meet the trigger criteria again, it would re-enter the workflow.

### Actions

Once a deal is enrolled, the workflow performs the following single action:

*   **Action 1: Set Property Value**
    *   **Target Property:** Lifecycle Stage (lifecyclestage)
    *   **New Value:** Sales Qualified Lead (SQL)