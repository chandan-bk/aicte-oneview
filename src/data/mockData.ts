import { Institution, Complaint, OverlapAlert, CoordinationGroup, CaseAction, AuditLogEntry, UserProfile, SharedDocumentRegistryItem } from '../types';
import { computeAuditHash } from '../services/crypto';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'USR-001',
    name: 'Dr. Rajiv Kumar',
    designation: 'Member Secretary & Chief Executive',
    bureau: 'AICTE HQ Executive',
    role: 'AICTE Senior Management (Member Secretary)',
    avatarInitials: 'RK'
  },
  {
    id: 'USR-002',
    name: 'Smt. Sunita Rao',
    designation: 'Director, Regulation Bureau (RB)',
    bureau: 'Regulation Bureau (RB)',
    role: 'Regulation Bureau Officer (RB-Lead)',
    avatarInitials: 'SR'
  },
  {
    id: 'USR-003',
    name: 'Shri Anil Verma',
    designation: 'Redressal Officer, PGRC',
    bureau: 'Public Grievance Redressal Cell (PGRC)',
    role: 'PGRC Redressal Officer (PGRC-Lead)',
    avatarInitials: 'AV'
  },
  {
    id: 'USR-004',
    name: 'Dr. K. Venkataraman',
    designation: 'Advisor, Approval Bureau (AB)',
    bureau: 'Approval Bureau (AB)',
    role: 'Approval Bureau Officer (AB-Lead)',
    avatarInitials: 'KV'
  },
  {
    id: 'USR-005',
    name: 'Shri Sandeep Deshmukh',
    designation: 'Regional Director, Western Regional Office',
    bureau: 'Regional Office (RO)',
    role: 'Regional Officer (Western Region)',
    avatarInitials: 'SD'
  },
  {
    id: 'USR-006',
    name: 'Shri M. K. Sharma',
    designation: 'Independent Chief Vigilance Auditor',
    bureau: 'Independent Oversight',
    role: 'Independent Vigilance Auditor',
    avatarInitials: 'MS'
  }
];

export const MOCK_INSTITUTIONS: Institution[] = [
  {
    id: 'INST-001',
    aictePermanentId: '1-43598711',
    name: 'ABC Engineering College',
    category: 'Engineering & Tech',
    region: 'Western',
    state: 'Maharashtra',
    city: 'Pune',
    address: 'Survey No. 42/1, Sector 9, Wagholi-Katraj Bypass, Pune, Maharashtra 412207',
    principalName: 'Dr. Ramesh K. Deshmukh',
    contactEmail: 'principal@abcengg-pune.edu.in',
    contactPhone: '+91 20 2748 9100',
    totalComplaints: 3,
    pendingComplaints: 1,
    activeOverlaps: 1,
    riskRating: 'High',
    establishedYear: 2004,
    affiliatingUniversity: 'Savitribai Phule Pune University (SPPU)'
  },
  {
    id: 'INST-002',
    aictePermanentId: '1-28114092',
    name: 'Vivekananda Institute of Technology & Science',
    category: 'Engineering & Tech',
    region: 'South-Western',
    state: 'Karnataka',
    city: 'Bangalore',
    address: 'Kumbalgodu, Kengeri Hobli, Mysore Road, Bangalore 560074',
    principalName: 'Dr. S. Radhakrishna',
    contactEmail: 'contact@vits-blr.ac.in',
    contactPhone: '+91 80 2843 7111',
    totalComplaints: 2,
    pendingComplaints: 1,
    activeOverlaps: 0,
    riskRating: 'Moderate',
    establishedYear: 2001,
    affiliatingUniversity: 'Visvesvaraya Technological University (VTU)'
  },
  {
    id: 'INST-003',
    aictePermanentId: '1-10948211',
    name: 'Delhi National Institute of Engineering & Management',
    category: 'Management',
    region: 'Northern',
    state: 'Delhi',
    city: 'New Delhi',
    address: 'Plot 12, Institutional Area, Vasant Kunj Phase II, New Delhi 110070',
    principalName: 'Prof. Meenakshi Sundaram',
    contactEmail: 'director@dniem-delhi.org.in',
    contactPhone: '+91 11 2613 4590',
    totalComplaints: 1,
    pendingComplaints: 0,
    activeOverlaps: 0,
    riskRating: 'Low',
    establishedYear: 2008,
    affiliatingUniversity: 'Guru Gobind Singh Indraprastha University (GGSIPU)'
  },
  {
    id: 'INST-004',
    aictePermanentId: '1-33910244',
    name: 'Kolkata Institute of Pharmaceutical Sciences',
    category: 'Pharmacy',
    region: 'Eastern',
    state: 'West Bengal',
    city: 'Kolkata',
    address: 'Sector V, Salt Lake City, Bidhannagar, Kolkata 700091',
    principalName: 'Dr. Debabrata Roy',
    contactEmail: 'office@kips-kol.edu.in',
    contactPhone: '+91 33 2357 8812',
    totalComplaints: 4,
    pendingComplaints: 2,
    activeOverlaps: 1,
    riskRating: 'High',
    establishedYear: 2010,
    affiliatingUniversity: 'Maulana Abul Kalam Azad University of Technology (MAKAUT)'
  },
  {
    id: 'INST-005',
    aictePermanentId: '1-49182371',
    name: 'Sardar Patel College of Engineering & Research',
    category: 'Engineering & Tech',
    region: 'Western',
    state: 'Gujarat',
    city: 'Ahmedabad',
    address: 'Near SG Highway, Gota, Ahmedabad, Gujarat 382481',
    principalName: 'Dr. Hiren J. Patel',
    contactEmail: 'admin@spcer-gujarat.edu.in',
    contactPhone: '+91 79 2766 5430',
    totalComplaints: 2,
    pendingComplaints: 0,
    activeOverlaps: 0,
    riskRating: 'Low',
    establishedYear: 1998,
    affiliatingUniversity: 'Gujarat Technological University (GTU)'
  },
  {
    id: 'INST-006',
    aictePermanentId: '1-71928340',
    name: 'Bhopal Global Management Institute',
    category: 'Management',
    region: 'Central',
    state: 'Madhya Pradesh',
    city: 'Bhopal',
    address: 'Raisen Road, Anand Nagar, Bhopal, MP 462021',
    principalName: 'Dr. Anurag Saxena',
    contactEmail: 'director@bgmi-bhopal.in',
    contactPhone: '+91 755 278 1234',
    totalComplaints: 3,
    pendingComplaints: 1,
    activeOverlaps: 0,
    riskRating: 'Moderate',
    establishedYear: 2012,
    affiliatingUniversity: 'Barkatullah University, Bhopal'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'C-101',
    referenceNumber: 'AICTE/RB/2026/0842',
    institutionId: 'INST-001',
    institutionName: 'ABC Engineering College',
    aictePermanentId: '1-43598711',
    receivingBureau: 'Regulation Bureau (RB)',
    assignedOfficial: 'Smt. Sunita Rao (Director, RB)',
    status: 'Under Process',
    priority: 'High',
    category: 'Unauthorized Fees / Capitation',
    description: 'Institution administration is collecting tuition and development fees significantly exceeding the fee regulatory committee approved caps. Students report being forced to pay Rs. 45,000 per term as mandatory unapproved lab development and examination clearances under duress.',
    language: 'English',
    complainantType: 'Whistleblower / Anonymous',
    dateOfReceipt: '2026-10-14',
    expectedDisposalDate: '2026-11-14',
    lastActionType: 'Documents Requested',
    lastActionDate: '2026-10-18',
    lastActionSummary: 'Formal request dispatched to Chairman seeking 3-year audited fee ledger & bank accounts.',
    nextActionRequired: 'Review 15-day institutional reply and bank statement audit.',
    supportingDocsCount: 3,
    overlapAlertId: 'ALT-2026-088',
    isOverdue: false
  },
  {
    id: 'C-042',
    referenceNumber: 'AICTE/AB/2025/1109',
    institutionId: 'INST-001',
    institutionName: 'ABC Engineering College',
    aictePermanentId: '1-43598711',
    receivingBureau: 'Approval Bureau (AB)',
    assignedOfficial: 'Dr. K. Venkataraman (Advisor, AB)',
    status: 'Disposed',
    priority: 'Medium',
    category: 'Faculty Shortage & Qualifications',
    description: 'Complaint alleging adjunct faculty falsely listed as full-time cadre in mechanical engineering department during 2025 extension of approval (EoA) cycle.',
    language: 'English',
    complainantType: 'Faculty',
    dateOfReceipt: '2025-08-11',
    expectedDisposalDate: '2025-09-30',
    lastActionType: 'Case Closed',
    lastActionDate: '2025-09-28',
    lastActionSummary: 'Deficiency verified; intake in B.Tech Mechanical reduced by 30 seats. Compliance confirmed.',
    nextActionRequired: 'Case closed and archived.',
    supportingDocsCount: 5,
    isOverdue: false
  },
  {
    id: 'C-102',
    referenceNumber: 'AICTE/PGRC/2026/0319',
    institutionId: 'INST-002',
    institutionName: 'Vivekananda Institute of Technology & Science',
    aictePermanentId: '1-28114092',
    receivingBureau: 'Public Grievance Redressal Cell (PGRC)',
    assignedOfficial: 'Shri Anil Verma (Redressal Officer)',
    status: 'Under Review',
    priority: 'Medium',
    category: 'Non-Refund of Caution Deposit',
    description: 'M.Tech students graduating batch 2025 reporting caution money (deposit) Rs. 15,000 refund pending. College administration wapsi nahi kar raha hai despite complete clearance.',
    language: 'Hinglish',
    complainantType: 'Student',
    dateOfReceipt: '2026-10-02',
    expectedDisposalDate: '2026-11-02',
    lastActionType: 'Notice Issued',
    lastActionDate: '2026-10-18',
    lastActionSummary: 'Directive sent to Finance Officer seeking refund status report within 10 days.',
    nextActionRequired: 'Verify bank disbursement proof.',
    supportingDocsCount: 2,
    isOverdue: false
  },
  {
    id: 'C-103',
    referenceNumber: 'AICTE/RB/2026/0674',
    institutionId: 'INST-004',
    institutionName: 'Kolkata Institute of Pharmaceutical Sciences',
    aictePermanentId: '1-33910244',
    receivingBureau: 'Regulation Bureau (RB)',
    assignedOfficial: 'Smt. Sunita Rao (Director, RB)',
    status: 'Escalated',
    priority: 'Critical',
    category: 'Infrastructure Deficiencies',
    description: 'Substandard chemical pharmacology laboratory facilities and non-functioning fire safety infrastructure reported, putting students at severe safety risk during practical examinations.',
    language: 'English',
    complainantType: 'Parent',
    dateOfReceipt: '2026-09-18',
    expectedDisposalDate: '2026-10-18',
    lastActionType: 'Inspection Ordered',
    lastActionDate: '2026-10-24',
    lastActionSummary: 'Surprise inspection recommended; referred to Standing Hearing Committee (SHC).',
    nextActionRequired: 'Schedule SHC hearing in Eastern Regional Office.',
    supportingDocsCount: 6,
    isOverdue: true
  },
  {
    id: 'C-104',
    referenceNumber: 'AICTE/AB/2026/0411',
    institutionId: 'INST-004',
    institutionName: 'Kolkata Institute of Pharmaceutical Sciences',
    aictePermanentId: '1-33910244',
    receivingBureau: 'Approval Bureau (AB)',
    assignedOfficial: 'Dr. K. Venkataraman (Advisor, AB)',
    status: 'Under Process',
    priority: 'High',
    category: 'Faculty Shortage & Qualifications',
    description: 'Discrepancies identified in teacher-student cadre ratio for B.Pharm program. Three assistant professors allegedly hold unaccredited degrees.',
    language: 'English',
    complainantType: 'Faculty',
    dateOfReceipt: '2026-09-25',
    expectedDisposalDate: '2026-10-25',
    lastActionType: 'Documents Requested',
    lastActionDate: '2026-10-20',
    lastActionSummary: 'Verification letter dispatched to issuing university registrar.',
    nextActionRequired: 'Standing Committee review pending.',
    supportingDocsCount: 4,
    isOverdue: true
  },
  {
    id: 'C-105',
    referenceNumber: 'AICTE/PGRC/2026/0202',
    institutionId: 'INST-006',
    institutionName: 'Bhopal Global Management Institute',
    aictePermanentId: '1-71928340',
    receivingBureau: 'Public Grievance Redressal Cell (PGRC)',
    assignedOfficial: 'Shri Anil Verma (Redressal Officer)',
    status: 'Awaiting Information',
    priority: 'Low',
    category: 'Misleading Advertisement',
    description: 'Promotional brochures and website claiming 100% international placement packages with false corporate tie-ups not recognized by AICTE placement guidelines.',
    language: 'English',
    complainantType: 'Student',
    dateOfReceipt: '2026-10-10',
    expectedDisposalDate: '2026-11-10',
    lastActionType: 'Notice Issued',
    lastActionDate: '2026-10-19',
    lastActionSummary: 'Institution asked to submit certified copy of previous 3 years placement audit reports.',
    nextActionRequired: 'Pending institutional reply.',
    supportingDocsCount: 1,
    isOverdue: false
  }
];

export const INITIAL_ALERTS: OverlapAlert[] = [
  {
    id: 'ALT-2026-088',
    newComplaintId: 'C-205',
    matchedComplaintId: 'C-101',
    institutionId: 'INST-001',
    institutionName: 'ABC Engineering College',
    aictePermanentId: '1-43598711',
    overallScore: 88,
    level1CoActivity: true,
    level2RelatedIssue: {
      isRelated: true,
      reason: 'Both complaints allege illegal extra fee collection beyond state fee committee caps under laboratory and development heads.',
      score: 88
    },
    level3ActionConflict: {
      hasConflict: true,
      conflictType: 'Pre-Action Warning: Document Request Duplication',
      details: 'Regulation Bureau already requested 3-year fee ledgers on 18 Oct 2026. Avoid issuing separate redundant document demand from PGRC.'
    },
    breakdown: {
      institutionScore: 40,
      semanticScore: 26,
      categoryScore: 14,
      proximityScore: 8,
      evidenceScore: 0
    },
    classification: 'Related Complaints (Coordination Required)',
    explanation: [
      'Level 1: Co-Activity active across Regulation Bureau (RB) and PGRC.',
      'Level 2: 86.7% semantic alignment on fee extortion terminology (40 pts ID + 26 pts NLP).',
      'Level 3: Regulation Bureau has already dispatched document demand AICTE/RB/2026/0842.'
    ],
    sharedKeywords: ['fees', 'unauthorized', 'prescribed', 'students', 'collection', 'development', 'shulk'],
    status: 'Pending Review',
    createdAt: '2026-10-26T14:15:00Z'
  }
];

export const INITIAL_COORDINATION_GROUPS: CoordinationGroup[] = [
  {
    id: 'CG-007',
    title: 'Sardar Patel College Faculty Cadre & Approval Audit',
    institutionId: 'INST-005',
    institutionName: 'Sardar Patel College of Engineering & Research',
    aictePermanentId: '1-49182371',
    complaintIds: ['C-011', 'C-019'],
    decision: 'Confirmed Related Cases',
    remarks: 'RB and AB coordinated joint inspection in September 2025. Deficiency resolved with appointment of approved faculty.',
    jointDirectives: [
      'Conduct coordinated inspection with nominee from Western Regional Office',
      'Joint scrutiny of faculty salary bank slips for 12 months'
    ],
    leadBureau: 'Regulation Bureau (RB)',
    participatingBureaus: ['Regulation Bureau (RB)', 'Approval Bureau (AB)'],
    sharedDocuments: [
      {
        id: 'DOC-001',
        documentTitle: 'Faculty Cadre Salary Ledger (12 Months)',
        requestedByBureau: 'Regulation Bureau (RB)',
        requestDate: '2025-09-18',
        status: 'Received & Verified'
      }
    ],
    createdBy: 'Smt. Sunita Rao (Director, RB)',
    createdAt: '2025-09-15T11:00:00Z',
    updatedAt: '2025-10-10T16:30:00Z',
    status: 'Resolved'
  }
];

export const INITIAL_ACTIONS: CaseAction[] = [
  {
    id: 'ACT-001',
    complaintId: 'C-101',
    timestamp: '2026-10-14T10:15:00Z',
    actor: 'Smt. Sunita Rao',
    actorBureau: 'Regulation Bureau (RB)',
    actionType: 'Notice Issued',
    details: 'Complaint registered and assigned to Fees & Capitation Desk.'
  },
  {
    id: 'ACT-002',
    complaintId: 'C-101',
    timestamp: '2026-10-18T14:30:00Z',
    actor: 'Smt. Sunita Rao',
    actorBureau: 'Regulation Bureau (RB)',
    actionType: 'Documents Requested',
    details: 'Formal order dispatched demanding 3-year fee ledger and bank statement submission from college management.'
  }
];

const genesisHash = 'GENESIS-BLOCK-AICTE-SAMANVAY';

const log1Timestamp = '2026-10-26T14:15:22Z';
const log1Actor = 'AICTE Samanvay Overlap Engine';
const log1Action = 'Level 1 & 2 Overlap Alert';
const log1Entity = 'ALT-2026-088';
const log1Details = 'Triggered 3-level overlap alert between C-205 (PGRC) and existing C-101 (RB) on ABC Engineering College.';
const log1Hash = computeAuditHash(log1Timestamp, log1Actor, log1Action, log1Entity, log1Details, genesisHash);

const log2Timestamp = '2026-10-26T18:30:12Z';
const log2Actor = 'Dr. Rajiv Kumar';
const log2Action = 'Executive Cross-Bureau Sync';
const log2Entity = 'SYS-SYNC-Q3';
const log2Details = 'Cross-Bureau coordination layer synchronized records across RB, PGRC, and AB.';
const log2Hash = computeAuditHash(log2Timestamp, log2Actor, log2Action, log2Entity, log2Details, log1Hash);

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-9011',
    timestamp: log2Timestamp,
    actor: log2Actor,
    actorRole: 'AICTE Senior Management (Member Secretary)',
    actorBureau: 'AICTE HQ Executive',
    action: log2Action,
    entityType: 'Security',
    entityId: log2Entity,
    details: log2Details,
    hash: log2Hash,
    previousHash: log1Hash
  },
  {
    id: 'AUD-9010',
    timestamp: log1Timestamp,
    actor: log1Actor,
    actorRole: 'System Daemon',
    actorBureau: 'AICTE HQ Executive',
    action: log1Action,
    entityType: 'OverlapAlert',
    entityId: log1Entity,
    details: log1Details,
    hash: log1Hash,
    previousHash: genesisHash
  }
];

// Sample Synthetic CSV data for the 1-Click Ingestion demonstration
export const SYNTHETIC_CSV_DATA = `CaseID,ReferenceNumber,AICTEPermanentID,InstitutionName,Bureau,Category,Description,Language,DateReceived,Priority
C-205,AICTE/PGRC/2026/0491,1-43598711,ABC Engineering College,Public Grievance Redressal Cell (PGRC),Unauthorized Fees / Capitation,"College students allege that administration is forcing extra Rs. 40,000 collection for lab and exam clearances beyond fee regulatory committee caps without giving official receipts.",English,2026-10-26,High
C-206,AICTE/RB/2026/0912,1-28114092,Vivekananda Institute of Technology & Science,Regulation Bureau (RB),Non-Refund of Caution Deposit,"M.Tech 2025 batch caution deposit refund pending. Management says accounts audit pending.",Hinglish,2026-10-25,Medium
C-207,AICTE/AB/2026/0129,1-10948211,Delhi National Institute of Engineering & Management,Approval Bureau (AB),Faculty Shortage & Qualifications,"MBA program faculty cadre ratio short by 4 associate professors during 2026 EoA inspection.",English,2026-10-24,Low`;
