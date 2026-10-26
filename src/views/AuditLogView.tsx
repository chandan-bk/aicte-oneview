import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, Lock, Search, 
  CheckCircle2, AlertTriangle, ShieldAlert, RotateCcw, Bug 
} from 'lucide-react';
import { verifyAuditChain, ChainVerificationResult } from '../services/crypto';
import { AuditLogEntry } from '../types';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLogs, setActiveLogs] = useState<AuditLogEntry[]>(auditLogs);
  const [isTampered, setIsTampered] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Keep in sync with app context when not simulated
  React.useEffect(() => {
    if (!isTampered) {
      setActiveLogs(auditLogs);
    }
  }, [auditLogs, isTampered]);

  const filteredLogs = activeLogs.filter(log => {
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
      const result = verifyAuditChain(activeLogs);
      setVerificationResult(result);
      setIsVerifying(false);
    }, 300);
  };

  // Tamper detection simulation to demonstrate cryptographic integrity to judges
  const handleSimulateTamper = () => {
    if (activeLogs.length === 0) return;
    const targetIdx = Math.min(1, activeLogs.length - 1);
    const tampered = activeLogs.map((log, idx) => {
      if (idx === targetIdx) {
        return {
          ...log,
          details: log.details + ' [TAMPERED: Penalty waived by unauthorized backdoor modification]'
        };
      }
      return log;
    });

    setActiveLogs(tampered);
    setIsTampered(true);
    // Automatically re-run verification to immediately showcase tamper detection
    const result = verifyAuditChain(tampered);
    setVerificationResult(result);
  };

  const handleResetTamper = () => {
    setActiveLogs(auditLogs);
    setIsTampered(false);
    const result = verifyAuditChain(auditLogs);
    setVerificationResult(result);
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
            <span className="text-xs text-slate-500 font-medium">Client-Side SHA-256 Hash Chained Records</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
            Administrative Audit & Decision History
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Every case registration, overlap alert, Pre-Action Check advisory, and coordination directive is recorded with user attribution and linked via cryptographic SHA-256 predecessor hash chaining.
          </p>
        </div>

        {/* Cryptographic Verification & Tamper Simulation Controls */}
        <div className="flex items-center gap-2">
          {!isTampered ? (
            <button
              onClick={handleSimulateTamper}
              title="Simulates altering an audit record's payload to test whether the chain verifier detects unauthorized modification"
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-semibold rounded-xl text-xs transition"
            >
              <Bug className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulate Tampering</span>
            </button>
          ) : (
            <button
              onClick={handleResetTamper}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition border border-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Authentic Chain</span>
            </button>
          )}

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
          <div className="flex items-start gap-3 font-medium">
            {verificationResult.isValid ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">
                  {verificationResult.isValid 
                    ? 'Cryptographic Audit Chain: 100% Valid & Linked' 
                    : 'Cryptographic Integrity Alert: Chain Tampering Detected!'}
                </span>
                {isTampered && !verificationResult.isValid && (
                  <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold text-[10px]">
                    Tamper Simulation Active
                  </span>
                )}
              </div>
              <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
                {verificationResult.isValid 
                  ? `Recalculated SHA-256 digests across all ${verificationResult.verifiedCount} recorded events (${verificationResult.linksVerified} predecessor links + genesis block). Zero alterations detected.`
                  : verificationResult.errorDetails}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono bg-white/70 px-2 py-1 rounded border border-slate-300 block">
              FIPS 180-4 / UTF-8
            </span>
          </div>
        </div>
      )}

      {/* Demonstration Mode Explainer Card */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed flex items-start gap-2.5">
        <Lock className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Demonstration Architecture Note:</span> In this client-side prototype, each action is hashed over its canonical payload (`timestamp|actor|action|entityId|details|previousHash`) and linked in a cryptographic chain. In production, these records are stored in an append-only, write-once PostgreSQL table with server-side HMAC signatures to align with DPDP Act 2023 design principles.
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
                <th className="py-3 px-4">Index & Timestamp</th>
                <th className="py-3 px-4">Acting Officer & Role</th>
                <th className="py-3 px-4">Event Classification</th>
                <th className="py-3 px-4">Entity Ref</th>
                <th className="py-3 px-4">Details & Directives</th>
                <th className="py-3 px-4 font-mono">Predecessor Hash</th>
                <th className="py-3 px-4 font-mono">Current SHA-256 Digest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log, idx) => {
                const isTamperedRow = isTampered && idx === Math.min(1, activeLogs.length - 1);
                return (
                  <tr 
                    key={log.id} 
                    className={`transition ${isTamperedRow ? 'bg-rose-50/80 font-medium' : 'hover:bg-slate-50/80'}`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      <span className="text-[10px] text-slate-400 mr-1.5 font-bold">#{idx}</span>
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
                      {isTamperedRow && (
                        <span className="ml-1 px-1.5 py-0.5 rounded bg-rose-200 text-rose-800 text-[10px] font-bold inline-block">
                          Tampered Field
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 block truncate max-w-[120px]" title={log.previousHash}>
                        {log.previousHash || 'GENESIS'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                      <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 block truncate max-w-[120px]" title={log.hash}>
                        {log.hash}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};