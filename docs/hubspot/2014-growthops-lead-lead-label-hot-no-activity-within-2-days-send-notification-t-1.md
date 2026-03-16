---
title: '2014 | GrowthOps | lead | Lead Label = "hot" & no activity within 2 days  | send notification to manager an add to list "old lead list"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635475
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639203514/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639203514/edit)
*   **Workflow ID:** 2639203514
*   **Workflow Name:** 2014 | GrowthOps | lead | Lead Label = "hot" & no activity within 2 days | send notification to manager an add to list "old lead list"

### Purpose

This workflow identifies 'hot' leads that have become stale (i.e., have had no logged activity for more than two days). Its purpose is to automatically notify the lead's owner to prompt a follow-up, ensuring that high-priority leads are not neglected.

### Enrollment Triggers

This workflow enrolls leads that meet **ALL** of the following criteria:

*   The lead's 'Lead Label' property is exactly 'HOT'.
*   The lead's 'Last Activity Date' is more than 2 days ago.

_Note: Re-enrollment is turned off, meaning a lead can only trigger this workflow once._

### Actions

Once a lead is enrolled, the following action is performed immediately:

**1\. Send Internal Notification to Owner**

*   **Action:** An internal notification email is sent to the HubSpot Owner of the lead.
*   **Email Subject:** "\[Lead Label\] ist hot und letzte Aktivität ist vom \[Last Activity Date\], bitte prüfen." (Translation: "\[Lead Label\] is hot and last activity was on \[Last Activity Date\], please check.")
*   **Email Body:** The email content reminds the owner about the specific lead, its 'hot' status, and the date of its last activity, urging them to review it urgently.