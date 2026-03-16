---
title: '2055 | GrowthOps | Spots | File is known | send webhhok to n8n to update file in Delfin'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634195
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3552755954/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3552755954/edit)
*   **Workflow ID:** 3552755954
*   **Workflow Name:** 2055 | GrowthOps | Spots | File is known | send webhhok to n8n to update file in Delfin

### Objective

This workflow automates the process of notifying an external system (n8n) to update a file record in a system named "Delfin". The notification is sent via a webhook whenever a file is associated with an approved "Spot" custom object in HubSpot.

### Object Type

This workflow is based on a HubSpot Custom Object, likely named "Spots" (Object Type ID: 2-196234143).

### Enrollment Triggers

A Spot record will be enrolled in this workflow when **ALL** of the following conditions are met:

*   The property **'File'** has a value (is known).
*   The property **'Spot Approved'** is equal to **'Yes'**.

### Re-enrollment

Re-enrollment is **enabled** for this workflow. A record will re-enroll if it is already in the workflow and one of the following property updates occurs:

*   The **'File'** property is updated with a new value.
*   The **'Spot Approved'** property is updated to **'Yes'**.

### Workflow Actions

Once a record is enrolled, it will immediately execute the following action:

**Action 1: Send a Webhook**

*   **Type:** A POST request is sent to an external service.
*   **Webhook URL:** `https://n8n.tools.energy/webhook/update-spot-file`
*   **Purpose:** This triggers an n8n automation designed to update the corresponding spot file within the Delfin system.