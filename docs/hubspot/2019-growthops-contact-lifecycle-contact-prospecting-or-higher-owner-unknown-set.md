---
title: '2019 | GrowthOps | contact | Lifecycle contact: Prospecting or higher, owner unknown. | Set owner from company or revenue stream'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632795
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2427020508/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2427020508/edit)
*   **Workflow ID**: 2427020508
*   **Workflow Name**: 2019 | GrowthOps | contact | Lifecycle contact: Prospecting or higher, owner unknown. | Set owner from company or revenue stream

### Purpose

This workflow automatically assigns a HubSpot owner to contacts that are in a sales-ready lifecycle stage but do not currently have an owner. The primary method is to inherit the owner from the contact's associated company. If that is not possible, a default owner is assigned based on the contact's stated interests (e.g., Medienpartnerschaften, Radio, Digital).

### Enrollment Triggers

A contact is enrolled in this workflow if they meet **all** of the following criteria:

*   **Lifecycle Stage is one of the following:**
    *   Sales Qualified Lead
    *   Opportunity
    *   Customer
    *   (or other stages representing prospecting or higher)
*   **AND Contact Owner** property is unknown.

_Note: Contacts can be re-enrolled in this workflow if they meet the trigger criteria again in the future._

### Workflow Actions

**Step 1: Check for Associated Company**

*   **If** the contact has a primary associated company:
    *   The workflow proceeds to check the company's owner (Step 2).
*   **Else** (no associated company):
    *   The workflow skips to the interest-based owner assignment logic (Step 3).

**Step 2: Check for Company Owner**

*   **If** the associated company has a known HubSpot Owner:
    *   **Action:** The company's owner is copied to the contact's "HubSpot Owner" property.
    *   The workflow ends for this contact.
*   **Else** (company has no owner):
    *   The workflow proceeds to the interest-based owner assignment logic (Step 3).

**Step 3: Interest-Based Owner Assignment (Fallback Logic)**
This step runs if the contact has no associated company or the associated company has no owner.

*   **If the contact's "Interested In" property is "Medienpartnerschaften":**
    *   **Action:** Set the contact's "HubSpot Owner" to a specific default user (ID: 80253547).
    *   The workflow then ends.
*   **If the contact's "Interested In" property is one of "Promotionen", "Digital", "Event", "Radio", or is unknown:**
    *   **Action:** Set the contact's "HubSpot Owner" to a different specific default user (ID: 1779033493).
    *   The workflow then ends.