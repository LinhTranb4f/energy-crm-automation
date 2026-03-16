---
title: '2039 | GrowthOps | deal | Closed Won Deal | Create Project Records'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634035
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3333729525/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3333729525/edit)
*   **Workflow ID:** 3333729525
*   **Workflow Name:** 2039 | GrowthOps | deal | Closed Won Deal | Create Project Records

### High-Level Purpose

This workflow automates the creation of project records in an external system immediately after a deal is won in HubSpot. It acts as a bridge between the sales and project delivery teams, ensuring a seamless handover by sending deal-related data to an n8n automation platform.

### Trigger (Enrollment Criteria)

This workflow is based on the **Deal** object and a deal is enrolled when the following criteria are met:

*   **Deal Property:** The 'Deal Stage' property is set to 'Closed Won' (Internal ID: 4636861648).
*   **Re-enrollment:** Re-enrollment is enabled, meaning a deal can trigger this workflow multiple times if its stage is changed away from and then back to 'Closed Won'.

### Workflow Actions

#### Action 1: Send Data to n8n to Create Project

*   **Action Type:** Send a Webhook
*   **Method:** POST
*   **Target URL:** `https://n8n.tools.energy/webhook/create-project`
*   **Purpose:** This is the only action in the workflow. It sends a data payload to an n8n automation workflow. This n8n workflow is responsible for taking the HubSpot data and creating the corresponding project and/or service records in the designated project management system.
*   **Authentication:** The request is authenticated using a secret Authorization key sent in the request header.

### Associated Data Context

To ensure the n8n workflow has all the necessary information to create a complete project record, this HubSpot workflow automatically fetches and can include data from the following objects associated with the deal:

*   Associated Company (most recently modified)
*   Associated Contacts (most recently modified)
*   Associated Line Items (most recently modified)

This allows for details like the client's name, key contact persons, and the specific products/services sold to be passed directly to the project creation system.