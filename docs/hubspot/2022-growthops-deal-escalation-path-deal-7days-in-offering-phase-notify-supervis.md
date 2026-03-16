---
title: '2022 | GrowthOps | deal | Escalation Path: Deal >7Days in Offering Phase | Notify Supervisor'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633355
---

### Workflow Goal

This workflow serves as an escalation path to alert management about deals that may be stalled. It identifies deals that have been in the "Create Offer" stage for over a week without any planned next steps and notifies the deal owner's manager to prompt a review and ensure sales pipeline momentum.

### Enrollment Triggers

A deal is automatically enrolled in this workflow if it meets **all** of the following criteria simultaneously:

*   The deal stage is "Create Offer" (`dealstage` ID 2652804333).
*   The deal has been in this stage for more than 7 days.
*   There is no "Next Activity Date" set for the deal.

### Workflow Actions

Once a deal is enrolled, the workflow executes the following action:

*   **Send Internal Notification to Manager:**
    *   **Recipient:** The Manager of the deal's owner.
    *   **Subject:** `[Deal Name] seit [Date Entered Stage] in [Deal Stage]` (Translated: `[Deal Name] since [Date Entered Stage] in [Deal Stage]`)
    *   **Body:** The notification body, written in German, informs the manager that the specific deal has been in its current stage since a certain date and should be reviewed.
        *   _English Translation:_ "Hello \[Manager Name\], The deal \[Deal Name\] from \[Deal Owner\] has been in the stage \[Deal Stage\] since \[Date Entered Stage\] and should be reviewed."

### Settings

*   **Re-enrollment:** Disabled. A deal will only trigger this notification once per period it meets the criteria.