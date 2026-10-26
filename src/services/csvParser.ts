import { Complaint, Institution, BureauType, ComplaintCategory, ComplaintPriority, ActionVocabulary } from '../types';

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

const VALID_ACTIONS: ActionVocabulary[] = [
  'Notice Issued',
  'Documents Requested',
  'Inspection Ordered',
  'Hearing Scheduled',
  'Case Closed',
  'Transferred'
];

/**
 * Standard CSV line splitter supporting quoted strings with commas and escaped quotes ("")
 */
export function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Escaped double quote
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
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
 * Normalizes text for controlled string matching (removes symbols and whitespace)
 */
function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Parses and strictly validates CSV text into structured complaints against registered institutions.
 * Rejects rows with unresolved institutions, invalid bureaus, invalid categories, duplicate IDs, or malformed data.
 */
export function parseAndValidateCsv(
  csvContent: string,
  registeredInstitutions: Institution[],
  existingComplaints: Complaint[]
): CsvParseResult {
  if (!csvContent || csvContent.trim().length === 0) {
    return { 
      accepted: [], 
      rejected: [{ line: 1, reason: 'File is empty.', rawText: '' }], 
      totalRows: 0 
    };
  }

  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  const accepted: Complaint[] = [];
  const rejected: CsvParseResult['rejected'] = [];

  if (lines.length <= 1) {
    return { 
      accepted: [], 
      rejected: [{ line: 1, reason: 'File contains only a header row with no data records.', rawText: lines[0] || '' }], 
      totalRows: 0 
    };
  }

  if (registeredInstitutions.length === 0) {
    return {
      accepted: [],
      rejected: [{ line: 1, reason: 'Institution registry is empty; cannot validate college identities.', rawText: lines[0] }],
      totalRows: lines.length - 1
    };
  }

  // Parse Header row
  const header = splitCsvLine(lines[0]).map(h => h.replace(/[^a-zA-Z0-9]/g, '').toLowerCase());
  
  // Column index identification
  const colIndex = {
    caseId: header.findIndex(h => h.includes('caseid') || h.includes('complaintid') || h === 'id'),
    ref: header.findIndex(h => h.includes('ref') || h.includes('reference')),
    permanentId: header.findIndex(h => h.includes('permanentid') || h.includes('aicteid') || h.includes('pid')),
    instName: header.findIndex(h => h.includes('inst') || h.includes('college') || h.includes('university')),
    bureau: header.findIndex(h => h.includes('bureau') || h.includes('cell')),
    category: header.findIndex(h => h.includes('category') || h.includes('grievancetype') || h.includes('type')),
    desc: header.findIndex(h => h.includes('desc') || h.includes('allegation') || h.includes('particulars')),
    priority: header.findIndex(h => h.includes('priority') || h.includes('urgency')),
    date: header.findIndex(h => h.includes('date') || h.includes('receipt')),
    actionType: header.findIndex(h => h.includes('actiontype') || h.includes('lastaction')),
    actionDate: header.findIndex(h => h.includes('actiondate'))
  };

  // Validate mandatory headers
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

    const rawCaseId = colIndex.caseId !== -1 ? cells[colIndex.caseId]?.trim() : '';
    const caseId = rawCaseId || `C-CSV-${Date.now().toString().slice(-4)}-${i}`;

    const rawPermanentId = colIndex.permanentId !== -1 ? cells[colIndex.permanentId]?.trim() : '';
    const rawInstName = colIndex.instName !== -1 ? cells[colIndex.instName]?.trim() : '';
    const rawBureau = colIndex.bureau !== -1 ? cells[colIndex.bureau]?.trim() : '';
    const rawCategory = colIndex.category !== -1 ? cells[colIndex.category]?.trim() : '';
    const rawDesc = colIndex.desc !== -1 ? cells[colIndex.desc]?.trim() : '';
    const rawPriority = colIndex.priority !== -1 ? cells[colIndex.priority]?.trim() : 'High';
    const rawDate = colIndex.date !== -1 && cells[colIndex.date] ? cells[colIndex.date]?.trim() : '';
    const rawActionType = colIndex.actionType !== -1 && cells[colIndex.actionType] ? cells[colIndex.actionType]?.trim() : '';
    const rawActionDate = colIndex.actionDate !== -1 && cells[colIndex.actionDate] ? cells[colIndex.actionDate]?.trim() : '';

    // 1. Validate Description
    if (!rawDesc || rawDesc.length < 10) {
      rejected.push({ 
        line: i + 1, 
        caseId, 
        reason: 'Description too short or missing (<10 characters). Meaningful grievance particulars required.', 
        rawText: rawLine 
      });
      continue;
    }

    // 2. Validate Duplicate Case ID (against both existing registry and current import batch)
    const isDuplicate = existingComplaints.some(c => c.id.toLowerCase() === caseId.toLowerCase()) || 
                       accepted.some(c => c.id.toLowerCase() === caseId.toLowerCase());
    if (isDuplicate) {
      rejected.push({ 
        line: i + 1, 
        caseId, 
        reason: `Duplicate Case ID "${caseId}" already exists in registry or within this upload batch.`, 
        rawText: rawLine 
      });
      continue;
    }

    // 3. Institution Resolution (Safe: never silently assigns to first college)
    let matchedInst: Institution | undefined = undefined;

    // A. Match by exact AICTE Permanent ID
    if (rawPermanentId) {
      const cleanPid = rawPermanentId.toLowerCase();
      matchedInst = registeredInstitutions.find(inst => 
        inst.aictePermanentId.toLowerCase() === cleanPid
      );
    }

    // B. If not found by Permanent ID, attempt exact normalized name matching
    if (!matchedInst && rawInstName) {
      const normInput = normalizeText(rawInstName);
      if (normInput.length >= 5) {
        matchedInst = registeredInstitutions.find(inst => 
          normalizeText(inst.name) === normInput
        );
      }
    }

    // C. Strict rejection if institution identity cannot be resolved
    if (!matchedInst) {
      rejected.push({
        line: i + 1,
        caseId,
        reason: `Unresolved institution identity: Permanent ID "${rawPermanentId || 'N/A'}" / Name "${rawInstName || 'N/A'}" not recognized in registry. Quarantined to prevent false association.`,
        rawText: rawLine
      });
      continue;
    }

    // 4. Validate Bureau (Strict: no silent fallback to PGRC)
    const rawBureauLower = rawBureau.toLowerCase();
    let matchedBureau: BureauType | null = null;
    if (rawBureauLower.includes('regulation') || rawBureauLower === 'rb' || rawBureauLower.includes('(rb)')) {
      matchedBureau = 'Regulation Bureau (RB)';
    } else if (rawBureauLower.includes('grievance') || rawBureauLower.includes('pgrc') || rawBureauLower === 'pgrc' || rawBureauLower.includes('(pgrc)')) {
      matchedBureau = 'Public Grievance Redressal Cell (PGRC)';
    } else if (rawBureauLower.includes('approval') || rawBureauLower === 'ab' || rawBureauLower.includes('(ab)')) {
      matchedBureau = 'Approval Bureau (AB)';
    } else if (rawBureauLower.includes('policy') || rawBureauLower.includes('pab') || rawBureauLower === 'pab' || rawBureauLower.includes('(pab)')) {
      matchedBureau = 'Policy & Academic Bureau (PAB)';
    } else if (rawBureauLower.includes('regional') || rawBureauLower === 'ro' || rawBureauLower.includes('(ro)')) {
      matchedBureau = 'Regional Office (RO)';
    }

    if (!matchedBureau) {
      rejected.push({
        line: i + 1,
        caseId,
        reason: `Invalid or unrecognized Bureau: "${rawBureau}". Expected one of: Regulation Bureau (RB), Public Grievance Redressal Cell (PGRC), Approval Bureau (AB), Policy & Academic Bureau (PAB), Regional Office (RO).`,
        rawText: rawLine
      });
      continue;
    }

    // 5. Validate Category (Strict: avoid includes('') match)
    const rawCatLower = rawCategory.toLowerCase();
    if (!rawCatLower) {
      rejected.push({
        line: i + 1,
        caseId,
        reason: 'Mandatory grievance category is missing.',
        rawText: rawLine
      });
      continue;
    }

    let matchedCategory: ComplaintCategory | null = null;
    if (rawCatLower.includes('fee') || rawCatLower.includes('capitation') || rawCatLower.includes('shulk')) {
      matchedCategory = 'Unauthorized Fees / Capitation';
    } else if (rawCatLower.includes('faculty') || rawCatLower.includes('teacher') || rawCatLower.includes('qualification')) {
      matchedCategory = 'Faculty Shortage & Qualifications';
    } else if (rawCatLower.includes('infrastructure') || rawCatLower.includes('facility') || rawCatLower.includes('building') || rawCatLower.includes('lab')) {
      matchedCategory = 'Infrastructure Deficiencies';
    } else if (rawCatLower.includes('deposit') || rawCatLower.includes('refund') || rawCatLower.includes('caution')) {
      matchedCategory = 'Non-Refund of Caution Deposit';
    } else if (rawCatLower.includes('admission') || rawCatLower.includes('intake') || rawCatLower.includes('quota')) {
      matchedCategory = 'Admissions Violation';
    } else if (rawCatLower.includes('ragging') || rawCatLower.includes('harassment')) {
      matchedCategory = 'Ragging / Harassment';
    } else if (rawCatLower.includes('advertisement') || rawCatLower.includes('misleading')) {
      matchedCategory = 'Misleading Advertisement';
    } else if (rawCatLower.includes('curriculum') || rawCatLower.includes('norms')) {
      matchedCategory = 'Curriculum & Norms Violation';
    }

    if (!matchedCategory) {
      rejected.push({
        line: i + 1,
        caseId,
        reason: `Unrecognized grievance category: "${rawCategory}". Must match standard AICTE grievance categories.`,
        rawText: rawLine
      });
      continue;
    }

    // 6. Validate Priority (Strict)
    const rawPriLower = rawPriority.toLowerCase();
    let matchedPriority: ComplaintPriority | null = null;
    if (rawPriLower === 'critical') matchedPriority = 'Critical';
    else if (rawPriLower === 'high') matchedPriority = 'High';
    else if (rawPriLower === 'medium') matchedPriority = 'Medium';
    else if (rawPriLower === 'low') matchedPriority = 'Low';

    if (!matchedPriority) {
      rejected.push({
        line: i + 1,
        caseId,
        reason: `Invalid priority level: "${rawPriority}". Must be Critical, High, Medium, or Low.`,
        rawText: rawLine
      });
      continue;
    }

    // 7. Validate Date
    let parsedDate = rawDate;
    if (rawDate) {
      const time = Date.parse(rawDate);
      if (isNaN(time)) {
        rejected.push({
          line: i + 1,
          caseId,
          reason: `Invalid receipt date format: "${rawDate}". Expected valid date (YYYY-MM-DD).`,
          rawText: rawLine
        });
        continue;
      }
    } else {
      parsedDate = new Date().toISOString().split('T')[0];
    }

    // 8. Action History Handling (Do NOT fabricate "Notice Issued")
    let validatedActionType: ActionVocabulary | undefined = undefined;
    let validatedActionDate: string | undefined = undefined;
    let validatedActionSummary = 'Imported via CSV ingestion overlay adapter; no prior bureau action recorded.';

    if (rawActionType) {
      const matchedAction = VALID_ACTIONS.find(a => 
        a.toLowerCase() === rawActionType.toLowerCase() ||
        a.toLowerCase().includes(rawActionType.toLowerCase())
      );
      if (matchedAction) {
        validatedActionType = matchedAction;
        validatedActionDate = rawActionDate || parsedDate;
        validatedActionSummary = `Historical action '${matchedAction}' recorded from source record.`;
      }
    }

    const refNumber = colIndex.ref !== -1 && cells[colIndex.ref] 
      ? cells[colIndex.ref].trim()
      : `AICTE/${matchedBureau.includes('PGRC') ? 'PGRC' : 'RB'}/2026/0${Math.floor(100 + Math.random() * 800)}`;

    const newComplaint: Complaint = {
      id: caseId,
      referenceNumber: refNumber,
      institutionId: matchedInst.id,
      institutionName: matchedInst.name,
      aictePermanentId: matchedInst.aictePermanentId,
      receivingBureau: matchedBureau,
      assignedOfficial: 'Desk Officer (Imported)',
      status: 'Received',
      priority: matchedPriority,
      category: matchedCategory,
      description: rawDesc.replace(/^["']|["']$/g, ''),
      language: 'English',
      complainantType: 'Student',
      dateOfReceipt: parsedDate,
      expectedDisposalDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      lastActionType: validatedActionType,
      lastActionDate: validatedActionDate,
      lastActionSummary: validatedActionSummary,
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
 * Generates sample CSV template string for download with valid columns and format
 */
export function generateSampleCsv(): string {
  return `CaseID,ReferenceNumber,AICTEPermanentID,InstitutionName,Bureau,Category,Description,Priority,Date
C-208,AICTE/PGRC/2026/0512,1-43598711,ABC Engineering College,Public Grievance Redressal Cell (PGRC),Unauthorized Fees / Capitation,"College demanding unauthorized building development fund of Rs 35000 before issuing semester hall tickets.",High,2026-10-26
C-209,AICTE/RB/2026/0889,1-28114092,Vivekananda Institute of Technology & Science,Regulation Bureau (RB),Non-Refund of Caution Deposit,"Graduated B.Tech students petitioning non-refund of institutional caution money pending since 8 months.",Medium,2026-10-25
C-210,AICTE/AB/2026/0341,1-10948211,Delhi National Institute of Engineering & Management,Approval Bureau (AB),Faculty Shortage & Qualifications,"Deficiency reported in faculty student ratio for M.Tech program.",Critical,2026-10-24`;
}