---
title: '2035 | GrowthOps | invoice | Create comission note document  | send webhook to create comission note document / pandadoc'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633915
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3266391278/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3266391278/edit)
*   **Workflow ID:** 3266391278
*   **Workflow Name:** 2035 | GrowthOps | invoice | Create comission note document | send webhook to create comission note document / pandadoc

### Workflow Goal

This workflow automates the creation of a commission note document. It sends a secure webhook to an external automation platform (n8n) when specific conditions on an Invoice record are met. The purpose is to trigger an external process to generate and manage the commission note document, potentially using a service like PandaDoc.

### Enrollment Triggers

This workflow enrolls Invoice objects when **all** of the following conditions are true:

*   The **Invoice Stage** is set to `Create invoice`.
*   The **Record Type** is `Credit Note`.
*   The **Create Credit Note** property is set to `Yes` (true).

### Re-enrollment

*   Objects are allowed to re-enroll in this workflow. This means if an Invoice record already passed through and later meets the trigger criteria again (due to a property update), it will run through the workflow actions a second time.

### Workflow Actions

*   **Step 1: Send Webhook to n8n**
    *   **Action Type:** Send a POST webhook.
    *   **Target System:** n8n ([n8n.tools.energy](http://n8n.tools.energy))
    *   **Target URL:** `https://n8n.tools.energy/webhook/generate-commission`
    *   **Purpose:** To signal the external n8n system to start its own process for generating a commission note document.
    *   **Authentication:** The request is authenticated using a secret "Authorization" key sent in the request header.