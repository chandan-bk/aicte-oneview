import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, AlertTriangle, GitMerge, Clock, CheckCircle2, 
  ArrowUpRight, ShieldAlert, FileText, ChevronRight, Sparkles, Scale, Users, UploadCloud, Layers
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    complaints, alerts, coordinationGroups, institutions, 
    setCurrentView, setSelectedComplaint, setSelectedInstitution,
    setActiveAlertForCoordination, setSihDemoStep, importSyntheticCSV
  } = useApp();

  const [importNotice, setImportNotice] = useState<string | null>(null);

  const pendingAlerts = alerts.filter(a => a.status === 'Pending Review');
  const activeComplaints = complaints.filter(c => c.status !== 'Disposed');
  const overdueComplaints = complaints.filter(c => c.isOverdue);
  const disposedComplaints = complaints.filter(c => c.status === 'Disposed');

  // Workload counts by Bureau
  const rbCount = complaints.filter(c => c.receivingBureau.includes('Regulation')).length;
  const pgrcCount = complaints.filter(c => c.receivingBureau.includes('PGRC')).length;
  const abCount = complaints.filter(c => c.receivingBureau.includes('Approval')).length;
  const roCount = complaints.filter(c => c.receivingBureau.includes('Regional')).length;

  const handleCsvImport = () => {
    const count = importSyntheticCSV();
    setImportNotice(`Successfully ingested ${count} synthetic complaint records into Samanvay overlay layer without data re-entry!`);
    setTimeout(() => setImportNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome / Context Hero */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#13315C] to-[#134074] rounded-2xl p-6 text-white shadow-xl border border-slate-700/60 flex flex-wrap justify-between items-center gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wide border border-amber-400/30">
              AICTE Samanvay
            </span>
            <span className="text-xs text-slate-300 font-mono">SIH26264: Smart Automation</span>
          </div>
          <h2 className="text-2xl font-bold font-['Outfit'] tracking-tight text-white mb-2">
            One Institution. Connected Cases. Coordinated Action.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            An overlay layer on existing Regulation Bureau (RB) and PGRC systems. Resolves cases to a single institution profile, detects overlaps across 3 levels (Co-activity, Issue, Action), and intercepts conflicting actions before they happen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCsvImport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import CSV / Synthetic Data</span>
          </button>
          <button
            onClick={() => {
              setSihDemoStep(3);
              setCurrentView('new-complaint');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulate Incoming Case</span>
          </button>
        </div>
      </div>

      {/* CSV Ingestion Banner */}
      {importNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{importNotice}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">NO RE-ENTRY REQUIRED</span>
        </div>
      )}

      {/* Overlap Alert Banner with 3-Level Breakdown */}
      {pendingAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-slate-900 rounded-xl p-4 border border-rose-500/40 shadow-lg flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3 max-w-3xl">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mt-0.5">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-rose-300 text-sm">
                  POTENTIAL OVERLAPPING CASES — COORDINATION REQUIRED
                </span>
                <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.2 rounded-full">
                  L1 Co-Activity Detected
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2 py-0.2 rounded-full">
                  L2 Related Issue
                </span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold px-2 py-0.2 rounded-full">
                  L3 Action Alert
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Active in both Regulation Bureau and PGRC for <strong className="text-white">{pendingAlerts[0].institutionName}</strong> (Permanent ID: {pendingAlerts[0].aictePermanentId}). Pre-Action check warns that Regulation Bureau has already requested 3-year fee ledgers.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveAlertForCoordination(pendingAlerts[0]);
              setSihDemoStep(5);
              setCurrentView('coordination');
            }}
            className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition shadow flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Open Coordination Workspace</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Total Ingested</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-slate-800">
            {complaints.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Across RB, PGRC & AB
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Under Process</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-blue-600">
            {activeComplaints.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Active Investigations
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Overdue (&gt;SLA)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-rose-600">
            {overdueComplaints.length}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            Configurable Threshold
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-amber-700 text-xs font-medium mb-1.5">
            <span>Open Overlap Alerts</span>
            <GitMerge className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-amber-600">
            {pendingAlerts.length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            {pendingAlerts.length > 0 ? 'Coordination Required' : 'All Coordinated'}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Coordination Groups</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-purple-600">
            {coordinationGroups.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Linked (Never Merged)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Disposed Cases</span>
            <Scale className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-emerald-600">
            {disposedComplaints.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Full Audit Recorded
          </div>
        </div>
      </div>

      {/* Middle Row: 3-Level Overlap Architecture & Institution 360 Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 3-Level Overlap Method Explainer */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>3-Level Overlap Engine</span>
            </h3>
            <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded">Active</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                <span>Level 1: Co-Activity</span>
                <span className="text-emerald-600 text-[10px]">Rules (Always-On)</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Detects when multiple Bureaus are active on the same AICTE Permanent ID.
              </p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between font-bold text-slate-800 mb-0.5">
                <span>Level 2: Related Issue</span>
                <span className="text-blue-600 text-[10px]">Rules + Multilingual AI</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Matches English, Hindi, and Hinglish allegations with category severity.
              </p>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between font-bold text-amber-900 mb-0.5">
                <span>Level 3: Action Conflict</span>
                <span className="text-amber-700 text-[10px]">Action Vocabulary</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-snug">
                Warns if two Bureaus issue duplicate notices, repeat document requests, or contradict rulings.
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[10px] text-slate-400 border-t border-slate-100 italic">
            *Rules first, AI where rules cannot reach. Officials always decide.
          </div>
        </div>

        {/* High Attention Institution 360 Watchlist */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>Institution 360 Watchlist</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Consolidated profiles indexed by AICTE Permanent ID
                </p>
              </div>
              <button
                onClick={() => {
                  setSihDemoStep(2);
                  setCurrentView('institutions');
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>View All Institutions</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {institutions.slice(0, 4).map(inst => (
                <div
                  key={inst.id}
                  onClick={() => {
                    setSelectedInstitution(inst);
                    setCurrentView('institutions');
                  }}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    inst.aictePermanentId === '1-43598711'
                      ? 'border-amber-400 bg-amber-50/40 hover:bg-amber-50 ring-1 ring-amber-300'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-semibold text-xs text-slate-900 line-clamp-1">
                      {inst.name}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      inst.riskRating === 'High' ? 'bg-rose-100 text-rose-700' :
                      inst.riskRating === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {inst.riskRating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Permanent ID: <strong className="text-slate-700">{inst.aictePermanentId}</strong></span>
                    <span>{inst.city}, {inst.state}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Total: <strong className="text-slate-800">{inst.totalComplaints}</strong></span>
                    {inst.activeOverlaps > 0 ? (
                      <span className="text-amber-700 font-bold flex items-center gap-1">
                        <GitMerge className="w-3 h-3" /> {inst.activeOverlaps} Overlap Alert
                      </span>
                    ) : (
                      <span className="text-slate-500">Pending: {inst.pendingComplaints}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overlay Architecture — No change to existing Bureau tools</span>
            <span className="text-slate-400 font-mono text-[10px]">Registry Status: SYNCHRONIZED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
