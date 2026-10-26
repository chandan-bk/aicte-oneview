import React, { createContext, useContext, useState } from 'react';
import { 
  Institution, Complaint, OverlapAlert, CoordinationGroup, 
  CaseAction, AuditLogEntry, UserProfile, CoordinationDecision, BureauType, ComplaintStatus,
  ActionVocabulary, PreActionCheckAdvisory, SharedDocumentRegistryItem 
} from '../types';
import { 
  MOCK_USERS, MOCK_INSTITUTIONS, INITIAL_COMPLAINTS, 
  INITIAL_ALERTS, INITIAL_COORDINATION_GROUPS, INITIAL_ACTIONS, INITIAL_AUDIT_LOGS, SYNTHETIC_CSV_DATA 
} from '../data/mockData';
import { evaluate3LevelOverlap, checkPreActionAdvisory } from '../services/overlapEngine';
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
  activePreActionAdvisory: PreActionCheckAdvisory | null;
  sihDemoStep: number;
  isDemoGuideOpen: boolean;
  setCurrentView: (view: string) => void;
  setCurrentUser: (user: UserProfile) => void;
  setSelectedComplaint: (complaint: Complaint | null) => void;
  setSelectedInstitution: (institution: Institution | null) => void;
  setActiveAlertForCoordination: (alert: OverlapAlert | null) => void;
  setActivePreActionAdvisory: (advisory: PreActionCheckAdvisory | null) => void;
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
  updateComplaintStatus: (complaintId: string, status: ComplaintStatus, remarks: string, actionType?: ActionVocabulary) => void;
  evaluatePreActionCheck: (action: ActionVocabulary, complaint: Complaint) => PreActionCheckAdvisory | null;
  importSyntheticCSV: () => number;
  addSharedDocumentToGroup: (groupId: string, docTitle: string) => void;
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
  
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [activeAlertForCoordination, setActiveAlertForCoordination] = useState<OverlapAlert | null>(INITIAL_ALERTS[0]);
  const [activePreActionAdvisory, setActivePreActionAdvisory] = useState<PreActionCheckAdvisory | null>(null);
  
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

  // Register a new complaint with 3-Level Overlap analysis
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
      language: complaintData.language || 'English',
      complainantType: complaintData.complainantType || 'Student',
      dateOfReceipt: new Date().toISOString().split('T')[0],
      expectedDisposalDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      lastActionType: 'Notice Issued',
      lastActionDate: new Date().toISOString().split('T')[0],
      lastActionSummary: 'Complaint imported into AICTE Samanvay coordination overlay.',
      nextActionRequired: 'Pending inter-bureau overlap scrutiny and desk assignment.',
      supportingDocsCount: complaintData.supportingDocsCount || 2,
      isOverdue: false
    };

    // Run 3-Level Overlap Detection
    const detectedAlert = evaluate3LevelOverlap(fullComplaint, complaints, institution);

    if (detectedAlert) {
      detectedAlert.newComplaintId = generatedId;
      fullComplaint.overlapAlertId = detectedAlert.id;
      setAlerts(prev => [detectedAlert, ...prev]);
      setActiveAlertForCoordination(detectedAlert);

      addAuditLog(
        '3-Level Overlap Alert Triggered',
        'OverlapAlert',
        detectedAlert.id,
        `L1 Co-Activity detected on ${institution.name}. L2 similarity: ${detectedAlert.overallScore}%. L3 Warning: ${detectedAlert.level3ActionConflict?.conflictType || 'None'}`
      );
    }

    setComplaints(prev => [fullComplaint, ...prev]);

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

    const newAction: CaseAction = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      complaintId: generatedId,
      timestamp: new Date().toISOString(),
      actor: currentUser.name,
      actorBureau: currentUser.bureau,
      actionType: 'Notice Issued',
      details: `Case ingested under ${fullComplaint.receivingBureau}. Overlap alert: ${detectedAlert ? detectedAlert.id : 'None'}.`
    };
    setCaseActions(prev => [newAction, ...prev]);

    addAuditLog(
      'Complaint Ingested via Overlay',
      'Complaint',
      generatedId,
      `Ingested complaint for ${institution.name} (${institution.aictePermanentId}) under ${fullComplaint.receivingBureau}`
    );

    return { complaint: fullComplaint, alert: detectedAlert };
  };

  // Headline Innovation: Pre-Action Check Evaluator
  const evaluatePreActionCheck = (action: ActionVocabulary, complaint: Complaint): PreActionCheckAdvisory | null => {
    const advisory = checkPreActionAdvisory(action, complaint, complaints);
    setActivePreActionAdvisory(advisory);
    if (advisory) {
      addAuditLog(
        'Pre-Action Advisory Intercept',
        'PreActionCheck',
        complaint.id,
        `Officer intended '${action}'. System warned of prior action by ${advisory.conflictingBureau}: ${advisory.message}`
      );
    }
    return advisory;
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
      sharedDocuments: [
        {
          id: `DOC-${Date.now().toString().slice(-3)}`,
          documentTitle: 'Student Fee Payment Receipts & Affidavits (PGRC Docket)',
          requestedByBureau: 'Public Grievance Redressal Cell (PGRC)',
          requestDate: '2026-10-26',
          status: 'Received & Verified'
        },
        {
          id: `DOC-${Date.now().toString().slice(-3)}-B`,
          documentTitle: '3-Year Audited Balance Sheet & Fee Ledger (RB Docket)',
          requestedByBureau: 'Regulation Bureau (RB)',
          requestDate: '2026-10-18',
          status: 'Pending Institution'
        }
      ],
      createdBy: `${currentUser.name} (${currentUser.role})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'Active Coordination'
    };

    setCoordinationGroups(prev => [newGroup, ...prev]);

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

    setInstitutions(prev => prev.map(inst => {
      if (inst.id === alert.institutionId) {
        return {
          ...inst,
          activeOverlaps: Math.max(0, inst.activeOverlaps - 1)
        };
      }
      return inst;
    }));

    addAuditLog(
      'Coordination Decision Recorded',
      'CoordinationGroup',
      groupNum,
      `Official decision '${decision}' executed by ${currentUser.name}. Cases ${alert.matchedComplaintId} & ${alert.newComplaintId} linked under ${groupNum} with shared document registry.`
    );

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // test environment catch
    }
  };

  const addSharedDocumentToGroup = (groupId: string, docTitle: string) => {
    const newDoc: SharedDocumentRegistryItem = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      documentTitle: docTitle,
      requestedByBureau: currentUser.bureau as BureauType,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Requested'
    };

    setCoordinationGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          sharedDocuments: [...g.sharedDocuments, newDoc]
        };
      }
      return g;
    }));

    addAuditLog(
      'Document Added to Shared Registry',
      'CoordinationGroup',
      groupId,
      `Added '${docTitle}' to shared registry. The institution is asked once on behalf of both Bureaus.`
    );
  };

  // Update a complaint's status
  const updateComplaintStatus = (
    complaintId: string, 
    status: ComplaintStatus, 
    remarks: string,
    actionType: ActionVocabulary = 'Notice Issued'
  ) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === complaintId) {
        return {
          ...c,
          status,
          lastActionType: actionType,
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
      actionType,
      details: `Status transitioned to ${status}. Remarks: ${remarks}`
    };
    setCaseActions(prev => [newAction, ...prev]);

    addAuditLog(
      'Case Status Modified',
      'Complaint',
      complaintId,
      `Action: ${actionType} -> Status: ${status} by ${currentUser.name}`
    );
  };

  // CSV/Excel Ingestion (Prototype requirement)
  const importSyntheticCSV = (): number => {
    const lines = SYNTHETIC_CSV_DATA.trim().split('\n');
    let imported = 0;
    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const parts = line.split(',');
      if (parts.length >= 6) {
        const id = parts[0];
        // If already exists, skip
        if (complaints.some(c => c.id === id)) continue;

        const newComp: Complaint = {
          id: parts[0],
          referenceNumber: parts[1],
          aictePermanentId: parts[2],
          institutionId: 'INST-001',
          institutionName: parts[3],
          receivingBureau: parts[4] as BureauType,
          assignedOfficial: 'Shri Anil Verma (PGRC)',
          status: 'Received',
          priority: 'High',
          category: parts[5] as any,
          description: parts[6] ? parts[6].replace(/"/g, '') : 'Allegation of unauthorized fee extraction.',
          language: (parts[7] as any) || 'English',
          complainantType: 'Student',
          dateOfReceipt: parts[8] || new Date().toISOString().split('T')[0],
          expectedDisposalDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
          lastActionType: 'Notice Issued',
          lastActionDate: new Date().toISOString().split('T')[0],
          lastActionSummary: 'Imported via CSV batch adapter.',
          nextActionRequired: 'Pending L1/L2 overlap review.',
          supportingDocsCount: 3,
          isOverdue: false
        };

        const alert = evaluate3LevelOverlap(newComp, complaints);
        if (alert) {
          alert.newComplaintId = newComp.id;
          newComp.overlapAlertId = alert.id;
          setAlerts(prev => [alert, ...prev]);
          setActiveAlertForCoordination(alert);
        }

        setComplaints(prev => [newComp, ...prev]);
        imported++;
      }
    }

    addAuditLog(
      'Batch CSV Ingestion Executed',
      'Security',
      'CSV-IMPORT-BATCH',
      `Imported ${imported} synthetic case records without re-entry into AICTE Samanvay layer.`
    );

    return imported;
  };

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
    setActivePreActionAdvisory(null);
  };

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
      language: 'English',
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
      activePreActionAdvisory,
      sihDemoStep,
      isDemoGuideOpen,
      setCurrentView,
      setCurrentUser,
      setSelectedComplaint,
      setSelectedInstitution,
      setActiveAlertForCoordination,
      setActivePreActionAdvisory,
      setSihDemoStep,
      setIsDemoGuideOpen,
      registerComplaint,
      recordCoordinationDecision,
      updateComplaintStatus,
      evaluatePreActionCheck,
      importSyntheticCSV,
      addSharedDocumentToGroup,
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
