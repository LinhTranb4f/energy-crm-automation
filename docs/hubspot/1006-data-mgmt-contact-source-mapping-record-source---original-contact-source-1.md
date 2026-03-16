---
title: '1006 | Data-Mgmt | contact | Source mapping | Record Source -> Original Contact Source'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635195
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2551541994/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2551541994/edit)
*   **Workflow ID**: 2551541994
*   **Workflow Name**: 1006 | Data-Mgmt | contact | Source mapping | Record Source -> Original Contact Source

### Goal

This workflow automates data cleansing and enrichment for contacts. Its primary purpose is to populate the `Original Contact Source` property when it is unknown, by translating the technical `Record source` property into a more marketing-friendly source category. This ensures more accurate and consistent source tracking for reporting and segmentation.

### Enrollment Triggers

A contact will be enrolled in this workflow when the following two conditions are met simultaneously:

*   The contact's `Original Contact Source` property is empty.
*   The contact's `Record source` property has any known value.

### Re-enrollment

Re-enrollment is enabled. A contact will re-enroll if their `Record source` property is updated and the `Original Contact Source` property is still empty at that time.

### Workflow Actions

The workflow consists of a single, large branching logic step that determines the contact's origin and updates their `Original Contact Source` property accordingly.

1. **Check Record Source**: The workflow first checks the value of the contact's `Record source` property.
2. **Map to Original Contact Source**: Based on the `Record source`, it sets the `Original Contact Source` as follows:
    *   If `Record source` is **ADS**: Sets source to **Paid Search**
    *   If `Record source` is **ANALYTICS**: Sets source to **Direct Traffic**
    *   If `Record source` is **CHATSPOT**, **DATA\_ENRICHMENT**, **AI\_GROUP**, or **INTENT**: Sets source to **Buyer Intent**
    *   If `Record source` is **CRM\_UI**, **COMMUNICATOR**, **EXTENSION**, **PLAYBOOKS**, **CRM\_UI\_BULK\_ACTION**, **MOBILE\_ANDROID**, **MOBILE\_IOS**, **SEQUENCES**, or **SALES**: Sets source to **Cold Outreach**
    *   If `Record source` is **AUTOMATION\_JOURNEY**, **BCC\_TO\_CRM**, **BEHAVIORAL\_EVENTS**, **BOT**, **CONTENT\_MEMBERSHIP**, **EMAIL**, **ENGAGEMENTS**, **SUCCESS**, **HELP\_DESK**, **CONVERSATIONS**, **CONVERSATIONAL\_ENRICHMENT**, **EMAIL\_INTEGRATION**, **FORWARD\_TO\_CRM**, or **AUTOMATION\_PLATFORM**: Sets source to **Conversion Inbox**
    *   If `Record source` is **COMPANY\_INSIGHTS**, **PROSPECTING\_AGENT**, or **CUSTOMER\_AGENT**: Sets source to **External Prospecting**
    *   If `Record source` is **EMAIL\_INBOX\_IMPORT**, **PROPERTY\_RESTORE**, **IMPORT**, **INTEGRATION**, or **SALESFORCE**: Sets source to **Import / CRM**
    *   If `Record source` is **MARKETPLACE** or **MEETINGS**: Sets source to **Direct Traffic**
    *   If `Record source` is **MARKET\_SOURCING** or **SOCIAL**: Sets source to **Organic Search**
    *   If `Record source` is **ECOMMERCE\_INTEGRATION**: Sets source to **Paid Search**
    *   If `Record source` is one of many other system-generated sources (e.g., **BILLING**, **QUOTES**, **TASK**, **MERGE\_OBJECTS**, **INTERNAL\_PROCESSING**, etc.): Sets source to **Other**
    *   **Special Case - FORM**: If `Record source` is **FORM**, the workflow performs a second check on the `Original source` (`hs_analytics_source`) property:
        *   If `Original source` is **ORGANIC\_SEARCH**, **EMAIL\_MARKETING**, **SOCIAL\_MEDIA**, or **OTHER\_CAMPAIGNS**: Sets source to **Organic Search**
        *   If `Original source` is **PAID\_SEARCH** or **PAID\_SOCIAL**: Sets source to **Paid Search**
        *   If `Original source` is **REFERRALS**, **DIRECT\_TRAFFIC**, or **AI\_REFERRALS**: Sets source to **Direct Traffic**
        *   If `Original source` is **OFFLINE**: Sets source to **Cold Outreach**
        *   If `Original source` is unknown or any other value: Sets source to **Other**
    *   **Default/All Other Cases**: If the `Record source` does not match any of the above branches, the `Original Contact Source` is set to **Other**.
3. **End Workflow**: Once the property is set, the contact finishes the workflow.