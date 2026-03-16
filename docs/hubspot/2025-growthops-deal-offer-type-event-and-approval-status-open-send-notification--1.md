---
title: '2025 | GrowthOps | deal | Offer Type Event and Approval Status open | send notification to approval person and deal owner incl. reminder in 3 days'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635695
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2759363827/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2759363827/edit)
*   **Workflow ID:** 2759363827
*   **Workflow Name:** 2025 | GrowthOps | deal | Offer Type Event and Approval Status open | send notification to approval person and deal owner incl. reminder in 3 days

### Objective

This is a deal-based workflow designed to automate the approval process for deals with the offer type "Event-Partnerschaft" (Event Partnership). It notifies the designated approver and the deal owner, creates a task for the approver, and sends a reminder if the approval is not actioned within 3 days.

### Enrollment Triggers

A deal is enrolled in this workflow if **either** of the following conditions is met:

*   **Initial Approval Request:**
    *   The deal's "Need Approval" property is set to `true`.
    *   AND the deal's "Offer Type" is `Event-Partnerschaft`.
    *   AND the deal's "Approval Status" is not already `Approved`, `Not required`, or `Pending` (meaning it's likely empty).
*   **Revised Offer Resubmission:**
    *   The deal's "Event Offer Revised" checkbox is checked (`true`). This is used to re-enroll a deal after it has been rejected and updated.

_Re-enrollment is active, meaning a deal can enter this workflow multiple times if it meets the criteria again (e.g., after being revised)._

### Workflow Actions (Step-by-Step)

1. **Set Initial Status:**
    *   The deal property "Approval Status" is immediately set to `Pending`.
    *   The deal property "Approval Person" is set to a specific user (ID: 80253526).
    *   The "Event Offer Revised" checkbox is cleared to reset the status for future revisions.
2. **Initial Notifications & Task Creation:**
    *   **Email to Deal Owner:** An internal email is sent to the deal owner with the subject "Attention: This deal must be approved by \[Approval Person's Name\]".
    *   **Email to Approver:** An internal email is sent to the designated approval person with the subject "Please check Deal \[Deal Name\] & set approval".
    *   **Task Creation:** A high-priority task is created and assigned to the approval person.
        *   **Title:** "Deal prüfen & Freigabe setzen" (Review Deal & Set Approval).
        *   **Due Date:** 3 business days from creation, at 8:00 AM.
        *   **Notes:** The task body contains the deal's status, name, description, and the assigned deal owner.
3. **Wait for Approval:**
    *   The workflow pauses for 3 days (4320 minutes).
4. **Check Approval Status (If/Then Branch):**
    *   After the 3-day delay, the workflow checks the value of the "Approval Status" property.
    *   **If** **`Approved`****:** The workflow ends for this deal.
    *   **If** **`Not required`****:** The deal property "Need Approval" is set to `false`, and the workflow ends.
    *   **If** **`Rejected`****:** The workflow waits for 1 hour, then sends an email to the deal owner with the subject "Deal rejected: This deal was rejected by \[Approval Person's Name\]". The email includes the rejection reason and instructs the owner to revise the deal and check the "Event Offer Revised" box to resubmit for approval. The workflow then ends.
    *   **If still** **`Pending`** **(or empty):** A reminder is sent.
5. **Send Reminder:**
    *   If the deal is still pending after 3 days, an internal reminder email is sent to **both** the deal owner and the approval person with the subject "Reminder: Offer Approval pending – please review/decide." The workflow then ends.