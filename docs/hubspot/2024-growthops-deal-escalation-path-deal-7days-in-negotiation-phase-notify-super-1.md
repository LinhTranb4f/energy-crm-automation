---
title: '2024 | GrowthOps | deal | Escalation Path: Deal >7Days in Negotiation Phase | Notify Supervisor'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635515
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2685767873/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2685767873/edit)
*   **Workflow ID:** 2685767873
*   **Workflow Name:** 2024 | GrowthOps | deal | Escalation Path: Deal >7Days in Negotiation Phase | Notify Supervisor

### Workflow Goal

This workflow is designed to automatically identify and escalate deals that have remained in a specific negotiation stage for an extended period. The primary goal is to prompt action from the deal owner to prevent deals from stalling.

### Enrollment Triggers

This is a Deal-based workflow. A deal is enrolled when it meets the following criteria simultaneously:

*   **Deal Stage:** The deal's stage is set to ID `2652804335`. Based on the workflow's name, this corresponds to the 'Negotiation' phase.
*   **Time in Stage:** The 'Date Entered Current Stage' property is more than 14 days in the past.
    *   **Note:** The workflow's name mentions '>7Days', but the logic is configured for more than 14 days.

### Workflow Settings

*   **Re-enrollment:** Disabled. A deal will only go through this workflow once.

### Workflow Actions

Once a deal is enrolled, it triggers a single action:

*   **Action 1: Send Internal Notification**
    *   **Description:** An internal email notification is sent to the deal owner to remind them about the stagnant deal.
    *   **Recipient:** The notification is sent to the `HubSpot Owner` of the deal.
        *   **Note:** The workflow's name mentions 'Notify Supervisor', but the action is configured to notify the deal owner directly, not their supervisor.
    *   **Email Subject (Translated):** `[Deal Name] since [Date Entered Stage] in [Deal Stage]`
    *   **Email Body (Translated):**

> Hello \[HubSpot Owner's Name\],
> Your deal '\[Deal Name\]' has been in the '\[Deal Stage\]' phase since \[Date Entered Stage\].
> Please take care of it.