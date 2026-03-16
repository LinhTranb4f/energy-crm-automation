---
title: '2024 | GrowthOps | deal | Escalation Path: Deal >7Days in Negotiation Phase | Notify Supervisor'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633195
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2685767873/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2685767873/edit)
*   **Workflow ID:** 2685767873
*   **Workflow Name:** 2024 | GrowthOps | deal | Escalation Path: Deal >7Days in Negotiation Phase | Notify Supervisor

### Purpose

This workflow is designed to automatically identify and escalate deals that have remained in the 'Negotiation Phase' for an extended period. It alerts the assigned deal owner to prompt action and ensure the deal progresses.

### Enrollment Triggers

A deal will be enrolled in this workflow if it meets ALL of the following conditions:

*   **Object Type:** Deal
*   **Trigger Conditions:**
    *   The Deal Stage is 'Negotiation Phase' (ID: 2652804335).
    *   AND The deal has been in its current stage for **more than 14 days**.
*   **Re-enrollment:** Disabled. A deal will only trigger this workflow once.

### Actions

Once a deal is enrolled, the following action occurs:

*   **Step 1: Send Internal Email Notification**
    *   **Recipient:** The HubSpot Owner of the deal.
    *   **Email Subject:** The subject is dynamic and follows the format: "\[Deal Name\] seit \[Date Entered Current Stage\] in \[Deal Stage\]".
    *   **Email Body:** The body (in German) notifies the owner that their specific deal has been in its current stage since the date it entered and asks them to please take care of it.

### Observations for Project Management

*   **Timeframe Discrepancy:** The workflow's name suggests an escalation after ">7 Days", but the actual trigger is set for **more than 14 days**.
*   **Recipient Discrepancy:** The name suggests notifying a "Supervisor", but the action is configured to send the notification directly to the **deal's HubSpot Owner**.