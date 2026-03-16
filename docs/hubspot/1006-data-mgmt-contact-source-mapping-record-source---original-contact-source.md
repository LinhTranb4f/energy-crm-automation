---
title: '1006 | Data-Mgmt | contact | Source mapping | Record Source -> Original Contact Source'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632875
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2551541994/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2551541994/edit)
*   **Workflow ID:** 2551541994
*   **Workflow Name:** 1006 | Data-Mgmt | contact | Source mapping | Record Source -> Original Contact Source

**Purpose**

This workflow automates data cleansing for contact records. Its primary function is to translate HubSpot's system-generated "Record source" property into a standardized, user-friendly "Original Contact Source" property. This ensures consistency in reporting on how contacts are created in the CRM.

**Enrollment Triggers**

A contact is enrolled in this workflow when the following two conditions are met simultaneously:

*   The contact's "Original Contact Source" property is empty.
*   The contact's "Record source" property has a known value.

The workflow allows for re-enrollment, meaning if a contact's "Record source" is updated and their "Original Contact Source" is still empty, they will run through this workflow again.

**Workflow Logic**

The workflow uses a series of if/then branches to check the value of the contact's "Record source" property. Based on this value, it sets the "Original Contact Source" to a specific, predefined value.

**Source Mapping Details**

**Mapped to 'Other'**
If the "Record source" is one of the following, "Original Contact Source" is set to 'Other':

*   BILLING
*   CENTRAL\_EXCHANGE\_RATES
*   QUOTES
*   TASK
*   BATCH\_UPDATE
*   CRM\_SETTING
*   PAYMENTS
*   CLONE\_OBJECTS
*   MERGE\_OBJECTS
*   PRESENTATIONS
*   APPROVALS
*   HELP\_DESK\_CATEGORY\_GENERATOR
*   CALCULATED
*   INTERNAL\_PROCESSING
*   MICROAPPS
*   FORECASTING
*   SCORING
*   TEAM\_SYNC
*   SYNC\_PROPERTY
*   RECYCLING\_BIN
*   GOALS
*   DATASET

**Mapped to 'Conversion Inbox'**
If the "Record source" is one of the following, "Original Contact Source" is set to 'Conversion Inbox':

*   ENGAGEMENTS
*   AUTOMATION\_JOURNEY
*   BCC\_TO\_CRM
*   BEHAVIORAL\_EVENTS
*   BOT
*   CONTENT\_MEMBERSHIP
*   EMAIL
*   SUCCESS
*   HELP\_DESK
*   CONVERSATIONS
*   CONVERSATIONAL\_ENRICHMENT
*   EMAIL\_INTEGRATION
*   FORWARD\_TO\_CRM
*   AUTOMATION\_PLATFORM

**Mapped to 'Cold Outreach'**
If the "Record source" is one of the following, "Original Contact Source" is set to 'Cold Outreach':

*   CRM\_UI
*   COMMUNICATOR
*   EXTENSION
*   PLAYBOOKS
*   CRM\_UI\_BULK\_ACTION
*   MOBILE\_ANDROID
*   MOBILE\_IOS
*   SEQUENCES
*   SALES

**Mapped to 'Import / CRM'**
If the "Record source" is one of the following, "Original Contact Source" is set to 'Import / CRM':

*   EMAIL\_INBOX\_IMPORT
*   PROPERTY\_RESTORE
*   IMPORT
*   INTEGRATION
*   SALESFORCE

**Mapped to 'Direct Traffic'**
If the "Record source" is one of the following, "Original Contact Source" is set to 'Direct Traffic':

*   ANALYTICS
*   MARKETPLACE
*   MEETINGS

**Mapped to 'Paid Search'**
If the "Record source" is one of the following, "Original Contact Source" is set to 'Paid Search':

*   ECOMMERCE\_INTEGRATION
*   ADS

**Mapped to 'Organic Search'**
If the "Record source" is one of the following, "Original Contact Source" is set to 'Organic Search':

*   MARKET\_SOURCING
*   SOCIAL

**Mapped to 'Buyer Intent'**
If the "Record source" is one of the following, "Original Contact Source" is set to 'Buyer Intent':

*   CHATSPOT
*   DATA\_ENRICHMENT
*   AI\_GROUP
*   INTENT

**Mapped to 'External Prospecting'**
If the "Record source" is one of the following, "Original Contact Source" is set to 'External Prospecting':

*   COMPANY\_INSIGHTS
*   PROSPECTING\_AGENT
*   CUSTOMER\_AGENT

**Special Case: 'FORM' Source**
If the "Record source" is 'FORM', the workflow performs a second check on the contact's "Original source" property (`hs_analytics_source`) to determine the final value:

*   If "Original source" is ORGANIC\_SEARCH, SOCIAL\_MEDIA, EMAIL\_MARKETING, or OTHER\_CAMPAIGNS, it is mapped to 'Organic Search'.
*   If "Original source" is PAID\_SEARCH or PAID\_SOCIAL, it is mapped to 'Paid Search'.
*   If "Original source" is REFERRALS, DIRECT\_TRAFFIC, or AI\_REFERRALS, it is mapped to 'Direct Traffic'.
*   If "Original source" is OFFLINE, it is mapped to 'Cold Outreach'.
*   If the "Original source" does not match any of the above, it defaults to 'Other'.

**Default Case**
If a contact's "Record source" does not match any of the branches listed above, the "Original Contact Source" property is set to 'Other' by default.