---
title: '1022 | Data-Mgmt | contact | Jobfunktion is known and Jobbezeichnung is unknown | copy Jobfunktion to Jobbezeichnung'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633555
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3113612529/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3113612529/edit)
*   **Workflow ID:** 3113612529
*   **Workflow Name:** 1022 | Data-Mgmt | contact | Jobfunktion is known and Jobbezeichnung is unknown | copy Jobfunktion to Jobbezeichnung

### Workflow Purpose

This workflow is a data management tool for contacts. Its primary goal is to ensure data consistency by populating the standard "Job Title" (`jobtitle`) property using the value from the "Job Function" (`job_function`) property, but only when "Job Title" is empty.

### Enrollment Triggers

A contact is automatically enrolled in this workflow if they meet the following criteria simultaneously:

*   The "Job Function" (`job_function`) property has a known value (is not empty).
*   The "Job Title" (`jobtitle`) property is empty (has an unknown value).

### Workflow Actions

Once a contact is enrolled, the workflow performs a single action:

*   **Action 1: Copy Property Value**
    *   It copies the existing value from the contact's "Job Function" (`job_function`) property.
    *   It pastes this value into the contact's "Job Title" (`jobtitle`) property.

### Settings

*   **Object Type:** Contact
*   **Re-enrollment:** Disabled. Contacts who meet the criteria again will not re-enter the workflow.