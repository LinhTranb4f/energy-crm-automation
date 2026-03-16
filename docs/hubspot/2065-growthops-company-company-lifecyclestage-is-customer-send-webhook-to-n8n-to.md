---
title: '2065 | GrowthOps | company | Company | lifecyclestage is Customer | send webhook to n8n to create address in Delfin'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634475
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3605123292/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3605123292/edit)
*   **Workflow ID:** 3605123292
*   **Workflow Name:** 2065 | GrowthOps | company | Company | lifecyclestage is Customer | send webhook to n8n to create address in Delfin

### Workflow Objective

This workflow automates the creation of company addresses in an external system named Delfin. It sends a webhook to an n8n automation service when a HubSpot company becomes a 'Customer' and has a complete set of address details, ensuring that customer data is synchronized with Delfin.

### Enrollment Triggers

A company record will be enrolled in this workflow when it meets **ALL** of the following criteria:

*   The company's **Lifecycle Stage** is **Customer**.
*   The **Company Name** property has a value.
*   The **Street Address** property has a value.
*   The **ZIP/Postal Code** property has a value.
*   The **City** property has a value.
*   The **Country** property has a value.

### Re-enrollment

Re-enrollment is enabled. A company can go through this workflow more than once. A company will be re-enrolled if it still meets the initial enrollment criteria and any of the following properties are updated:

*   Lifecycle Stage
*   Name
*   Street Address
*   City
*   ZIP/Postal Code
*   Country

This ensures that if a customer's address details are updated in HubSpot, the changes are also sent to Delfin.

### Workflow Actions

Once a company is enrolled, the workflow immediately performs the following action:

*   **Action 1: Send a Webhook**
    *   A POST request is sent to the following URL: `https://n8n.tools.energy/webhook/create-address-delfin`.
    *   This action transfers the company's data to the n8n automation tool, which then processes and creates the address record in the Delfin system.