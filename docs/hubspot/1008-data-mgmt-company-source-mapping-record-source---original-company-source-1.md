---
title: '1008 | Data-Mgmt | company | Source mapping | Record Source -> Original Company Source'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635255
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604664013/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604664013/edit)
*   **Workflow ID:** 2604664013
*   **Workflow Name:** 1008 | Data-Mgmt | company | Source mapping | Record Source -> Original Company Source

### **Purpose**

This is a critical data management workflow that operates on **Company** records. Its primary goal is to ensure data hygiene and accurate source tracking by automatically populating the `Original Company Source` property. It achieves this by translating the system-generated `Record source` property into a standardized, business-relevant value. This automation is essential for reliable marketing and sales reporting.

### **Enrollment Triggers**

A company record is automatically enrolled in this workflow if it meets the following criteria:

*   The company's `Original Company Source` property is currently empty.
*   **AND** the company's `Record source` property has a known value.

**Note:** Re-enrollment is turned off, meaning a company will only pass through this workflow once.

### **Workflow Logic**

The workflow's logic is a large branching process based on the value of the company's `Record source` (`hs_object_source_label`). Depending on this value, it sets the `Original Company Source` to a specific category.

#### **Source Mapping Rules**

*   **Source is set to** **`Conversion Inbox`** **if** **`Record source`** **is one of:**
    *   ENGAGEMENTS
    *   AUTOMATION\_JOURNEY
    *   BCC\_TO\_CRM
    *   BOT
    *   EMAIL\_INTEGRATION
    *   CONTENT\_MEMBERSHIP
    *   CONVERSATIONAL\_ENRICHMENT
    *   CONVERSATIONS
    *   BEHAVIORAL\_EVENTS
    *   EMAIL
    *   SUCCESS
    *   FORWARD\_TO\_CRM
    *   HELP\_DESK
    *   AUTOMATION\_PLATFORM
*   **Source is set to** **`Paid Search`** **if** **`Record source`** **is:**
    *   ADS
    *   ECOMMERCE\_INTEGRATION
*   **Source is set to** **`Direct Traffic`** **if** **`Record source`** **is one of:**
    *   ANALYTICS
    *   MARKETPLACE
    *   MEETINGS
*   **Source is set to** **`Buyer Intent`** **if** **`Record source`** **is one of:**
    *   CHATSPOT
    *   DATA\_ENRICHMENT
    *   INTENT
    *   AI\_GROUP
*   **Source is set to** **`Cold Outreach`** **if** **`Record source`** **is one of:**
    *   CRM\_UI
    *   CRM\_UI\_BULK\_ACTION
    *   COMMUNICATOR
    *   MOBILE\_ANDROID
    *   MOBILE\_IOS
    *   PLAYBOOKS
    *   EXTENSION
    *   SALES
    *   SEQUENCES
*   **Source is set to** **`External Prospecting`** **if** **`Record source`** **is one of:**
    *   CUSTOMER\_AGENT
    *   COMPANY\_INSIGHTS
    *   PROSPECTING\_AGENT
*   **Source is set to** **`Import / CRM`** **if** **`Record source`** **is one of:**
    *   EMAIL\_INBOX\_IMPORT
    *   IMPORT
    *   INTEGRATION
    *   PROPERTY\_RESTORE
    *   SALESFORCE
*   **Source is set to** **`Organic Search`** **if** **`Record source`** **is one of:**
    *   MARKET\_SOURCING
    *   SOCIAL

#### **Special Logic for Form Submissions**

If the `Record source` is `FORM`, the workflow uses a more granular approach by checking the `Original Traffic Source` (`hs_analytics_source`) property.

*   If `Original Traffic Source` is **ORGANIC\_SEARCH, EMAIL\_MARKETING, SOCIAL\_MEDIA, or OTHER\_CAMPAIGNS**, then `Original Company Source` is set to **Organic Search**.
*   If `Original Traffic Source` is **PAID\_SEARCH or PAID\_SOCIAL**, then `Original Company Source` is set to **Paid Search**.
*   If `Original Traffic Source` is **REFERRALS, DIRECT\_TRAFFIC, or AI\_REFERRALS**, then `Original Company Source` is set to **Direct Traffic**.
*   If `Original Traffic Source` is **OFFLINE**, then `Original Company Source` is set to **Cold Outreach**.
*   If the `Original Traffic Source` is any other value, it defaults to **Other**.

#### **Default / Fallback Rule**

If a company's `Record source` does not match any of the conditions listed above, the `Original Company Source` is set to **`Other`** as a catch-all.