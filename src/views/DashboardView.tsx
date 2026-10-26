import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, AlertTriangle, GitMerge, Clock, CheckCircle2, 
  ArrowUpRight, ShieldAlert, FileText, ChevronRight, Sparkles, Scale, Users
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    complaints, alerts, coordinationGroups, institutions, 
    setCurrentView, setSelectedComplaint, setSelectedInstitution,
    setActiveAlertForCoordination, setSihDemoStep
  } = useApp();

  const pendingAlerts = alerts.filter(a => a.status === 'Pending Review');
  const activeComplaints = complaints.filter(c => c.status !== 'Disposed');
  const overdueComplaints = complaints.filter(c => c.isOverdue);
  const disposedComplaints = complaints.filter(c => c.status === 'Disposed');

  // Workload counts by Bureau
  const rbCount = complaints.filter(c => c.receivingBureau.includes('Regulation')).length;
  const pgrcCount = complaints.filter(c => c.receivingBureau.includes('PGRC')).length;
  const abCount = complaints.filter(c => c.receivingBureau.includes('Approval')).length;
  const roCount = complaints.filter(c => c.receivingBureau.includes('Regional')).length;

  return (
    <div className="space-y-6">
      {/* Top Welcome / Context Hero */}
      <div className="bg-gradient-to-r from-[#0B2545] via-[#13315C] to-[#134074] rounded-2xl p-6 text-white shadow-xl border border-slate-700/60 flex flex-wrap justify-between items-center gap-4">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wide border border-amber-400/30">
              Cross-Bureau Oversight Engine
            </span>
            <span className="text-xs text-slate-300">Live AICTE Institutional Grievance Stream</span>
          </div>
          <h2 className="text-2xl font-bold font-['Outfit'] tracking-tight text-white mb-2">
            Centralized Institution Complaint & Overlap Coordination Platform
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Eliminating operational silos across Regulation Bureau (RB), Public Grievance Redressal Cell (PGRC), and Approval Bureau (AB). Ensuring one consolidated institution history and AI-assisted cross-case overlap detection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setSihDemoStep(3);
              setCurrentView('new-complaint');
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg transition-all text-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simulate Incoming Complaint</span>
          </button>
          <button
            onClick={() => setCurrentView('coordination')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all text-xs"
          >
            <GitMerge className="w-4 h-4 text-amber-400" />
            <span>Coordination Workspace</span>
          </button>
        </div>
      </div>

      {/* Overlap Alert Urgency Banner (If pending alerts exist) */}
      {pendingAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-slate-900 rounded-xl p-4 border border-rose-500/40 shadow-lg flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3 max-w-3xl">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 mt-0.5">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-rose-300 text-sm">
                  POTENTIAL OVERLAPPING CASES DETECTED — COORDINATION REQUIRED
                </span>
                <span className="text-[11px] bg-rose-500 text-white font-bold px-2 py-0.2 rounded-full">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Overlap detected on <strong className="text-white">{pendingAlerts[0].institutionName}</strong> (AICTE Permanent ID: {pendingAlerts[0].aictePermanentId}). New PGRC allegation matches active Regulation Bureau case <strong className="text-amber-300">{pendingAlerts[0].matchedComplaintId}</strong> with an <strong className="text-rose-300">{pendingAlerts[0].overallScore}% semantic & category match</strong>.
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
            <span>Resolve Overlap Alert</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Ingested */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Total Complaints</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-slate-800">
            {complaints.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Across 3 Major Bureaus
          </div>
        </div>

        {/* Active Under Process */}
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

        {/* Overdue / SLA Breached */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Overdue (&gt;30d)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-rose-600">
            {overdueComplaints.length}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            Escalation Triggered
          </div>
        </div>

        {/* Active Overlaps */}
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-amber-700 text-xs font-medium mb-1.5">
            <span>Unresolved Overlaps</span>
            <GitMerge className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-amber-600">
            {pendingAlerts.length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">
            {pendingAlerts.length > 0 ? 'Requires Joint Action' : 'All Clear'}
          </div>
        </div>

        {/* Coordinated Groups */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Coordination Groups</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-purple-600">
            {coordinationGroups.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Linked Joint Portfolios
          </div>
        </div>

        {/* Avg Disposal Time */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1.5">
            <span>Avg Disposal TAT</span>
            <Scale className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-['Outfit'] text-emerald-600">
            22.4 d
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            18% Faster Disposal
          </div>
        </div>
      </div>

      {/* Middle Row: Bureau Workload & Institution Quick Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bureau Workload Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-600" />
              <span>Inter-Bureau Caseload Allocation</span>
            </h3>
            <span className="text-xs text-slate-500">Live Count</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700">Regulation Bureau (RB)</span>
                <span className="font-bold text-slate-900">{rbCount} cases</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(rbCount / complaints.length) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700">Public Grievance Redressal (PGRC)</span>
                <span className="font-bold text-slate-900">{pgrcCount} cases</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(pgrcCount / complaints.length) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700">Approval Bureau (AB)</span>
                <span className="font-bold text-slate-900">{abCount} cases</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(abCount / complaints.length) * 100}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span className="text-slate-700">Regional Offices (RO)</span>
                <span className="font-bold text-slate-900">{roCount} cases</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.max(10, (roCount / complaints.length) * 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Silos connected via OneView central bus</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
            </span>
          </div>
        </div>

        {/* High Attention Institutions Dossier Preview */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-600" />
                  <span>Consolidated Institution Watchlist</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Institutions with active multi-bureau grievance histories
                </p>
              </div>
              <button
                onClick={() => {
                  setSihDemoStep(2);
                  setCurrentView('institutions');
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>View Full Registry</span>
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
                      {inst.riskRating} Risk
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>ID: <strong className="text-slate-700">{inst.aictePermanentId}</strong></span>
                    <span>{inst.city}, {inst.state}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">Total Cases: <strong className="text-slate-800">{inst.totalComplaints}</strong></span>
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
            <span>Permanent ID takes priority over name variants</span>
            <span className="text-slate-400 font-mono text-[10px]">Registry Hash: 9942-VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Recent Complaints Stream Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              Recent Case Feed & Cross-Bureau Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Live unified stream with automated duplicate detection
            </p>
          </div>
          <button
            onClick={() => setCurrentView('complaints')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            <span>All Case Records</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case ID & Ref</th>
                <th className="py-3 px-4">Institution</th>
                <th className="py-3 px-4">Bureau</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Coordination Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {complaints.slice(0, 5).map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{c.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.referenceNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 block">{c.institutionName}</span>
                    <span className="text-[10px] text-slate-500">AICTE ID: {c.aictePermanentId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      c.receivingBureau.includes('Regulation') ? 'bg-blue-100 text-blue-800' :
                      c.receivingBureau.includes('PGRC') ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.receivingBureau.split(' ')[0]} {c.receivingBureau.includes('PGRC') ? 'PGRC' : 'Bureau'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate" title={c.category}>
                    {c.category}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      c.status === 'Disposed' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'Escalated' ? 'bg-rose-100 text-rose-700' :
                      c.status === 'Under Process' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {c.coordinationGroupId ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        <GitMerge className="w-3 h-3" />
                        <span>{c.coordinationGroupId} Linked</span>
                      </span>
                    ) : c.overlapAlertId ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Overlap Alert Pending</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Independent Case</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedComplaint(c);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
