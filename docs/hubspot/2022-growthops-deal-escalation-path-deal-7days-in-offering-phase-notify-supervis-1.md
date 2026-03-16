---
title: '2022 | GrowthOps | deal | Escalation Path: Deal >7Days in Offering Phase | Notify Supervisor'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635675
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2752767212/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2752767212/edit)
*   **Workflow ID:** 2752767212
*   **Workflow Name:** 2022 | GrowthOps | deal | Escalation Path: Deal >7Days in Offering Phase | Notify Supervisor

### Purpose

This workflow serves as an escalation path to ensure sales deals do not stagnate in the offering phase. It automatically identifies deals that have been in the 'Create Offer' stage for over a week without any scheduled follow-up activities and notifies the deal owner's manager for intervention.

### Enrollment Triggers

A deal will be enrolled in this workflow if **all** of the following conditions are met:

*   The deal stage is 'Create Offer' (Deal Stage ID: 2652804333).
*   The deal has been in its current stage for more than 7 days.
*   The 'Next Activity Date' property on the deal is unknown (i.e., no follow-up is scheduled).

**Note:** Re-enrollment is disabled. A deal can only go through this workflow once.

### Workflow Actions

Once a deal is enrolled, the workflow performs the following action:

*   **Action 1: Send Internal Email Notification**
    *   **Recipient:** The manager of the HubSpot user who owns the deal.
    *   **Email Subject:** _\[Deal Name\]_ seit _\[Date Entered Stage\]_ in _\[Deal Stage\]_
        *   (Translation: _\[Deal Name\]_ since _\[Date Entered Stage\]_ in _\[Deal Stage\]_)
    *   **Email Body:**
        *   Hallo _\[Manager's Name\]_
        *   Der Deal _\[Deal Name\]_ von _\[Deal Owner\]_ ist seit _\[Date Entered Stage\]_ in der Phase _\[Deal Stage\]_ und sollte überprüft werden.
        *   (Translation: Hello _\[Manager's Name\]_, The deal _\[Deal Name\]_ from _\[Deal Owner\]_ has been in the stage _\[Deal Stage\]_ since _\[Date Entered Stage\]_ and should be reviewed.)