---
title: 'Update Delfin Order ID on Deal'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634775
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3761253571/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3761253571/edit)
*   **Workflow ID:** 3761253571
*   **Workflow Name:** Update Delfin Order ID on Deal

### **Purpose**

This workflow automates the process of synchronizing an order ID from a "Delfin Order" custom object to its associated Deal record. This ensures that the Deal record always contains the correct and up-to-date order ID from the related custom object, preventing data discrepancies.

### **Enrollment Trigger**

This workflow is based on "Delfin Order" custom object records. A record will enroll in this workflow when the following two conditions are met simultaneously:

*   The "Delfin Order" record has a value in its 'Delfin Order ID' property.
*   AND The associated Deal record does _not_ have a value in its 'Delfin Order ID' property (it is empty).

### **Workflow Actions**

Once a "Delfin Order" record is enrolled, it will immediately execute the following action:

**1\. Copy 'Delfin Order ID' to Associated Deal**

*   **Action Type:** Set Property Value
*   **Details:** The workflow copies the value from the 'Delfin Order ID' property of the enrolled "Delfin Order" record.
*   **Target:** It then pastes this value into the 'Delfin Order ID' property on the associated Deal record.

### **Settings**

*   **Re-enrollment:** Disabled. A "Delfin Order" record can only trigger this workflow and update its associated Deal once.