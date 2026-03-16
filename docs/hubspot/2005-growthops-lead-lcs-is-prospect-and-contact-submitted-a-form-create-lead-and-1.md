---
title: '2005 | GrowthOps | lead | LCS is prospect and contact submitted a form | create lead and set label to hot'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635855
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3056350426/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3056350426/edit)
*   **Workflow ID:** 3056350426
*   **Workflow Name:** 2005 | GrowthOps | lead | LCS is prospect and contact submitted a form | create lead and set label to hot

### Objective

This workflow automates the creation of a custom 'Lead' object when a qualified contact submits one of several specific forms. The primary goal is to capture new interest from both prospective and existing customers, label them as 'HOT', and assign them to the correct lead pipeline, differentiating between new business and upselling opportunities.

### Enrollment Triggers

This is a contact-based workflow. A contact will be enrolled if they meet the following criteria:

*   The contact's **Lifecycle Stage** is one of the following: Prospect, Opportunity, Sales Qualified Lead, or Customer.

**AND**

*   The contact submits any one of the following forms:
    *   Form ID: `89122a36-69d1-4d61-8611-484fac02363e`
    *   Form ID: `927233ab-de4f-4d85-8525-6a866f8d9f66`
    *   Form ID: `58a890ca-5364-418c-9f31-485c8472e525`
    *   Form ID: `32f2d710-aa60-4f6e-b3b7-38df4b11f6a0`
    *   Form ID: `c0fb2de7-183f-4e40-ae1e-f4555f1c3117`
    *   Form ID: `aa47b459-2e02-4082-8d85-2f2a70504a4b`

**Re-enrollment:** Re-enrollment is enabled. A contact can re-enter this workflow every time they submit one of the specified forms.

### Workflow Actions

**Step 1: Delay**

*   The workflow waits for **3 minutes** after the contact is enrolled before proceeding.

**Step 2: If/Then Branch (Check Lifecycle Stage)**

*   The workflow checks the enrolled contact's `Lifecycle Stage` to determine the type of lead to create.

**Branch A: Prospect / SQL / Opportunity**

*   **Condition:** If the contact's Lifecycle Stage is 'Prospect', 'Opportunity', 'Sales Qualified Lead', or is unknown.
*   **Action:** A new 'Lead' record is created with properties for **New Business**.

**Branch B: Customer**

*   **Condition:** If the contact's Lifecycle Stage is 'Customer'.
*   **Action:** A new 'Lead' record is created with properties for an **Existing Customer**.

### Action Details: Create Lead Record

**For Branch A (New Business):**

*   A new 'Lead' object is created with the following properties:
    *   **Lead Name:** Set to the contact's First Name and Last Name.
    *   **Lead Label:** Set to **HOT**.
    *   **Lead Type:** Set to **NEW\_BUSINESS**.
    *   **Pipeline:** Set to the lead pipeline (ID: `lead-pipeline-id`).
    *   **Pipeline Stage:** Set to the stage with ID `2672478433`.
    *   **Message (Nachricht):** Copied from the contact's `message` property.
    *   **Form Type:** Copied from the contact's `form_type` property.
    *   **Interest (Interesse):** Copied from the contact's `interested_in` property.
    *   **Last Conversion (Letzte Konversion):** Copied from the contact's `recent_conversion_event_name` property.
*   The newly created Lead is automatically associated with the enrolled Contact.

**For Branch B (Existing Customer):**

*   A new 'Lead' object is created with the following properties:
    *   **Lead Name:** Set to the contact's First Name and Last Name.
    *   **Lead Label:** Set to **HOT**.
    *   **Lead Type:** Set to **Existing Customer**.
    *   **Pipeline:** Set to the lead pipeline (ID: `lead-pipeline-id`).
    *   **Pipeline Stage:** Set to the stage with ID `2672478433`.
    *   **Message (Nachricht):** Copied from the contact's `message` property.
    *   **Form Type:** Copied from the contact's `form_type` property.
    *   **Interest (Interesse):** Copied from the contact's `interested_in` property.
    *   **Last Conversion (Letzte Konversion):** Copied from the contact's `recent_conversion_event_name` property.
*   The newly created Lead is automatically associated with the enrolled Contact.