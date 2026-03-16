---
title: '2071 | GrowthOps | invoice | Pandadoc Creation | Inform Sales & Finance Team when new pandadoc is created'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636035
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3185710280/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3185710280/edit)
*   **Workflow ID**: 3185710280
*   **Workflow Name**: 2071 | GrowthOps | invoice | Pandadoc Creation | Inform Sales & Finance Team when new pandadoc is created

### Purpose

This workflow automates the internal notification process following the creation of a new invoice via PandaDoc. Its primary goal is to immediately inform the responsible Deal Owner that a new invoice has been generated and linked to their deal, ensuring timely review and awareness.

### Trigger and Enrollment Criteria

This is a Deal-based workflow that enrolls deals automatically when specific criteria are met.

*   **Object Type**: Deal
*   **Trigger Type**: Property Change
*   **Triggering Event**: A deal is enrolled when the property **Invoice Standard PandaDoc URL** (`invoice_standard_pandadoc_url`) is updated with a new value. This occurs when a PandaDoc invoice is created and its URL is synced to the deal record.
*   **Re-enrollment**: Re-enrollment is turned OFF. A deal can only trigger this workflow once.

### Actions

Once a deal is enrolled, the workflow executes the following single action:

#### Action 1: Send Internal Email Notification

*   **Action Type**: Send Internal Notification (Email)
*   **Recipient**: The owner of the enrolled deal (`deal_owner`).
*   **Email Subject**: "Neue Rechnung generiert" (German for "New invoice generated").
*   **Email Body**: The email, written in German, informs the deal owner that a new invoice has been created and provides a direct link to it for review. The body includes personalization tokens to address the deal owner and insert the specific invoice URL.
    *   _Message Content (translated)_: "Hello \[Deal Owner's Name\], A new invoice has been created. You can review it at the following link: \[Link to the PandaDoc Invoice\]"