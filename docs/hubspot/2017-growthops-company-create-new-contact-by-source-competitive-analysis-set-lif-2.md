---
title: '2017 | GrowthOps | company | Create new contact by source competitive analysis | Set lifecycle stage to prospect'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635075
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419857649/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419857649/edit)
*   **Workflow ID:** 2419857649
*   **Workflow Name:** 2017 | GrowthOps | company | Create new contact by source competitive analysis | Set lifecycle stage to prospect

### Objective

This workflow automatically updates the lifecycle stage of specific companies to 'Sales Qualified Lead'. It targets companies identified through competitive analysis or those showing buying intent, as long as they are not already advanced in the sales funnel (e.g., Opportunity, Customer).

### Workflow Type

*   Company-based

### Enrollment Triggers

A company will be enrolled in this workflow if it meets **EITHER** of the following conditions:

*   **Condition 1:**
    *   The company's 'Original Company Source' is 'Competitive Analysis'.
    *   **AND** the company's 'Lifecycle Stage' is not 'Opportunity' or 'Customer' (or other specified late-stage values).
*   **OR**
*   **Condition 2:**
    *   The company's 'Object Source Label' is 'INTENT'.
    *   **AND** the company's 'Lifecycle Stage' is not 'Opportunity' or 'Customer' (or other specified late-stage values).

### Actions

Once a company is enrolled, the workflow performs the following single action:

1. **Set Property Value:**
    *   Sets the company's 'Lifecycle Stage' property to **Sales Qualified Lead**.

### Settings

*   **Re-enrollment:** Disabled. A company can only go through this workflow once.

### Important Notes

*   **Discrepancy:** The workflow's name suggests it sets the lifecycle stage to 'Prospect', but the action actually sets the stage to **'Sales Qualified Lead'**. This should be reviewed for accuracy.