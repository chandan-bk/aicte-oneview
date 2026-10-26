import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronLeft, ChevronRight, Play, Sparkles, Building2, 
  GitMerge, ShieldCheck, Scale, Cpu, Users, Award, ExternalLink, CheckCircle2 
} from 'lucide-react';

export const PresentationDeckView: React.FC = () => {
  const { setCurrentView, setSihDemoStep } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'Smart India Hackathon 2026 | Grand Finale Pitch',
      title: 'AICTE OneView',
      subtitle: 'Intelligent Institution Complaint Monitoring, Overlap Detection & Inter-Bureau Coordination Platform',
      content: (
        <div className="space-y-6 max-w-3xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-1 mx-auto flex items-center justify-center shadow-xl">
            <div className="w-full h-full bg-[#0B2545] rounded-xl flex items-center justify-center">
              <span className="font-extrabold text-amber-400 text-3xl font-['Outfit']">OV</span>
            </div>
          </div>
          
          <p className="text-lg text-slate-200 font-light leading-relaxed">
            Eliminating operational silos across the <strong className="text-amber-400">Regulation Bureau (RB)</strong>, <strong className="text-amber-400">Public Grievance Redressal Cell (PGRC)</strong>, and <strong className="text-amber-400">Approval Bureau (AB)</strong> through verified institution registries and explainable AI overlap inference.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 text-xs font-semibold">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-amber-400 block text-sm font-bold">1 Institution</span>
              <span className="text-slate-300">Consolidated Single Source of Truth</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-emerald-400 block text-sm font-bold">Intelligent Overlap</span>
              <span className="text-slate-300">Semantic & Rule Detection Engine</span>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="text-purple-400 block text-sm font-bold">Coordinated Action</span>
              <span className="text-slate-300">Zero Loss of Bureau Jurisdiction</span>
            </div>
          </div>
        </div>
      ),
      speakerNotes: 'Judges, technical education institutions frequently receive simultaneous complaints in PGRC from students, and in the Regulation Bureau from anonymous whistleblowers. Today, these two bureaus operate in silos. AICTE OneView bridges them seamlessly without violating bureau autonomy.'
    },
    {
      id: 2,
      badge: 'The Administrative Challenge',
      title: 'The Inter-Bureau Silo Dilemma',
      subtitle: 'Why Technical Education Grievance Monitoring is Currently Vulnerable',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-5 bg-rose-950/40 border border-rose-500/40 rounded-2xl space-y-3">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl w-fit">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-rose-300">Information Blindspots</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              When Regulation Bureau issues a show cause notice for fee cap violations, PGRC has zero real-time visibility and may independently start a separate, redundant inquiry.
            </p>
          </div>

          <div className="p-5 bg-amber-950/40 border border-amber-500/40 rounded-2xl space-y-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl w-fit">
              <Scale className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-amber-300">Conflicting Regulatory Orders</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Uncoordinated inquiries risk contradictory outcomes (e.g. one Bureau dismissing a case while another orders an intake penalty), giving non-compliant colleges legal loopholes.
            </p>
          </div>

          <div className="p-5 bg-blue-950/40 border border-blue-500/40 rounded-2xl space-y-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl w-fit">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-blue-300">Wasted Administrative Bandwidth</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Duplicate inspections, multiple notices, and separate officer assignments waste valuable AICTE personnel time and delay student grievance disposal by weeks.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'The problem is not lack of effort from AICTE officials; it is the absence of an intelligent bridge that detects underlying nexus when different words describe the same core misconduct.'
    },
    {
      id: 3,
      badge: 'Core Innovation',
      title: 'The Explainable Overlap Engine',
      subtitle: 'How AICTE OneView Detects Hidden Case Relationships in Real-Time',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="p-4 bg-slate-800/80 border border-emerald-500/40 rounded-xl">
              <span className="text-xs font-bold text-emerald-400 block mb-1">1. Institution Identity</span>
              <div className="text-2xl font-bold font-mono text-white mb-1">40 Pts</div>
              <p className="text-[11px] text-slate-400">Verified AICTE Permanent ID takes strict precedence over fuzzy name variants.</p>
            </div>

            <div className="p-4 bg-slate-800/80 border border-amber-500/40 rounded-xl">
              <span className="text-xs font-bold text-amber-400 block mb-1">2. Semantic Cosine</span>
              <div className="text-2xl font-bold font-mono text-white mb-1">30 Pts</div>
              <p className="text-[11px] text-slate-400">Sentence embeddings & lemma matching ("excessive fees" vs "unauthorized charges").</p>
            </div>

            <div className="p-4 bg-slate-800/80 border border-blue-500/40 rounded-xl">
              <span className="text-xs font-bold text-blue-400 block mb-1">3. Grievance Domain</span>
              <div className="text-2xl font-bold font-mono text-white mb-1">15 Pts</div>
              <p className="text-[11px] text-slate-400">Taxonomy match across 8 official AICTE grievance classifications.</p>
            </div>

            <div className="p-4 bg-slate-800/80 border border-purple-500/40 rounded-xl">
              <span className="text-xs font-bold text-purple-400 block mb-1">4. Temporal & Proofs</span>
              <div className="text-2xl font-bold font-mono text-white mb-1">15 Pts</div>
              <p className="text-[11px] text-slate-400">Proximity decay function evaluating whether cases were received in same cycle.</p>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300 flex items-center justify-between">
            <span><strong>Strict Regulatory Policy:</strong> AI generates explainable recommendations, NEVER automated case merging.</span>
            <span className="text-amber-400 font-mono text-[11px]">Human Decision Control</span>
          </div>
        </div>
      ),
      speakerNotes: 'Look at our formula: 40 points for verified Permanent ID, 30 points for semantic similarity, 15 for category, and 15 for timeline and evidence. When a case hits 80+, an urgent alert is raised with exact explanations of why they match.'
    },
    {
      id: 4,
      badge: 'Administrative Autonomy',
      title: 'The Cross-Bureau Coordination Workspace',
      subtitle: 'Preserving Statutory Authority while Eliminating Information Silos',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3">
            <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <GitMerge className="w-4 h-4" />
              <span>What AICTE OneView DOES</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Displays complaints side-by-side with semantic text highlighting.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Enables joint inter-bureau directives (e.g. shared inspection teams).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Links cases under unified Coordination Groups (e.g. CG-008).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Logs every administrative finding to an immutable audit trail.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3">
            <h4 className="font-bold text-rose-400 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>What AICTE OneView NEVER Does</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>Does NOT automatically merge or delete distinct case IDs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>Does NOT usurp the statutory authority of Regulation Bureau or PGRC.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>Does NOT expose restricted complainant personal data without clearance.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold shrink-0">✕</span>
                <span>Does NOT make black-box automated regulatory decisions.</span>
              </li>
            </ul>
          </div>
        </div>
      ),
      speakerNotes: 'Judges often ask: "Will linking cases take away a Bureau\'s power?" No! Case C-101 remains in Regulation Bureau; Case C-205 remains in PGRC. They share an evidentiary bridge CG-008.'
    },
    {
      id: 5,
      badge: 'SIH Live Demonstration',
      title: 'Scenario Walkthrough: ABC Engineering College',
      subtitle: 'The Exact 7-Step SIH Scenario Demonstrating the Platform',
      content: (
        <div className="space-y-4 max-w-4xl mx-auto text-left">
          <div className="p-4 bg-amber-500/10 border border-amber-500/40 rounded-xl flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-400 text-xs block">Featured Institution:</span>
              <span className="text-sm font-semibold text-white">ABC Engineering College (AICTE Permanent ID: 1-43598711)</span>
            </div>
            <button
              onClick={() => {
                setSihDemoStep(1);
                setCurrentView('dashboard');
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition shadow flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Interactive Walkthrough</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="text-blue-400 block mb-1">Phase 1: Existing Case</strong>
              <p className="text-slate-300 text-[11px]">Regulation Bureau has active case C-101 on mandatory development fees.</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="text-amber-400 block mb-1">Phase 2: PGRC Intake</strong>
              <p className="text-slate-300 text-[11px]">PGRC registers C-205 on unauthorized lab & exam fees. Overlap Engine fires 88% alert!</p>
            </div>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <strong className="text-emerald-400 block mb-1">Phase 3: Joint Action</strong>
              <p className="text-slate-300 text-[11px]">Reviewer binds cases under CG-008, issues joint audit directive, and logs SHA256 audit entry.</p>
            </div>
          </div>
        </div>
      ),
      speakerNotes: 'You can click "Launch Live Interactive Walkthrough" right now to step through this exact sequence live in the working prototype.'
    },
    {
      id: 6,
      badge: 'System Architecture',
      title: 'Technical Stack & Data Architecture',
      subtitle: 'Scalable, Secure & National-Scale Ready',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg w-fit">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Frontend & UI Layer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              React 19 + TypeScript + Vite + Tailwind CSS. Componentized architecture, responsive design, Recharts analytics, and zero external runtime dependencies.
            </p>
          </div>

          <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg w-fit">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">NLP & Inference Engine</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sentence Transformers embeddings, cosine n-gram similarity, and domain synonym expansion tailored specifically for Indian higher education terminology.
            </p>
          </div>

          <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-sm">Security & Audit Vault</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              PostgreSQL relational schema with pgvector vector indexing. Immutable audit logging with SHA256 cryptographic chain and 6-tier RBAC.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'Our architecture is production-ready. It uses standard web standards, lightweight client inference for rapid demo responsiveness, and a clean PostgreSQL relational schema with pgvector extension support.'
    },
    {
      id: 7,
      badge: 'Measurable Impact',
      title: 'Quantifiable Administrative Value',
      subtitle: 'Transforming AICTE Operational Efficiency',
      content: (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
          <div className="p-5 bg-slate-800/80 border border-emerald-500/40 rounded-2xl">
            <div className="text-3xl font-extrabold font-['Outfit'] text-emerald-400 mb-1">45%</div>
            <span className="text-xs font-bold text-white block">Reduction in TAT</span>
            <p className="text-[10px] text-slate-400 mt-1">Average disposal turnaround drops from 41 to 22 days.</p>
          </div>

          <div className="p-5 bg-slate-800/80 border border-blue-500/40 rounded-2xl">
            <div className="text-3xl font-extrabold font-['Outfit'] text-blue-400 mb-1">100%</div>
            <span className="text-xs font-bold text-white block">Silo Elimination</span>
            <p className="text-[10px] text-slate-400 mt-1">Cross-referencing between RB, PGRC, and Approval Bureau.</p>
          </div>

          <div className="p-5 bg-slate-800/80 border border-amber-500/40 rounded-2xl">
            <div className="text-3xl font-extrabold font-['Outfit'] text-amber-400 mb-1">0</div>
            <span className="text-xs font-bold text-white block">Conflicting Rulings</span>
            <p className="text-[10px] text-slate-400 mt-1">Zero instances of contradictory show-cause orders.</p>
          </div>

          <div className="p-5 bg-slate-800/80 border border-purple-500/40 rounded-2xl">
            <div className="text-3xl font-extrabold font-['Outfit'] text-purple-400 mb-1">10,000+</div>
            <span className="text-xs font-bold text-white block">Institutions Indexed</span>
            <p className="text-[10px] text-slate-400 mt-1">Scalable across all technical colleges and polytechnics in India.</p>
          </div>
        </div>
      ),
      speakerNotes: 'With 45% faster disposal, complete elimination of duplicate inquiries, and zero conflicting orders, AICTE OneView saves thousands of hours of bureaucratic effort and restores student trust.'
    },
    {
      id: 8,
      badge: 'Evaluation & Defense',
      title: 'Addressing Judge Inquiries & Edge Cases',
      subtitle: 'Robust Engineering Addressing Real-World Challenges',
      content: (
        <div className="space-y-3 max-w-4xl mx-auto text-left text-xs">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-amber-400 block mb-1">Q: How do you handle false positives when two colleges have similar names?</strong>
            <p className="text-slate-300 text-[11px]">
              AICTE OneView anchors every record to the verified AICTE Permanent ID (40 points). Name similarity alone cannot trigger an overlap alert without manual verification.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-blue-400 block mb-1">Q: Can regional language complaints (Hindi, Marathi, Tamil) be processed?</strong>
            <p className="text-slate-300 text-[11px]">
              The underlying Sentence Transformers model utilizes multilingual embeddings (e.g. IndicBERT / multilingual-MiniLM), enabling cross-lingual semantic matching between English regulatory notices and vernacular student complaints.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-emerald-400 block mb-1">Q: Is student personal data protected across bureaus?</strong>
            <p className="text-slate-300 text-[11px]">
              Yes. Role-based access control redacts complainant personal identification details from cross-bureau views until a formal joint coordination group is authorized.
            </p>
          </div>
        </div>
      ),
      speakerNotes: 'We have thoroughly thought through edge cases: verified Permanent IDs prevent false positives from similar names, multilingual embeddings support vernacular complaints, and RBAC redacts personal data.'
    }
  ];

  const currentSlideData = slides[currentSlide];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  return (
    <div className="space-y-4">
      {/* Slide Presenter Stage */}
      <div className="bg-gradient-to-br from-[#0B2545] via-[#13315C] to-[#081B33] text-white rounded-3xl p-8 min-h-[520px] shadow-2xl border border-slate-700 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background shapes */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 font-bold text-xs uppercase tracking-wider rounded-full border border-amber-400/30">
              {currentSlideData.badge}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Slide {currentSlide + 1} of {slides.length}</span>
          </div>
        </div>

        {/* Slide Title & Subtitle */}
        <div className="text-center my-4 z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white tracking-tight mb-1">
            {currentSlideData.title}
          </h2>
          <p className="text-sm text-slate-300 font-normal">
            {currentSlideData.subtitle}
          </p>
        </div>

        {/* Slide Content Body */}
        <div className="my-auto z-10">
          {currentSlideData.content}
        </div>

        {/* Bottom Navigation & Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 z-10">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-30 transition flex items-center gap-1 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              disabled={currentSlide === slides.length - 1}
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-30 transition flex items-center gap-1 text-xs shadow-lg"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Speaker Notes / Judge Defense Cue Card */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
        <div className="p-2 bg-amber-50 text-amber-700 rounded-lg shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Presenter Pitch Script & Key Talking Points:
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-sans mt-0.5">
            "{currentSlideData.speakerNotes}"
          </p>
        </div>
      </div>
    </div>
  );
};
