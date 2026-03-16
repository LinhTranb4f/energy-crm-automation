---
title: '1036 | Data-Mgmt | deal | Deal owner is unknown | copy owner from company to deal'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634735
---

**Summary**

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3706288367/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3706288367/edit)
*   **Workflow ID**: 3706288367
*   **Workflow Name**: 1036 | Data-Mgmt | deal | Deal owner is unknown | copy owner from company to deal

**Purpose**
This workflow is a data management tool designed to ensure that deals have an assigned owner. When a deal is created or updated without an owner, this workflow checks if the deal's associated primary company has an owner. If it does, the workflow copies the company's owner to the deal, assigning ownership and ensuring accountability.

**Enrollment Triggers**
A deal will be enrolled in this workflow when all of the following conditions are met:

*   **Deal Owner is Unknown**: The "Deal owner" property on the deal record is empty.
*   **Close Date is in the Future**: The "Close date" property is set to a date after January 1st, 2025. This prevents the workflow from running on old, closed deals.
*   **Associated Company Has an Owner**: The deal is associated with a primary company, and that company has a value in its "Company owner" property.

**Re-enrollment**

*   Re-enrollment is active for this workflow.
*   A deal will re-enroll if its "Deal owner" property is updated and the new value is empty. This ensures that if a deal owner is ever removed, the workflow will try to re-assign it based on the company owner.

**Actions**
Once a deal is enrolled, the workflow performs the following single action:

*   **Copy Company Owner to Deal Owner**:
    *   **Action**: Set property value.
    *   **Target Property**: "Deal owner" on the enrolled deal.
    *   **Source Value**: The value from the "Company owner" property of the most recently modified associated company.