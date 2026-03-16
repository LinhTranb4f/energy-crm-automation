---
title: '2016 | GrowthOps | contact | Create new contact by source competitive analysis | Set lifecycle stage to prospect'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632735
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419822821/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419822821/edit)
*   **Workflow ID:** 2419822821
*   **Workflow Name:** 2016 | GrowthOps | contact | Create new contact by source competitive analysis | Set lifecycle stage to prospect

**Objective**
This contact-based workflow is designed to automatically advance new contacts to the "Sales Qualified Lead" (SQL) lifecycle stage when they are created from specific high-intent sources and are not already further down the sales funnel.

**Enrollment Triggers**
A contact will be enrolled in this workflow if they meet **EITHER** of the following sets of conditions:

*   **Condition Group 1:**
    *   The contact's 'Original Contact Source' property is 'Competitive Analysis'.
    *   **AND**
    *   The contact's 'Lifecycle Stage' is **not** Opportunity, Customer, or another designated later-stage value.
*   **OR**
*   **Condition Group 2:**
    *   The contact's 'Object Source Label' property is 'INTENT'.
    *   **AND**
    *   The contact's 'Lifecycle Stage' is **not** Opportunity, Customer, or another designated later-stage value.

**Actions**
Once a contact is enrolled, the following action will be executed immediately:

*   **Set Property Value:** The contact's 'Lifecycle Stage' property will be set to 'Sales Qualified Lead'.

**Workflow Settings**

*   **Re-enrollment:** Re-enrollment is turned **off**. A contact can only be processed by this workflow once.