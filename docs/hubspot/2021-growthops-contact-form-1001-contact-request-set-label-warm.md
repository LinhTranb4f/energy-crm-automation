---
title: '2021 | GrowthOps | contact | Form 1001 contact Request | set label warm'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632855
---

## Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2480599242/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2480599242/edit)
*   **Workflow ID**: 2480599242
*   **Workflow Name**: 2021 | GrowthOps | contact | Form 1001 contact Request | set label warm

## Objective

This workflow automates the processing of contacts who submit the 'Form 1001 contact Request'. Its purpose is to update the contact's lead status and pipeline stage, and manage their associations with other CRM records like deals and companies.

## Enrollment Criteria (Trigger)

*   **Object Type**: This is a Contact-based workflow.
*   **Trigger**: A contact is enrolled when they submit the form with ID `89122a36-69d1-4d61-8611-484fac02363e`.

## Workflow Actions

Upon enrollment, the following single action is immediately executed:

*   **Action 1: Update Contact Properties & Associations**
    *   **Set Property**: The contact's 'Lead Label' property (`hs_lead_label`) is set to `HOT`.
    *   **Set Property**: The contact's 'Pipeline Stage' property (`hs_pipeline_stage`) is set to the stage with the ID `new-stage-id`.
    *   **Manage Associations**:
        *   Associates the enrolled contact with a corresponding deal.
        *   Copies the contact's primary company association to that deal.

## Re-enrollment

*   **Status**: Re-enrollment is **enabled**.
*   **Condition**: A contact can re-enter this workflow every time they submit the specified form.