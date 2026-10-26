import React from 'react';
import { useApp } from '../context/AppContext';
import { Institution } from '../types';
import { 
  X, Building2, MapPin, Mail, Phone, Calendar, 
  Award, AlertTriangle, ShieldCheck, FileText, GitMerge, ExternalLink 
} from 'lucide-react';

export const InstitutionDetailModal: React.FC = () => {
  const { 
    selectedInstitution, setSelectedInstitution, 
    complaints, setSelectedComplaint, setCurrentView,
    setSihDemoStep
  } = useApp();

  if (!selectedInstitution) return null;

  const instComplaints = complaints.filter(c => 
    c.institutionId === selectedInstitution.id || 
    c.aictePermanentId === selectedInstitution.aictePermanentId
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-[#0B2545] p-6 text-white flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-400">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-400 text-slate-950 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                  AICTE PERMANENT ID: {selectedInstitution.aictePermanentId}
                </span>
                <span className="text-xs bg-white/10 text-slate-200 px-2 py-0.5 rounded-full border border-white/20">
                  {selectedInstitution.category}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  selectedInstitution.riskRating === 'High' ? 'bg-rose-500 text-white' :
                  selectedInstitution.riskRating === 'Moderate' ? 'bg-amber-500 text-slate-950' :
                  'bg-emerald-500 text-white'
                }`}>
                  {selectedInstitution.riskRating} Risk
                </span>
              </div>
              <h2 className="text-xl font-bold font-['Outfit'] text-white">
                {selectedInstitution.name}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedInstitution.address}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedInstitution(null)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Institution Reference Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Affiliating University</span>
              <strong className="text-slate-800 font-semibold">{selectedInstitution.affiliatingUniversity}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Head of Institution</span>
              <strong className="text-slate-800 font-semibold">{selectedInstitution.principalName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Official Email & Phone</span>
              <span className="text-slate-800 block truncate">{selectedInstitution.contactEmail}</span>
              <span className="text-slate-600 font-mono text-[10px]">{selectedInstitution.contactPhone}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Regional Jurisdiction</span>
              <strong className="text-slate-800 font-semibold">{selectedInstitution.region} Regional Office</strong>
              <span className="text-slate-500 block text-[10px]">Est. Year {selectedInstitution.establishedYear}</span>
            </div>
          </div>

          {/* Consolidated Complaint Stats Summary */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Consolidated Cross-Bureau Grievance Portfolio</span>
              </h3>
              <span className="text-xs text-slate-500">
                Single Source of Truth across all AICTE cells
              </span>
            </div>

            {instComplaints.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs">
                No complaint records on file for this institution.
              </div>
            ) : (
              <div className="space-y-3">
                {instComplaints.map(complaint => (
                  <div
                    key={complaint.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white shadow-sm transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 font-mono text-xs">
                          {complaint.id}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {complaint.referenceNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          complaint.receivingBureau.includes('Regulation') ? 'bg-blue-100 text-blue-800' :
                          complaint.receivingBureau.includes('PGRC') ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {complaint.receivingBureau}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          complaint.status === 'Disposed' ? 'bg-emerald-100 text-emerald-700' :
                          complaint.status === 'Escalated' ? 'bg-rose-100 text-rose-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {complaint.status}
                        </span>
                        {complaint.coordinationGroupId && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 flex items-center gap-1">
                            <GitMerge className="w-3 h-3" />
                            {complaint.coordinationGroupId}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-slate-800 mb-1">
                      Category: <span className="text-amber-800">{complaint.category}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {complaint.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <div>
                        Assigned Official: <strong className="text-slate-700">{complaint.assignedOfficial}</strong>
                      </div>
                      <div>
                        Last Action: <span className="text-slate-700 font-medium">{complaint.lastActionSummary}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action from Dossier */}
          {selectedInstitution.aictePermanentId === '1-43598711' && (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-amber-900 block">
                  SIH Demo Scenario Context
                </span>
                <span className="text-xs text-amber-800">
                  ABC Engineering College currently has case C-101 active in Regulation Bureau.
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedInstitution(null);
                  setSihDemoStep(3);
                  setCurrentView('new-complaint');
                }}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition shadow"
              >
                Simulate Incoming PGRC Case
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>AICTE Unified National Registry Engine</span>
          <button
            onClick={() => setSelectedInstitution(null)}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
