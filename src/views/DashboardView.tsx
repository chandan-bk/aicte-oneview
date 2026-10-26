import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, AlertTriangle, GitMerge, Clock, CheckCircle2, 
  ArrowUpRight, ShieldAlert, FileText, ChevronRight, Sparkles, Scale, Users, 
  UploadCloud, Layers, Download, X, AlertCircle, FileSpreadsheet
} from 'lucide-react';
import { CsvParseResult } from '../services/csvParser';

export const DashboardView: React.FC = () => {
  const { 
    complaints, alerts, coordinationGroups, institutions, 
    setCurrentView, setSelectedComplaint, setSelectedInstitution,
    setActiveAlertForCoordination, setSihDemoStep, importSyntheticCSV,
    importUploadedCsv, getSampleCsvText
  } = useApp();

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [csvResult, setCsvResult] = useState<CsvParseResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pendingAlerts = alerts.filter(a => a.status === 'Pending Review');
  const activeComplaints = complaints.filter(c => c.status !== 'Disposed');
  const overdueComplaints = complaints.filter(c => c.isOverdue);
  const disposedComplaints = complaints.filter(c => c.status === 'Disposed');

  // Workload counts by Bureau
  const rbCount = complaints.filter(c => c.receivingBureau.includes('Regulation')).length;
  const pgrcCount = complaints.filter(c => c.receivingBureau.includes('PGRC')).length;
  const abCount = complaints.filter(c => c.receivingBureau.includes('Approval')).length;
  const roCount = complaints.filter(c => c.receivingBureau.includes('Regional')).length;

  const handleFileProcess = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please select a valid .csv file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        const result = importUploadedCsv(content);
        setCsvResult(result);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(getSampleCsvText());
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', 'AICTE_Samanvay_Sample_Complaints.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLoadSyntheticPreset = () => {
    const count = importSyntheticCSV();
    setCsvResult({
      accepted: new Array(count).fill(null) as any,
      rejected: [],
      totalRows: count
    });
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
            An overlay layer on existing Regulation Bureau (RB) and PGRC systems. Resolves cases to a single institution profile, detects overlaps across 3 levels (Co-activity, Issue, Action), and intercepts conflicting actions through a Pre-Action Check before they happen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs"
          >
            <UploadCloud className="w-4 h-4" />
            <span>CSV Ingestion (Upload / Sample)</span>
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

      {/* CSV Ingestion Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Case Ingestion Overlay (CSV File Ingestion & Validation)
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCsvModalOpen(false);
                  setCsvResult(null);
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Demonstrates the <strong>no re-entry overlay architecture</strong>. Ingest complaint datasets via file upload, validate mandatory fields and AICTE Permanent IDs against the registry, or load the pre-calibrated synthetic demonstration batch.
            </p>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition ${
                dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'
              }`}
            >
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <span className="text-xs font-bold text-slate-700 block">
                Click to browse or drag & drop a .csv file here
              </span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Columns: CaseID, ReferenceNumber, AICTEPermanentID, InstitutionName, Bureau, Category, Description
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileProcess(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </div>

            {/* Ingestion Results Feedback */}
            {csvResult && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Accepted: {csvResult.accepted.length} valid cases ingested</span>
                  </span>
                  {csvResult.rejected.length > 0 && (
                    <span className="text-rose-600 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>Rejected: {csvResult.rejected.length} rows</span>
                    </span>
                  )}
                </div>

                {csvResult.rejected.length > 0 && (
                  <div className="mt-2 max-h-32 overflow-y-auto space-y-1 text-[11px]">
                    {csvResult.rejected.map((rej, idx) => (
                      <div key={idx} className="p-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded">
                        Line {rej.line}: {rej.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Alternative Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 text-xs">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Download Sample CSV Template</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadSyntheticPreset}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition"
                >
                  Load Synthetic Dataset Preset
                </button>
                <button
                  onClick={() => {
                    setIsCsvModalOpen(false);
                    setCsvResult(null);
                  }}
                  className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
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
            Active Inquiries
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
            Sample Configurable SLA
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
            Recorded in Audit Trail
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
