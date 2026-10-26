import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CoordinationDecision, BureauType } from '../types';
import { 
  GitMerge, ShieldCheck, CheckCircle2, AlertTriangle, 
  ArrowRight, Scale, Clock, FileText, UserCheck, MessageSquare, 
  Sparkles, Layers, CheckSquare, Send
} from 'lucide-react';

export const CoordinationWorkspaceView: React.FC = () => {
  const { 
    alerts, complaints, coordinationGroups, 
    activeAlertForCoordination, setActiveAlertForCoordination,
    recordCoordinationDecision, currentUser, setSihDemoStep, setCurrentView
  } = useApp();

  const [decision, setDecision] = useState<CoordinationDecision>('Confirmed Related Cases');
  const [leadBureau, setLeadBureau] = useState<BureauType>('Regulation Bureau (RB)');
  const [remarks, setRemarks] = useState(
    'Inter-Bureau review confirms underlying nexus between PGRC student fee grievance and ongoing Regulation Bureau inquiry RB/2026/0842. Both cases shall be coordinated under Joint Action Group CG-008 without merging case IDs, maintaining distinct statutory records.'
  );

  const [directives, setDirectives] = useState<string[]>([
    'Incorporate student fee receipts submitted under PGRC into Regulation Bureau formal show cause proceeding.',
    'Direct Western Regional Office (WRO) to include fee audit in scheduled physical surprise inspection.',
    'Single consolidated status report to be submitted to AICTE Member Secretary within 20 days.'
  ]);

  const [newDirective, setNewDirective] = useState('');
  const [isCommitted, setIsCommitted] = useState(false);

  // Get active alert
  const alert = activeAlertForCoordination || alerts.find(a => a.status === 'Pending Review') || alerts[0];

  // Retrieve matching cases
  const case1 = complaints.find(c => c.id === alert?.matchedComplaintId) || complaints[0];
  const case2 = complaints.find(c => c.id === alert?.newComplaintId) || complaints[complaints.length - 1];

  const handleCommitDecision = () => {
    if (!alert) return;
    recordCoordinationDecision(
      alert.id,
      decision,
      remarks,
      directives,
      leadBureau
    );
    setIsCommitted(true);
    setSihDemoStep(7);
  };

  const addDirective = () => {
    if (newDirective.trim()) {
      setDirectives(prev => [...prev, newDirective.trim()]);
      setNewDirective('');
    }
  };

  const removeDirective = (idx: number) => {
    setDirectives(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-xs">
              Section 6: Cross-Bureau Coordination Workspace
            </span>
            <span className="text-xs text-slate-500 font-medium">Preserving Bureau Authority with Zero Data Silos</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
            Inter-Bureau Case Deliberation & Joint Linking Workspace
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Compare overlapping grievances side-by-side. Authorized officers make formal coordination decisions, issue joint directives, and link cases without altering statutory jurisdictions.
          </p>
        </div>

        {/* Active Alert Picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Select Overlap Alert:</span>
          <select
            value={alert?.id}
            onChange={(e) => {
              const found = alerts.find(a => a.id === e.target.value);
              if (found) {
                setActiveAlertForCoordination(found);
                setIsCommitted(false);
              }
            }}
            className="bg-slate-50 border border-slate-300 rounded-lg text-xs py-2 px-3 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {alerts.map(a => (
              <option key={a.id} value={a.id}>
                {a.id} — {a.institutionName} ({a.overallScore}%) [{a.status}]
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Overlap Summary Card */}
      {alert && (
        <div className="bg-gradient-to-r from-slate-900 via-[#13315C] to-slate-900 text-white rounded-2xl p-5 border border-slate-700 shadow-lg flex flex-wrap justify-between items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-full">
                {alert.overallScore}% OVERLAP DETECTED
              </span>
              <span className="text-xs text-slate-300 font-mono">
                AICTE Permanent ID: {alert.aictePermanentId}
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                alert.status === 'Reviewed & Coordinated' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
              }`}>
                Status: {alert.status}
              </span>
            </div>
            <h3 className="text-lg font-bold font-['Outfit'] text-white">
              {alert.institutionName}
            </h3>
            <p className="text-xs text-slate-300">
              Cross-referencing <strong className="text-amber-300">{alert.matchedComplaintId} ({case1?.receivingBureau})</strong> and <strong className="text-amber-300">{alert.newComplaintId} ({case2?.receivingBureau})</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {alert.sharedKeywords.slice(0, 5).map(kw => (
              <span key={kw} className="px-2 py-1 bg-white/10 text-amber-300 rounded text-xs font-mono border border-white/10">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Side-by-Side Comparison Dossier */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Side: Case 1 (Regulation Bureau) */}
        <div className="bg-white rounded-2xl border-2 border-blue-400 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold text-xs rounded">
                CASE A (Existing Lead)
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm">{case1?.id}</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {case1?.receivingBureau}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 text-[10px] block">Reference Number</span>
              <strong className="font-mono text-slate-800">{case1?.referenceNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Assigned Officer</span>
              <strong className="text-slate-800">{case1?.assignedOfficial}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Date Received</span>
              <strong className="text-slate-800">{case1?.dateOfReceipt}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Current Status</span>
              <strong className="text-blue-600">{case1?.status}</strong>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1">
              Grievance Category & Allegation:
            </span>
            <div className="text-xs font-semibold text-blue-900 bg-blue-50/50 p-2 rounded mb-2 border border-blue-100">
              {case1?.category}
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto">
              {case1?.description}
            </div>
          </div>

          <div className="text-xs p-3 bg-slate-100/70 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Last Recorded Action:</span>
            <p className="text-slate-800 font-medium">{case1?.lastActionSummary}</p>
            <span className="text-[10px] text-slate-500 block">Next Action: {case1?.nextActionRequired}</span>
          </div>
        </div>

        {/* Right Side: Case 2 (PGRC) */}
        <div className="bg-white rounded-2xl border-2 border-amber-400 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-xs rounded">
                CASE B (Incoming Matched)
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm">{case2?.id}</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {case2?.receivingBureau}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 text-[10px] block">Reference Number</span>
              <strong className="font-mono text-slate-800">{case2?.referenceNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Assigned Officer</span>
              <strong className="text-slate-800">{case2?.assignedOfficial}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Date Received</span>
              <strong className="text-slate-800">{case2?.dateOfReceipt}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">Current Status</span>
              <strong className="text-amber-600">{case2?.status}</strong>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1">
              Grievance Category & Allegation:
            </span>
            <div className="text-xs font-semibold text-amber-900 bg-amber-50/50 p-2 rounded mb-2 border border-amber-100">
              {case2?.category}
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto">
              {case2?.description}
            </div>
          </div>

          <div className="text-xs p-3 bg-slate-100/70 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Last Recorded Action:</span>
            <p className="text-slate-800 font-medium">{case2?.lastActionSummary}</p>
            <span className="text-[10px] text-slate-500 block">Next Action: {case2?.nextActionRequired}</span>
          </div>
        </div>
      </div>

      {/* Official Coordination Decision Panel (Human-in-the-Loop Authority) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              <span>Official Inter-Bureau Coordination Order</span>
            </h3>
            <p className="text-xs text-slate-500">
              Acting Officer: <strong className="text-slate-700">{currentUser.name}</strong> ({currentUser.role})
            </p>
          </div>
          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full font-semibold">
            Human-in-the-Loop Decision Authority
          </span>
        </div>

        {isCommitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-900 space-y-2 animate-in zoom-in-95">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Coordination Order Successfully Executed & Linked under CG-008</span>
            </div>
            <p className="text-xs leading-relaxed text-emerald-800">
              Both cases ({case1?.id} & {case2?.id}) are now synchronized under joint portfolio <strong>CG-008</strong>. The Regulation Bureau will lead statutory proceedings with PGRC evidentiary support. Neither Bureau has lost jurisdictional authority.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setCurrentView('audit')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow"
              >
                View Tamper-Evident Audit Record
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-white border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Decision Radio Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. Select Administrative Coordination Finding *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { value: 'Confirmed Related Cases', label: 'Confirmed Related Cases (Link & Coordinate)', desc: 'Distinct complaints with common underlying nexus; requires joint action.' },
                  { value: 'Duplicate Records Confirmed', label: 'Duplicate Records Confirmed', desc: 'Identical complainant & grievance; combine evidentiary dossier.' },
                  { value: 'Separate Cases', label: 'Separate Independent Cases', desc: 'Complaints concern same college but distinct unrelated matters.' },
                  { value: 'Institution Identity Mismatch', label: 'Institution Identity Mismatch', desc: 'Different institutions share similar name; split records.' },
                  { value: 'Further Review Required', label: 'Further Review Required', desc: 'Awaiting clarity before inter-bureau linking.' }
                ].map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => setDecision(opt.value as CoordinationDecision)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${
                      decision === opt.value
                        ? 'border-purple-600 bg-purple-50/60 ring-1 ring-purple-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <input
                        type="radio"
                        checked={decision === opt.value}
                        onChange={() => setDecision(opt.value as CoordinationDecision)}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="font-bold text-xs text-slate-900">{opt.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug pl-5">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Bureau Allocation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Designate Lead Inquiring Bureau
                </label>
                <select
                  value={leadBureau}
                  onChange={(e) => setLeadBureau(e.target.value as BureauType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Regulation Bureau (RB)">Regulation Bureau (RB) — Statutory Regulatory Enforcement</option>
                  <option value="Public Grievance Redressal Cell (PGRC)">Public Grievance Redressal Cell (PGRC) — Student Welfare Focus</option>
                  <option value="Approval Bureau (AB)">Approval Bureau (AB) — Intake/EoA Sanctions</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Coordination Portfolio Tag
                </label>
                <input
                  type="text"
                  readOnly
                  value="CG-008: ABC Engineering Fee Irregularities Joint Action"
                  className="w-full bg-slate-100 border border-slate-300 rounded-lg text-xs py-2 px-3 font-mono font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Joint Directives */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. Joint Administrative Directives
              </label>
              <div className="space-y-2 mb-2">
                {directives.map((dir, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>{dir}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDirective(idx)}
                      className="text-slate-400 hover:text-rose-500 text-xs px-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add additional joint directive..."
                  value={newDirective}
                  onChange={(e) => setNewDirective(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDirective(); } }}
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg text-xs py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={addDirective}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Official Remarks */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                4. Official Review Remarks (Recorded to Audit Trail) *
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 leading-relaxed font-sans"
              />
            </div>

            {/* Execute Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleCommitDecision}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
              >
                <GitMerge className="w-4 h-4 text-amber-300" />
                <span>Commit Inter-Bureau Coordination Order</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
