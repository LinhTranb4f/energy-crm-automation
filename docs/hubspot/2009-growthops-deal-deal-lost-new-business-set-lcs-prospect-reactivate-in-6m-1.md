---
title: '2009 | GrowthOps | deal | Deal Lost (New Business) | Set LCS= Prospect & Reactivate in 6M'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635435
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/\[PORTAL\_ID\]/platform/flow/2639201502/edit](https://app-eu1.hubspot.com/workflows/[PORTAL_ID]/platform/flow/2639201502/edit)
*   **Workflow ID:** 2639201502
*   **Workflow Name:** 2009 | GrowthOps | deal | Deal Lost (New Business) | Set LCS= Prospect & Reactivate in 6M

### Workflow Goal

This workflow is designed to manage "New Business" deals that have been marked as "Closed Lost". The primary goal is to automatically re-engage with the contacts associated with these lost deals after a 6-month cooling-off period by resetting their lifecycle stage and updating a custom lead type property to flag them for future outreach.

### Enrollment Triggers

A Deal will enroll in this workflow when it meets **all** of the following criteria:

*   The Deal's stage is updated to **Closed Lost**.
*   The Deal is associated with another object where the **Lead Type** property is **New Business**.

### Settings

*   **Re-enrollment:** This is **enabled**. A deal can re-enter this workflow every time it is moved to the "Closed Lost" stage and meets the associated object criteria.

### Workflow Actions

Once a deal is enrolled, the workflow will perform the following actions in sequence:

1. **Delay for 6 Months:** The workflow will pause for 180 days (259,200 minutes) before proceeding to the next step.
2. **Update Associated Contact's Lifecycle Stage:** After the delay, the workflow finds the contact associated with the deal and sets their **Lifecycle Stage** property to **Sales Qualified Lead**.
3. **Update Associated Object's Lead Type:** The workflow then updates the associated object's (the one checked in the trigger condition) **Lead Type** property to **RE\_ATTEMPTING**.

### Notes & Discrepancies

*   **Lifecycle Stage Mismatch:** The workflow's name suggests it sets the Lifecycle Stage (LCS) to "Prospect". However, the action is configured to set the stage to **"Sales Qualified Lead"**. This should be reviewed to ensure the workflow is functioning as intended.