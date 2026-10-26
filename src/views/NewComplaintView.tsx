import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BureauType, ComplaintCategory, ComplaintPriority, OverlapAlert } from '../types';
import { evaluateComplaintOverlap } from '../services/overlapEngine';
import { 
  PlusCircle, Sparkles, AlertTriangle, ShieldCheck, 
  CheckCircle2, ArrowRight, GitMerge, FileText, Info, HelpCircle 
} from 'lucide-react';

export const NewComplaintView: React.FC = () => {
  const { 
    institutions, complaints, registerComplaint, 
    setCurrentView, setActiveAlertForCoordination,
    loadSihPresetComplaint, setSihDemoStep 
  } = useApp();

  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || '');
  const [receivingBureau, setReceivingBureau] = useState<BureauType>('Public Grievance Redressal Cell (PGRC)');
  const [category, setCategory] = useState<ComplaintCategory>('Unauthorized Fees / Capitation');
  const [priority, setPriority] = useState<ComplaintPriority>('High');
  const [complainantType, setComplainantType] = useState<'Student' | 'Faculty' | 'Parent' | 'Whistleblower / Anonymous' | 'Public Body'>('Student');
  const [description, setDescription] = useState('');
  const [docsCount, setDocsCount] = useState(3);

  // Live real-time overlap analysis state
  const [liveAlert, setLiveAlert] = useState<OverlapAlert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAlert, setSubmittedAlert] = useState<OverlapAlert | null>(null);

  const selectedInst = institutions.find(i => i.id === institutionId);

  // Evaluate overlap dynamically as user types
  useEffect(() => {
    if (description.length > 20 && selectedInst) {
      const candidate = {
        institutionId: selectedInst.id,
        institutionName: selectedInst.name,
        aictePermanentId: selectedInst.aictePermanentId,
        receivingBureau,
        category,
        description,
        dateOfReceipt: new Date().toISOString().split('T')[0],
        supportingDocsCount: docsCount
      };
      const alert = evaluateComplaintOverlap(candidate, complaints, selectedInst);
      setLiveAlert(alert);
    } else {
      setLiveAlert(null);
    }
  }, [description, institutionId, category, receivingBureau, complaints, selectedInst, docsCount]);

  // Load SIH Preset
  const handleLoadPreset = () => {
    const preset = loadSihPresetComplaint();
    if (preset.institutionId) setInstitutionId(preset.institutionId);
    if (preset.receivingBureau) setReceivingBureau(preset.receivingBureau);
    if (preset.category) setCategory(preset.category);
    if (preset.priority) setPriority(preset.priority);
    if (preset.complainantType) setComplainantType(preset.complainantType);
    if (preset.description) setDescription(preset.description);
    if (preset.supportingDocsCount) setDocsCount(preset.supportingDocsCount);
    setSihDemoStep(4);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    const result = registerComplaint({
      institutionId,
      receivingBureau,
      category,
      priority,
      complainantType,
      description,
      supportingDocsCount: docsCount
    });

    setIsSubmitting(false);

    if (result.alert) {
      setSubmittedAlert(result.alert);
      setActiveAlertForCoordination(result.alert);
      setSihDemoStep(5);
    } else {
      setCurrentView('complaints');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              Section 4 & 5: Unified Registration & Overlap Scrutiny
            </span>
            <span className="text-xs text-slate-500 font-medium">Real-Time Natural Language Inference</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
            Intake Grievance & Cross-Bureau Overlap Detection
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Register an incoming complaint. AICTE OneView's overlap engine checks for institutional duplicates, semantic allegations, and ongoing cases across other Bureaus before case creation.
          </p>
        </div>

        {/* 1-Click SIH Preset Loader */}
        <button
          type="button"
          onClick={handleLoadPreset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all animate-bounce"
        >
          <Sparkles className="w-4 h-4" />
          <span>Load SIH Demo Scenario Preset (ABC College)</span>
        </button>
      </div>

      {/* Success Modal / Banner after registration */}
      {submittedAlert && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 shadow-xl animate-in zoom-in-95">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 text-slate-950 rounded-xl">
              <GitMerge className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full">
                  OVERLAP DETECTED & ALERT LOGGED
                </span>
                <span className="text-xs text-slate-600">Alert ID: {submittedAlert.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Inter-Bureau Coordination Required with Regulation Bureau
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                The registered PGRC grievance for <strong>{submittedAlert.institutionName}</strong> matches an ongoing Regulation Bureau case <strong>({submittedAlert.matchedComplaintId})</strong> with a <strong>{submittedAlert.overallScore}% overlap score</strong>. Individual Bureau jurisdiction is preserved; authorized officials must now review and link the cases in the Coordination Workspace.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveAlertForCoordination(submittedAlert);
                    setCurrentView('coordination');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2"
                >
                  <span>Open Coordination Workspace (Side-by-Side)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSubmittedAlert(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  Dismiss Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Form on Left, Real-Time Engine Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Registration Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Institution Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Educational Institution (Centralized Registry) *
              </label>
              <select
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} [Permanent ID: {inst.aictePermanentId}] — {inst.city}, {inst.state}
                  </option>
                ))}
              </select>
              {selectedInst && (
                <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified AICTE Permanent ID: <strong className="text-slate-700">{selectedInst.aictePermanentId}</strong></span>
                </div>
              )}
            </div>

            {/* Receiving Bureau & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Receiving AICTE Bureau / Cell *
                </label>
                <select
                  value={receivingBureau}
                  onChange={(e) => setReceivingBureau(e.target.value as BureauType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Public Grievance Redressal Cell (PGRC)">Public Grievance Redressal Cell (PGRC)</option>
                  <option value="Regulation Bureau (RB)">Regulation Bureau (RB)</option>
                  <option value="Approval Bureau (AB)">Approval Bureau (AB)</option>
                  <option value="Policy & Academic Bureau (PAB)">Policy & Academic Bureau (PAB)</option>
                  <option value="Regional Office (RO)">Regional Office (RO)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Grievance Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Unauthorized Fees / Capitation">Unauthorized Fees / Capitation</option>
                  <option value="Faculty Shortage & Qualifications">Faculty Shortage & Qualifications</option>
                  <option value="Infrastructure Deficiencies">Infrastructure Deficiencies</option>
                  <option value="Non-Refund of Caution Deposit">Non-Refund of Caution Deposit</option>
                  <option value="Admissions Violation">Admissions Violation</option>
                  <option value="Ragging / Harassment">Ragging / Harassment</option>
                  <option value="Misleading Advertisement">Misleading Advertisement</option>
                </select>
              </div>
            </div>

            {/* Complainant Type & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Complainant Identity
                </label>
                <select
                  value={complainantType}
                  onChange={(e) => setComplainantType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Student">Student</option>
                  <option value="Parent">Parent</option>
                  <option value="Faculty">Faculty Member</option>
                  <option value="Whistleblower / Anonymous">Whistleblower / Anonymous</option>
                  <option value="Public Body">Public Body / NGO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Urgency Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as ComplaintPriority)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attached Proofs / Receipts
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={docsCount}
                  onChange={(e) => setDocsCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Allegation Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Grievance Description & Particulars of Allegation *
                </label>
                <span className="text-[10px] text-slate-400">
                  Analyzed by Semantic Text Similarity Engine
                </span>
              </div>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter detailed description of the grievance, alleged fee demands, unapproved heads, or non-compliance..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Action will be permanently recorded in immutable audit log.
              </span>
              <button
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs shadow-md transition disabled:opacity-40 flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Register Complaint & Scrutinize Overlap</span>
              </button>
            </div>
          </form>
        </div>

        {/* Real-Time Overlap Detection Engine Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <h3 className="text-xs font-bold font-['Outfit'] tracking-wider text-amber-400 uppercase">
                  AICTE Overlap Engine — Live Inspector
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">v3.2 Embeddings</span>
            </div>

            {liveAlert ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Score Dial */}
                <div className="p-4 bg-slate-800/80 rounded-xl border border-amber-500/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-300 font-medium">Composite Overlap Probability</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      liveAlert.overallScore >= 80 ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      liveAlert.overallScore >= 55 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                      'bg-slate-700 text-slate-300'
                    }`}>
                      {liveAlert.classification}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-3xl font-extrabold font-['Outfit'] text-amber-400">
                      {liveAlert.overallScore}%
                    </span>
                    <span className="text-xs text-slate-400">
                      Weighted multi-signal match
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        liveAlert.overallScore >= 80 ? 'bg-rose-500' :
                        liveAlert.overallScore >= 55 ? 'bg-amber-400' : 'bg-blue-400'
                      }`}
                      style={{ width: `${liveAlert.overallScore}%` }}
                    />
                  </div>
                </div>

                {/* 4-Component Explainability Breakdown */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Explainable Scoring Weights</span>
                    <span className="text-[10px] text-slate-400 font-normal">Section 5 Calibration</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    {/* Institution Identity (Max 40) */}
                    <div className="p-2.5 bg-slate-800/60 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-slate-200 block font-medium">1. Institution Identity</span>
                        <span className="text-[10px] text-slate-400">AICTE Permanent ID Match</span>
                      </div>
                      <span className="font-mono font-bold text-emerald-400 text-xs">
                        {liveAlert.breakdown.institutionScore.toFixed(1)} / 40.0 pts
                      </span>
                    </div>

                    {/* Semantic Description (Max 30) */}
                    <div className="p-2.5 bg-slate-800/60 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-slate-200 block font-medium">2. Description Semantics</span>
                        <span className="text-[10px] text-slate-400">NLP Cosine & Synonym Vectors</span>
                      </div>
                      <span className="font-mono font-bold text-amber-400 text-xs">
                        {liveAlert.breakdown.semanticScore.toFixed(1)} / 30.0 pts
                      </span>
                    </div>

                    {/* Category Match (Max 15) */}
                    <div className="p-2.5 bg-slate-800/60 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-slate-200 block font-medium">3. Grievance Domain</span>
                        <span className="text-[10px] text-slate-400">Prescribed Fee Violation</span>
                      </div>
                      <span className="font-mono font-bold text-blue-400 text-xs">
                        {liveAlert.breakdown.categoryScore.toFixed(1)} / 15.0 pts
                      </span>
                    </div>

                    {/* Proximity & Evidence (Max 15) */}
                    <div className="p-2.5 bg-slate-800/60 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="text-slate-200 block font-medium">4. Date Proximity</span>
                        <span className="text-[10px] text-slate-400">Within Active Investigation Cycle</span>
                      </div>
                      <span className="font-mono font-bold text-purple-400 text-xs">
                        {(liveAlert.breakdown.proximityScore + liveAlert.breakdown.evidenceScore).toFixed(1)} / 15.0 pts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Overlapping Entity Reference */}
                <div className="p-3 bg-amber-950/40 border border-amber-600/40 rounded-xl text-xs">
                  <span className="text-amber-400 font-bold block mb-1">
                    Matching Existing Case: {liveAlert.matchedComplaintId} (Regulation Bureau)
                  </span>
                  <div className="text-[11px] text-slate-300 space-y-1">
                    {liveAlert.explanation.map((exp, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{exp}</span>
                      </div>
                    ))}
                  </div>
                  {liveAlert.sharedKeywords.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-amber-700/40 flex flex-wrap gap-1">
                      <span className="text-[10px] text-slate-400 mr-1">Shared Concepts:</span>
                      {liveAlert.sharedKeywords.map(kw => (
                        <span key={kw} className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[9px] font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-3">
                <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs leading-relaxed">
                  Start typing the grievance description or click <strong>"Load SIH Demo Scenario Preset"</strong> above to see AICTE OneView's intelligent overlap detection evaluate cases in real time.
                </p>
                <div className="text-[11px] text-slate-500 bg-slate-800/50 p-2.5 rounded-lg border border-slate-700">
                  Target SIH Scenario: <strong>ABC Engineering College</strong> has an active Regulation Bureau case on fee extortion.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
