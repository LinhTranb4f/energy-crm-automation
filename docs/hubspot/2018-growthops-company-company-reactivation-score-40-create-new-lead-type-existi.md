---
title: '2018 |   GrowthOps | company | Company Reactivation Score > 40 | Create new Lead   ("type = Existing customer")\xa0'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632815
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2427021552/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2427021552/edit)
*   **Workflow ID:** 2427021552
*   **Workflow Name:** 2018 | GrowthOps | company | Company Reactivation Score > 40 | Create new Lead ("type = Existing customer")

### Workflow Goal

This workflow automates the creation of new "Lead" objects for existing companies that show signs of re-engagement. The goal is to flag these "warm" companies for the sales or account management team to follow up on.

### Enrollment Triggers

This is a company-based workflow. A company will be enrolled when it meets ALL of the following criteria:

*   Its "Company Reactivation Score" is greater than 40.
*   It is NOT a member of suppression list ID 167 (likely excluding companies with recent activity or specific opt-outs).
*   It is NOT a member of suppression list ID 170 (likely excluding companies with open deals or in other sales processes).

### Re-enrollment

*   Re-enrollment is turned ON for this workflow.
*   A company can re-enter the workflow whenever its "Company Reactivation Score" property is updated to a value greater than 40.

### Workflow Actions

When a company is enrolled, the workflow performs the following single action:

*   **Create a new Lead object with the following properties:**
    *   **Lead Name:** Set to the name of the enrolled company.
    *   **Lead Label:** Set to "Warm".
    *   **Lead Stage:** Set to "Open".
    *   **Lead Type:** Set to "Existing Customer" (internally "RE\_ATTEMPTING").
    *   **Association:** The newly created Lead is automatically associated with the enrolled company.