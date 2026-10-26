# AICTE Samanvay: Institution Case Intelligence and Coordination Layer

[![Live Demo on GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2ea44f?style=for-the-badge&logo=github)](https://chandan-bk.github.io/aicte-oneview/)

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://sih.gov.in)
[![Problem Statement](https://img.shields.io/badge/Problem%20ID-SIH26264-blue.svg)]()
[![Theme](https://img.shields.io/badge/Theme-Smart%20Automation-purple.svg)]()
[![Status](https://img.shields.io/badge/Prototype-Ready-emerald.svg)]()

> **Tagline:** *One Institution. Connected Cases. Coordinated Action.*

👉 **Live Demo URL:** [https://chandan-bk.github.io/aicte-oneview/](https://chandan-bk.github.io/aicte-oneview/)

AICTE Samanvay is an **overlay on existing systems** (Regulation Bureau, PGRC, Approval Bureau), **not a replacement portal**. It connects related cases, resolves them to one verified institution profile, detects overlaps across three distinct levels, and warns officers through a **Pre-Action Check** before they duplicate or contradict another Bureau's action.

AI recommends; authorized officials always decide. Nothing is auto-merged, auto-closed, or auto-blocked.

---

## ⚡ Quick Start for Judges & Evaluators

Run the web application locally:

```bash
cd aicte-oneview
npm install
npm run dev
```

Open: **[http://localhost:5174](http://localhost:5174)**

---

## 🌟 Core Modules

1. **Ingestion Layer (No Re-entry):** Prototype supports **real CSV file upload & column validation**, downloadable sample CSV template, and 1-click synthetic dataset loading. Roadmap includes live API/DB adapters.
2. **Institution 360:** Unique **AICTE Permanent ID** as primary key; fuzzy match fallback; uncertain matches flagged for human verification.
3. **3-Level Overlap Engine:**
   - **L1 Co-Activity:** Rules (always-on) detect multiple Bureaus active on the same institution.
   - **L2 Related Issue:** Rule-based overlap engine with multilingual synonym matching across English, Hindi, and Hinglish complaints.
   - **L3 Duplicate / Conflicting Action Warning:** Evaluates defined action vocabulary (`Notice Issued`, `Documents Requested`, `Inspection Ordered`, `Case Closed`, `Transferred`).
4. **Pre-Action Check (Headline Innovation):** Warns officers before issuing notices or document demands if another Bureau has already acted on the institution.
5. **Coordination Workspace:** Link cases (never merge), proposed lead Bureau, shared document-request registry ("ask once"), and cryptographic audit trail.
6. **Dashboard & Configurable SLA:** Overview of pending, active, and overdue cases; Bureau workload; SLA thresholds configurable as sample rules.
7. **Built-in 6-Slide Master PPT Deck:** Exact 6-slide presentation deck formatted for the SIH template.

---

## 🛠️ Technology Stack & Architecture

- **Demonstrated Prototype:** React 19, TypeScript, Tailwind CSS, Recharts, Lucide Icons, Canvas Confetti, Web Crypto API (SHA-256 hash chaining), and `localStorage` state persistence.
- **Matching Engine:** Rule-based overlap scoring with domain taxonomy and multilingual synonym lemmatization (Hindi, English, Hinglish).
- **Roadmap Architecture:** Python FastAPI backend service, persistent PostgreSQL database with `pgvector` extension for vector indexing, server-side RBAC, and live adapters to existing AICTE databases.
- **Governance:** Designed for DPDP Act 2023 & GIGW 3.0 alignment. All metrics baselined on test data without unverified accuracy claims.

---

## 📄 Documentation

- Full Pitch & Presentation Masterplan: [`docs/SIH_DEMO_PRESENTATION_KIT.md`](docs/SIH_DEMO_PRESENTATION_KIT.md)
