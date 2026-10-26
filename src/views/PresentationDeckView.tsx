import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, ChevronRight, Play, Sparkles, Building2, 
  GitMerge, ShieldCheck, Scale, Cpu, Users, Award, ExternalLink, CheckCircle2, Copy 
} from 'lucide-react';

export const PresentationDeckView: React.FC = () => {
  const { setCurrentView, setSihDemoStep } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  // Exact 6-Slide Master Presentation Deck from AICTE Samanvay final alignment
  const slides = [
    {
      id: 1,
      badge: 'Smart India Hackathon 2026 | Problem Statement: SIH26264',
      heading: 'Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases Across AICTE Bureaus/Cells',
      subtitle: 'Theme: Smart Automation | Category: Software',
      content: (
        <div className="space-y-6 max-w-3xl mx-auto text-center py-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-1 mx-auto flex items-center justify-center shadow-xl">
            <div className="w-full h-full bg-[#0B2545] rounded-xl flex items-center justify-center">
              <span className="font-extrabold text-amber-400 text-3xl font-['Outfit']">सम</span>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
              AICTE Samanvay
            </h1>
            <p className="text-amber-400 font-semibold text-base mt-1">
              Institution Case Intelligence and Coordination Layer
            </p>
            <p className="text-xs text-slate-300 italic mt-0.5">
              "One Institution. Connected Cases. Coordinated Action."
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left pt-2 text-xs">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-slate-400 text-[10px] block">Problem ID</span>
              <strong className="text-white text-xs">SIH26264</strong>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-slate-400 text-[10px] block">Theme</span>
              <strong className="text-white text-xs">Smart Automation</strong>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-slate-400 text-[10px] block">Category</span>
              <strong className="text-white text-xs">Software</strong>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-slate-400 text-[10px] block">Organization</span>
              <strong className="text-amber-400 text-xs">AICTE (Govt of India)</strong>
            </div>
          </div>
        </div>
      ),
      bullets: [
        'Problem Statement ID: SIH26264',
        'Title: Integrated Dashboard for Monitoring and Tracking Institution Cases',
        'Theme: Smart Automation | Category: Software',
        'Final Solution: AICTE Samanvay (Case Intelligence & Coordination Layer)',
        'Tagline: One Institution. Connected Cases. Coordinated Action.'
      ]
    },
    {
      id: 2,
      badge: 'Slide 2: Proposed Solution',
      heading: 'AICTE Samanvay: Institution Case Intelligence and Coordination Layer',
      subtitle: 'Overlay on existing systems — not a replacement',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left text-xs">
          <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2.5">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>The Gap & Core Solution</span>
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>The gap:</strong> same institution has cases open in RB, PGRC & other cells with no shared view.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Overlay, not a replacement:</strong> imports cases from existing systems with no re-entry (CSV/Excel prototype).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Institution 360:</strong> one profile per AICTE Permanent ID with all cases, status, and history.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Unified dashboard:</strong> pending, under process, disposed, transferred, escalated & overdue cases.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Coordination Workspace:</strong> link cases (never merge), record decisions, keep an audit trail.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 bg-slate-800/80 border border-amber-500/30 rounded-2xl space-y-2.5">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Headline Innovation</span>
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Pre-action check (HEADLINE):</strong> before a notice or doc request, see what another Bureau has done.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>3-level engine:</strong> L1 co-activity → L2 related issue → L3 duplicate/conflicting action.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Multilingual text matching:</strong> Hindi, English and Hinglish complaints cross-referenced.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Human decides:</strong> AI only recommends; nothing is auto-merged, auto-closed or auto-blocked.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
      bullets: [
        'The gap: same institution has cases in RB, PGRC & other cells with no shared view.',
        'Overlay, not a replacement: imports cases from existing systems with zero re-entry.',
        'Institution 360: one profile per AICTE Permanent ID with all cases, Bureaus & status.',
        'Unified dashboard: pending, under process, disposed, transferred, escalated & overdue.',
        'Alert: "Potential Overlapping Cases — Coordination Required" with transparent reasons.',
        'Coordination Workspace: link cases (never merge), record decisions, keep an audit trail.',
        'Pre-action check: before a notice or doc request, see what another Bureau has already done.',
        '3-level engine: L1 co-activity → L2 related issue → L3 duplicate/conflicting action.'
      ]
    },
    {
      id: 3,
      badge: 'Slide 3: Technical Approach',
      heading: 'Architecture, Stack & Ingestion Pipeline',
      subtitle: 'Open-Source, API-Ready & Secure on Government Cloud',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto text-left text-xs">
          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-2">
              Methodology Flow
            </span>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 font-mono text-[11px] text-slate-200 overflow-x-auto whitespace-nowrap">
              CSV/Excel import (API-ready) → Validate → Institution resolution → L1 co-activity → L2 related issue → L3 action conflict → Alert with reasons → Pre-action check → Coordination Workspace → Dashboard · SLA · Audit trail
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 block">Prototype (Built & Demonstrable):</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                React + TypeScript overlay, real CSV file upload & validation, Institution 360, rule-based 3-level overlap engine with multilingual synonyms, Pre-Action Check advisory, Coordination Workspace + SHA-256 hash chaining, and localStorage persistence.
              </p>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1.5">
              <span className="text-xs font-bold text-purple-400 block">Roadmap (Post-Pilot Architecture):</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Persistent Python FastAPI backend with PostgreSQL (+ pgvector) vector database, live API/DB sync adapters to RB and PGRC systems, production server-side RBAC, and SMS/email alerts.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-white/5 p-3 rounded-lg border border-white/10 flex items-center justify-between">
            <span><strong>Prototype:</strong> React, TypeScript, Tailwind, Recharts, Rule-Based Multilingual Overlap Engine | <strong>Roadmap:</strong> FastAPI, pgvector</span>
            <span className="text-amber-400 font-mono">100% On-Premise Capable</span>
          </div>
        </div>
      ),
      bullets: [
        'Architecture: Overlay design on top of existing RB and PGRC systems with zero re-entry.',
        'Matching: Rule-based overlap engine with multilingual synonym dictionary (English, Hindi, Hinglish); embeddings planned for pilot.',
        'Flow: CSV/Excel import → Validate → Institution resolution → L1 → L2 → L3 → Alert.',
        'Pre-action check: flags recorded prior Bureau actions before notice dispatch.',
        'Coordination Workspace: links cases (never merge), proposes lead Bureau, shared document registry.',
        'Prototype (demonstrated): CSV upload/parser with validation, Institution 360, L1-L3 rule engine, Pre-Action Check, SHA-256 audit chaining.',
        'Roadmap: persistent FastAPI backend, PostgreSQL + pgvector, live API adapters, server-side authentication.'
      ]
    },
    {
      id: 4,
      badge: 'Slide 4: Feasibility and Viability',
      heading: 'Practical Rollout, Risk Matrix & Compliance',
      subtitle: 'Designed for DPDP Act 2023 & GIGW Alignment',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto text-left text-xs">
          <div className="overflow-x-auto bg-slate-800/90 rounded-xl border border-slate-700">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-900 text-slate-300 uppercase font-semibold text-[10px] border-b border-slate-700">
                <tr>
                  <th className="py-2 px-3">Identified Risk</th>
                  <th className="py-2 px-3">Engineered Mitigation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                <tr>
                  <td className="py-2 px-3 font-semibold text-rose-300">Inconsistent institution IDs/names</td>
                  <td className="py-2 px-3">Permanent ID first, fuzzy match, human verification queue</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-amber-300">False overlap alerts</td>
                  <td className="py-2 px-3">Rules first, severity levels, reasons shown, officer can dismiss</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-blue-300">Incomplete action history</td>
                  <td className="py-2 px-3">Defined action vocabulary, start with 4-5 core rules</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-purple-300">Existing systems lack APIs</td>
                  <td className="py-2 px-3">CSV and DB sync fallback, pluggable adapters</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-emerald-300">Unauthorized access / privacy</td>
                  <td className="py-2 px-3">Role-based access, audit log, PII masking, local AI hosting</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-semibold text-slate-300">Unverified deadlines</td>
                  <td className="py-2 px-3">SLA thresholds configurable, labelled as sample rules</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-slate-300 text-[11px] flex items-center justify-between">
            <span><strong>Footnote:</strong> No accuracy claims before testing; metrics will be measured on a labelled test set in pilot.</span>
            <span className="text-amber-400 font-mono text-[10px]">Zero False Promises</span>
          </div>
        </div>
      ),
      bullets: [
        'Open-source stack, runs on synthetic data, deployable on-premise or government cloud.',
        'Overlay design means no change to existing Bureau workflows.',
        'Rollout plan: prototype → authorized pilot with RB + PGRC → all Bureaus & regional offices.',
        'Inconsistent IDs: Permanent ID first, fuzzy match fallback, human verification queue.',
        'False alerts: rules first, severity levels, reasons shown, officer can dismiss.',
        'No APIs: CSV/DB sync fallback; pluggable adapters.',
        'Governance: role-based access, audit log, PII masking, designed for DPDP/GIGW alignment.',
        'Footnote: No accuracy claims before testing; metrics will be measured on a labelled test set.'
      ]
    },
    {
      id: 5,
      badge: 'Slide 5: Impact and Benefits',
      heading: 'Administrative Value & Public Redressal',
      subtitle: 'Quantifiable Benefits for Officers, Management & Students',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto text-left text-xs">
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
            <strong className="text-amber-400 block">For Officers</strong>
            <p className="text-slate-300 text-[11px]">Full institution context before acting; prevents duplicate document demands.</p>
          </div>
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
            <strong className="text-blue-400 block">For Management</strong>
            <p className="text-slate-300 text-[11px]">Real-time visibility, workload tracking, and accountability across all Bureaus.</p>
          </div>
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
            <strong className="text-emerald-400 block">Administrative</strong>
            <p className="text-slate-300 text-[11px]">Fewer duplicate or conflicting actions; accelerated case disposal.</p>
          </div>
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
            <strong className="text-purple-400 block">Economic</strong>
            <p className="text-slate-300 text-[11px]">Less officer time lost to repeated inspections and duplicate paperwork.</p>
          </div>
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
            <strong className="text-rose-400 block">Social</strong>
            <p className="text-slate-300 text-[11px]">Quicker redressal for students and faculty facing extortion or harassment.</p>
          </div>
          <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-1">
            <strong className="text-cyan-400 block">Metrics (Pilot Baselined)</strong>
            <p className="text-slate-300 text-[11px]">Duplicate-action rate, time to detect overlap, overdue cases, alert precision.</p>
          </div>
        </div>
      ),
      bullets: [
        'Officers: full institution context before acting; no duplicate document demands.',
        'Management: real-time cross-bureau visibility and accountability.',
        'Administrative: fewer duplicate or conflicting actions, faster disposal.',
        'Economic: less officer time lost to repeated work and parallel inquiries.',
        'Social: quicker grievance redressal for students and faculty.',
        'Transparency: complete chronological action history with tamper-resistant audit trail.',
        'Metrics to baseline in pilot: duplicate-action rate, time to detect overlap, overdue cases, alert precision.'
      ]
    },
    {
      id: 6,
      badge: 'Slide 6: Research and References',
      heading: 'Citations, Technical Standards & Guidelines',
      subtitle: 'Grounding AICTE Samanvay in Official Standards',
      content: (
        <div className="space-y-3 max-w-4xl mx-auto text-left text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <strong className="text-amber-400 block">SIH 2026 Problem Statement SIH26264</strong>
              <span className="text-slate-300 text-[11px]">All India Council for Technical Education (AICTE), Ministry of Education</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Problem ID: SIH26264</span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <strong className="text-blue-400 block">AICTE Official Portal & Permanent ID Standard</strong>
              <span className="text-slate-300 text-[11px]">https://www.aicte-india.org — Approval Process Handbook 2024-27</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Permanent ID Key</span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <strong className="text-emerald-400 block">CPGRAMS (Centralised Public Grievance Redress and Monitoring System)</strong>
              <span className="text-slate-300 text-[11px]">Department of Administrative Reforms and Public Grievances (DARPG), Govt of India</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">CPGRAMS Protocol</span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <strong className="text-purple-400 block">DPDP Act 2023 & Guidelines for Indian Government Websites (GIGW 3.0)</strong>
              <span className="text-slate-300 text-[11px]">Digital Personal Data Protection Act, MeitY & NIC National Security Guidelines</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Designed for Alignment</span>
          </div>

          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex justify-between items-center">
            <div>
              <strong className="text-rose-400 block">Open Source Technical Documentation</strong>
              <span className="text-slate-300 text-[11px]">pgvector, Sentence Transformers (LaBSE / multilingual-e5), RapidFuzz, FastAPI</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Open-Source Core</span>
          </div>
        </div>
      ),
      bullets: [
        'SIH 2026 problem statement SIH26264 (AICTE).',
        'AICTE official portal: https://www.aicte-india.org',
        'CPGRAMS, the Government of India grievance redressal framework.',
        'Digital Personal Data Protection (DPDP) Act 2023 & GIGW 3.0 guidelines.',
        'Technical docs: pgvector, Sentence Transformers (LaBSE / multilingual-e5), FastAPI, PostgreSQL, RapidFuzz.'
      ]
    }
  ];

  const currentSlideData = slides[currentSlide];

  // Copy bullets for PPT generator
  const copySlideText = () => {
    const text = `### ${currentSlideData.heading}\n\n` + currentSlideData.bullets.map(b => `- ${b}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  return (
    <div className="space-y-4">
      {/* Presenter Stage */}
      <div className="bg-gradient-to-br from-[#0B2545] via-[#13315C] to-[#081B33] text-white rounded-3xl p-8 min-h-[530px] shadow-2xl border border-slate-700 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-full border border-amber-400/30">
              {currentSlideData.badge}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copySlideText}
              className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-slate-200 rounded text-xs transition"
              title="Copy slide bullet points"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Slide Text'}</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-3 z-10">
          <h2 className="text-xl sm:text-2xl font-extrabold font-['Outfit'] text-white tracking-tight mb-1 max-w-3xl mx-auto">
            {currentSlideData.heading}
          </h2>
          <p className="text-xs text-slate-300 font-normal">
            {currentSlideData.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="my-auto z-10">
          {currentSlideData.content}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-5 border-t border-slate-800 z-10">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-30 transition flex items-center gap-1 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-30 transition flex items-center gap-1 text-xs shadow-lg"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Text Bullets (Direct copy for PPT template) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Master Slide {currentSlide + 1} Bullets (Formatted for 6-Slide SIH Template):
          </span>
          <span className="text-[10px] text-slate-400 font-mono">6 to 8 concise points · No invented stats</span>
        </div>
        <ul className="space-y-1 text-slate-700 list-disc pl-5">
          {currentSlideData.bullets.map((b, idx) => (
            <li key={idx}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
