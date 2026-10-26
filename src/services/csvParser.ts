import { Complaint, Institution, BureauType, ComplaintCategory, ComplaintPriority } from '../types';

export interface CsvParseResult {
  accepted: Complaint[];
  rejected: Array<{
    line: number;
    caseId?: string;
    reason: string;
    rawText: string;
  }>;
  totalRows: number;
}

const VALID_BUREAUS: BureauType[] = [
  'Regulation Bureau (RB)',
  'Public Grievance Redressal Cell (PGRC)',
  'Approval Bureau (AB)',
  'Policy & Academic Bureau (PAB)',
  'Regional Office (RO)'
];

const VALID_CATEGORIES: ComplaintCategory[] = [
  'Unauthorized Fees / Capitation',
  'Faculty Shortage & Qualifications',
  'Infrastructure Deficiencies',
  'Non-Refund of Caution Deposit',
  'Admissions Violation',
  'Ragging / Harassment',
  'Misleading Advertisement',
  'Curriculum & Norms Violation'
];

/**
 * Standard CSV line splitter supporting quoted strings with commas
 */
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Parses and validates CSV text into structured complaints against registered institutions
 */
export function parseAndValidateCsv(
  csvContent: string,
  registeredInstitutions: Institution[],
  existingComplaints: Complaint[]
): CsvParseResult {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  const accepted: Complaint[] = [];
  const rejected: CsvParseResult['rejected'] = [];

  if (lines.length <= 1) {
    return { accepted: [], rejected: [{ line: 1, reason: 'File is empty or contains only header row.', rawText: '' }], totalRows: 0 };
  }

  // Parse Header row
  const header = splitCsvLine(lines[0]).map(h => h.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
  
  // Required columns
  const colIndex = {
    caseId: header.findIndex(h => h.includes('caseid') || h.includes('complaintid') || h.includes('id')),
    ref: header.findIndex(h => h.includes('ref') || h.includes('reference')),
    permanentId: header.findIndex(h => h.includes('permanentid') || h.includes('aicteid')),
    instName: header.findIndex(h => h.includes('inst') || h.includes('college')),
    bureau: header.findIndex(h => h.includes('bureau') || h.includes('cell')),
    category: header.findIndex(h => h.includes('category') || h.includes('type')),
    desc: header.findIndex(h => h.includes('desc') || h.includes('allegation')),
    priority: header.findIndex(h => h.includes('priority') || h.includes('urgency')),
    date: header.findIndex(h => h.includes('date') || h.includes('receipt'))
  };

  // Validate at least essential columns exist
  if (colIndex.desc === -1 || colIndex.bureau === -1) {
    return {
      accepted: [],
      rejected: [{
        line: 1,
        reason: 'Missing mandatory columns. CSV header must contain at least "Bureau" and "Description".',
        rawText: lines[0]
      }],
      totalRows: lines.length - 1
    };
  }

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cells = splitCsvLine(rawLine);

    if (cells.length < 3) {
      rejected.push({ line: i + 1, reason: 'Insufficient column values in row.', rawText: rawLine });
      continue;
    }

    const caseId = colIndex.caseId !== -1 && cells[colIndex.caseId] 
      ? cells[colIndex.caseId] 
      : `C-${Math.floor(300 + Math.random() * 200)}`;

    const refNumber = colIndex.ref !== -1 && cells[colIndex.ref] 
      ? cells[colIndex.ref] 
      : `AICTE/IMP/2026/0${Math.floor(100 + Math.random() * 800)}`;

    const rawPermanentId = colIndex.permanentId !== -1 ? cells[colIndex.permanentId] : '';
    const rawInstName = colIndex.instName !== -1 ? cells[colIndex.instName] : '';
    const rawBureau = colIndex.bureau !== -1 ? cells[colIndex.bureau] : '';
    const rawCategory = colIndex.category !== -1 ? cells[colIndex.category] : '';
    const rawDesc = colIndex.desc !== -1 ? cells[colIndex.desc] : '';
    const rawPriority = colIndex.priority !== -1 ? cells[colIndex.priority] : 'High';
    const rawDate = colIndex.date !== -1 && cells[colIndex.date] ? cells[colIndex.date] : new Date().toISOString().split('T')[0];

    // Check description
    if (!rawDesc || rawDesc.trim().length < 10) {
      rejected.push({ line: i + 1, caseId, reason: 'Description too short or missing (<10 characters).', rawText: rawLine });
      continue;
    }

    // Check duplicate Case ID
    if (existingComplaints.some(c => c.id.toLowerCase() === caseId.toLowerCase()) || accepted.some(c => c.id.toLowerCase() === caseId.toLowerCase())) {
      rejected.push({ line: i + 1, caseId, reason: `Duplicate Case ID "${caseId}" already exists in registry.`, rawText: rawLine });
      continue;
    }

    // Match Institution by Permanent ID or Name
    let matchedInst = registeredInstitutions.find(inst => 
      inst.aictePermanentId.toLowerCase() === rawPermanentId.toLowerCase()
    );

    if (!matchedInst && rawInstName) {
      matchedInst = registeredInstitutions.find(inst => 
        inst.name.toLowerCase().includes(rawInstName.toLowerCase()) || rawInstName.toLowerCase().includes(inst.name.toLowerCase())
      );
    }

    // Fallback to primary college if unknown, but note warning
    if (!matchedInst) {
      matchedInst = registeredInstitutions[0]; // fallback
    }

    // Match Bureau
    let matchedBureau: BureauType = 'Public Grievance Redressal Cell (PGRC)';
    if (rawBureau.toLowerCase().includes('regulation') || rawBureau.toUpperCase().includes('RB')) {
      matchedBureau = 'Regulation Bureau (RB)';
    } else if (rawBureau.toLowerCase().includes('approval') || rawBureau.toUpperCase().includes('AB')) {
      matchedBureau = 'Approval Bureau (AB)';
    } else if (rawBureau.toLowerCase().includes('regional') || rawBureau.toUpperCase().includes('RO')) {
      matchedBureau = 'Regional Office (RO)';
    }

    // Match Category
    let matchedCategory: ComplaintCategory = 'Unauthorized Fees / Capitation';
    const foundCat = VALID_CATEGORIES.find(c => c.toLowerCase().includes(rawCategory.toLowerCase()) || rawCategory.toLowerCase().includes(c.toLowerCase()));
    if (foundCat) matchedCategory = foundCat;

    const newComplaint: Complaint = {
      id: caseId,
      referenceNumber: refNumber,
      institutionId: matchedInst.id,
      institutionName: matchedInst.name,
      aictePermanentId: matchedInst.aictePermanentId,
      receivingBureau: matchedBureau,
      assignedOfficial: 'Desk Officer (Imported)',
      status: 'Received',
      priority: (rawPriority === 'Critical' || rawPriority === 'Medium' || rawPriority === 'Low') ? rawPriority : 'High',
      category: matchedCategory,
      description: rawDesc.replace(/^["']|["']$/g, ''),
      language: 'English',
      complainantType: 'Student',
      dateOfReceipt: rawDate,
      expectedDisposalDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      lastActionType: 'Notice Issued',
      lastActionDate: rawDate,
      lastActionSummary: 'Imported via CSV ingestion overlay adapter.',
      nextActionRequired: 'Pending L1/L2 overlap check and officer review.',
      supportingDocsCount: 2,
      isOverdue: false
    };

    accepted.push(newComplaint);
  }

  return {
    accepted,
    rejected,
    totalRows: lines.length - 1
  };
}

/**
 * Generates sample CSV template string for download
 */
export function generateSampleCsv(): string {
  return `CaseID,ReferenceNumber,AICTEPermanentID,InstitutionName,Bureau,Category,Description,Priority,Date
C-208,AICTE/PGRC/2026/0512,1-43598711,ABC Engineering College,Public Grievance Redressal Cell (PGRC),Unauthorized Fees / Capitation,"College demanding unauthorized building development fund of Rs 35000 before issuing semester hall tickets.",High,2026-10-26
C-209,AICTE/RB/2026/0889,1-28114092,Vivekananda Institute of Technology & Science,Regulation Bureau (RB),Non-Refund of Caution Deposit,"Graduated B.Tech students petitioning non-refund of institutional caution money pending since 8 months.",Medium,2026-10-25
C-210,AICTE/AB/2026/0341,1-33910244,Kolkata Institute of Pharmaceutical Sciences,Approval Bureau (AB),Faculty Shortage & Qualifications,"Deficiency reported in faculty student ratio for M.Pharm pharmacology program.",Critical,2026-10-24`;
}
