---
title: '1009 | Data-Mgmt | contact | Channel mapping | Original Contact Source -> Original Contact Channel'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632975
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604860612/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604860612/edit)
*   **Workflow ID:** 2604860612
*   **Workflow Name:** 1009 | Data-Mgmt | contact | Channel mapping | Original Contact Source -> Original Contact Channel

### Goal

This workflow automates data management for contacts. Its primary purpose is to map the 'Original Contact Source' property to a corresponding, higher-level 'Original Contact Channel' property. This is triggered only when the source is known, but the channel has not yet been set, ensuring data consistency and completeness for reporting.

### Object Type

*   Contact-based

### Enrollment Triggers

A contact is enrolled in this workflow when it meets **all** of the following criteria:

*   The contact property 'Original Contact Source' has a known value.
*   The contact property 'Original Contact Channel' is empty (unknown).

### Re-enrollment

*   Re-enrollment is enabled. A contact can re-enter this workflow if its 'Original Contact Source' property is updated.

### Workflow Logic

The workflow uses an if/then branch based on the value of the 'Original Contact Source' property. Based on the source, it sets the 'Original Contact Channel' as follows:

#### Outbound Channels

*   If Source is **Cold Outreach**, set Channel to **Outbound**.
*   If Source is **Competitive Analysis**, set Channel to **Outbound**.
*   If Source is **External Prospecting**, set Channel to **Outbound**.
*   If Source is **Buyer Intent**, set Channel to **Outbound**.

#### Partner/Network Channels

*   If Source is **Network**, set Channel to **Partner/Netzwerk**.
*   If Source is **Customer Referral**, set Channel to **Partner/Netzwerk**.
*   If Source is **Organic Social**, set Channel to **Partner/Netzwerk**.

#### Inbound Channels

*   If Source is **Direct Traffic**, set Channel to **Inbound**.
*   If Source is **Organic Search**, set Channel to **Inbound**.
*   If Source is **Paid Search**, set Channel to **Inbound**.
*   If Source is **Conversion Inbox**, set Channel to **Inbound**.

#### Other Channels

*   If Source is **Import / CRM**, set Channel to **Other**.
*   If Source is **Other**, set Channel to **Other**.
*   If the Source does not match any of the above branches, set Channel to **Other**.