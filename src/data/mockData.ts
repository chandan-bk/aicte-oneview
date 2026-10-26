import { Institution, Complaint, OverlapAlert, CoordinationGroup, CaseAction, AuditLogEntry, UserProfile } from '../types';

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
    complainantType: 'Whistleblower / Anonymous',
    dateOfReceipt: '2026-10-14',
    expectedDisposalDate: '2026-11-14',
    lastActionDate: '2026-10-21',
    lastActionSummary: 'Formal Show Cause Notice RB/MH/2026/77 dispatched to Management. Audit team requested ledger.',
    nextActionRequired: 'Review 15-day institutional reply and bank statement audit.',
    supportingDocsCount: 3,
    coordinationGroupId: undefined,
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
    complainantType: 'Faculty',
    dateOfReceipt: '2025-08-11',
    expectedDisposalDate: '2025-09-30',
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
    description: 'Graduating batch of 2025 M.Tech students petitioning non-refund of institutional caution deposit (Rs. 15,000 each) pending since August 2025 despite submission of all no-dues clearance forms.',
    complainantType: 'Student',
    dateOfReceipt: '2026-10-02',
    expectedDisposalDate: '2026-11-02',
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
    complainantType: 'Parent',
    dateOfReceipt: '2026-09-18',
    expectedDisposalDate: '2026-10-18',
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
    complainantType: 'Faculty',
    dateOfReceipt: '2026-09-25',
    expectedDisposalDate: '2026-10-25',
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
    complainantType: 'Student',
    dateOfReceipt: '2026-10-10',
    expectedDisposalDate: '2026-11-10',
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
    newComplaintId: 'C-205', // The SIH demo case to be confirmed
    matchedComplaintId: 'C-101',
    institutionId: 'INST-001',
    institutionName: 'ABC Engineering College',
    aictePermanentId: '1-43598711',
    overallScore: 88,
    breakdown: {
      institutionScore: 40,
      semanticScore: 26,
      categoryScore: 14,
      proximityScore: 8,
      evidenceScore: 0
    },
    classification: 'Related Complaints (Coordination Required)',
    explanation: [
      'Verified AICTE Permanent ID match: 1-43598711 (Full 40.0 pts)',
      'High semantic similarity (86.7%) between descriptions: Unauthorized fee demands vs unapproved fee collection (26.0 pts)',
      'Matching complaint category: Unauthorized Fees / Capitation (14.0 pts)',
      'Temporal proximity: Complaints received within 12 days of each other (8.0 pts)'
    ],
    sharedKeywords: ['fees', 'unauthorized', 'prescribed', 'students', 'collection', 'development', 'clearance'],
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
    actionType: 'Official Assigned',
    details: 'Complaint registered and assigned to Desk Officer 4 (Fees & Capitation Desk).'
  },
  {
    id: 'ACT-002',
    complaintId: 'C-101',
    timestamp: '2026-10-18T14:30:00Z',
    actor: 'Smt. Sunita Rao',
    actorBureau: 'Regulation Bureau (RB)',
    actionType: 'Notice Issued',
    details: 'Show cause notice AICTE/RB/SCN/2026/842 dispatched via speed post & email to Chairman, ABC Engineering College.'
  },
  {
    id: 'ACT-003',
    complaintId: 'C-101',
    timestamp: '2026-10-21T09:45:00Z',
    actor: 'Regulation Bureau (RB)',
    actorBureau: 'Regulation Bureau (RB)',
    actionType: 'Status Change',
    details: 'Status updated from Under Review to Under Process.'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-9011',
    timestamp: '2026-10-26T18:30:12Z',
    actor: 'Dr. Rajiv Kumar',
    actorRole: 'AICTE Senior Management (Member Secretary)',
    actorBureau: 'AICTE HQ Executive',
    action: 'Executive Council Overlap Health Audit',
    entityType: 'Security',
    entityId: 'SYS-AUDIT-Q3',
    details: 'Generated monthly inter-bureau cross-referencing audit report across RB, PGRC, and AB.',
    hash: 'SHA256:7f3b89a01e4281f9b30d12e4'
  },
  {
    id: 'AUD-9010',
    timestamp: '2026-10-26T14:15:22Z',
    actor: 'System Overlap Engine',
    actorRole: 'System Daemon',
    actorBureau: 'AICTE HQ Executive',
    action: 'Potential Overlap Detection Event',
    entityType: 'OverlapAlert',
    entityId: 'ALT-2026-088',
    details: 'Triggered overlap alert between C-205 (PGRC) and existing C-101 (RB) with 88.0% composite score.',
    hash: 'SHA256:5c829e1f409bc2456aa109d7'
  },
  {
    id: 'AUD-9009',
    timestamp: '2026-10-21T09:45:00Z',
    actor: 'Smt. Sunita Rao',
    actorRole: 'Regulation Bureau Officer (RB-Lead)',
    actorBureau: 'Regulation Bureau (RB)',
    action: 'Case Status Modification',
    entityType: 'Complaint',
    entityId: 'C-101',
    details: 'Updated status to Under Process following dispatch of formal Show Cause Notice.',
    hash: 'SHA256:4d712e098a5142cb911002ac'
  }
];
