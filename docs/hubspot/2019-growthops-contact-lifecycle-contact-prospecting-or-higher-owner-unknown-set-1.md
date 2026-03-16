---
title: '2019 | GrowthOps | contact | Lifecycle contact: Prospecting or higher, owner unknown. | Set owner from company or revenue stream'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635115
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2427020508/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2427020508/edit)
*   **Workflow ID:** 2427020508
*   **Workflow Name:** 2019 | GrowthOps | contact | Lifecycle contact: Prospecting or higher, owner unknown. | Set owner from company or revenue stream

### Workflow Goal

This workflow automatically assigns an owner to contacts that do not have one. It prioritizes assigning the owner from the contact's associated company. If the company or its owner is unknown, it assigns a default owner based on the contact's stated interests (e.g., revenue stream). The primary goal is to ensure every qualified lead has a designated point of contact for follow-up.

### Enrollment Triggers

A contact will be enrolled in this workflow if they meet **ALL** of the following criteria:

*   Their **Lifecycle Stage** is one of the following: Prospecting, Opportunity, Sales Qualified Lead, or Customer.
*   Their **HubSpot Owner** property is unknown (they have no owner).
*   **Re-enrollment:** This is enabled, meaning a contact can go through this workflow again if they meet the trigger criteria in the future (e.g., their owner is removed).

### Workflow Steps

1. **Check for Associated Company:**
    *   The workflow first checks if the contact has a primary associated company record.
    *   **If Yes (Company is Known):** The contact proceeds to Step 2.
    *   **If No (Company is Unknown):** The contact skips to Step 4 to be assigned an owner based on their interests.
2. **Check for Company Owner:**
    *   For contacts with an associated company, the workflow checks if that company has a known owner.
    *   **If Yes (Company Owner is Known):** The contact proceeds to Step 3.
    *   **If No (Company Owner is Unknown):** The contact proceeds to Step 4 to be assigned an owner based on their interests.
3. **Assign Owner from Company:**
    *   The owner from the associated company is copied to the contact's "HubSpot Owner" property.
    *   The workflow ends for this contact.
4. **Check Contact's Interests (Fallback Logic):**
    *   This step runs for contacts with no associated company or whose associated company has no owner. The workflow checks the contact's "Interested In" property.
    *   **If "Interested In" is "Medienpartnerschaften":** The contact is assigned a specific default owner (User ID: 80253547) and the workflow proceeds to a final ownership check.
    *   **If "Interested In" is "Radio", "Digital", "Promotion", or "Event":** The contact is assigned a different default owner (User ID: 1779033493) and the workflow continues.
    *   **If "Interested In" is Unknown:** The contact is also assigned the default owner (User ID: 1779033493) and the workflow continues.
5. **Final Ownership Check (Redundant Step):**
    *   After a default owner is assigned in Step 4, the workflow performs a final, and likely redundant, check to see if an owner can be copied from the associated company. This appears to be a safeguard.
    *   The workflow ends for this contact.