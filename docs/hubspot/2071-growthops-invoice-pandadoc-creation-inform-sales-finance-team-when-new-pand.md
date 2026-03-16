---
title: '2071 | GrowthOps | invoice | Pandadoc Creation | Inform Sales & Finance Team when new pandadoc is created'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633715
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3185710280/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3185710280/edit)
*   **Workflow ID:** 3185710280
*   **Workflow Name:** 2071 | GrowthOps | invoice | Pandadoc Creation | Inform Sales & Finance Team when new pandadoc is created

### Purpose

This workflow automates internal communication by notifying the responsible team member when a new invoice, generated via PandaDoc, is created and its URL is saved to an Invoice object record. The goal is to ensure prompt review of new invoices by the appropriate Deal Owner.

### Trigger (Enrollment Criteria)

This is an event-based workflow that enrolls Invoice objects when a specific property is updated.

*   **Trigger Type:** Property Change Event.
*   **Trigger Condition:** The workflow starts when the property **'invoice\_standard\_pandadoc\_url'** is updated with any value (i.e., it becomes known).
*   **Re-enrollment:** Disabled. An object can only be enrolled in this workflow once.

### Actions

This workflow consists of a single action.

*   **Action 1: Send Internal Notification**
    *   **Type:** An internal email notification is sent.
    *   **Recipient:** The notification is sent to the user listed in the **'Deal Owner'** property of the enrolled object.
    *   **Subject:** "Neue Rechnung generiert" (German for "New invoice generated").
    *   **Body:** The email informs the Deal Owner (in German) that a new invoice has been created and provides a direct link to the PandaDoc document for review.