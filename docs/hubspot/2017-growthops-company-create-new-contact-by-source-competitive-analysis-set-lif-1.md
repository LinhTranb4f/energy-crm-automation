---
title: '2017 | GrowthOps | company | Create new contact by source competitive analysis | Set lifecycle stage to prospect'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632755
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419857649/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419857649/edit)
*   Workflow ID: 2419857649
*   Workflow Name: 2017 | GrowthOps | company | Create new contact by source competitive analysis | Set lifecycle stage to prospect

### Objective

This workflow automatically updates a company's lifecycle stage to 'Sales Qualified Lead' based on its original source or source label, provided it isn't already a more advanced lead, opportunity, or customer.

### Workflow Type

*   Object-based: This workflow enrolls and acts upon **Company** records.

### Enrollment Triggers

A company will be enrolled in this workflow if it meets **EITHER** of the following two conditions:

*   **Condition Set 1:**
    *   The company's 'Original Company Source' property is exactly 'Competitive Analysis'.
    *   **AND**
    *   The company's 'Lifecycle Stage' is not one of 'Opportunity', 'Customer', or other designated later-stage values (IDs: 2658077915, 2658077914).
*   **OR**
*   **Condition Set 2:**
    *   The company's 'Source Label' property is exactly 'INTENT'.
    *   **AND**
    *   The company's 'Lifecycle Stage' is not one of 'Opportunity', 'Customer', or other designated later-stage values (IDs: 2658077915, 2658077914).

### Re-enrollment

*   Re-enrollment is turned **OFF**. A company can only be processed by this workflow once.

### Actions

If a company is enrolled, the workflow performs the following single action:

1. **Set a property value:**
    *   The 'Lifecycle Stage' property is updated to **'Sales Qualified Lead'**.