# AICTE OneView: Intelligent Institution Complaint Monitoring & Overlap Coordination Platform

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://sih.gov.in)
[![AICTE](https://img.shields.io/badge/Council-AICTE%20Gov-blue.svg)](https://www.aicte-india.org)
[![Status](https://img.shields.io/badge/Prototype-Ready-emerald.svg)]()

> **Guiding Principle:** *One Institution, One Consolidated View, Intelligent Overlap Detection, and Coordinated Administrative Action.*

AICTE OneView is a centralized, intelligent web platform proposed for the All India Council for Technical Education (AICTE) to monitor, track, analyze, and coordinate institution-related complaints across the **Regulation Bureau (RB)**, **Public Grievance Redressal Cell (PGRC)**, and **Approval Bureau (AB)**.

---

## ⚡ Quick Start for Judges & Presenters

The development server is running locally:

```bash
cd aicte-oneview
npm install
npm run dev
```

Open your browser to: **[http://localhost:5174](http://localhost:5174)**

---

## 🌟 Key Features

1. **Executive Workload & Silo Dashboard**: Real-time cross-bureau telemetry, SLA tracking, active overlap alerts, and caseload breakdown.
2. **Centralized Institution Registry**: Consolidated profiles indexed by verified **AICTE Permanent ID**, containing full multi-bureau grievance histories.
3. **Live Overlap Detection Engine**:
   - 40 Pts: Verified Institution Identity
   - 30 Pts: NLP Semantic Cosine & Synonym Vectors
   - 15 Pts: AICTE Grievance Taxonomy Domain
   - 15 Pts: Temporal Proximity & Supporting Evidence
4. **Cross-Bureau Coordination Workspace**: Side-by-side comparison of cases (e.g. Case C-101 vs C-205) without automatically merging dockets or stripping Bureaus of statutory jurisdiction.
5. **Interactive SIH Demo Guide**: One-click step-by-step controller walking through the exact 7-step Section 17 demonstration scenario.
6. **Built-in Pitch Slide Deck**: 8-slide interactive pitch deck with speaker notes and keyboard arrow navigation.
7. **Tamper-Evident Audit Trail**: Immutable SHA256 hashed audit log of every status transition and coordination directive.
8. **Council Level Analytics & CSV Export**: Turnaround time metrics, category distributions, and downloadable briefings.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Inference Engine:** Client-side Semantic NLP Cosine Embedding & Domain Synonym Lemmatizer
- **Backend Architecture:** RESTful APIs, PostgreSQL + pgvector design, SHA256 audit chaining
