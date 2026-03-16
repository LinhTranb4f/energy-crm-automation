---
title: '2002 | GrowthOps | contact | new LCS= Suspect | Run Simple Scoring ICP'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635375
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638530794/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638530794/edit)
*   **Workflow ID:** 2638530794
*   **Workflow Name:** 2002 | GrowthOps | contact | new LCS= Suspect | Run Simple Scoring ICP

### **Overview**

This contact-based workflow scores contacts based on their location (Switzerland), associated company size, and associated company industry. The goal is to set a custom contact property called "Simple Contact Score" to one of three values: "ideal Fit", "Workable", or "no Fit".

### **Enrollment Triggers**

A contact will be enrolled in this workflow if they meet **any** of the following criteria:

*   Their Lifecycle Stage is one of the following:
    *   Marketing Qualified Lead
    *   Sales Qualified Lead
    *   Lead
*   **OR** the "Country" property has any value (is known).

Contacts can be re-enrolled in this workflow if they meet the trigger criteria again.

### **Workflow Steps**

1. **Check Contact's Country**
    *   **IF** the contact's "Country" property is unknown OR does not contain any variation of "Switzerland" (e.g., Schweiz, Suisse, CH, Svizzera),
        *   **THEN** set the "Simple Contact Score" property to "no Fit". The workflow ends for this contact.
    *   **ELSE** (if the country is Switzerland), the contact proceeds to the next step.
2. **Delay for 2 Minutes**
    *   The workflow waits for 2 minutes before continuing.
3. **Check Company's Number of Employees**
    *   **IF** the "Number of employees" property on the associated company is unknown,
        *   **THEN** set the "Simple Contact Score" property to "no Fit". The workflow ends for this contact.
    *   **ELSE IF** the "Number of employees" property is "1–10",
        *   **THEN** set the "Simple Contact Score" property to "no Fit". The workflow ends for this contact.
    *   **ELSE** (if the number of employees is known and is greater than 10), the contact proceeds to the next step.
4. **Delay for 2 Minutes**
    *   The workflow waits for another 2 minutes before continuing.
5. **Check Company's Industry**
    *   **IF** the associated company's "Industry" is in the 'Strong Fit' list (e.g., Medien, Bildung, Telekommunikation, Handel, Freizeit, Agenturen, etc.),
        *   **THEN** set the "Simple Contact Score" property to "ideal Fit". The workflow ends.
    *   **ELSE IF** the associated company's "Industry" is in the 'Workable Fit' list (e.g., Haushalt, Energie, IT, Verkehr, Immobilien, etc.),
        *   **THEN** set the "Simple Contact Score" property to "Workable". The workflow ends.
    *   **ELSE IF** the associated company's "Industry" is in the 'No Fit' list (e.g., Kreativ-Agenturen, Personalvermittlung, Tabakwaren, etc.),
        *   **THEN** set the "Simple Contact Score" property to "no Fit". The workflow ends.
    *   **ELSE** (if the industry is not in any of the predefined lists), the workflow ends without setting the score.