---
title: '1024 | Data-Mgmt | contact | preferred language is known | Mapping to Inferred Language Code'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633775
---

### **Workflow Documentation**

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3222833363/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3222833363/edit)
*   **Workflow ID:** 3222833363
*   **Workflow Name:** 1024 | Data-Mgmt | contact | preferred language is known | Mapping to Inferred Language Code

### **Objective**

This workflow is designed for data management purposes. Its primary function is to standardize a contact's language preference into a single, two-letter ISO language code. It reads the contact's "Preferred language" (`hs_language`) property and sets the "Inferred Language Codes" (`hs_inferred_language_codes`) property accordingly.

### **Enrollment Triggers**

*   **Object Type:** Contact
*   **Trigger Condition:** A contact is enrolled in this workflow whenever their "Preferred language" (`hs_language`) property has a known value.
*   **Re-enrollment:** Re-enrollment is active. This means if a contact's "Preferred language" is updated, they will re-enter the workflow to ensure the "Inferred Language Codes" property is also updated.

### **Workflow Steps**

The workflow consists of a single branching logic step that evaluates the contact's "Preferred language" property and takes the corresponding action.

*   **If the "Preferred language" is one of 'de', 'de-de', or 'de-ch':**
    *   The workflow sets the contact's "Inferred Language Codes" property to **'de'**.
*   **If the "Preferred language" is one of 'it', 'it-ch', or 'it-it':**
    *   The workflow sets the contact's "Inferred Language Codes" property to **'it'**.
*   **If the "Preferred language" is one of 'fr', 'fr-fr', or 'fr-ch':**
    *   The workflow sets the contact's "Inferred Language Codes" property to **'fr'**.
*   **If the "Preferred language" is one of 'en', 'en-us', or 'en-gb':**
    *   The workflow sets the contact's "Inferred Language Codes" property to **'en'**.
*   **Default Case (If none of the above conditions are met):**
    *   The workflow sets the contact's "Inferred Language Codes" property to **'de'**.

### **End of Workflow**

Once the "Inferred Language Codes" property has been set, the contact exits the workflow.