import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, ChevronRight, ChevronLeft, CheckCircle2, 
  Play, RotateCcw, X, Layers, GripHorizontal, 
  Minus, Maximize2, ArrowUpRight, Move
} from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const { 
    sihDemoStep, setSihDemoStep, 
    isDemoGuideOpen, setIsDemoGuideOpen, 
    setCurrentView, resetToSihBaseline,
    setSelectedInstitution, institutions
  } = useApp();

  // Position state (custom pixel coordinates or default bottom-right)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize position to bottom right on mount
  useEffect(() => {
    if (!position) {
      const defaultX = Math.max(20, window.innerWidth - 530);
      const defaultY = Math.max(20, window.innerHeight - 320);
      setPosition({ x: defaultX, y: defaultY });
    }
  }, []);

  // Handle window resize so modal stays on screen
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        if (!prev) return null;
        const maxX = window.innerWidth - (modalRef.current?.offsetWidth || 500) - 20;
        const maxY = window.innerHeight - (modalRef.current?.offsetHeight || 250) - 20;
        return {
          x: Math.max(10, Math.min(maxX, prev.x)),
          y: Math.max(10, Math.min(maxY, prev.y))
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag from header handle
    if ((e.target as HTMLElement).closest('button, select, input')) return;
    
    setIsDragging(true);
    const rect = modalRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const modalWidth = modalRef.current?.offsetWidth || 500;
      const modalHeight = modalRef.current?.offsetHeight || 250;

      const newX = Math.max(10, Math.min(window.innerWidth - modalWidth - 10, e.clientX - dragOffset.x));
      const newY = Math.max(10, Math.min(window.innerHeight - modalHeight - 10, e.clientY - dragOffset.y));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Corner snap helper
  const snapTo = (corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    const modalWidth = modalRef.current?.offsetWidth || 500;
    const modalHeight = modalRef.current?.offsetHeight || 250;
    switch (corner) {
      case 'top-left':
        setPosition({ x: 20, y: 70 });
        break;
      case 'top-right':
        setPosition({ x: window.innerWidth - modalWidth - 20, y: 70 });
        break;
      case 'bottom-left':
        setPosition({ x: 20, y: window.innerHeight - modalHeight - 20 });
        break;
      case 'bottom-right':
        setPosition({ x: window.innerWidth - modalWidth - 20, y: window.innerHeight - modalHeight - 20 });
        break;
    }
  };

  if (!isDemoGuideOpen) {
    return (
      <button
        onClick={() => setIsDemoGuideOpen(true)}
        className="fixed bottom-5 right-5 z-50 bg-[#0B2545] text-amber-400 border border-amber-400/40 p-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-semibold text-xs group"
      >
        <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
        <span>Open Samanvay Demo Guide (Step {sihDemoStep}/6)</span>
      </button>
    );
  }

  const steps = [
    {
      step: 1,
      title: 'Dashboard: Cross-Bureau Telemetry & SLA',
      subtitle: 'Samanvay Demo — Step 1 (Overlay View)',
      desc: 'Show consolidated cases across institutions, in English and Hindi. Point out active caseloads across RB, PGRC & AB, and configurable SLA overdue flags.',
      actionLabel: 'Go to Dashboard',
      onAction: () => setCurrentView('dashboard')
    },
    {
      step: 2,
      title: 'Institution 360: ABC Engineering College',
      subtitle: 'Samanvay Demo — Step 2 (Permanent ID Key)',
      desc: 'Inspect ABC Engineering College (Permanent ID: 1-43598711). Point out existing Regulation Bureau inquiry C-101 where 3-year fee ledgers were already requested.',
      actionLabel: 'Open ABC College 360',
      onAction: () => {
        const inst = institutions.find(i => i.aictePermanentId === '1-43598711');
        if (inst) setSelectedInstitution(inst);
        setCurrentView('institutions');
      }
    },
    {
      step: 3,
      title: 'Case Ingestion: PGRC Fee Complaint',
      subtitle: 'Samanvay Demo — Step 3 (No Data Re-entry)',
      desc: 'Ingest student fee grievance into PGRC (or import CSV). Notice different phrasing: students alleging extra charges for lab/exam clearance.',
      actionLabel: 'Open Ingestion Form',
      onAction: () => setCurrentView('new-complaint')
    },
    {
      step: 4,
      title: '3-Level Overlap Engine Fires Alert',
      subtitle: 'Samanvay Demo — Step 4 (L1, L2 & L3 Overlap)',
      desc: 'L1 detects co-activity (RB + PGRC on same college). L2 confirms related issue via multilingual rule-based synonym matching. L3 warns of duplicate document demand risk.',
      actionLabel: 'Inspect 3-Level Match',
      onAction: () => setCurrentView('new-complaint')
    },
    {
      step: 5,
      title: 'Pre-Action Check (Headline Innovation)',
      subtitle: 'Samanvay Demo — Step 5 (Preventing Redundancy)',
      desc: 'Officer starts "Request Documents" action -> Pre-Action Check warns: "Regulation Bureau already requested fee ledgers on 18 Oct. Use Shared Document Registry to ask the college once!"',
      actionLabel: 'Test Pre-Action Check',
      onAction: () => setCurrentView('coordination')
    },
    {
      step: 6,
      title: 'Coordination Order & Shared Document Registry',
      subtitle: 'Samanvay Demo — Step 6 (Link Never Merge)',
      desc: 'Link cases without merging case IDs. Add documents to Shared Registry so college is asked once. Review updated dashboard & verify cryptographic audit trail.',
      actionLabel: 'Execute Coordination Order',
      onAction: () => setCurrentView('coordination')
    }
  ];

  const currentStepData = steps[sihDemoStep - 1] || steps[0];

  return (
    <div
      ref={modalRef}
      style={{
        left: position ? `${position.x}px` : undefined,
        top: position ? `${position.y}px` : undefined,
        position: 'fixed'
      }}
      className={`z-50 w-full ${isMinimized ? 'max-w-sm' : 'max-w-lg'} bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border ${
        isDragging ? 'border-amber-400 ring-2 ring-amber-400/40 cursor-grabbing' : 'border-amber-500/50'
      } transition-shadow select-none`}
    >
      {/* Draggable Header Bar */}
      <div
        onMouseDown={handleMouseDown}
        className="px-3.5 py-2.5 border-b border-slate-700/80 flex items-center justify-between cursor-grab active:cursor-grabbing bg-slate-950/60 rounded-t-2xl"
        title="Click and drag anywhere on this header to move"
      >
        <div className="flex items-center gap-2">
          <div className="p-1 text-slate-400 hover:text-amber-400">
            <GripHorizontal className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>SIH Demo Guide</span>
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded-full border border-slate-700 font-mono">
              Step {sihDemoStep}/6
            </span>
          </div>
        </div>

        {/* Right Corner Buttons */}
        <div className="flex items-center gap-1">
          {/* Quick Corner Snap Menu */}
          <div className="hidden sm:flex items-center gap-0.5 mr-1 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
            <span className="text-[9px] mr-0.5 text-slate-500">Snap:</span>
            <button
              onClick={() => snapTo('top-left')}
              title="Snap Top-Left"
              className="hover:text-amber-300 px-0.5"
            >
              ↖
            </button>
            <button
              onClick={() => snapTo('top-right')}
              title="Snap Top-Right"
              className="hover:text-amber-300 px-0.5"
            >
              ↗
            </button>
            <button
              onClick={() => snapTo('bottom-left')}
              title="Snap Bottom-Left"
              className="hover:text-amber-300 px-0.5"
            >
              ↙
            </button>
            <button
              onClick={() => snapTo('bottom-right')}
              title="Snap Bottom-Right"
              className="hover:text-amber-300 px-0.5"
            >
              ↘
            </button>
          </div>

          <button
            onClick={resetToSihBaseline}
            title="Reset to baseline"
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand full guide' : 'Minimize bar'}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setIsDemoGuideOpen(false)}
            title="Close demo guide"
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Collapsed Compact View */}
      {isMinimized ? (
        <div className="p-3 flex items-center justify-between gap-3 text-xs">
          <div className="truncate flex-1">
            <span className="font-semibold text-slate-200 block truncate">
              {currentStepData.title}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={currentStepData.onAction}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition"
            >
              Run
            </button>
            <button
              disabled={sihDemoStep === 6}
              onClick={() => setSihDemoStep(Math.min(6, sihDemoStep + 1))}
              className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded disabled:opacity-30"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Full Expanded Body */
        <div className="p-4 space-y-3">
          <div>
            <div className="text-[11px] text-amber-400/90 font-medium mb-0.5">
              {currentStepData.subtitle}
            </div>
            <h4 className="text-sm font-bold text-slate-100 mb-1">
              {currentStepData.title}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {currentStepData.desc}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-6 gap-1.5 py-1">
            {steps.map((s, idx) => (
              <div
                key={s.step}
                onClick={() => setSihDemoStep(idx + 1)}
                className={`h-1.5 rounded-full cursor-pointer transition-all ${
                  idx + 1 === sihDemoStep
                    ? 'bg-amber-400 ring-2 ring-amber-400/30'
                    : idx + 1 < sihDemoStep
                    ? 'bg-emerald-500'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Step ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
            <button
              onClick={currentStepData.onAction}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition shadow"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{currentStepData.actionLabel}</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                disabled={sihDemoStep === 1}
                onClick={() => setSihDemoStep(Math.max(1, sihDemoStep - 1))}
                className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 transition"
                title="Previous Step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={sihDemoStep === 6}
                onClick={() => setSihDemoStep(Math.min(6, sihDemoStep + 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold transition"
                title="Next Step"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
