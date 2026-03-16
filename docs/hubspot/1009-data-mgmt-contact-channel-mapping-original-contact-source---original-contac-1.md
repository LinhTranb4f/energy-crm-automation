---
title: '1009 | Data-Mgmt | contact | Channel mapping | Original Contact Source -> Original Contact Channel'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635295
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604860612/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604860612/edit)
*   **Workflow ID**: 2604860612
*   **Workflow Name**: 1009 | Data-Mgmt | contact | Channel mapping | Original Contact Source -> Original Contact Channel

### Purpose

This workflow automates data management for contacts by standardizing the 'Original Contact Channel' property. It maps the more granular 'Original Contact Source' property to a higher-level channel category, ensuring data consistency for reporting and analysis. This process runs when a contact has a known source but their channel has not yet been defined.

### Enrollment Triggers

A contact is enrolled in this workflow if they meet the following criteria:

*   The contact property 'Original Contact Source' has a known value.
*   AND the contact property 'Original Contact Channel' is unknown (empty).

### Re-enrollment

Re-enrollment is enabled. A contact will re-enter the workflow if their 'Original Contact Source' property is ever updated, allowing the channel to be re-evaluated and corrected if necessary.

### Workflow Logic

The workflow begins with a single branching action that checks the value of the 'Original Contact Source' property. Based on this value, it sets the 'Original Contact Channel' property as follows:

#### Channel Mapping

*   **Sets 'Original Contact Channel' to "Outbound" if the source is:**
    *   Cold Outreach
    *   Competitive Analysis
    *   External Prospecting
    *   Buyer Intent
*   **Sets 'Original Contact Channel' to "Inbound" if the source is:**
    *   Direct Traffic
    *   Organic Search
    *   Paid Search
    *   Conversion Inbox
*   **Sets 'Original Contact Channel' to "Partner/Netzwerk" if the source is:**
    *   Network
    *   Customer Referral
    *   Organic Social
*   **Sets 'Original Contact Channel' to "Other" if the source is:**
    *   Import / CRM
    *   Other
    *   Any other value not listed above (Default branch).

### End State

After setting the 'Original Contact Channel' property, the contact completes the workflow. There are no further steps.