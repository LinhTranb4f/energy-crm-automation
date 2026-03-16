---
title: '2039 | GrowthOps | deal | Closed Won Deal | Create Project Records'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636355
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3333729525/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3333729525/edit)
*   **Workflow ID:** 3333729525
*   **Workflow Name:** 2039 | GrowthOps | deal | Closed Won Deal | Create Project Records

### Objective

This workflow automates the creation of new project records in an external system ([n8n.io](http://n8n.io)) immediately after a deal is successfully closed. Its primary purpose is to streamline the sales-to-operations handoff process, ensuring that new projects are kicked off promptly and with all necessary information.

### Trigger (Enrollment Criteria)

This is a Deal-based workflow that enrolls a deal when it meets the following criteria:

*   The **Deal Stage** is set to **'Closed Won'** (specifically, the stage with ID `4636861648`).
*   Re-enrollment is enabled, meaning a deal can trigger this workflow more than once if its stage is changed and then set back to 'Closed Won'.

### Workflow Actions

Upon enrollment, the workflow performs a single, critical action:

*   **Action 1: Send Webhook to** [**n8n.io**](http://n8n.io)
    *   **Type:** `POST` Webhook
    *   **Endpoint URL:** `https://n8n.tools.energy/webhook/create-project`
    *   **Description:** The workflow sends the deal's data, along with information from its associated records, to an [n8n.io](http://n8n.io) automation. This external automation is responsible for taking the HubSpot data and creating a corresponding project and/or service record in the company's project management system.
    *   **Authentication:** The request is secured using an Authorization key sent in the header.

### Data Handling

To ensure the external system has all the context needed to create a comprehensive project, this workflow automatically gathers and includes data from the following associated objects:

*   The Deal itself (the triggering object).
*   Associated Company records.
*   Associated Contact records.
*   Associated records from a Custom Object (ID: 0-8).