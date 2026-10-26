import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, ChevronRight, ChevronLeft, CheckCircle2, 
  Play, RotateCcw, X, ExternalLink, ShieldAlert, ArrowRight, ShieldCheck, Layers 
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
        <span>Open Samanvay Demo Guide (Step {sihDemoStep}/6)</span>
      </button>
    );
  }

  const steps = [
    {
      step: 1,
      title: 'Dashboard: Cross-Bureau Telemetry & SLA',
      subtitle: 'Samanvay Demo — Step 1 (Overlay View)',
      desc: 'Show consolidated cases across institutions, in English and Hindi. Point out active caseloads across RB, PGRC & AB, and configurable SLA overdue flags.',
      actionLabel: 'Go to Dashboard',
      onAction: () => setCurrentView('dashboard')
    },
    {
      step: 2,
      title: 'Institution 360: ABC Engineering College',
      subtitle: 'Samanvay Demo — Step 2 (Permanent ID Key)',
      desc: 'Inspect ABC Engineering College (Permanent ID: 1-43598711). Point out existing Regulation Bureau inquiry C-101 where 3-year fee ledgers were already requested.',
      actionLabel: 'Open ABC College 360',
      onAction: () => {
        const inst = institutions.find(i => i.aictePermanentId === '1-43598711');
        if (inst) setSelectedInstitution(inst);
        setCurrentView('institutions');
      }
    },
    {
      step: 3,
      title: 'Case Ingestion: PGRC Fee Complaint',
      subtitle: 'Samanvay Demo — Step 3 (No Data Re-entry)',
      desc: 'Ingest student fee grievance into PGRC (or import CSV). Notice different phrasing: students alleging extra charges for lab/exam clearance.',
      actionLabel: 'Open Ingestion Form',
      onAction: () => setCurrentView('new-complaint')
    },
    {
      step: 4,
      title: '3-Level Overlap Engine Fires Alert',
      subtitle: 'Samanvay Demo — Step 4 (L1, L2 & L3 Overlap)',
      desc: 'L1 detects co-activity (RB + PGRC on same college). L2 confirms related issue via multilingual semantic matching. L3 warns of duplicate document demand risk.',
      actionLabel: 'Inspect 3-Level Match',
      onAction: () => setCurrentView('new-complaint')
    },
    {
      step: 5,
      title: 'Pre-Action Check (Headline Innovation)',
      subtitle: 'Samanvay Demo — Step 5 (Preventing Redundancy)',
      desc: 'Officer starts "Request Documents" action -> Pre-Action Check warns: "Regulation Bureau already requested fee ledgers on 18 Oct. Use Shared Document Registry to ask the college once!"',
      actionLabel: 'Test Pre-Action Check',
      onAction: () => setCurrentView('coordination')
    },
    {
      step: 6,
      title: 'Coordination Order & Shared Document Registry',
      subtitle: 'Samanvay Demo — Step 6 (Link Never Merge)',
      desc: 'Link cases under CG-008 without merging case IDs. Add documents to Shared Registry so college is asked once. Review updated dashboard & immutable audit trail.',
      actionLabel: 'Execute Coordination Order',
      onAction: () => setCurrentView('coordination')
    }
  ];

  const currentStepData = steps[sihDemoStep - 1] || steps[0];

  return (
    <div className="fixed bottom-5 right-5 z-50 w-full max-w-lg bg-slate-900/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-amber-500/50 p-4 transition-all animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                AICTE Samanvay — 3-Minute Demo Guide
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                Step {sihDemoStep} of 6
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

      {/* Step Description */}
      <div className="mb-3.5">
        <h4 className="text-sm font-semibold text-slate-100 mb-1">
          {currentStepData.title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {currentStepData.desc}
        </p>
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-6 gap-1.5 mb-3">
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

      {/* Actions */}
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
            disabled={sihDemoStep === 6}
            onClick={() => setSihDemoStep(Math.min(6, sihDemoStep + 1))}
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
