/**
 * Automated Verification Script for AICTE Samanvay
 * Validates CSV parsing, institution isolation, duplicate prevention, 
 * 3-level overlap engine, Pre-Action Check, and cryptographic audit chain.
 */

import { parseAndValidateCsv } from '../src/services/csvParser.ts';
import { verifyAuditChain, computeAuditHash, GENESIS_BLOCK_HASH } from '../src/services/crypto.ts';
import { evaluate3LevelOverlap, checkPreActionAdvisory } from '../src/services/overlapEngine.ts';
import { Institution, Complaint } from '../src/types/index.ts';

// Mock registry
const MOCK_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    aictePermanentId: '1-43598711',
    name: 'ABC Engineering College',
    category: 'Engineering & Tech',
    region: 'Western',
    state: 'Maharashtra',
    city: 'Pune',
    address: 'Sector 4, Hinjawadi',
    principalName: 'Dr. Ramesh Patil',
    contactEmail: 'principal@abcengg.edu.in',
    contactPhone: '+91 20 2234 5678',
    totalComplaints: 2,
    pendingComplaints: 2,
    activeOverlaps: 1,
    riskRating: 'High',
    establishedYear: 2004,
    affiliatingUniversity: 'Savitribai Phule Pune University'
  },
  {
    id: 'inst-2',
    aictePermanentId: '1-28114092',
    name: 'Vivekananda Institute of Technology & Science',
    category: 'Engineering & Tech',
    region: 'Central',
    state: 'Madhya Pradesh',
    city: 'Bhopal',
    address: 'Bypass Road, Gandhi Nagar',
    principalName: 'Dr. Sunita Sharma',
    contactEmail: 'info@vitsbhopal.ac.in',
    contactPhone: '+91 755 289 1100',
    totalComplaints: 1,
    pendingComplaints: 1,
    activeOverlaps: 0,
    riskRating: 'Moderate',
    establishedYear: 2008,
    affiliatingUniversity: 'RGPV Bhopal'
  }
];

const EXISTING_COMPLAINTS: Complaint[] = [
  {
    id: 'C-101',
    referenceNumber: 'AICTE/RB/2026/0842',
    institutionId: 'inst-1',
    institutionName: 'ABC Engineering College',
    aictePermanentId: '1-43598711',
    receivingBureau: 'Regulation Bureau (RB)',
    assignedOfficial: 'Desk Officer',
    status: 'Under Review',
    priority: 'High',
    category: 'Unauthorized Fees / Capitation',
    description: 'Statutory audit discrepancy concerning development charges and laboratory fees collected without approval.',
    complainantType: 'Whistleblower / Anonymous',
    dateOfReceipt: '2026-10-18',
    expectedDisposalDate: '2026-11-18',
    lastActionType: 'Documents Requested',
    lastActionDate: '2026-10-18',
    lastActionSummary: 'Demanded 3-year fee ledger.',
    nextActionRequired: 'Scrutinize ledger.',
    supportingDocsCount: 3
  }
];

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
  }
}

console.log('\n======================================================');
console.log('AICTE SAMANVAY — COMPREHENSIVE BUSINESS LOGIC VERIFICATION');
console.log('======================================================\n');

// 1. CSV INGESTION & INSTITUTION RESOLUTION TESTS
console.log('--- 1. CSV Parsing & Institution Resolution Tests ---');

// Test 1: Valid CSV with known institution
const validCsv = `CaseID,ReferenceNumber,AICTEPermanentID,InstitutionName,Bureau,Category,Description,Priority,Date
C-501,AICTE/PGRC/2026/101,1-43598711,ABC Engineering College,Public Grievance Redressal Cell (PGRC),Unauthorized Fees / Capitation,"College demanding unauthorized building development fund of Rs 35000 before issuing semester hall tickets.",High,2026-10-26`;

const res1 = parseAndValidateCsv(validCsv, MOCK_INSTITUTIONS, EXISTING_COMPLAINTS);
assert(res1.accepted.length === 1 && res1.accepted[0].institutionId === 'inst-1', 'Valid CSV accepted and matched to correct institution');
assert(res1.accepted[0].lastActionType === undefined, 'Imported row has no fabricated "Notice Issued" action');

// Test 2: CSV with unknown institution (MUST REJECT, NEVER FALLBACK)
const unknownCollegeCsv = `CaseID,ReferenceNumber,AICTEPermanentID,InstitutionName,Bureau,Category,Description,Priority,Date
C-502,AICTE/PGRC/2026/102,9-99999999,Unknown Mars Institute of Space,Public Grievance Redressal Cell (PGRC),Unauthorized Fees / Capitation,"Demanding extra fees.",High,2026-10-26`;

const res2 = parseAndValidateCsv(unknownCollegeCsv, MOCK_INSTITUTIONS, EXISTING_COMPLAINTS);
assert(res2.accepted.length === 0, 'Unknown institution row is NOT accepted');
assert(res2.rejected.length === 1 && res2.rejected[0].reason.includes('Unresolved institution identity'), 'Unknown institution is quarantined with explicit reason');

// Test 3: CSV with duplicate Case ID
const dupCaseIdCsv = `CaseID,ReferenceNumber,AICTEPermanentID,InstitutionName,Bureau,Category,Description,Priority,Date
C-101,AICTE/PGRC/2026/103,1-43598711,ABC Engineering College,Public Grievance Redressal Cell (PGRC),Unauthorized Fees / Capitation,"Another complaint with duplicate C-101 ID.",High,2026-10-26`;

const res3 = parseAndValidateCsv(dupCaseIdCsv, MOCK_INSTITUTIONS, EXISTING_COMPLAINTS);
assert(res3.accepted.length === 0 && res3.rejected[0].reason.includes('Duplicate Case ID'), 'Duplicate Case ID rejected');

// Test 4: CSV with invalid bureau
const invalidBureauCsv = `CaseID,ReferenceNumber,AICTEPermanentID,InstitutionName,Bureau,Category,Description,Priority,Date
C-504,AICTE/XYZ/2026/104,1-43598711,ABC Engineering College,Space Flight Division,Unauthorized Fees / Capitation,"Valid description of fee grievance.",High,2026-10-26`;

const res4 = parseAndValidateCsv(invalidBureauCsv, MOCK_INSTITUTIONS, EXISTING_COMPLAINTS);
assert(res4.accepted.length === 0 && res4.rejected[0].reason.includes('Invalid or unrecognized Bureau'), 'Invalid bureau rejected; not silently defaulted');

// Test 5: CSV with 3 complaints for 1 institution
const multiRowCsv = `CaseID,ReferenceNumber,AICTEPermanentID,InstitutionName,Bureau,Category,Description,Priority,Date
C-601,AICTE/PGRC/2026/111,1-43598711,ABC Engineering College,Public Grievance Redressal Cell (PGRC),Unauthorized Fees / Capitation,"Fee complaint 1 description text here.",High,2026-10-26
C-602,AICTE/PGRC/2026/112,1-43598711,ABC Engineering College,Public Grievance Redressal Cell (PGRC),Unauthorized Fees / Capitation,"Fee complaint 2 description text here.",High,2026-10-26
C-603,AICTE/PGRC/2026/113,1-43598711,ABC Engineering College,Public Grievance Redressal Cell (PGRC),Unauthorized Fees / Capitation,"Fee complaint 3 description text here.",High,2026-10-26`;

const res5 = parseAndValidateCsv(multiRowCsv, MOCK_INSTITUTIONS, EXISTING_COMPLAINTS);
assert(res5.accepted.length === 3, 'All 3 rows accepted for institution ABC');

// 2. CRYPTOGRAPHIC AUDIT CHAIN VERIFICATION TESTS
console.log('\n--- 2. Cryptographic SHA-256 Audit Chain Tests ---');

// Build authentic chain: Genesis -> Log 1 -> Log 2
const ts1 = '2026-10-26T10:00:00Z';
const hash1 = computeAuditHash(ts1, 'Officer A', 'Case Registration', 'C-101', 'Ingested case', GENESIS_BLOCK_HASH);

const ts2 = '2026-10-26T11:00:00Z';
const hash2 = computeAuditHash(ts2, 'Officer B', 'Overlap Review', 'ALT-01', 'Reviewed overlap', hash1);

// Newest-first array: [log2, log1]
const authenticLogs = [
  {
    id: 'AUD-02',
    timestamp: ts2,
    actor: 'Officer B',
    action: 'Overlap Review',
    entityId: 'ALT-01',
    details: 'Reviewed overlap',
    hash: hash2,
    previousHash: hash1
  },
  {
    id: 'AUD-01',
    timestamp: ts1,
    actor: 'Officer A',
    action: 'Case Registration',
    entityId: 'C-101',
    details: 'Ingested case',
    hash: hash1,
    previousHash: GENESIS_BLOCK_HASH
  }
];

// Test 6: Authentic chain verification passes
const chainResult1 = verifyAuditChain(authenticLogs);
assert(chainResult1.isValid === true && chainResult1.verifiedCount === 2 && chainResult1.genesisVerified === true, 'Authentic audit chain passes verification 100%');

// Test 7: Tampered payload verification fails
const tamperedPayloadLogs = [
  {
    ...authenticLogs[0],
    details: 'Altered details: backdoor waiver granted'
  },
  authenticLogs[1]
];
const chainResult2 = verifyAuditChain(tamperedPayloadLogs);
assert(chainResult2.isValid === false && chainResult2.brokenIndex === 0, 'Tampered payload detected and rejected at index 0');

// Test 8: Broken predecessor link verification fails
const brokenLinkLogs = [
  {
    ...authenticLogs[0],
    previousHash: 'FAKE-HASH-DOES-NOT-MATCH'
  },
  authenticLogs[1]
];
const chainResult3 = verifyAuditChain(brokenLinkLogs);
assert(chainResult3.isValid === false, 'Broken predecessor link detected and rejected');

// Test 9: Unicode / Hindi UTF-8 hashing
const hindiTs = '2026-10-26T12:00:00Z';
const hindiHash1 = computeAuditHash(hindiTs, 'अधिकारी', 'जांच', 'C-HINDI', 'छात्रों से अतिरिक्त अवैध शुल्क वसूली', GENESIS_BLOCK_HASH);
const hindiHash2 = computeAuditHash(hindiTs, 'अधिकारी', 'जांच', 'C-HINDI', 'छात्रों से अतिरिक्त अवैध शुल्क वसूली', GENESIS_BLOCK_HASH);
assert(hindiHash1 === hindiHash2 && hindiHash1.startsWith('SHA256:'), 'UTF-8 byte hashing produces deterministic SHA-256 for Devanagari Hindi text');

// 3. 3-LEVEL OVERLAP ENGINE & PRE-ACTION CHECK TESTS
console.log('\n--- 3. Overlap Engine & Pre-Action Check Tests ---');

// Test 10: Unrelated complaints on same college (e.g. fees vs ragging) MUST NOT trigger duplicate document request warning
const unrelatedComplaint: Partial<Complaint> = {
  id: 'C-701',
  institutionId: 'inst-1',
  institutionName: 'ABC Engineering College',
  aictePermanentId: '1-43598711',
  receivingBureau: 'Public Grievance Redressal Cell (PGRC)',
  category: 'Ragging / Harassment',
  description: 'First year hostel students petitioning regarding senior intimidation in dining hall.',
  dateOfReceipt: '2026-10-26',
  supportingDocsCount: 1
};

const unrelatedAlert = evaluate3LevelOverlap(unrelatedComplaint, EXISTING_COMPLAINTS, MOCK_INSTITUTIONS[0]);
// It may detect L1 Co-Activity, but L3 duplicate document warning must NOT be triggered because issue is unrelated
assert(
  unrelatedAlert === null || !unrelatedAlert.level3ActionConflict?.hasConflict,
  'Unrelated complaint on same college does NOT trigger false duplicate action warning'
);

// Test 11: Related fee complaint on same college TRIGGERS L1, L2, and L3
const relatedFeeComplaint: Partial<Complaint> = {
  id: 'C-702',
  institutionId: 'inst-1',
  institutionName: 'ABC Engineering College',
  aictePermanentId: '1-43598711',
  receivingBureau: 'Public Grievance Redressal Cell (PGRC)',
  category: 'Unauthorized Fees / Capitation',
  description: 'Students allege administration is charging extra Rs 40000 compulsory lab and tuition fee without official receipts.',
  dateOfReceipt: '2026-10-26',
  supportingDocsCount: 3
};

const relatedAlert = evaluate3LevelOverlap(relatedFeeComplaint, EXISTING_COMPLAINTS, MOCK_INSTITUTIONS[0]);
assert(relatedAlert !== null, 'Related fee complaint triggers overlap alert');
assert(relatedAlert?.level1CoActivity === true, 'L1 Co-Activity detected (RB + PGRC active on same college)');
assert(relatedAlert?.level2RelatedIssue.isRelated === true, 'L2 Related Issue detected (high domain and textual overlap)');
assert(relatedAlert?.level3ActionConflict?.hasConflict === true, 'L3 Action Conflict detected against existing C-101 Documents Requested');

// Test 12: Pre-Action Check accurately flags duplicate document demand
const advisory = checkPreActionAdvisory('Documents Requested', relatedFeeComplaint as Complaint, EXISTING_COMPLAINTS);
assert(advisory !== null && advisory.hasConflict === true, 'Pre-Action Check warns against duplicate document demand');
assert(advisory?.conflictingBureau === 'Regulation Bureau (RB)', 'Pre-Action Check correctly attributes prior action to Regulation Bureau');

console.log('\n======================================================');
console.log(`SUMMARY: ${passedTests} / ${totalTests} assertions PASSED!`);
console.log('======================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
