---
title: '2005 | GrowthOps | lead | LCS is prospect and contact submitted a form | create lead and set label to hot'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633535
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3056350426/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3056350426/edit)
*   Workflow ID: 3056350426
*   Workflow Name: 2005 | GrowthOps | lead | LCS is prospect and contact submitted a form | create lead and set label to hot

### Goal

This workflow automates the creation of a new "Lead" object when an existing, qualified contact submits a specific form. It differentiates between new business opportunities and inquiries from existing customers by setting the lead type accordingly.

### Enrollment Triggers

Contacts are enrolled in this workflow when they meet the following criteria:

*   The contact's Lifecycle Stage is one of the following: Prospect (including Sales Qualified Lead, Opportunity, and custom stage ID 2572120291) or Customer.
*   **AND** the contact submits any one of the following six forms:
    *   Form ID: 89122a36-69d1-4d61-8611-484fac02363e
    *   Form ID: 927233ab-de4f-4d85-8525-6a866f8d9f66
    *   Form ID: 58a890ca-5364-418c-9f31-485c8472e525
    *   Form ID: 32f2d710-aa60-4f6e-b3b7-38df4b11f6a0
    *   Form ID: c0fb2de7-183f-4e40-ae1e-f4555f1c3117
    *   Form ID: aa47b459-2e02-4082-8d85-2f2a70504a4b

**Re-enrollment:** Re-enrollment is enabled. A contact will re-enter this workflow every time they submit one of the specified forms.

### Workflow Steps

1. **Delay for 3 Minutes:** After a contact is enrolled, the workflow waits for 3 minutes before proceeding.
2. **If/Then Branch (Check Lifecycle Stage):** The workflow checks the enrolled contact's current lifecycle stage.
    *   **Branch 1: Prospect**
        *   **Condition:** The contact's lifecycle stage is Prospect, Sales Qualified Lead, or Opportunity.
        *   **Action:** A new "Lead" object is created with the following properties:
            *   **Lead Name:** Contact's First Name + Last Name
            *   **Lead Label:** HOT
            *   **Lead Type:** NEW\_BUSINESS
            *   **Pipeline:** Lead Pipeline (ID: lead-pipeline-id)
            *   **Pipeline Stage:** Stage ID 2672478433
            *   The new lead is associated with the enrolled contact.
            *   Contact properties are copied to the lead: Message, Form Type, Interested In, and Recent Conversion Event Name.
    *   **Branch 2: Customer**
        *   **Condition:** The contact's lifecycle stage is Customer.
        *   **Action:** A new "Lead" object is created with the following properties:
            *   **Lead Name:** Contact's First Name + Last Name
            *   **Lead Label:** HOT
            *   **Lead Type:** Existing Customer
            *   **Pipeline:** Lead Pipeline (ID: lead-pipeline-id)
            *   **Pipeline Stage:** Stage ID 2672478433
            *   The new lead is associated with the enrolled contact.
            *   Contact properties are copied to the lead: Message, Form Type, Interested In, and Recent Conversion Event Name.
    *   **Default Branch:** If the contact's lifecycle stage is not defined in the branches above, it follows the "Prospect" branch logic by default.
3. **End:** The workflow finishes after the lead object has been created.