---
title: '2017 | GrowthOps | company | Create new contact by source competitive analysis | Set lifecycle stage to prospect'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632655
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419857649/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419857649/edit)
*   **Workflow ID:** 2419857649
*   **Workflow Name:** 2017 | GrowthOps | company | Create new contact by source competitive analysis | Set lifecycle stage to prospect

### Workflow Goal

This company-based workflow is designed to automatically identify high-potential companies and advance their lifecycle stage. It specifically targets companies sourced from 'Competitive Analysis' or marked with 'INTENT' data, and updates their status to 'Sales Qualified Lead' to flag them for sales team attention.

### Enrollment Triggers

A company will be enrolled in this workflow if it meets **EITHER** of the following conditions:

**Condition 1:**

*   The company's 'Original Company Source' is 'Competitive Analysis'.
*   **AND** the company's 'Lifecycle Stage' is **NOT** 'Opportunity', 'Customer', or certain other later stages (ID: 2658077915, 2658077914).

**OR**

**Condition 2:**

*   The company's 'Object Source Label' is 'INTENT'.
*   **AND** the company's 'Lifecycle Stage' is **NOT** 'Opportunity', 'Customer', or certain other later stages (ID: 2658077915, 2658077914).

### Settings

*   **Re-enrollment:** Companies cannot be re-enrolled in this workflow.

### Workflow Actions

Once a company is enrolled, the following action occurs:

*   **Action 1: Set Property Value**
    *   The company's 'Lifecycle Stage' property is immediately set to **Sales Qualified Lead**.