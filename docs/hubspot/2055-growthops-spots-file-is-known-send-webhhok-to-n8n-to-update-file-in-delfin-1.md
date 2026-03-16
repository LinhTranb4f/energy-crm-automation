---
title: '2055 | GrowthOps | Spots | File is known | send webhhok to n8n to update file in Delfin'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636515
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3552755954/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3552755954/edit)
*   **Workflow ID:** 3552755954
*   **Workflow Name:** 2055 | GrowthOps | Spots | File is known | send webhhok to n8n to update file in Delfin

### Goal

This workflow automates the notification process to an external system (Delfin) via an n8n webhook. It triggers when a Spot's associated file is known and the spot has been approved, ensuring that the Delfin system is updated with the latest file information.

### Trigger & Enrollment

A Spot custom object record is enrolled in this workflow when it meets **all** of the following conditions:

*   The 'File' property has a value (is not empty).
*   The 'Spot Approved' property is equal to "Yes".

### Re-enrollment

This workflow allows re-enrollment. A record will re-enter the workflow if it already meets the initial enrollment criteria and one of the following property updates occurs:

*   The 'File' property is updated with a new value.
*   The 'Spot Approved' property is changed to "Yes".

### Actions

Once a record is enrolled, the workflow immediately performs the following single action:

*   **Action 1: Send a Webhook**
    *   **Purpose:** To send a real-time notification to the n8n automation platform.
    *   **Method:** POST
    *   **Webhook URL:** `https://n8n.tools.energy/webhook/update-spot-file`
    *   **Details:** This webhook carries the Spot record's data, signaling the n8n workflow to begin its process of updating the corresponding file in the Delfin system.