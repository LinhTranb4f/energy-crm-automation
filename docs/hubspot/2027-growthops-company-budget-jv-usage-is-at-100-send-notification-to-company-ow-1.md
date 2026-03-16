---
title: '2027 | GrowthOps | company | Budget JV Usage is at 100% | send notification to company owner'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635835
---

### Workflow Documentation

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3047405793/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3047405793/edit)
*   **Workflow ID:** 3047405793
*   **Workflow Name:** 2027 | GrowthOps | company | Budget JV Usage is at 100% | send notification to company owner

**Objective**
This workflow automatically sends an internal notification to the HubSpot Company Owner when a company's annual agreement budget ("Jahresvereinbarung") usage reaches or exceeds 100%. This serves as an alert for the owner to review the account and take appropriate action.

**Trigger Criteria (Enrollment)**

*   **Object Type:** Company
*   **Trigger Condition:** The workflow enrolls a company when its property "Budget JV Usage in Percent" (`budget_jv_usage_in_percent`) is greater than or equal to `1`.
    *   _Note: The value_ _`1`_ _represents 100% in this property._
*   **Re-enrollment:** Disabled. A company will only be enrolled in this workflow once, even if its budget property is updated again after enrollment.

**Workflow Actions**

*   **Action 1: Send Internal Notification**
    *   **Type:** An internal notification is sent within HubSpot.
    *   **Recipient:** The notification is sent to the user assigned as the company's "HubSpot Owner".
    *   **Notification Subject:** "JV Budget von \[Company Name\] ist aufgebraucht!"
        *   _Translation: "JV Budget of \[Company Name\] is used up!"_
    *   **Notification Body:** The message informs the owner that the company's annual agreement budget has been fully used and advises them to review the situation. It uses the following personalization tokens:
        *   `{{ enrolled_object.hubspot_owner_id }}`: The company owner's name.
        *   `{{ enrolled_object.name }}`: The name of the company.
        *   `{{ enrolled_object.budget_jv_usage_in_percent }}`: The exact percentage of the budget used.