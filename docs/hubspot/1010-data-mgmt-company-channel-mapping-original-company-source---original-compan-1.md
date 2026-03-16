---
title: '1010 | Data-Mgmt | company | Channel mapping | Original Company Source -> Original Company Channel'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635275
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604795126/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604795126/edit)
*   **Workflow ID:** 2604795126
*   **Workflow Name:** 1010 | Data-Mgmt | company | Channel mapping | Original Company Source -> Original Company Channel

### Purpose

This workflow automates data management for Company records. Its primary function is to set the 'Original Company Channel' property based on the value of the 'Original Company Source' property. This ensures that every company with a known source also has a corresponding channel, improving data consistency and reporting accuracy.

### Trigger and Enrollment

This is a Company-based workflow. A company will be enrolled when it meets the following criteria:

*   The 'Original Company Source' property has a value (is known).
*   AND the 'Original Company Channel' property is empty (is unknown).

Re-enrollment is enabled, meaning a company can re-enter the workflow if its 'Original Company Source' is updated or its 'Original Company Channel' becomes empty again.

### Workflow Logic / Actions

The workflow begins with a single branching logic step that checks the value of the 'Original Company Source' property. Based on this value, it sets the 'Original Company Channel' property as follows:

#### Channel: Inbound

If 'Original Company Source' is one of the following, 'Original Company Channel' is set to **Inbound**:

*   Direct Traffic
*   Organic Search
*   Paid Search
*   Conversion Inbox

#### Channel: Outbound

If 'Original Company Source' is one of the following, 'Original Company Channel' is set to **Outbound**:

*   Competitive Analysis
*   Cold Outreach
*   External Prospecting
*   Buyer Intent

#### Channel: Partner/Netzwerk

If 'Original Company Source' is one of the following, 'Original Company Channel' is set to **Partner/Netzwerk**:

*   Organic Social
*   Network
*   Customer Referral

#### Channel: Other

If 'Original Company Source' is one of the following, or if it does not match any of the values above, 'Original Company Channel' is set to **Other**:

*   Import / CRM
*   Other
*   Any other value not listed above (Default branch)