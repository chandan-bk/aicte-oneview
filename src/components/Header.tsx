import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../data/mockData';
import { 
  Building2, ShieldAlert, GitMerge, FileText, BarChart3, 
  History, PlusCircle, Presentation, UserCheck, Sparkles, Layers, UploadCloud 
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentView, setCurrentView, 
    currentUser, setCurrentUser, 
    alerts, complaints, sihDemoStep, 
    setIsDemoGuideOpen, isDemoGuideOpen 
  } = useApp();

  const pendingAlertsCount = alerts.filter(a => a.status === 'Pending Review').length;

  return (
    <header className="sticky top-0 z-40 bg-[#0B2545] text-white shadow-lg border-b border-[#134074]">
      {/* Top Gov Branding Bar */}
      <div className="bg-[#081B33] px-4 py-1.5 text-xs flex justify-between items-center text-slate-300 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-slate-200">Ministry of Education | AICTE</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400 font-mono text-[11px]">SIH26264: Smart Automation</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-300 italic hidden sm:inline">"One Institution. Connected Cases. Coordinated Action."</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-medium">Overlay Coordination Layer v3.0</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-3">
        {/* Brand & Title */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-[#0B2545] rounded-[7px] flex items-center justify-center">
              <span className="font-extrabold text-amber-400 text-lg tracking-wider font-['Outfit']">सम</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-['Outfit'] tracking-tight text-white flex items-center gap-1.5">
                AICTE <span className="text-amber-400">Samanvay</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                Coordination Overlay
              </span>
            </div>
            <p className="text-xs text-slate-300 font-normal">
              Institution Case Intelligence and Coordination Layer
            </p>
          </div>
        </div>

        {/* Right Controls: Role Switcher & SIH Demo Launcher */}
        <div className="flex items-center gap-3">
          {/* SIH Demo Guided Tour Pill */}
          <button
            onClick={() => setIsDemoGuideOpen(!isDemoGuideOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isDemoGuideOpen 
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' 
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border border-amber-500/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>SIH Walkthrough</span>
            <span className="px-1.5 py-0.2 bg-slate-900/40 rounded text-[10px] font-bold">
              Step {sihDemoStep}/6
            </span>
          </button>

          {/* User Role Switcher Dropdown */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700">
            <div className="w-7 h-7 rounded-md bg-[#134074] flex items-center justify-center font-bold text-xs text-amber-300 mr-2">
              {currentUser.avatarInitials}
            </div>
            <div className="text-left pr-2">
              <div className="text-[11px] font-medium text-slate-200 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[9px] text-amber-400 truncate max-w-[130px]">
                {currentUser.bureau}
              </div>
            </div>
            <select
              value={currentUser.id}
              onChange={(e) => {
                const found = MOCK_USERS.find(u => u.id === e.target.value);
                if (found) setCurrentUser(found);
              }}
              className="bg-slate-900 text-slate-200 text-xs rounded border border-slate-700 py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {MOCK_USERS.map(user => (
                <option key={user.id} value={user.id}>
                  {user.role}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Bar */}
      <nav className="bg-[#13315C] border-t border-[#134074] px-4 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex items-center gap-1">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              currentView === 'dashboard'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentView('institutions')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              currentView === 'institutions'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Institution 360</span>
          </button>

          <button
            onClick={() => setCurrentView('new-complaint')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              currentView === 'new-complaint'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Ingest & Overlap Check</span>
          </button>

          <button
            onClick={() => setCurrentView('coordination')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap relative ${
              currentView === 'coordination'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <GitMerge className="w-4 h-4 text-amber-400" />
            <span>Coordination Workspace</span>
            {pendingAlertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                {pendingAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('complaints')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              currentView === 'complaints'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Case Files & Timeline</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
              {complaints.length}
            </span>
          </button>

          <button
            onClick={() => setCurrentView('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              currentView === 'analytics'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>SLA & Reports</span>
          </button>

          <button
            onClick={() => setCurrentView('audit')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              currentView === 'audit'
                ? 'border-amber-400 text-amber-300 bg-white/5'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>

          <div className="flex-1"></div>

          {/* 6-Slide Master PPT Deck */}
          <button
            onClick={() => setCurrentView('presentation')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-md transition-all whitespace-nowrap ${
              currentView === 'presentation'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>6-Slide PPT Master</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
