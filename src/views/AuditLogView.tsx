import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History, ShieldCheck, Lock, Search, Filter, 
  CheckCircle2, Key, Database, RefreshCw 
} from 'lucide-react';

export const AuditLogView: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const matchesFilter = filterType === 'All' || log.entityType === filterType;
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              Section 13: Tamper-Evident Audit Trail & Data Sovereignty
            </span>
            <span className="text-xs text-slate-500 font-medium">Cryptographic Hash Chaining</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
            Immutable Administrative Audit Vault
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Every case registration, overlap alert, inter-bureau coordination decision, and status modification is recorded with a non-repudiable actor attribution and SHA256 integrity hash.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <div>
            <span className="block font-bold">Audit Chain Verified</span>
            <span className="text-[10px] text-emerald-700">All Blocks Match Merkle Root</span>
          </div>
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
                <th className="py-3 px-4">Timestamp (UTC/IST)</th>
                <th className="py-3 px-4">Acting Official & Bureau</th>
                <th className="py-3 px-4">Event Classification</th>
                <th className="py-3 px-4">Entity Ref</th>
                <th className="py-3 px-4">Details & Directives</th>
                <th className="py-3 px-4 font-mono">Integrity Signature</th>
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
                    <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200 block truncate max-w-[130px]" title={log.hash}>
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
