import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, ShieldCheck, Lock, Search, Filter, 
  CheckCircle2, Key, Database, RefreshCw, AlertCircle, ShieldAlert 
} from 'lucide-react';
import { verifyAuditChain } from '../services/crypto';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; verifiedCount: number; brokenIndex?: number } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = filterType === 'All' || log.entityType === filterType;
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const result = verifyAuditChain(auditLogs);
      setVerificationResult(result);
      setIsVerifying(false);
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-xs">
              Audit Trail — Demonstration Mode
            </span>
            <span className="text-xs text-slate-500 font-medium">SHA-256 Hash Chained Records</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
            Administrative Audit & Decision History
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Every case registration, overlap alert, Pre-Action Check advisory, and coordination directive is recorded with user attribution and an in-memory SHA-256 cryptographic chain.
          </p>
        </div>

        {/* Real Cryptographic Verification Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunVerification}
            disabled={isVerifying}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Hash Chain Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Verification Feedback Banner */}
      {verificationResult && (
        <div className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-in fade-in ${
          verificationResult.isValid 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center gap-2 font-medium">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div>
              <span className="font-bold block">
                {verificationResult.isValid ? 'Cryptographic Audit Chain: Valid' : 'Audit Chain Compromised!'}
              </span>
              <span className="text-[11px] opacity-90">
                {verificationResult.isValid 
                  ? `Recalculated SHA-256 digests across all ${verificationResult.verifiedCount} recorded events. All block hashes match.`
                  : `Discrepancy detected at index ${verificationResult.brokenIndex}.`}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-white/60 px-2 py-1 rounded border border-emerald-200">
            SHA-256 / SHA-2
          </span>
        </div>
      )}

      {/* Demonstration Mode Explainer Card */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Demonstration Architecture Note:</span> In this prototype, each action is hashed client-side over its payload (timestamp, actor, action, entityId, previousHash). In production, these records will be stored in an append-only, write-once PostgreSQL table with server-side HMAC signatures to align with DPDP Act 2023 guidelines.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search audit trail by Officer, Action, Case ID, or Details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="All">All Event Types</option>
            <option value="CoordinationGroup">Coordination Orders</option>
            <option value="OverlapAlert">Overlap Alerts</option>
            <option value="PreActionCheck">Pre-Action Advisories</option>
            <option value="Complaint">Complaint Actions</option>
            <option value="Security">Security & Audit</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Timestamp (ISO)</th>
                <th className="py-3 px-4">Acting Officer & Role</th>
                <th className="py-3 px-4">Event Classification</th>
                <th className="py-3 px-4">Entity Ref</th>
                <th className="py-3 px-4">Details & Directives</th>
                <th className="py-3 px-4 font-mono">Computed SHA-256 Digest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-800 block">{log.actor}</span>
                    <span className="text-[10px] text-slate-400">{log.actorRole}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.entityType === 'CoordinationGroup' ? 'bg-purple-100 text-purple-800' :
                      log.entityType === 'OverlapAlert' ? 'bg-amber-100 text-amber-800' :
                      log.entityType === 'PreActionCheck' ? 'bg-rose-100 text-rose-800' :
                      log.entityType === 'Complaint' ? 'bg-blue-100 text-blue-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                    {log.entityId}
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-[280px] leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                    <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 block truncate max-w-[150px]" title={log.hash}>
                      {log.hash}
                    </span>
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
