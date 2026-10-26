import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, ChevronRight, ChevronLeft, CheckCircle2, 
  Play, RotateCcw, X, ExternalLink, ShieldAlert, ArrowRight 
} from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const { 
    sihDemoStep, setSihDemoStep, 
    isDemoGuideOpen, setIsDemoGuideOpen, 
    setCurrentView, resetToSihBaseline,
    loadSihPresetComplaint, setSelectedInstitution,
    institutions, complaints, alerts
  } = useApp();

  if (!isDemoGuideOpen) {
    return (
      <button
        onClick={() => setIsDemoGuideOpen(true)}
        className="fixed bottom-5 right-5 z-50 bg-[#0B2545] text-amber-400 border border-amber-400/40 p-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-semibold text-xs group"
      >
        <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span>Open SIH Demo Script (Step {sihDemoStep}/7)</span>
      </button>
    );
  }

  const steps = [
    {
      step: 1,
      title: 'Executive Dashboard & Silo Overview',
      subtitle: 'Section 17 - Scenario Step 1',
      desc: 'Demonstrate AICTE OneView overview across Regulation Bureau (RB), Public Grievance (PGRC), and Approval Bureau (AB). Point out active complaints, pending SLA timelines, and cross-bureau metrics.',
      actionLabel: 'Go to Dashboard',
      onAction: () => setCurrentView('dashboard')
    },
    {
      step: 2,
      title: 'Centralized Institution Dossier: ABC Engineering College',
      subtitle: 'Section 17 - Scenario Step 2',
      desc: 'Look up ABC Engineering College (Permanent ID: 1-43598711). Show that the Regulation Bureau already has an active case C-101 (unauthorized development fee show-cause notice).',
      actionLabel: 'Inspect ABC College Dossier',
      onAction: () => {
        const inst = institutions.find(i => i.aictePermanentId === '1-43598711');
        if (inst) setSelectedInstitution(inst);
        setCurrentView('institutions');
      }
    },
    {
      step: 3,
      title: 'PGRC Receives New Student Fee Grievance',
      subtitle: 'Section 17 - Scenario Step 3',
      desc: 'Simulate PGRC registering a new complaint stating students are forced to pay Rs. 40,000 extra for lab/exam clearance. Click the button to prefill the exact SIH demo complaint.',
      actionLabel: 'Open Registration Form',
      onAction: () => setCurrentView('new-complaint')
    },
    {
      step: 4,
      title: 'Real-Time Overlap Detection Engine Analysis',
      subtitle: 'Section 17 - Scenario Step 4',
      desc: 'Witness the Overlap Engine compute an 88% confidence score in real time. Point to the 4 explainable components: AICTE ID match (40 pts), Semantic similarity (26 pts), Fee category match (14 pts), and Proximity (8 pts).',
      actionLabel: 'Inspect Overlap Trigger',
      onAction: () => setCurrentView('new-complaint')
    },
    {
      step: 5,
      title: 'Open Cross-Bureau Coordination Workspace',
      subtitle: 'Section 17 - Scenario Step 5',
      desc: 'Review Case C-101 (RB) and Case C-205 (PGRC) side-by-side. Highlight overlapping terms without violating bureau jurisdiction or merging case IDs.',
      actionLabel: 'Open Workspace Side-by-Side',
      onAction: () => setCurrentView('coordination')
    },
    {
      step: 6,
      title: 'Execute Inter-Bureau Coordination Order (CG-008)',
      subtitle: 'Section 17 - Scenario Step 6',
      desc: 'Select "Confirmed Related Cases", designate Regulation Bureau as lead, assign joint inspection directive, and commit the coordination decision.',
      actionLabel: 'Go to Coordination Decision',
      onAction: () => setCurrentView('coordination')
    },
    {
      step: 7,
      title: 'Immutable Audit Trail & Verified Impact',
      subtitle: 'Section 17 - Scenario Step 7',
      desc: 'Review the SHA256 hashed audit log of the coordination order. Observe unresolved alerts decrement to 0 on the dashboard and view updated executive analytics.',
      actionLabel: 'View Audit Trail & Stats',
      onAction: () => setCurrentView('audit')
    }
  ];

  const currentStepData = steps[sihDemoStep - 1];

  return (
    <div className="fixed bottom-5 right-5 z-50 w-full max-w-lg bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-amber-500/50 p-4 transition-all animate-in slide-in-from-bottom-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                SIH Live Demo Walkthrough
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                Step {sihDemoStep} of 7
              </span>
            </div>
            <div className="text-[11px] text-slate-400">{currentStepData.subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={resetToSihBaseline}
            title="Reset to baseline"
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDemoGuideOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-3.5">
        <h4 className="text-sm font-semibold text-slate-100 mb-1 flex items-center gap-2">
          <span>{currentStepData.title}</span>
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {currentStepData.desc}
        </p>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {steps.map((s, idx) => (
          <div
            key={s.step}
            onClick={() => setSihDemoStep(idx + 1)}
            className={`h-1.5 rounded-full cursor-pointer transition-all ${
              idx + 1 === sihDemoStep
                ? 'bg-amber-400'
                : idx + 1 < sihDemoStep
                ? 'bg-emerald-500'
                : 'bg-slate-700'
            }`}
            title={`Step ${idx + 1}: ${s.title}`}
          />
        ))}
      </div>

      {/* Actions & Navigation */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          onClick={currentStepData.onAction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{currentStepData.actionLabel}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            disabled={sihDemoStep === 1}
            onClick={() => setSihDemoStep(Math.max(1, sihDemoStep - 1))}
            className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={sihDemoStep === 7}
            onClick={() => setSihDemoStep(Math.min(7, sihDemoStep + 1))}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium transition"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
