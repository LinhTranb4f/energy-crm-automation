---
title: '1002 | Data-Mgmt | company | contact source unknown and company source known | then map source to contact'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632695
---

## Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419643625/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419643625/edit)
*   **Workflow ID:** 2419643625
*   **Workflow Name:** 1002 | Data-Mgmt | company | contact source unknown and company source known | then map source to contact

## Purpose

This workflow is designed for data management and enrichment. Its primary function is to populate the 'Original Contact Source' property on a contact record when it is empty, by using the source information from its associated company record. This ensures data consistency and completeness for contact attribution.

## Enrollment Triggers

This is a contact-based workflow. A contact will be enrolled if it meets all of the following criteria:

*   The contact's 'Original Contact Source' property is unknown (empty).
*   AND the contact is associated with a company.
*   AND the associated company's 'Original Company Source' property is known (has a value).

## Re-enrollment

Re-enrollment is turned OFF for this workflow. A contact can only go through this workflow once.

## Actions

This workflow consists of a single action:

*   **Action 1: Copy Property**
    *   **Source:** The value from the 'Original Company Source' property of the associated company.
    *   **Target:** The value is copied to the 'Original Contact Source' property on the enrolled contact record.