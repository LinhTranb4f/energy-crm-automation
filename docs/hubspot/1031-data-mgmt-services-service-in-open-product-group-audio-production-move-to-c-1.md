---
title: '1031 | Data-Mgmt | Services | Service in Open & Product Group = "Audio Production" | Move to Content in Production'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636475
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3551336648/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3551336648/edit)
*   **Workflow ID**: 3551336648
*   **Workflow Name**: 1031 | Data-Mgmt | Services | Service in Open & Product Group = "Audio Production" | Move to Content in Production

### Objective

This workflow automates the initial project management step for Service objects. When a delivery date is set, this workflow officially moves the service into the production pipeline and synchronizes key dates for tracking.

### Trigger / Enrollment Criteria

This workflow enrolls a "Service" object when the following condition is met:

*   The "Planned Delivery Date" property has a known value (i.e., it is not empty).

### Workflow Actions

Once a Service is enrolled, the workflow performs the following actions in order:

*   **Step 1: Synchronize Dates**: The workflow sets the "Campaign End Date" property, copying the value from the "Planned Delivery Date" property.
*   **Step 2: Update Pipeline Stage**: The workflow moves the Service object to the "Content in Production" stage in its pipeline.

### Additional Settings

*   **Re-enrollment**: Disabled. A Service object will only run through this workflow once.