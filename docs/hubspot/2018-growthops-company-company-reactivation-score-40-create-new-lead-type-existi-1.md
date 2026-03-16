---
title: '2018 |   GrowthOps | company | Company Reactivation Score > 40 | Create new Lead   ("type = Existing customer")\xa0'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635135
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2427021552/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2427021552/edit)
*   **Workflow ID:** 2427021552
*   **Workflow Name:** 2018 | GrowthOps | company | Company Reactivation Score > 40 | Create new Lead ("type = Existing customer")

### Purpose

This workflow automates the creation of new "Lead" objects for existing companies that show signs of re-engagement. It identifies companies with a high reactivation score and generates a corresponding lead for the sales or growth team to follow up on, excluding companies that are part of certain suppression lists.

### Enrollment Triggers

This workflow enrolls **Companies** when they meet **all** of the following criteria:

*   The company's "Company Reactivation Score" is greater than 40.
*   The company is **NOT** a member of list ID 167.
*   The company is **NOT** a member of list ID 170.

### Re-enrollment

*   Re-enrollment is **enabled**.
*   A company can re-enter this workflow each time its "Company Reactivation Score" property is updated and its new value is greater than 40.

### Workflow Actions

When a company is enrolled, the workflow performs the following single action:

*   **Create a new Lead object** with the following properties:
    *   **Lead Name:** Set to the name of the enrolled company.
    *   **Lead Label:** Set to "WARM".
    *   **Lead Type:** Set to "RE\_ATTEMPTING".
    *   **Pipeline Stage:** Set to the stage with the internal ID "new-stage-id".
*   **Associate the new Lead** with the enrolled Company.