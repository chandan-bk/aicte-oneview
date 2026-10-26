import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BureauType, ComplaintCategory, ComplaintPriority, OverlapAlert } from '../types';
import { evaluate3LevelOverlap } from '../services/overlapEngine';
import { 
  PlusCircle, Sparkles, AlertTriangle, ShieldCheck, 
  CheckCircle2, ArrowRight, GitMerge, FileText, Info, HelpCircle, UploadCloud, Layers 
} from 'lucide-react';

export const NewComplaintView: React.FC = () => {
  const { 
    institutions, complaints, registerComplaint, 
    setCurrentView, setActiveAlertForCoordination,
    loadSihPresetComplaint, setSihDemoStep, importSyntheticCSV 
  } = useApp();

  const [institutionId, setInstitutionId] = useState(institutions[0]?.id || '');
  const [receivingBureau, setReceivingBureau] = useState<BureauType>('Public Grievance Redressal Cell (PGRC)');
  const [category, setCategory] = useState<ComplaintCategory>('Unauthorized Fees / Capitation');
  const [priority, setPriority] = useState<ComplaintPriority>('High');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Hinglish'>('English');
  const [complainantType, setComplainantType] = useState<'Student' | 'Faculty' | 'Parent' | 'Whistleblower / Anonymous' | 'Public Body'>('Student');
  const [description, setDescription] = useState('');
  const [docsCount, setDocsCount] = useState(3);

  // Live real-time overlap analysis state
  const [liveAlert, setLiveAlert] = useState<OverlapAlert | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAlert, setSubmittedAlert] = useState<OverlapAlert | null>(null);

  const selectedInst = institutions.find(i => i.id === institutionId);

  // Evaluate 3-Level overlap dynamically as user types
  useEffect(() => {
    if (description.length > 20 && selectedInst) {
      const candidate = {
        institutionId: selectedInst.id,
        institutionName: selectedInst.name,
        aictePermanentId: selectedInst.aictePermanentId,
        receivingBureau,
        category,
        description,
        language,
        dateOfReceipt: new Date().toISOString().split('T')[0],
        supportingDocsCount: docsCount
      };
      const alert = evaluate3LevelOverlap(candidate, complaints, selectedInst);
      setLiveAlert(alert);
    } else {
      setLiveAlert(null);
    }
  }, [description, institutionId, category, receivingBureau, language, complaints, selectedInst, docsCount]);

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
    setLanguage('English');
    setSihDemoStep(4);
  };

  const handleCsvImport = () => {
    importSyntheticCSV();
    setCurrentView('dashboard');
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
      language,
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
              Overlay Case Ingestion & 3-Level Overlap Scrutiny
            </span>
            <span className="text-xs text-slate-500 font-medium">Multilingual NLP (Hindi / English / Hinglish)</span>
          </div>
          <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
            Case Intake & Pre-Action Overlap Engine
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
            Ingest case records via form or CSV adapter. Samanvay evaluates L1 (Co-Activity), L2 (Related Issue), and L3 (Conflicting Prior Actions) in real time before formal docket creation.
          </p>
        </div>

        {/* 1-Click Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCsvImport}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-300"
          >
            <UploadCloud className="w-4 h-4 text-slate-600" />
            <span>Batch CSV Ingestion</span>
          </button>

          <button
            type="button"
            onClick={handleLoadPreset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all animate-bounce"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Demo Preset (ABC College)</span>
          </button>
        </div>
      </div>

      {/* Success Modal / Banner after registration */}
      {submittedAlert && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-6 shadow-xl animate-in zoom-in-95">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500 text-slate-950 rounded-xl">
              <GitMerge className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full">
                  OVERLAP ALERT FIRED (L1, L2 & L3)
                </span>
                <span className="text-xs text-slate-600">Alert ID: {submittedAlert.id}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Coordination Required: Active Investigation in Regulation Bureau
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                The ingested PGRC grievance for <strong>{submittedAlert.institutionName}</strong> matches an ongoing Regulation Bureau case <strong>({submittedAlert.matchedComplaintId})</strong> with a <strong>{submittedAlert.overallScore}% score</strong>. Both cases retain distinct identities. Pre-Action check warns that Regulation Bureau has already demanded financial ledgers.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveAlertForCoordination(submittedAlert);
                    setCurrentView('coordination');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2"
                >
                  <span>Open Coordination Workspace & Pre-Action Check</span>
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

      {/* Main Grid: Form on Left, 3-Level Overlap Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Registration Form */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Institution Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Institution (AICTE Permanent ID Key) *
              </label>
              <select
                value={institutionId}
                onChange={(e) => setInstitutionId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} [ID: {inst.aictePermanentId}] — {inst.city}, {inst.state}
                  </option>
                ))}
              </select>
              {selectedInst && (
                <div className="mt-1 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Permanent ID verified: <strong className="text-slate-700">{selectedInst.aictePermanentId}</strong></span>
                </div>
              )}
            </div>

            {/* Receiving Bureau & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Receiving Bureau / Cell *
                </label>
                <select
                  value={receivingBureau}
                  onChange={(e) => setReceivingBureau(e.target.value as BureauType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Public Grievance Redressal Cell (PGRC)">Public Grievance Redressal Cell (PGRC)</option>
                  <option value="Regulation Bureau (RB)">Regulation Bureau (RB)</option>
                  <option value="Approval Bureau (AB)">Approval Bureau (AB)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>
            </div>

            {/* Category & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Complainant Type
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
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Grievance Description & Particulars *
                </label>
                <span className="text-[10px] text-slate-400">
                  Evaluated across English, Hindi & Hinglish
                </span>
              </div>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter detailed description in English, Hindi, or Hinglish..."
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
                <span>Ingest Case & Evaluate Overlap</span>
              </button>
            </div>
          </form>
        </div>

        {/* 3-Level Overlap Engine Live Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-700 shadow-md">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <h3 className="text-xs font-bold font-['Outfit'] tracking-wider text-amber-400 uppercase">
                  3-Level Overlap Inspector
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Rules + Multilingual AI</span>
            </div>

            {liveAlert ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Score Header */}
                <div className="p-4 bg-slate-800/80 rounded-xl border border-amber-500/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-300 font-medium">Composite Overlap Probability</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
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

                  <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${liveAlert.overallScore}%` }}
                    />
                  </div>
                </div>

                {/* 3-Level Status Cards */}
                <div className="space-y-2 text-xs">
                  {/* L1 Card */}
                  <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">L1:</span>
                    <div>
                      <span className="font-semibold text-slate-200 block">Co-Activity Triggered (Rules, Always-On)</span>
                      <p className="text-[11px] text-slate-400">Both {receivingBureau} and Regulation Bureau are active on {selectedInst?.name}.</p>
                    </div>
                  </div>

                  {/* L2 Card */}
                  <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700 flex items-start gap-2">
                    <span className="text-blue-400 font-bold">L2:</span>
                    <div>
                      <span className="font-semibold text-slate-200 block">Related Issue (Multilingual Match)</span>
                      <p className="text-[11px] text-slate-400">Concepts align across fee collection terminology: [{liveAlert.sharedKeywords.slice(0, 4).join(', ')}].</p>
                    </div>
                  </div>

                  {/* L3 Card */}
                  {liveAlert.level3ActionConflict?.hasConflict && (
                    <div className="p-2.5 bg-amber-950/40 rounded-lg border border-amber-600/50 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">L3:</span>
                      <div>
                        <span className="font-semibold text-amber-300 block">{liveAlert.level3ActionConflict.conflictType}</span>
                        <p className="text-[11px] text-slate-300">{liveAlert.level3ActionConflict.details}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Point Breakdown</span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <span>Permanent ID: <strong>40.0 pts</strong></span>
                    <span>Semantic Vector: <strong>{liveAlert.breakdown.semanticScore.toFixed(1)} pts</strong></span>
                    <span>Fee Domain: <strong>{liveAlert.breakdown.categoryScore.toFixed(1)} pts</strong></span>
                    <span>Proximity: <strong>{liveAlert.breakdown.proximityScore.toFixed(1)} pts</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-3">
                <HelpCircle className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs leading-relaxed">
                  Start typing the grievance description or click <strong>"Load Demo Preset"</strong> to observe AICTE Samanvay's 3-level overlap engine evaluate L1 Co-Activity, L2 Issue Similarity, and L3 Action Warnings.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
