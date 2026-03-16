---
title: '1019 | Data-Mgmt | contact | AI Gender Enrichment | Update gender & Salutation'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633435
---

### **Summary**

*   **Workflow URL:** `https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2989814002/edit`
*   **Workflow ID:** `2989814002`
*   **Workflow Name:** `1019 | Data-Mgmt | contact | AI Gender Enrichment | Update gender & Salutation`

### **Overview**

This workflow is designed to automate data enrichment for contacts by updating their gender and salutation properties. It uses an AI-powered step to predict a contact's gender based on their first name. The workflow then sets an appropriate salutation (e.g., "Sehr geehrter Herr", "Hallo") by considering the predicted gender, the contact's preferred language, and a desired salutation style (formal or informal).

### **Enrollment and Re-enrollment**

*   **Initial Enrollment:** A contact is enrolled in this workflow if any of the following properties have a known value: `First Name`, `Salutation Style`, or `Preferred language`. It also triggers if the `First Name` is unknown, making the trigger very broad.
*   **Re-enrollment:** Re-enrollment is enabled. A contact will re-enter the workflow whenever their `First Name`, `Preferred language`, or `Salutation Style` properties are updated.

### **Workflow Process**

The workflow follows a logical path to determine and set the correct salutation:

**Step 1: Check if First Name Exists**

*   The workflow first checks if the contact record has a value in the `First Name` property.
    *   **If YES (First Name is known):** The contact proceeds to the AI enrichment path.
    *   **If NO (First Name is not known):** The workflow skips directly to the end and sets a default informal salutation.

**Step 2: AI Gender Prediction (If First Name is Known)**

*   An AI action analyzes the contact's first name to predict a gender.
*   The AI is instructed to assign one of three categories:
    *   **Male:** For typically masculine names.
    *   **Female:** For typically feminine names.
    *   **Other:** For names that are ambiguous or not clearly gendered.
*   The result of this AI prediction is stored in the `Original Gender` contact property.

**Step 3: Branch by Salutation Style**

*   The workflow then checks the `Salutation Style` property on the contact record.
    *   **If "Formal":** The contact moves down the formal salutation path.
    *   **If "Informal" or Unknown:** The contact moves down the informal salutation path.

**Step 4a: Formal Salutation Path**

*   This path is for contacts who require a formal salutation. It branches again based on the AI-predicted gender.
    *   **If Gender is "Male":**
        *   It checks the `Preferred language` property.
        *   If the language is German ("de") or unknown, it sets the `Original Salutation` to **"Sehr geehrter Herr"**.
    *   **If Gender is "Female":**
        *   It checks the `Preferred language` property.
        *   If the language is German ("de") or unknown, it sets the `Original Salutation` to **"Sehr geehrte Frau"**.
    *   **If Gender is "Other" or Unknown:**
        *   It checks the `Preferred language` property.
        *   If the language is German ("de") or unknown, it sets the `Original Salutation` to **"Guten Tag"**.

**Step 4b: Informal Salutation Path**

*   This path is the default for contacts who require an informal salutation or have no preference specified.
*   It checks the `Preferred language` property.
*   If the language is German ("de") or unknown, it sets the `Original Salutation` to **"Hallo"**.

### **Fallback and End State**

*   If a contact enters the workflow without a known `First Name`, they are immediately routed to the final step, and their `Original Salutation` is set to **"Hallo"**.
*   The workflow currently only defines salutations for the German language ("de"). Contacts with other languages (e.g., "en") will exit the workflow without having a salutation set.