---
title: '2035 | GrowthOps | invoice | Create comission note document  | send webhook to create comission note document / pandadoc'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636235
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3266391278/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3266391278/edit)
*   **Workflow ID:** 3266391278
*   **Workflow Name:** 2035 | GrowthOps | invoice | Create comission note document | send webhook to create comission note document / pandadoc

### Purpose

This workflow automates the creation of a commission note document. It is triggered when an invoice record, specifically a credit note, is moved to the 'Create invoice' stage and is explicitly marked for creation.

### Object Type

*   This workflow is based on the **Invoice** custom object (Object ID: 0-53).

### Trigger (Enrollment Criteria)

An Invoice record will be enrolled in this workflow when **ALL** of the following conditions are met:

*   **Invoice Stage** is exactly 'Create invoice'.
*   **Record Type** is exactly 'Credit Note'.
*   **Create Credit Note** property is set to 'Yes' (true).

### Re-enrollment

*   Re-enrollment is **enabled**. An invoice record can enter this workflow multiple times if its properties are updated to meet the trigger criteria again.

### Actions

Once an invoice is enrolled, the workflow performs the following single action:

*   **Action 1: Send a Webhook**
    *   **Purpose:** To notify an external system (n8n) to begin the process of generating a commission note document.
    *   **Method:** POST
    *   **Endpoint URL:** [https://n8n.tools.energy/webhook/generate-commission](https://n8n.tools.energy/webhook/generate-commission)
    *   **Authentication:** The request is secured using an Authorization key sent in the header.