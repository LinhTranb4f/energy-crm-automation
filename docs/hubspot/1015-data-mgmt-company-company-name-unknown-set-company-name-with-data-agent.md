---
title: '1015 | Data-Mgmt | company | Company name unknown | set company name with Data Agent'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633315
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2724854998/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2724854998/edit)
*   **Workflow ID:** 2724854998
*   **Workflow Name:** 1015 | Data-Mgmt | company | Company name unknown | set company name with Data Agent

### Objective

This workflow automates data management for company records. Its primary goal is to ensure data completeness by automatically populating the standard 'Company Name' field when it is empty, using a value from a custom 'Data Agent Company Name' field.

### Workflow Details

*   **Workflow Type:** Company-based
*   **Status:** Active

### Enrollment Triggers

A company will be enrolled in this workflow if it meets **ALL** of the following conditions:

*   The 'Company Name' property is empty.
*   The 'Data Agent Company Name' (`data_agent_unternehmensname`) property has a value.

### Re-enrollment

Companies can be re-enrolled in this workflow. A company will be checked against the enrollment triggers again if **EITHER** of the following property changes occurs:

*   The 'Data Agent Company Name' property is updated with a new value.
*   The 'Company Name' property is changed to be empty.

### Actions

Once a company is enrolled, the workflow performs a single action:

*   **Set Property Value:** It copies the value from the company's 'Data Agent Company Name' property and sets it as the value for the company's standard 'Company Name' property.

### Outcome

This workflow maintains data quality by ensuring company records do not have a blank name if an alternative name from the "Data Agent" source is available. This prevents records from appearing as "Company name unknown" in HubSpot.