---
title: 'Set Spot Motiv Quantity'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634955
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3911123132/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3911123132/edit)
*   **Workflow ID:** 3911123132
*   **Workflow Name:** Set Spot Motiv Quantity

### **Objective**

This workflow automates the process of setting the 'Spot Motiv Quantity' property for specific deals. Its primary goal is to ensure this field is never empty for relevant deals by either setting a default value of '1' or by copying the value from a specific associated deal.

### **Object Type**

This workflow operates on **Deal** records.

### **Enrollment Triggers**

A deal is enrolled in this workflow when all the following conditions are met:

*   The deal is in the pipeline with ID '3387257046'.
*   The deal's 'Product Group' property is one of the following: 'digital\_spots', 'radio\_spots', or 'audio\_production'.
*   The deal's 'Spot Motiv Quantity' property is currently empty.

### **Workflow Steps**

Once a deal is enrolled, the workflow proceeds as follows:

1. **If/Then Branch: Check Associated Deal**
    *   The workflow first checks a deal associated via association type '451'.
    *   **Branch 1 (If 'Spot Motiv Quantity' is unknown):** If the associated deal's 'Spot Motiv Quantity' property is empty, the workflow proceeds to the next step in this branch.
    *   **Branch 2 (If 'Spot Motiv Quantity' is known):** If the associated deal has a value for 'Spot Motiv Quantity', the workflow follows the 'known' branch.
2. **Action: Set Property Value**
    *   **Path for Branch 1 (Unknown Value):** The workflow sets the enrolled deal's 'Spot Motiv Quantity' property to a static value of **1**.
    *   **Path for Branch 2 (Known Value):** The workflow copies the value from the associated deal's 'Spot Motiv Quantity' property and sets it on the enrolled deal's 'Spot Motiv Quantity' property.

### **Re-enrollment**

Re-enrollment is turned **OFF**. A deal can only go through this workflow once, even if it meets the enrollment criteria again in the future.