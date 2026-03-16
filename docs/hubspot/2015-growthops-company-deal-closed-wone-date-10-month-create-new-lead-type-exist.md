---
title: '2015 | GrowthOps | company | Deal Closed Wone Date > 10 Month | Create New Lead ("type = Existing customer") '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632775
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2426860787/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2426860787/edit)
*   **Workflow ID:** 2426860787
*   **Workflow Name:** 2015 | GrowthOps | company | Deal Closed Wone Date > 10 Month | Create New Lead ("type = Existing customer")

### Workflow Goal

This company-based workflow automatically identifies and creates new sales opportunities from past customers. It targets companies whose last deal was closed over 300 days ago and who are not currently in an active sales cycle, creating a new "Warm" lead for follow-up.

### Enrollment Triggers

*   A company will be enrolled in this workflow if it has an associated deal that meets **ALL** of the following conditions:
    *   The deal's `Close Date` is more than 300 days in the past.
    *   The deal's stage is `Closed Won` or `Closed Lost`.

### Re-enrollment

*   Companies can be enrolled in this workflow multiple times if they meet the trigger criteria again in the future.

### Workflow Steps

**1\. If/Then Branch: Check for Active Deals or Leads**

*   The workflow first checks if the enrolled company has any open sales activities. It proceeds only if the company meets the following criteria:
    *   The company has **no associated deals** in any active pipeline stages.
    *   AND the company has **no associated leads** in any active pipeline stages (e.g., "New", "Attempting", "Connected").
*   If the company has any active deals or leads, it exits the workflow.

**2\. Action: Create a New Lead Record**

*   If the company has no active opportunities, the workflow creates a new **Lead** record with the following properties:
    *   **Lead Name:** Set to the enrolled company's name.
    *   **Lead Label:** Set to `WARM`.
    *   **Lead Type:** Set to `Existing Customer`.
    *   **Pipeline Stage:** The new lead is placed into the first stage of the lead pipeline.
    *   **Association:** The newly created lead is automatically associated with the enrolled company.