---
title: '1008 | Data-Mgmt | company | Source mapping | Record Source -> Original Company Source'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632935
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604664013/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2604664013/edit)
*   **Workflow ID:** 2604664013
*   **Workflow Name:** 1008 | Data-Mgmt | company | Source mapping | Record Source -> Original Company Source

### Purpose

This workflow automates data hygiene for Company records. Its primary goal is to populate the `Original Company Source` property when it is unknown. It achieves this by analyzing the company's `Record source` property (how the record was created in HubSpot) and, in some cases, the `Original Traffic Source`, to assign a standardized and more meaningful source value.

### Enrollment Criteria

A Company record is enrolled in this workflow if it meets **all** of the following conditions:

*   The `Original Company Source` property is empty.
*   The `Record source` property has a value (is not empty).

Companies will only be enrolled in this workflow once and will not be re-enrolled.

### Workflow Logic

The workflow begins with a single, large branching action that checks the value of the Company's `Record source` property. Based on this value, it sets the `Original Company Source` property to a specific, mapped value.

### Source Mapping Details

*   **If** **`Record source`** **is FORM:**
    *   The workflow then checks the `Original Traffic Source` property for a more granular mapping:
        *   If `Original Traffic Source` is **Organic Search**, `Email Marketing`, `Social Media`, or `Other Campaigns` -> Sets `Original Company Source` to **Organic Search**.
        *   If `Original Traffic Source` is **Paid Search** or `Paid Social` -> Sets `Original Company Source` to **Paid Search**.
        *   If `Original Traffic Source` is **Referrals**, `Direct Traffic`, or `AI Referrals` -> Sets `Original Company Source` to **Direct Traffic**.
        *   If `Original Traffic Source` is **Offline** -> Sets `Original Company Source` to **Cold Outreach**.
        *   For any other value -> Sets `Original Company Source` to **Other**.
*   **Sets** **`Original Company Source`** **to Conversion Inbox for:**
    *   `ENGAGEMENTS`, `AUTOMATION_JOURNEY`, `BCC_TO_CRM`, `BOT`, `EMAIL_INTEGRATION`, `CONTENT_MEMBERSHIP`, `CONVERSATIONAL_ENRICHMENT`, `CONVERSATIONS`, `BEHAVIORAL_EVENTS`, `EMAIL`, `SUCCESS`, `FORWARD_TO_CRM`, `HELP_DESK`, `AUTOMATION_PLATFORM`
*   **Sets** **`Original Company Source`** **to Cold Outreach for:**
    *   `CRM_UI`, `CRM_UI_BULK_ACTION`, `COMMUNICATOR`, `MOBILE_ANDROID`, `MOBILE_IOS`, `PLAYBOOKS`, `EXTENSION`, `SALES`, `SEQUENCES`
*   **Sets** **`Original Company Source`** **to Import / CRM for:**
    *   `EMAIL_INBOX_IMPORT`, `IMPORT`, `INTEGRATION`, `PROPERTY_RESTORE`, `SALESFORCE`
*   **Sets** **`Original Company Source`** **to Paid Search for:**
    *   `ADS`, `ECOMMERCE_INTEGRATION`
*   **Sets** **`Original Company Source`** **to Buyer Intent for:**
    *   `CHATSPOT`, `DATA_ENRICHMENT`, `INTENT`, `AI_GROUP`
*   **Sets** **`Original Company Source`** **to External Prospecting for:**
    *   `CUSTOMER_AGENT`, `COMPANY_INSIGHTS`, `PROSPECTING_AGENT`
*   **Sets** **`Original Company Source`** **to Direct Traffic for:**
    *   `ANALYTICS`, `MARKETPLACE`, `MEETINGS`
*   **Sets** **`Original Company Source`** **to Organic Search for:**
    *   `MARKET_SOURCING`, `SOCIAL`
*   **Sets** **`Original Company Source`** **to Other for all other cases, including:**
    *   `APPROVALS`, `BATCH_UPDATE`, `BILLING`, `CRM_SETTING`, `PAYMENTS`, `DATASET`, `PRESENTATIONS`, `FORECASTING`, `GOALS`, `HELP_DESK_CATEGORY_GENERATOR`, `CALCULATED`, `INTERNAL_PROCESSING`, `QUOTES`, `MERGE_OBJECTS`, `RECYCLING_BIN`, `SCORING`, `TASK`, `TEAM_SYNC`
    *   This also applies to any `Record source` value not explicitly listed in the branches above (the default case).

### Outcome

After running, the enrolled company record will have a value in its `Original Company Source` property. This enhances data consistency and allows for more accurate reporting on where companies originate.