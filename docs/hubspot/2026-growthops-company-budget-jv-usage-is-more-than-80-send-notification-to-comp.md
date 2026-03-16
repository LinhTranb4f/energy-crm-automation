---
title: '2026 | GrowthOps | company | Budget JV Usage is more than 80% | send notification to company owner'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633495
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3030828226/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3030828226/edit)
*   **Workflow ID:** 3030828226
*   **Workflow Name:** 2026 | GrowthOps | company | Budget JV Usage is more than 80% | send notification to company owner

### Objective

This workflow automatically notifies the designated Company Owner when their company's annual agreement budget (Jahresvereinbarung or JV) usage reaches 80% or more. The purpose is to proactively alert the owner to review the budget status and take necessary action.

### Enrollment Criteria

*   **Object Type:** This is a Company-based workflow.
*   **Trigger:** A company is enrolled when its property 'Budget JV Usage in Percent' (`budget_jv_usage_in_percent`) is greater than or equal to 80% (0.8).
*   **Re-enrollment:** Re-enrollment is disabled. A company will only be enrolled in this workflow once.

### Actions

1. **Send Internal Notification**
    *   **Recipient:** The notification is sent to the user assigned as the company's 'HubSpot Owner' (`hubspot_owner_id`).
    *   **Email Subject:** JV Budget von {{ Company Name }} bei {{ Budget JV Usage % }}
    *   **Email Body (Translated from German):**
        *   "Hello {{ Company Owner }}"
        *   "For {{ Company Name }}, the budget of the annual agreement has already been used by {{ Budget JV Usage % }}. Please check and react if necessary."