---
title: '2002 | GrowthOps | contact | new LCS= Suspect | Run Simple Scoring ICP'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633055
---

### **Summary**

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638530794/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638530794/edit)
*   **Workflow ID**: 2638530794
*   **Workflow Name**: 2002 | GrowthOps | contact | new LCS= Suspect | Run Simple Scoring ICP

### **Workflow Goal**

This workflow automates a simple Ideal Customer Profile (ICP) scoring process for contacts. It evaluates contacts based on their country, their associated company's employee count, and company industry. Based on these criteria, it assigns a fit score ("ideal Fit", "Workable", or "no Fit") to the contact property "Simple Contact Score".

### **Enrollment Triggers**

Contacts are enrolled in this workflow if they meet any of the following criteria:

*   The contact's Lifecycle Stage is any of:
    *   Lead
    *   Marketing Qualified Lead
    *   Sales Qualified Lead
*   OR the contact's Country property has a known value.

_Note: Contacts can be re-enrolled in this workflow if they meet the criteria again._

### **Workflow Actions**

**Step 1: Country Qualification**

*   The workflow first checks the contact's `country` property.
*   **If** the country is unknown OR is not one of the following: "Schweiz", "Switzerland", "Suisse", "CH", "Svizzera", then:
    *   The contact's "Simple Contact Score" is set to "no Fit".
    *   The workflow ends for this contact.
*   **Otherwise** (if the contact is in Switzerland), the workflow continues.

**Step 2: Delay**

*   There is a 2-minute delay before the next action.

**Step 3: Employee Count Verification**

*   The workflow checks if the associated company's "Number of employees" property is known.
*   **If** the number of employees is unknown, then:
    *   The contact's "Simple Contact Score" is set to "no Fit".
    *   The workflow ends for this contact.
*   **Otherwise** (if the number of employees is known), the workflow continues.

**Step 4: Company Size Qualification**

*   The workflow checks the value of the "Number of employees" property.
*   **If** the number of employees is "1–10", then:
    *   The contact's "Simple Contact Score" is set to "no Fit".
    *   The workflow ends for this contact.
*   **Otherwise** (if the company has more than 10 employees), the workflow continues.

**Step 5: Delay**

*   There is another 2-minute delay before the final scoring.

**Step 6: Industry-Based Scoring**

*   The workflow checks the associated company's `original_company_industry` property and branches accordingly:
*   **Branch: Strong Fit**
    *   **If** the industry is one of: _Übrige Dienstleistungen, Medien, Bildung, Telekommunikation, Gastronomie, Getränke, Bekleidung, Automobil, Kosmetik und Körperpflege, Handel, Freizeit, Agenturen, Zweirad, Pharma und Gesundheit, Möbel und Garten, Finanzen und Versicherungen, Tourismus, Musik, Hotellerie_.
    *   The contact's "Simple Contact Score" is set to "ideal Fit".
*   **Branch: Workable Fit**
    *   **If** the industry is one of: _Haushalt, Reinigung, Energie, IT, Ringier, Luxus und Eigenbedarf, Verkehr, Immobilien, Behörden, Unterhaltungselektronik, Verbände, Online, Nahrungsmittel, Soziale Einrichtungen_.
    *   The contact's "Simple Contact Score" is set to "Workable".
*   **Branch: No Fit**
    *   **If** the industry is one of: _Dienstleistung, Kreativ-Agenturen, Personalvermittlung, Media-Agenturen, Tabakwaren, Film und Games_.
    *   The contact's "Simple Contact Score" is set to "no Fit".

_After setting the score in one of the branches, the workflow ends for the contact._