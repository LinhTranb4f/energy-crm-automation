---
title: '2025 | GrowthOps | deal | Offer Type Event and Approval Status open | send notification to approval person and deal owner incl. reminder in 3 days'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633375
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2759363827/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2759363827/edit)
*   **Workflow ID:** 2759363827
*   **Workflow Name:** 2025 | GrowthOps | deal | Offer Type Event and Approval Status open | send notification to approval person and deal owner incl. reminder in 3 days

### **Workflow Goal**

This workflow automates the approval process for deals with the "Event-Partnerschaft" (Event Partnership) offer type. It notifies the designated approver and the deal owner, creates a task for the approver, and sends a reminder if the deal is not actioned within 3 days. It also handles notifications for rejected deals.

### **Enrollment Triggers**

A deal is enrolled in this workflow if **EITHER** of the following is true:

*   **Initial Submission:**
    *   The "Need Approval" property is checked (set to true).
    *   AND the "Offer Type" is "Event-Partnerschaft".
    *   AND the "Approval Status" is empty or any value other than "Approved", "Not required", or "Pending".
*   **Revised Submission:**
    *   The "Event Offer Revised" checkbox is checked (set to true), indicating a previously rejected deal has been updated and is ready for a new review.

Deals can re-enroll in this workflow if their properties are updated to meet these criteria again.

### **Workflow Actions**

1. **Set Initial Status:**
    *   The deal's "Approval Status" property is set to "Pending".
    *   The deal's "Approval Person" is set to a specific user (ID: 80253526).
    *   The "Event Offer Revised" checkbox is cleared to prevent accidental re-enrollment loops.
2. **Initial Notifications:**
    *   **Email to Deal Owner:** An email is sent to the deal owner informing them that the deal now requires approval from the designated person.
    *   **Email to Approver:** An email is sent to the "Approval Person" requesting they review and set the approval status for the deal.
3. **Task Creation for Approver:**
    *   A high-priority task titled "Deal prüfen & Freigabe setzen" (Check deal & set approval) is created.
    *   The task is assigned to the designated "Approval Person" (ID: 80253526).
    *   The task is due in 3 business days at 8:00 AM.
    *   The task is associated with the deal.
4. **Wait Period:**
    *   The workflow pauses for 3 days (72 hours).
5. **Check Approval Status (If/Then Branch):**
    *   After the 3-day delay, the workflow checks the deal's "Approval Status" property.
    *   **If "Pending" (or empty):**
        *   A reminder email is sent to both the Deal Owner and the Approval Person. The subject is "Reminder: Offer Approval ausstehend – bitte prüfen/entscheiden." (Reminder: Offer Approval pending - please check/decide). The workflow then ends.
    *   **If "Approved":**
        *   No further action is taken. The workflow ends.
    *   **If "Rejected":**
        *   The workflow waits for 60 minutes.
        *   An email is sent to the Deal Owner with the subject "Deal rejected...". The email explains that the deal was rejected, includes the rejection reason, and instructs the owner to revise the deal and use the "Event Offer Revised" checkbox to resubmit it for approval. The workflow then ends.
    *   **If "Not required":**
        *   The "Need Approval" property on the deal is set to "false". The workflow then ends.