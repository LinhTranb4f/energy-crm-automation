---
title: '2016 | GrowthOps | contact | Create new contact by source competitive analysis | Set lifecycle stage to prospect'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635055
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419822821/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419822821/edit)
*   **Workflow ID:** 2419822821
*   **Workflow Name:** 2016 | GrowthOps | contact | Create new contact by source competitive analysis | Set lifecycle stage to prospect

**Workflow Purpose**

This contact-based workflow automatically updates the lifecycle stage of specific contacts to 'Sales Qualified Lead'. It targets contacts created from high-value sources, ensuring they are correctly prioritized, as long as they haven't already progressed to a later stage in the sales funnel.

**Enrollment Triggers**

A contact will be enrolled in this workflow if they meet **EITHER** of the following sets of conditions:

**Condition Set 1:**

*   The contact's 'Original Contact Source' is 'Competitive Analysis'.
*   **AND**
*   The contact's 'Lifecycle Stage' is not 'Opportunity', 'Customer', or other specific later-stage values.

**OR**

**Condition Set 2:**

*   The contact's 'Object Source Label' is 'INTENT'.
*   **AND**
*   The contact's 'Lifecycle Stage' is not 'Opportunity', 'Customer', or other specific later-stage values.

**Actions**

Once a contact is enrolled, the workflow performs the following single action:

1. **Set Property Value:** The contact's 'Lifecycle Stage' property is set to 'Sales Qualified Lead'.

**Additional Settings & Notes**

*   **Re-enrollment:** This is turned **OFF**. Contacts can only be processed by this workflow once.
*   **Note on Naming:** There is a discrepancy between the workflow's name (which mentions setting the stage to 'Prospect') and the actual action performed (which sets the stage to 'Sales Qualified Lead'). The action is the source of truth for the workflow's outcome.