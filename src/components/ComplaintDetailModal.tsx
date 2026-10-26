import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ComplaintStatus } from '../types';
import { 
  X, FileText, Building2, User, Clock, CheckCircle2, 
  AlertTriangle, GitMerge, Send, ShieldAlert, ArrowRight, ShieldCheck 
} from 'lucide-react';

export const ComplaintDetailModal: React.FC = () => {
  const { 
    selectedComplaint, setSelectedComplaint, 
    caseActions, updateComplaintStatus, currentUser,
    coordinationGroups, setCurrentView, setActiveAlertForCoordination, alerts
  } = useApp();

  const [newStatus, setNewStatus] = useState<ComplaintStatus>(selectedComplaint?.status || 'Under Process');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!selectedComplaint) return null;

  // Filter actions for this specific complaint
  const complaintActions = caseActions.filter(a => a.complaintId === selectedComplaint.id);

  // Check if linked to a coordination group
  const linkedGroup = coordinationGroups.find(g => g.id === selectedComplaint.coordinationGroupId);

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusRemarks.trim()) return;
    updateComplaintStatus(selectedComplaint.id, newStatus, statusRemarks);
    setStatusRemarks('');
    setIsUpdating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#0B2545] p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="font-mono text-xs font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                CASE ID: {selectedComplaint.id}
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {selectedComplaint.referenceNumber}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedComplaint.receivingBureau.includes('Regulation') ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40' :
                selectedComplaint.receivingBureau.includes('PGRC') ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
              }`}>
                {selectedComplaint.receivingBureau}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                selectedComplaint.priority === 'Critical' ? 'bg-rose-500 text-white' :
                selectedComplaint.priority === 'High' ? 'bg-amber-500 text-slate-950' :
                'bg-slate-700 text-slate-200'
              }`}>
                {selectedComplaint.priority} Priority
              </span>
            </div>

            <h2 className="text-lg font-bold font-['Outfit'] text-white">
              {selectedComplaint.category}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{selectedComplaint.institutionName} (AICTE ID: {selectedComplaint.aictePermanentId})</span>
            </p>
          </div>

          <button
            onClick={() => setSelectedComplaint(null)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Assigned Official</span>
              <strong className="text-slate-800">{selectedComplaint.assignedOfficial}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Date Received</span>
              <strong className="text-slate-800">{selectedComplaint.dateOfReceipt}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Expected Disposal</span>
              <strong className="text-slate-800">{selectedComplaint.expectedDisposalDate}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Current Status</span>
              <span className={`font-bold ${
                selectedComplaint.status === 'Disposed' ? 'text-emerald-600' :
                selectedComplaint.status === 'Escalated' ? 'text-rose-600' :
                'text-blue-600'
              }`}>
                {selectedComplaint.status}
              </span>
            </div>
          </div>

          {/* Coordination Group Banner (if linked) */}
          {linkedGroup && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-purple-900 block flex items-center gap-1.5 mb-0.5">
                  <GitMerge className="w-4 h-4 text-purple-700" />
                  <span>Linked to Coordination Group: {linkedGroup.id}</span>
                </span>
                <p className="text-purple-800 text-[11px]">
                  Decision: <strong>{linkedGroup.decision}</strong> | Lead Bureau: <strong>{linkedGroup.leadBureau}</strong>
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setCurrentView('coordination');
                }}
                className="px-3 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-semibold hover:bg-purple-600 transition"
              >
                Inspect in Workspace
              </button>
            </div>
          )}

          {/* Allegation Text */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Particulars of Grievance
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
              {selectedComplaint.description}
            </div>
          </div>

          {/* Chronological Action History / Timeline (Section 10) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Auditable Action History & Case Lifecycle</span>
              </h4>
              <span className="text-[11px] text-slate-500">
                Preserved chronological chain
              </span>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Default intake action */}
              <div className="flex items-start gap-3 relative pl-6">
                <div className="w-3 h-3 rounded-full bg-blue-500 absolute left-1.5 top-1 ring-4 ring-white" />
                <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between items-center text-slate-500 text-[11px] mb-1">
                    <span className="font-semibold text-slate-700">{selectedComplaint.receivingBureau} Ingestion Desk</span>
                    <span>{selectedComplaint.dateOfReceipt}</span>
                  </div>
                  <p className="text-slate-800">
                    Complaint registered in central registry. Case ID {selectedComplaint.id} assigned.
                  </p>
                </div>
              </div>

              {/* Case-specific recorded actions */}
              {complaintActions.map(act => (
                <div key={act.id} className="flex items-start gap-3 relative pl-6">
                  <div className="w-3 h-3 rounded-full bg-purple-600 absolute left-1.5 top-1 ring-4 ring-white" />
                  <div className="flex-1 bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="flex justify-between items-center text-slate-500 text-[11px] mb-1">
                      <span className="font-semibold text-slate-800">{act.actor} ({act.actorBureau})</span>
                      <span>{new Date(act.timestamp).toLocaleDateString()}</span>
                    </div>
                    <span className="inline-block px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-bold mb-1">
                      {act.actionType}
                    </span>
                    <p className="text-slate-800">{act.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Update Action by Authorized Officer */}
          <div className="p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-800 mb-2">
              Record Administrative Action / Status Transition
            </h4>
            <form onSubmit={handleStatusSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Target Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                    className="w-full bg-white border border-slate-300 rounded-lg text-xs py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Under Process">Under Process</option>
                    <option value="Awaiting Information">Awaiting Information</option>
                    <option value="Transferred">Transferred</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Disposed">Disposed (Closed)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Acting Officer</label>
                  <input
                    type="text"
                    readOnly
                    value={`${currentUser.name} (${currentUser.bureau})`}
                    className="w-full bg-slate-200/80 border border-slate-300 rounded-lg text-xs py-1.5 px-2.5 text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Action Notes / Directive Issued *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Show cause notice dispatched, inspection ordered, or hearing held..."
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg text-xs py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!statusRemarks.trim()}
                  className="px-4 py-2 bg-[#0B2545] hover:bg-[#13315C] text-white rounded-lg font-bold text-xs shadow transition disabled:opacity-40"
                >
                  Commit Status Update
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setSelectedComplaint(null)}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition"
          >
            Close Case File
          </button>
        </div>
      </div>
    </div>
  );
};
