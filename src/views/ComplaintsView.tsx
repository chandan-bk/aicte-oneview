import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint } from '../types';
import { 
  FileText, Search, Filter, AlertTriangle, GitMerge, 
  ArrowUpRight, Clock, ShieldCheck, ChevronRight 
} from 'lucide-react';

export const ComplaintsView: React.FC = () => {
  const { complaints, setSelectedComplaint, setCurrentView, setActiveAlertForCoordination, alerts } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBureau, setSelectedBureau] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.aictePermanentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedOfficial.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBureau = selectedBureau === 'All' || c.receivingBureau.includes(selectedBureau);
    const matchesStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;

    return matchesSearch && matchesBureau && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
              Section 4 & 8: Unified Case Management & Search
            </span>
            <span className="text-xs text-slate-500 font-medium">Cross-Bureau Consolidated Registry</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
            AICTE Centralized Grievance Repository
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Single view of all institution-related complaints across AICTE Bureaus. Complete chronological history and inter-case relationship tracking without merging independent dockets.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('new-complaint')}
          className="px-4 py-2 bg-[#0B2545] hover:bg-[#13315C] text-white rounded-xl text-xs font-bold transition shadow"
        >
          + Register New Complaint
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Case ID (C-101), Ref, Institution, Keywords, Officer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedBureau}
            onChange={(e) => setSelectedBureau(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="All">All Bureaus</option>
            <option value="Regulation">Regulation Bureau (RB)</option>
            <option value="PGRC">Public Grievance (PGRC)</option>
            <option value="Approval">Approval Bureau (AB)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="All">All Statuses</option>
            <option value="Received">Received</option>
            <option value="Under Review">Under Review</option>
            <option value="Under Process">Under Process</option>
            <option value="Awaiting Information">Awaiting Information</option>
            <option value="Escalated">Escalated</option>
            <option value="Disposed">Disposed</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 max-w-[200px]"
          >
            <option value="All">All Categories</option>
            <option value="Unauthorized Fees / Capitation">Unauthorized Fees</option>
            <option value="Faculty Shortage & Qualifications">Faculty Shortage</option>
            <option value="Infrastructure Deficiencies">Infrastructure</option>
            <option value="Non-Refund of Caution Deposit">Deposit Refund</option>
          </select>

          {(searchQuery || selectedBureau !== 'All' || selectedStatus !== 'All' || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedBureau('All');
                setSelectedStatus('All');
                setSelectedCategory('All');
              }}
              className="text-xs text-rose-600 font-semibold px-2 py-1 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case ID & Ref</th>
                <th className="py-3 px-4">Institution Profile</th>
                <th className="py-3 px-4">Bureau & Officer</th>
                <th className="py-3 px-4">Grievance Category</th>
                <th className="py-3 px-4">Status & SLA</th>
                <th className="py-3 px-4">Coordination Nexus</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block font-mono">{c.id}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{c.referenceNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block line-clamp-1">{c.institutionName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">AICTE: {c.aictePermanentId}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-0.5 ${
                      c.receivingBureau.includes('Regulation') ? 'bg-blue-100 text-blue-800' :
                      c.receivingBureau.includes('PGRC') ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.receivingBureau.split(' ')[0]} {c.receivingBureau.includes('PGRC') ? 'PGRC' : 'Bureau'}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">{c.assignedOfficial}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 max-w-[180px] truncate" title={c.category}>
                    <span className="block font-medium">{c.category}</span>
                    <span className="text-[10px] text-slate-400">Received {c.dateOfReceipt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-0.5 ${
                      c.status === 'Disposed' ? 'bg-emerald-100 text-emerald-700' :
                      c.status === 'Escalated' ? 'bg-rose-100 text-rose-700' :
                      c.status === 'Under Process' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {c.status}
                    </span>
                    {c.isOverdue && (
                      <span className="text-[10px] text-rose-600 font-bold block flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Overdue
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {c.coordinationGroupId ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        <GitMerge className="w-3 h-3" />
                        <span>{c.coordinationGroupId} Linked</span>
                      </span>
                    ) : c.overlapAlertId ? (
                      <button
                        onClick={() => {
                          const al = alerts.find(a => a.id === c.overlapAlertId);
                          if (al) setActiveAlertForCoordination(al);
                          setCurrentView('coordination');
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 hover:bg-rose-100 transition animate-pulse"
                      >
                        <AlertTriangle className="w-3 h-3" />
                        <span>Overlap Alert →</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400">Independent</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedComplaint(c)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs transition"
                    >
                      Dossier
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
