# AICTE Samanvay: Master Solution & SIH Presentation Kit

> **Problem Statement ID:** SIH26264  
> **Title:** Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells  
> **Theme:** Smart Automation | **Category:** Software  
> **Final Solution:** AICTE Samanvay (Institution Case Intelligence and Coordination Layer)  
> **Tagline:** *One Institution. Connected Cases. Coordinated Action.*  
> **Repository:** [https://github.com/chandan-bk/aicte-oneview](https://github.com/chandan-bk/aicte-oneview)

---

## 1. Executive Summary & Positioning

AICTE Samanvay is an **overlay on existing systems** (Regulation Bureau, PGRC, Approval Bureau), **not a replacement portal**. Officers do not re-enter data. It ingests cases via API/DB sync (prototype supports **real CSV file upload & validation** as well as 1-click synthetic datasets), resolves them to one verified institution profile, detects overlaps across three distinct levels, and warns officers through a **Pre-Action Check** before they duplicate or contradict another Bureau's action.

The prototype matching engine uses an explainable rule-based overlap model with multilingual synonym matching across English, Hindi, and Hinglish. Integration of server-side transformer embeddings (LaBSE / multilingual-e5) is designed for production deployment following pilot calibration.

AI recommends; authorized officials always decide. Nothing is automatically merged, closed, or blocked.

---

## 2. Three-Level Overlap Engine

| Level | Question | Method (Prototype) | Output |
| :--- | :--- | :--- | :--- |
| **L1 Co-Activity** | Are multiple Bureaus active on this institution? | Deterministic rules (always-on) | *"Potential Overlapping Cases – Coordination Required"* |
| **L2 Related Issue** | Is it the same or a related issue? | Rules & grievance domain taxonomy + multilingual synonym matching (English, Hindi, Hinglish) | Possible Duplicate / Related / Same institution but unrelated |
| **L3 Action Conflict** | Are actions duplicated or contradictory? | Explicit rules over a defined action vocabulary | Pre-Action Warning / Conflict Advisory |

### Defined Action Vocabulary:
- `Notice Issued`
- `Documents Requested`
- `Inspection Ordered`
- `Hearing Scheduled`
- `Case Closed`
- `Transferred`

---

## 3. Headline Innovation: Pre-Action Check

Before an officer issues a notice, requests documents, or orders an inspection, the Pre-Action Check displays prior active actions by other Bureaus on the same institution:
- *"Advisory: Regulation Bureau already requested 3-year fee ledgers on 18 Oct 2026. Use Shared Document Registry to ask the institution once."*
- **Action Pathways:**
  1. *Consolidate via Shared Document Registry (Ask Once)*
  2. *Modify Proposed Directive*
  3. *Proceed with Independent Notice (Override with Justification)*
- **Advisory Disclaimer:** The Pre-Action Check inspects known prior recorded actions. The absence of an alert is not proof that an action is free of conflict. Bureau officials retain statutory discretion.

---

## 4. Master 6-Slide Presentation Deck Text

### Slide 1: Title
- **Problem Statement ID:** SIH26264
- **Title:** Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells
- **Theme:** Smart Automation
- **Category:** Software
- **Final Solution:** AICTE Samanvay (Institution Case Intelligence and Coordination Layer)
- **Tagline:** One Institution. Connected Cases. Coordinated Action.

### Slide 2: Proposed Solution
- **The gap:** the same institution has cases in RB, PGRC and other cells with no shared view, so requests get duplicated and actions overlap.
- **Overlay, not a replacement:** imports cases from existing systems, with no re-entry (prototype: CSV/Excel).
- **Institution 360:** one profile per AICTE Permanent ID with all cases, Bureaus, status and history.
- **Unified dashboard:** pending, under process, disposed, transferred, escalated and overdue cases, plus Bureau workload.
- **Alert:** "Potential Overlapping Cases – Coordination Required", with reasons.
- **Coordination Workspace:** link cases (never merge), record decisions, keep an audit trail.
- **Configurable SLA alerts and reports** by institution, region, Bureau and status.
- **Innovation:** Pre-action check (see prior actions before notice dispatch); 3-level engine (L1 co-activity → L2 related issue → L3 action conflict); AI recommends, officials decide.

### Slide 3: Technical Approach
- **Technologies:** React + TypeScript, Tailwind, Recharts; Python FastAPI, PostgreSQL (+ pgvector); RapidFuzz and rule engine; multilingual embeddings (LaBSE / multilingual-e5) for Hindi, English and Hinglish; scheduled jobs for SLA; role-based access, audit log, PII masking.
- **Methodology (flow chart):**
  `CSV/Excel import (API-ready) → Validate → Institution resolution → L1 co-activity → L2 related issue → L3 action conflict → Alert with reasons → Pre-action check → Coordination Workspace → Dashboard · SLA · Audit trail`
- **Prototype (built):** import, Institution 360, L1/L2 alerts, pre-action check, workspace, SLA dashboard.
- **Roadmap:** live API adapters, pre-action API inside existing tools, notifications.

### Slide 4: Feasibility and Viability
- **Feasibility:** Open-source stack, runs on synthetic data, deployable on-premise or on government cloud; overlay design means no change to existing workflows; rollout: prototype → authorized pilot with RB + PGRC → all Bureaus and regional offices.
- **Risk Mitigation:**
  - *Inconsistent institution IDs/names:* Permanent ID first, fuzzy match, human verification queue.
  - *False alerts:* Rules first, severity levels, reasons shown, officer can dismiss.
  - *Incomplete action history:* Defined action vocabulary, start with a few core rules.
  - *No APIs available:* CSV and DB sync fallback, pluggable adapters.
  - *Unauthorized access:* Role-based access, audit log, PII masking, local AI hosting.
  - *Unverified deadlines:* SLA thresholds configurable, labelled as sample rules.
- **Footnote:** No accuracy claims before testing; metrics will be measured on a labelled test set in pilot.

### Slide 5: Impact and Benefits
- **Officers:** full institution context before acting; no duplicate document requests.
- **Management:** real-time cross-bureau visibility and accountability.
- **Administrative:** fewer duplicate or conflicting actions, faster disposal.
- **Economic:** less officer time lost to repeated work and duplicate inspections.
- **Social:** quicker redressal for students and faculty.
- **Transparency:** complete action history with tamper-resistant audit trail.
- **Metrics (to baseline in pilot):** duplicate-action rate, time to detect overlap, overdue cases, alert precision.

### Slide 6: Research and References
- SIH 2026 problem statement SIH26264 (AICTE).
- AICTE official portal (https://www.aicte-india.org).
- CPGRAMS, the Government of India grievance system.
- Digital Personal Data Protection (DPDP) Act 2023, GIGW 3.0 guidelines.
- Docs: pgvector, Sentence Transformers, FastAPI, PostgreSQL, RapidFuzz.

---

## 5. 3-Minute SIH Demonstration Scenario

1. **Dashboard:** Cases shown across institutions, in Hindi and English with configurable SLA flags.
2. **Institution 360:** Inspect ABC Engineering College (Permanent ID: `1-43598711`), showing ongoing Regulation Bureau case `C-101`.
3. **Ingestion:** Ingest PGRC student fee grievance (via form or 1-click CSV import).
4. **3-Level Overlap Alert:** L1 detects co-activity; L2 explains related issue; L3 warns of duplicate document demand risk.
5. **Pre-Action Check:** Officer starts "Request Documents" -> Pre-Action Check warns: *"Regulation Bureau already asked on 18 Oct. Ask once via Shared Document Registry."*
6. **Coordination Order:** Cases linked under `CG-008`, shared document added, decision committed, and audit trail permanently updated.
