---
title: '1010 | Data-Mgmt | company | Channel mapping | Original Company Source -> Original Company Channel'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632955
---

### Workflow Documentation: 1010 | Data-Mgmt | company | Channel mapping | Original Company Source -> Original Company Channel

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604795126/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604795126/edit)
*   **Workflow ID:** 2604795126
*   **Workflow Name:** 1010 | Data-Mgmt | company | Channel mapping | Original Company Source -> Original Company Channel

**Purpose**
This workflow automates data management for **Company** records. Its primary function is to ensure data consistency by automatically setting the `Original Company Channel` property based on the value of the `Original Company Source` property. This runs when the source is known but the channel has not yet been set.

**Enrollment Triggers**
A company record is enrolled in this workflow if it meets the following criteria:

*   The `Original Company Source` property has a value (is known).
*   **AND**
*   The `Original Company Channel` property is empty (is unknown).

Re-enrollment is **enabled**, meaning a company can go through this workflow multiple times if its properties are updated. A company will re-enroll if the `Original Company Source` property value changes or the `Original Company Channel` property is cleared.

**Workflow Logic and Actions**
The workflow consists of a single branching logic step that checks the value of the `Original Company Source` property and then sets the `Original Company Channel` property accordingly.

**Channel Mapping Rules**

*   **If** **`Original Company Source`** **is one of the following, the** **`Original Company Channel`** **is set to** **`Inbound`****:**
    *   Direct Traffic
    *   Organic Search
    *   Paid Search
    *   Conversion Inbox
*   **If** **`Original Company Source`** **is one of the following, the** **`Original Company Channel`** **is set to** **`Partner/Netzwerk`****:**
    *   Organic Social
    *   Network
    *   Customer Referral
*   **If** **`Original Company Source`** **is one of the following, the** **`Original Company Channel`** **is set to** **`Outbound`****:**
    *   Competitive Analysis
    *   Cold Outreach
    *   External Prospecting
    *   Buyer Intent
*   **If** **`Original Company Source`** **is one of the following, the** **`Original Company Channel`** **is set to** **`Other`****:**
    *   Import / CRM
    *   Other
    *   Any value not explicitly listed in the branches above (this is the default outcome).

The workflow concludes immediately after setting the property value.