---
title: '2014 | GrowthOps | lead | Lead Label = "hot" & no activity within 2 days  | send notification to manager an add to list "old lead list"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633155
---

### Workflow Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639203514/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639203514/edit)
*   **Workflow ID:** 2639203514
*   **Workflow Name:** 2014 | GrowthOps | lead | Lead Label = "hot" & no activity within 2 days | send notification to manager an add to list "old lead list"

### Workflow Goal

This workflow is designed to automatically identify "hot" leads that have not had any recorded activity for more than two days. It then notifies the assigned lead owner to prompt them to follow up and re-engage the lead.

### Enrollment Triggers

This workflow enrolls custom "Lead" objects when the following conditions are met simultaneously:

*   The **Lead Label** property is exactly **HOT**.
*   AND the **Last Activity Date** is more than 2 days ago.

_Note: Re-enrollment is turned off, so a lead can only enter this workflow once._

### Workflow Actions

**1\. Send Internal Notification to Lead Owner**

*   An internal email notification is sent to the HubSpot Owner assigned to the lead.
*   **Email Subject:** "\[Lead Label\] ist hot und letzte Aktivität ist vom \[Last Activity Date\], bitte prüfen." (Translation: "\[Lead Label\] is hot and last activity was on \[Last Activity Date\], please check.")
*   **Email Body:** A message is sent to the owner informing them that their lead, identified by its name and "HOT" label, has not had any activity since the specified last activity date and requires immediate attention.