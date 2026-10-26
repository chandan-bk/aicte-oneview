import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DemoGuideModal } from './components/DemoGuideModal';
import { InstitutionDetailModal } from './components/InstitutionDetailModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';

import { DashboardView } from './views/DashboardView';
import { InstitutionsView } from './views/InstitutionsView';
import { NewComplaintView } from './views/NewComplaintView';
import { CoordinationWorkspaceView } from './views/CoordinationWorkspaceView';
import { ComplaintsView } from './views/ComplaintsView';
import { AnalyticsView } from './views/AnalyticsView';
import { AuditLogView } from './views/AuditLogView';
import { PresentationDeckView } from './views/PresentationDeckView';

export const App: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-['Inter',sans-serif]">
      {/* Top Header & Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'institutions' && <InstitutionsView />}
        {currentView === 'new-complaint' && <NewComplaintView />}
        {currentView === 'coordination' && <CoordinationWorkspaceView />}
        {currentView === 'complaints' && <ComplaintsView />}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'audit' && <AuditLogView />}
        {currentView === 'presentation' && <PresentationDeckView />}
      </main>

      {/* Global Modals */}
      <InstitutionDetailModal />
      <ComplaintDetailModal />
      <DemoGuideModal />

      {/* Official Gov Footer */}
      <footer className="bg-[#0B2545] text-slate-400 py-6 border-t border-slate-800 text-xs text-center mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-left">
            <span className="font-bold text-white block">AICTE OneView National Platform</span>
            <span>All India Council for Technical Education, Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Smart India Hackathon 2026 Submission</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Single Source of Truth Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
