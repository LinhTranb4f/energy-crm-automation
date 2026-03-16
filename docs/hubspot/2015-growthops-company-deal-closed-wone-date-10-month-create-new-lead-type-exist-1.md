---
title: '2015 | GrowthOps | company | Deal Closed Wone Date > 10 Month | Create New Lead ("type = Existing customer") '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635095
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2426860787/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2426860787/edit)
*   **Workflow ID:** 2426860787
*   **Workflow Name:** 2015 | GrowthOps | company | Deal Closed Wone Date > 10 Month | Create New Lead ("type = Existing customer")

### Workflow Goal

This workflow is designed to re-engage past customers by automatically creating new sales opportunities. It identifies companies whose last deal was closed more than 300 days ago and who are not currently in an active sales process, then creates a new "Warm" lead for follow-up.

### Enrollment Triggers

This is a **Company-based** workflow. A company will be enrolled when it meets the following criteria:

*   The company has an associated deal that has a status of either **Closed Won** or **Closed Lost**.
*   The **Close Date** of that deal was more than 300 days in the past.
*   Companies are eligible to be re-enrolled in this workflow if they meet the criteria again in the future.

### Workflow Actions

**Step 1: Check for Existing Activity**
Once a company is enrolled, the workflow first checks if there is any current sales activity associated with it. This prevents creating duplicate tasks for companies already being worked on.

*   **Condition:** The workflow proceeds only if the company meets the following conditions:
    *   It has **NO** associated deals in an active pipeline stage.
    *   AND it has **NO** associated leads in an active pipeline stage.
*   **Outcome:** If there are any active deals or leads, the company exits the workflow. If there is no current activity, it proceeds to the next step.

**Step 2: Create a New Lead Record**
If no current sales activity is found, the workflow automatically creates a new **Lead** record with the following properties:

*   **Lead Name:** Set to the name of the enrolled company.
*   **Lead Label:** Set to **WARM**.
*   **Lead Type:** Set to **Existing Customer**.
*   **Pipeline Stage:** The new lead is placed in the initial stage of the sales pipeline.
*   **Association:** The newly created lead is automatically associated with the original company record.