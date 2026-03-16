---
title: '2009 | GrowthOps | deal | Deal Lost (New Business) | Set LCS= Prospect & Reactivate in 6M'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633115
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639201502/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639201502/edit)
*   **Workflow ID:** 2639201502
*   **Workflow Name:** 2009 | GrowthOps | deal | Deal Lost (New Business) | Set LCS= Prospect & Reactivate in 6M

**Workflow Goal**
This workflow automates the process of re-engaging with contacts from lost 'New Business' deals. After a six-month cool-down period, it updates associated records to flag them for new sales and marketing outreach.

**Enrollment Triggers**
This workflow enrolls **Deals** when they meet the following criteria:

*   The Deal's 'Deal Stage' is set to 'Closed Lost'.
*   **AND** the Deal is associated with a Lead Type of 'New Business'.
*   **Re-enrollment:** This is enabled, meaning a deal can enter this workflow more than once if it meets the trigger criteria again.

**Workflow Actions**
Once a deal is enrolled, the following actions occur in sequence:

1. **Delay for 6 Months**
    *   The workflow immediately pauses for 180 days (259,200 minutes). This creates a cool-down period before the system attempts to re-engage.
2. **Update Associated Contact's Lifecycle Stage**
    *   After the 6-month delay, the workflow finds the contact(s) associated with the lost deal.
    *   It sets the 'Lifecycle Stage' property of these contacts to 'Sales Qualified Lead'.
    *   **Project Note:** The workflow's name suggests setting the stage to 'Prospect', but the action is configured to set it to 'Sales Qualified Lead'. This discrepancy should be reviewed to ensure the action aligns with the intended business process.
3. **Update Associated Lead Type**
    *   Finally, the workflow updates the associated 'Lead Type' object.
    *   It changes the 'Lead Type' property to 'RE\_ATTEMPTING'. This serves as an internal flag to indicate that this is a re-engagement effort.