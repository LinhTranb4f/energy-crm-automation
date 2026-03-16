---
title: '1019 | Data-Mgmt | contact | AI Gender Enrichment | Update gender & Salutation'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635755
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2989814002/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2989814002/edit)
*   **Workflow ID:** 2989814002
*   **Workflow Name:** 1019 | Data-Mgmt | contact | AI Gender Enrichment | Update gender & Salutation
*   **Status:** Active

**Workflow Overview**
This workflow automates the process of enriching contact data by setting a gender and an appropriate salutation. It uses HubSpot's AI capabilities to predict a contact's gender based on their first name. The final salutation is determined by the predicted gender, the contact's preferred language, and a predefined salutation style (Formal or Informal).

**Enrollment Triggers**
A contact will be enrolled in this workflow if any of the following properties are known:

*   First Name
*   Salutation Style
*   Preferred Language

Contacts can be re-enrolled if any of these properties are updated, allowing the salutation to be recalculated with the new information.

**Workflow Process**

**1\. Initial Check: First Name**

*   The workflow first checks if the contact has a value in the "First Name" property.
*   If a first name exists, the workflow proceeds to the AI enrichment step.
*   If no first name exists, the workflow skips directly to the final step and sets a generic, informal salutation ("Hallo").

**2\. AI Gender Prediction**

*   For contacts with a known first name, the workflow uses an AI prompt to analyze the name.
*   The AI is instructed to categorize the name into one of three groups:
    *   **Male:** For typically masculine names.
    *   **Female:** For typically feminine names.
    *   **Other:** For names that are ambiguous or not clearly gendered.
*   The AI's output is then used to update the "Original Gender" contact property.

**3\. Salutation Style Branching**

*   Next, the workflow checks the "Salutation Style" property on the contact record. This determines whether a formal or informal greeting is required.
*   If the style is "Formal", the workflow proceeds to the formal salutation logic.
*   If the style is "Informal" or unknown, the workflow proceeds to the informal salutation logic.

**4\. Setting the Final Salutation**

**A. Formal Salutation Logic**
If the "Salutation Style" is "Formal", the workflow uses the AI-predicted gender and the contact's language to set the "Original Salutation" property.

*   **If Gender is Male:**
    *   If language is German (or unknown), the salutation is set to "Sehr geehrter Herr".
*   **If Gender is Female:**
    *   If language is German (or unknown), the salutation is set to "Sehr geehrte Frau".
*   **If Gender is Other, Non-Binary, or Unknown:**
    *   If language is German (or unknown), the salutation is set to the neutral "Guten Tag".

**B. Informal Salutation Logic**
If the "Salutation Style" is "Informal" or not set, the workflow sets a generic informal greeting.

*   If the contact's language is German (or unknown), the salutation is set to "Hallo".

**Workflow End**
After the "Original Salutation" property is set, the contact exits the workflow.