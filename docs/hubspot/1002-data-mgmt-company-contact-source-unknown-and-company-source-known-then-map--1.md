---
title: '1002 | Data-Mgmt | company | contact source unknown and company source known | then map source to contact'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635015
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419643625/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419643625/edit)
*   **Workflow ID:** 2419643625
*   **Workflow Name:** 1002 | Data-Mgmt | company | contact source unknown and company source known | then map source to contact

### Purpose

This workflow is designed for data management and integrity. Its primary function is to populate the 'Original contact source' property on a contact record when it's empty, by using the known source information from its primary associated company. This ensures that contact source data is not left blank if the parent company's source is available.

### Workflow Type

*   Contact-based

### Enrollment Triggers

A contact is enrolled in this workflow if they meet ALL of the following criteria:

*   The contact's property 'Original contact source' is unknown (has no value).
*   AND the contact's primary associated company has a known value for the 'Original company source' property.

### Re-enrollment

*   Re-enrollment is turned OFF. A contact can only go through this workflow once.

### Actions

Once a contact is enrolled, the following action occurs:

1. **Copy Property Value:** The value from the associated company's 'Original company source' property is copied to the contact's 'Original contact source' property.