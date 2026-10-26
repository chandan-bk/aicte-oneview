import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Institution, Complaint, OverlapAlert, CoordinationGroup, 
  CaseAction, AuditLogEntry, UserProfile, CoordinationDecision, BureauType, ComplaintStatus 
} from '../types';
import { 
  MOCK_USERS, MOCK_INSTITUTIONS, INITIAL_COMPLAINTS, 
  INITIAL_ALERTS, INITIAL_COORDINATION_GROUPS, INITIAL_ACTIONS, INITIAL_AUDIT_LOGS 
} from '../data/mockData';
import { evaluateComplaintOverlap } from '../services/overlapEngine';
import confetti from 'canvas-confetti';

interface AppContextType {
  institutions: Institution[];
  complaints: Complaint[];
  alerts: OverlapAlert[];
  coordinationGroups: CoordinationGroup[];
  caseActions: CaseAction[];
  auditLogs: AuditLogEntry[];
  currentUser: UserProfile;
  currentView: string;
  selectedComplaint: Complaint | null;
  selectedInstitution: Institution | null;
  activeAlertForCoordination: OverlapAlert | null;
  sihDemoStep: number;
  isDemoGuideOpen: boolean;
  setCurrentView: (view: string) => void;
  setCurrentUser: (user: UserProfile) => void;
  setSelectedComplaint: (complaint: Complaint | null) => void;
  setSelectedInstitution: (institution: Institution | null) => void;
  setActiveAlertForCoordination: (alert: OverlapAlert | null) => void;
  setSihDemoStep: (step: number) => void;
  setIsDemoGuideOpen: (open: boolean) => void;
  registerComplaint: (newComplaint: Partial<Complaint>) => { complaint: Complaint; alert: OverlapAlert | null };
  recordCoordinationDecision: (
    alertId: string, 
    decision: CoordinationDecision, 
    remarks: string, 
    directives: string[],
    leadBureau: BureauType
  ) => void;
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, remarks: string) => void;
  resetToSihBaseline: () => void;
  loadSihPresetComplaint: () => Partial<Complaint>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [institutions, setInstitutions] = useState<Institution[]>(MOCK_INSTITUTIONS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [alerts, setAlerts] = useState<OverlapAlert[]>(INITIAL_ALERTS);
  const [coordinationGroups, setCoordinationGroups] = useState<CoordinationGroup[]>(INITIAL_COORDINATION_GROUPS);
  const [caseActions, setCaseActions] = useState<CaseAction[]>(INITIAL_ACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]); // Default to AICTE Member Secretary
  const [currentView, setCurrentView] = useState<string>('dashboard');
  
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [activeAlertForCoordination, setActiveAlertForCoordination] = useState<OverlapAlert | null>(INITIAL_ALERTS[0]);
  
  const [sihDemoStep, setSihDemoStep] = useState<number>(1);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(true);

  // Helper to append immutable audit log
  const addAuditLog = (
    action: string, 
    entityType: AuditLogEntry['entityType'], 
    entityId: string, 
    details: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      actorRole: currentUser.role,
      actorBureau: currentUser.bureau,
      action,
      entityType,
      entityId,
      details,
      hash: `SHA256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Register a new complaint with real-time overlap analysis
  const registerComplaint = (complaintData: Partial<Complaint>) => {
    const institution = institutions.find(i => i.id === complaintData.institutionId) || institutions[0];
    const generatedId = `C-${Math.floor(200 + Math.random() * 90)}`;
    const refNum = `AICTE/${complaintData.receivingBureau?.includes('PGRC') ? 'PGRC' : 'RB'}/2026/0${Math.floor(500 + Math.random() * 400)}`;

    const fullComplaint: Complaint = {
      id: generatedId,
      referenceNumber: refNum,
      institutionId: institution.id,
      institutionName: institution.name,
      aictePermanentId: institution.aictePermanentId,
      receivingBureau: complaintData.receivingBureau || 'Public Grievance Redressal Cell (PGRC)',
      assignedOfficial: currentUser.name,
      status: 'Received',
      priority: complaintData.priority || 'High',
      category: complaintData.category || 'Unauthorized Fees / Capitation',
      description: complaintData.description || '',
      complainantType: complaintData.complainantType || 'Student',
      dateOfReceipt: new Date().toISOString().split('T')[0],
      expectedDisposalDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      lastActionDate: new Date().toISOString().split('T')[0],
      lastActionSummary: 'Complaint registered and ingested into AICTE OneView central registry.',
      nextActionRequired: 'Pending inter-bureau overlap scrutiny and desk assignment.',
      supportingDocsCount: complaintData.supportingDocsCount || 2,
      isOverdue: false
    };

    // Run overlap detection against all existing complaints
    const detectedAlert = evaluateComplaintOverlap(fullComplaint, complaints, institution);

    if (detectedAlert) {
      detectedAlert.newComplaintId = generatedId;
      fullComplaint.overlapAlertId = detectedAlert.id;
      setAlerts(prev => [detectedAlert, ...prev]);
      setActiveAlertForCoordination(detectedAlert);

      // Audit log for overlap alert
      addAuditLog(
        'Overlap Alert Triggered',
        'OverlapAlert',
        detectedAlert.id,
        `Intelligent overlap detection identified ${detectedAlert.overallScore}% score between new ${generatedId} and existing ${detectedAlert.matchedComplaintId}`
      );
    }

    setComplaints(prev => [fullComplaint, ...prev]);

    // Update institution pending & overlap counts
    setInstitutions(prev => prev.map(inst => {
      if (inst.id === institution.id) {
        return {
          ...inst,
          totalComplaints: inst.totalComplaints + 1,
          pendingComplaints: inst.pendingComplaints + 1,
          activeOverlaps: detectedAlert ? inst.activeOverlaps + 1 : inst.activeOverlaps
        };
      }
      return inst;
    }));

    // Action record
    const newAction: CaseAction = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      complaintId: generatedId,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      actorBureau: currentUser.bureau,
      actionType: 'Status Change',
      details: `Complaint registered in ${fullComplaint.receivingBureau}. Overlap alert generated: ${detectedAlert ? detectedAlert.id : 'None'}.`
    };
    setCaseActions(prev => [newAction, ...prev]);

    // Audit record
    addAuditLog(
      'Complaint Registered',
      'Complaint',
      generatedId,
      `Registered complaint for ${institution.name} (${institution.aictePermanentId}) under ${fullComplaint.receivingBureau}`
    );

    return { complaint: fullComplaint, alert: detectedAlert };
  };

  // Record a formal Coordination Decision
  const recordCoordinationDecision = (
    alertId: string,
    decision: CoordinationDecision,
    remarks: string,
    directives: string[],
    leadBureau: BureauType
  ) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    const groupNum = `CG-00${coordinationGroups.length + 8}`;
    const newGroup: CoordinationGroup = {
      id: groupNum,
      title: `${alert.institutionName} - Inter-Bureau Fee Overlap Coordination`,
      institutionId: alert.institutionId,
      institutionName: alert.institutionName,
      aictePermanentId: alert.aictePermanentId,
      complaintIds: [alert.matchedComplaintId, alert.newComplaintId],
      decision,
      remarks,
      jointDirectives: directives,
      leadBureau,
      participatingBureaus: ['Regulation Bureau (RB)', 'Public Grievance Redressal Cell (PGRC)'],
      createdBy: `${currentUser.name} (${currentUser.role})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Active Coordination'
    };

    setCoordinationGroups(prev => [newGroup, ...prev]);

    // Update Alert status
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: 'Reviewed & Coordinated',
          reviewedBy: currentUser.name,
          reviewedAt: new Date().toISOString(),
          coordinationGroupId: groupNum
        };
      }
      return a;
    }));

    // Update both Complaints to reference coordination group
    setComplaints(prev => prev.map(c => {
      if (c.id === alert.matchedComplaintId || c.id === alert.newComplaintId) {
        return {
          ...c,
          coordinationGroupId: groupNum,
          lastActionDate: new Date().toISOString().split('T')[0],
          lastActionSummary: `Linked to Coordination Group ${groupNum}. Official Decision: ${decision}.`,
          status: 'Under Process'
        };
      }
      return c;
    }));

    // Decrement active overlaps for institution
    setInstitutions(prev => prev.map(inst => {
      if (inst.id === alert.institutionId) {
        return {
          ...inst,
          activeOverlaps: Math.max(0, inst.activeOverlaps - 1)
        };
      }
      return inst;
    }));

    // Add Audit Log
    addAuditLog(
      'Coordination Decision Recorded',
      'CoordinationGroup',
      groupNum,
      `Official decision '${decision}' executed by ${currentUser.name}. Cases ${alert.matchedComplaintId} & ${alert.newComplaintId} linked under ${groupNum} without loss of Bureau jurisdiction.`
    );

    // Trigger celebration confetti for successful SIH demo milestone!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore in test environments
    }
  };

  // Update a complaint's status
  const updateComplaintStatus = (complaintId: string, status: ComplaintStatus, remarks: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status,
          lastActionDate: new Date().toISOString().split('T')[0],
          lastActionSummary: remarks
        };
      }
      return c;
    }));

    const newAction: CaseAction = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      complaintId,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      actorBureau: currentUser.bureau,
      actionType: 'Status Change',
      details: `Status transitioned to ${status}. Remarks: ${remarks}`
    };
    setCaseActions(prev => [newAction, ...prev]);

    addAuditLog(
      'Case Status Updated',
      'Complaint',
      complaintId,
      `Status changed to ${status} by ${currentUser.name}`
    );
  };

  // Reset to clean SIH Baseline state
  const resetToSihBaseline = () => {
    setInstitutions(MOCK_INSTITUTIONS);
    setComplaints(INITIAL_COMPLAINTS);
    setAlerts(INITIAL_ALERTS);
    setCoordinationGroups(INITIAL_COORDINATION_GROUPS);
    setCaseActions(INITIAL_ACTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setSihDemoStep(1);
    setCurrentView('dashboard');
    setActiveAlertForCoordination(INITIAL_ALERTS[0]);
  };

  // Load SIH Preset Complaint Data (as requested in Section 17)
  const loadSihPresetComplaint = (): Partial<Complaint> => {
    const abcInst = institutions.find(i => i.aictePermanentId === '1-43598711') || institutions[0];
    return {
      institutionId: abcInst.id,
      institutionName: abcInst.name,
      aictePermanentId: abcInst.aictePermanentId,
      receivingBureau: 'Public Grievance Redressal Cell (PGRC)',
      category: 'Unauthorized Fees / Capitation',
      priority: 'High',
      complainantType: 'Student',
      description: 'Students of ABC Engineering College allege that the institution is collecting fees beyond the prescribed state committee structure, extorting unauthorized additional charges of Rs. 40,000 as compulsory lab maintenance and exam fees without giving official receipts.',
      supportingDocsCount: 4
    };
  };

  return (
    <AppContext.Provider value={{
      institutions,
      complaints,
      alerts,
      coordinationGroups,
      caseActions,
      auditLogs,
      currentUser,
      currentView,
      selectedComplaint,
      selectedInstitution,
      activeAlertForCoordination,
      sihDemoStep,
      isDemoGuideOpen,
      setCurrentView,
      setCurrentUser,
      setSelectedComplaint,
      setSelectedInstitution,
      setActiveAlertForCoordination,
      setSihDemoStep,
      setIsDemoGuideOpen,
      registerComplaint,
      recordCoordinationDecision,
      updateComplaintStatus,
      resetToSihBaseline,
      loadSihPresetComplaint
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
