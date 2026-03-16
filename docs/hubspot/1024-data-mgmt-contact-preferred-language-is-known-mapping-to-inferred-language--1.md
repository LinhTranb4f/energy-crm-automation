---
title: '1024 | Data-Mgmt | contact | preferred language is known | Mapping to Inferred Language Code'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636095
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3222833363/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3222833363/edit)
*   **Workflow ID:** 3222833363
*   **Workflow Name:** 1024 | Data-Mgmt | contact | preferred language is known | Mapping to Inferred Language Code

### **Purpose**

This workflow automates data management for contacts. Its primary function is to standardize the contact's language preference into a single, simplified code. It reads the "Preferred language" (`hs_language`) property and sets a corresponding two-letter code in the "Inferred Language Codes" (`hs_inferred_language_codes`) property. This is crucial for consistent data, segmentation, and personalized communication.

### **Enrollment Triggers**

A contact is enrolled in this workflow under the following conditions:

*   **Initial Enrollment:** The workflow triggers for any contact as soon as their "Preferred language" (`hs_language`) property has any known value.
*   **Re-enrollment:** Re-enrollment is enabled. This means a contact will re-enter the workflow every time their "Preferred language" property is updated to a new known value, ensuring the inferred language code is always up-to-date.

### **Workflow Logic and Steps**

The workflow executes a series of checks based on the value of the contact's "Preferred language" property.

*   **Step 1: Branch on Preferred Language**

The workflow checks the value of the `hs_language` property and directs the contact down a specific path.

*   **Step 2: Set Inferred Language Code**
    *   **If the language is German:**
        *   Values: `de`, `de-de`, or `de-ch`
        *   Action: Set the "Inferred Language Codes" (`hs_inferred_language_codes`) property to `de`.
    *   **If the language is Italian:**
        *   Values: `it`, `it-it`, or `it-ch`
        *   Action: Set the "Inferred Language Codes" (`hs_inferred_language_codes`) property to `it`.
    *   **If the language is French:**
        *   Values: `fr`, `fr-fr`, or `fr-ch`
        *   Action: Set the "Inferred Language Codes" (`hs_inferred_language_codes`) property to `fr`.
    *   **If the language is English:**
        *   Values: `en`, `en-us`, or `en-gb`
        *   Action: Set the "Inferred Language Codes" (`hs_inferred_language_codes`) property to `en`.
    *   **If the language is any other value (Default Branch):**
        *   Action: Set the "Inferred Language Codes" (`hs_inferred_language_codes`) property to `de`.
        *   **Note:** The original workflow description in the JSON states it defaults to English, but the actual logic defaults to German (`de`). This is a critical detail for review.

### **End Goal**

Upon completion, every contact who runs through this workflow will have their "Inferred Language Codes" property correctly populated with a standardized two-letter code (`de`, `it`, `fr`, or `en`), ensuring clean and reliable language data across the CRM.