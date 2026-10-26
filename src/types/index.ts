export type BureauType = 
  | 'Regulation Bureau (RB)' 
  | 'Public Grievance Redressal Cell (PGRC)' 
  | 'Approval Bureau (AB)' 
  | 'Policy & Academic Bureau (PAB)'
  | 'Regional Office (RO)';

export type ComplaintStatus = 
  | 'Received' 
  | 'Under Review' 
  | 'Under Process' 
  | 'Awaiting Information' 
  | 'Transferred' 
  | 'Escalated' 
  | 'Disposed';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintCategory = 
  | 'Unauthorized Fees / Capitation' 
  | 'Faculty Shortage & Qualifications' 
  | 'Infrastructure Deficiencies' 
  | 'Non-Refund of Caution Deposit' 
  | 'Admissions Violation' 
  | 'Ragging / Harassment' 
  | 'Misleading Advertisement' 
  | 'Curriculum & Norms Violation';

export interface Institution {
  id: string;
  aictePermanentId: string;
  name: string;
  category: 'Engineering & Tech' | 'Management' | 'Pharmacy' | 'Architecture' | 'Polytechnic';
  region: 'Northern' | 'North-Western' | 'Western' | 'Eastern' | 'Southern' | 'South-Western' | 'Central';
  state: string;
  city: string;
  address: string;
  principalName: string;
  contactEmail: string;
  contactPhone: string;
  totalComplaints: number;
  pendingComplaints: number;
  activeOverlaps: number;
  riskRating: 'Low' | 'Moderate' | 'High' | 'Critical';
  establishedYear: number;
  affiliatingUniversity: string;
}

export type ActionVocabulary = 
  | 'Notice Issued' 
  | 'Documents Requested' 
  | 'Inspection Ordered' 
  | 'Hearing Scheduled'
  | 'Case Closed' 
  | 'Transferred';

export interface PreActionCheckAdvisory {
  hasConflict: boolean;
  severity: 'Info' | 'Warning' | 'High Risk';
  targetAction: ActionVocabulary;
  conflictingBureau: BureauType;
  conflictingCaseId: string;
  message: string;
  priorActionDate: string;
  recommendedAction: string;
}

export interface Complaint {
  id: string; // e.g. "C-101", "C-205"
  referenceNumber: string; // e.g. "AICTE/RB/2026/0842"
  institutionId: string;
  institutionName: string;
  aictePermanentId: string;
  receivingBureau: BureauType;
  assignedOfficial: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  category: ComplaintCategory;
  description: string;
  language?: 'English' | 'Hindi' | 'Hinglish';
  complainantType: 'Student' | 'Faculty' | 'Parent' | 'Whistleblower / Anonymous' | 'Public Body';
  dateOfReceipt: string;
  expectedDisposalDate: string;
  lastActionType?: ActionVocabulary;
  lastActionDate?: string;
  lastActionSummary?: string;
  nextActionRequired: string;
  supportingDocsCount: number;
  coordinationGroupId?: string;
  overlapAlertId?: string;
  isOverdue?: boolean;
}

export interface OverlapBreakdown {
  institutionScore: number; // max 40
  semanticScore: number;    // max 30
  categoryScore: number;    // max 15
  proximityScore: number;   // max 10
  evidenceScore: number;    // max 5
}

export type OverlapClassification = 
  | 'Possible Duplicate' 
  | 'Related Complaints (Coordination Required)' 
  | 'Same Institution but Unrelated' 
  | 'Uncertain Institution Match';

export interface OverlapAlert {
  id: string; // e.g. "ALT-2026-088"
  newComplaintId: string;
  matchedComplaintId: string;
  institutionId: string;
  institutionName: string;
  aictePermanentId: string;
  overallScore: number; // 0-100
  level1CoActivity: boolean; // Level 1: Are multiple Bureaus active on this institution?
  level2RelatedIssue: {
    isRelated: boolean;
    reason: string;
    score: number;
  };
  level3ActionConflict?: {
    hasConflict: boolean;
    conflictType: string;
    details: string;
  };
  breakdown: OverlapBreakdown;
  classification: OverlapClassification;
  explanation: string[];
  sharedKeywords: string[];
  status: 'Pending Review' | 'Reviewed & Coordinated' | 'Reviewed & Dismissed';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  coordinationGroupId?: string;
}

export type CoordinationDecision = 
  | 'Confirmed Related Cases' 
  | 'Duplicate Records Confirmed' 
  | 'Separate Cases' 
  | 'Institution Identity Mismatch' 
  | 'Further Review Required';

export interface SharedDocumentRegistryItem {
  id: string;
  documentTitle: string;
  requestedByBureau: BureauType;
  requestDate: string;
  status: 'Requested' | 'Received & Verified' | 'Pending Institution';
  fileRef?: string;
}

export interface CoordinationGroup {
  id: string; // e.g. "CG-008"
  title: string;
  institutionId: string;
  institutionName: string;
  aictePermanentId: string;
  complaintIds: string[];
  decision: CoordinationDecision;
  remarks: string;
  jointDirectives: string[];
  leadBureau: BureauType;
  participatingBureaus: BureauType[];
  sharedDocuments: SharedDocumentRegistryItem[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: 'Active Coordination' | 'Resolved' | 'Archived';
}

export interface CaseAction {
  id: string;
  complaintId: string;
  timestamp: string;
  actor: string;
  actorBureau: string;
  actionType: ActionVocabulary;
  details: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  actorBureau: string;
  action: string;
  entityType: 'Complaint' | 'Institution' | 'CoordinationGroup' | 'OverlapAlert' | 'Security' | 'PreActionCheck';
  entityId: string;
  details: string;
  hash: string;
  previousHash?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  bureau: BureauType | 'AICTE HQ Executive' | 'Independent Oversight';
  role: 'AICTE Senior Management (Member Secretary)' 
      | 'Regulation Bureau Officer (RB-Lead)' 
      | 'PGRC Redressal Officer (PGRC-Lead)' 
      | 'Approval Bureau Officer (AB-Lead)' 
      | 'Regional Officer (Western Region)' 
      | 'Independent Vigilance Auditor';
  avatarInitials: string;
}
