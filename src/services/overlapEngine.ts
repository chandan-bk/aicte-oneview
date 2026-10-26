import { Complaint, Institution, OverlapAlert, OverlapBreakdown, OverlapClassification, ActionVocabulary, PreActionCheckAdvisory } from '../types';

// Stopwords for English, Hindi (transliterated & Devanagari)
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
  'does', 'doing', 'don', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your',
  // Hindi & Hinglish stopwords
  'hai', 'hain', 'ka', 'ki', 'ke', 'ko', 'se', 'me', 'mein', 'par', 'tha', 'thi', 'the', 'kya', 'aur', 'bhi', 'liye'
]);

// Multilingual Semantic Synonym Dictionary (English, Hindi, Hinglish)
const MULTILINGUAL_SYNONYM_MAP: Record<string, string[]> = {
  'fee': ['fees', 'charges', 'money', 'tuition', 'capitation', 'cost', 'funds', 'receipt', 'payment', 'collection', 'amount', 'amounts', 'financial', 'shulk', 'shulka', 'paisa', 'paise', 'rupaye', 'daam'],
  'unauthorized': ['unapproved', 'illegal', 'illicit', 'excessive', 'beyond', 'extortion', 'overcharging', 'unwarranted', 'exorbitant', 'zyada', 'anuchit', 'ghair-kanuni', 'extra'],
  'faculty': ['teachers', 'staff', 'professors', 'instructors', 'educators', 'lecturers', 'cadre', 'adhyapak', 'shikshak'],
  'infrastructure': ['facilities', 'building', 'equipment', 'lab', 'laboratories', 'library', 'campus', 'suvidha', 'bhawan'],
  'shortage': ['deficiency', 'lack', 'inadequate', 'vacant', 'unfilled', 'absent', 'kami', 'kam'],
  'refund': ['return', 'reimbursement', 'deposit', 'caution', 'wapsi', 'lautana'],
  'ragging': ['harassment', 'bullying', 'mental', 'physical', 'abuse', 'shoshan', 'pareshan'],
  'admission': ['intake', 'quota', 'management', 'counseling', 'seats', 'enrollment', 'dakhila', 'pravesh']
};

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u0900-\u097F\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOPWORDS.has(word));
}

/**
 * Multilingual Semantic Similarity Evaluator (English, Hindi & Hinglish)
 */
export function calculateSemanticSimilarity(text1: string, text2: string): { score: number; sharedTerms: string[] } {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) {
    return { score: 0, sharedTerms: [] };
  }

  const expanded1 = new Set(tokens1);
  const expanded2 = new Set(tokens2);

  tokens1.forEach(t => {
    Object.entries(MULTILINGUAL_SYNONYM_MAP).forEach(([root, syns]) => {
      if (t === root || syns.includes(t)) {
        expanded1.add(root);
        syns.forEach(s => expanded1.add(s));
      }
    });
  });

  tokens2.forEach(t => {
    Object.entries(MULTILINGUAL_SYNONYM_MAP).forEach(([root, syns]) => {
      if (t === root || syns.includes(t)) {
        expanded2.add(root);
        syns.forEach(s => expanded2.add(s));
      }
    });
  });

  const shared: string[] = [];
  expanded1.forEach(term => {
    if (expanded2.has(term) && !STOPWORDS.has(term)) {
      shared.push(term);
    }
  });

  const directOverlap = tokens1.filter(t => tokens2.includes(t));
  const uniqueDirect = Array.from(new Set(directOverlap));

  const directScore = uniqueDirect.length / Math.sqrt(tokens1.length * tokens2.length);
  const semanticOverlapScore = shared.length / (Math.max(expanded1.size, expanded2.size) * 0.7);

  const rawScore = (directScore * 0.35) + (semanticOverlapScore * 0.65);
  const normalizedScore = Math.min(1.0, Math.max(0.0, rawScore * 1.35));

  return {
    score: normalizedScore,
    sharedTerms: Array.from(new Set([...uniqueDirect, ...shared])).slice(0, 8)
  };
}

/**
 * 3-Level Overlap Engine:
 * - Level 1: Co-Activity (Rules, always on: same institution, multiple Bureaus active)
 * - Level 2: Related Issue (Multilingual semantic vectors & grievance domain)
 * - Level 3: Conflicting or Duplicate Actions (Rules over action vocabulary)
 */
export function evaluate3LevelOverlap(
  newComplaint: Partial<Complaint>,
  existingComplaints: Complaint[],
  selectedInstitution?: Institution
): OverlapAlert | null {
  if (!newComplaint.description || existingComplaints.length === 0) return null;

  let highestAlert: OverlapAlert | null = null;
  let maxScore = -1;

  for (const existing of existingComplaints) {
    if (newComplaint.id && newComplaint.id === existing.id) continue;

    // Component 1: Institution Identity (Max 40.0 pts)
    let institutionScore = 0;
    const sameAicteId = Boolean(newComplaint.aictePermanentId && existing.aictePermanentId && 
                        newComplaint.aictePermanentId === existing.aictePermanentId);
    const sameInstId = Boolean(newComplaint.institutionId && existing.institutionId && 
                       newComplaint.institutionId === existing.institutionId);

    if (sameAicteId) {
      institutionScore = 40.0;
    } else if (sameInstId) {
      institutionScore = 38.0;
    } else if (newComplaint.institutionName && existing.institutionName) {
      const nameSim = calculateSemanticSimilarity(newComplaint.institutionName, existing.institutionName);
      if (nameSim.score > 0.7) {
        institutionScore = 22.0;
      }
    }

    if (institutionScore < 20) continue;

    // Level 1: Co-Activity Check (Rules, always on)
    const isDifferentBureau = newComplaint.receivingBureau !== existing.receivingBureau;
    const level1CoActivity = Boolean(isDifferentBureau && institutionScore >= 35);

    // Component 2: Multilingual Semantic Description Similarity (Max 30.0 pts)
    const { score: simScore, sharedTerms } = calculateSemanticSimilarity(
      newComplaint.description,
      existing.description
    );
    const semanticScore = Math.round(simScore * 30.0 * 10) / 10;

    // Component 3: Category Similarity (Max 15.0 pts)
    let categoryScore = 0;
    if (newComplaint.category && existing.category) {
      if (newComplaint.category === existing.category) {
        categoryScore = 15.0;
      } else {
        const feeCats = ['Unauthorized Fees / Capitation', 'Non-Refund of Caution Deposit'];
        if (feeCats.includes(newComplaint.category) && feeCats.includes(existing.category)) {
          categoryScore = 10.0;
        } else {
          categoryScore = 3.0;
        }
      }
    }

    // Component 4: Temporal / Date Proximity (Max 10.0 pts)
    let proximityScore = 5.0;
    if (newComplaint.dateOfReceipt && existing.dateOfReceipt) {
      const date1 = new Date(newComplaint.dateOfReceipt).getTime();
      const date2 = new Date(existing.dateOfReceipt).getTime();
      const diffDays = Math.abs(date1 - date2) / (1000 * 3600 * 24);

      if (diffDays <= 30) proximityScore = 10.0;
      else if (diffDays <= 90) proximityScore = 8.0;
      else if (diffDays <= 180) proximityScore = 5.0;
      else proximityScore = 2.0;
    }

    // Component 5: Evidence (Max 5.0 pts)
    const evidenceScore = (newComplaint.supportingDocsCount && newComplaint.supportingDocsCount > 0) ? 3.0 : 0.0;

    const totalScore = Math.min(100, Math.round(
      institutionScore + semanticScore + categoryScore + proximityScore + evidenceScore
    ));

    // Level 2: Related Issue Flag
    const level2RelatedIssue = {
      isRelated: totalScore >= 55,
      reason: totalScore >= 75 
        ? `High semantic & domain nexus in fee collection allegations across ${newComplaint.receivingBureau} and ${existing.receivingBureau}`
        : `Moderate overlap under common institution record`,
      score: totalScore
    };

    // Level 3: Action Conflict / Duplication Check
    let level3ActionConflict = undefined;
    if (existing.lastActionType === 'Documents Requested' || existing.lastActionType === 'Notice Issued') {
      level3ActionConflict = {
        hasConflict: true,
        conflictType: 'Potential Duplicate Document Request',
        details: `${existing.receivingBureau} already executed '${existing.lastActionType}' on ${existing.lastActionDate} (${existing.referenceNumber}). Proceeding independently may duplicate institutional compliance burden.`
      };
    } else if (existing.status === 'Disposed' && newComplaint.status !== 'Disposed') {
      level3ActionConflict = {
        hasConflict: true,
        conflictType: 'Risk of Contradictory Ruling',
        details: `Related case ${existing.id} was previously marked Disposed by ${existing.receivingBureau}. Ensure new grievance findings do not contradict earlier closure findings.`
      };
    }

    // Classification Outcome
    let classification: OverlapClassification = 'Same Institution but Unrelated';
    if (institutionScore < 30) {
      classification = 'Uncertain Institution Match';
    } else if (totalScore >= 80) {
      classification = 'Related Complaints (Coordination Required)';
    } else if (totalScore >= 55) {
      classification = 'Related Complaints (Coordination Required)';
    }

    const explanation: string[] = [
      `Level 1 Co-Activity: Active inquiries in both ${newComplaint.receivingBureau} and ${existing.receivingBureau}`,
      `Level 2 Nexus: Verified Permanent ID ${existing.aictePermanentId} (${institutionScore} pts) + ${(simScore * 100).toFixed(0)}% semantic alignment (${semanticScore} pts)`,
      `Shared concepts: [${sharedTerms.slice(0, 5).join(', ')}]`
    ];

    if (level3ActionConflict?.hasConflict) {
      explanation.push(`Level 3 Warning: ${level3ActionConflict.conflictType} against ${existing.id}`);
    }

    const alert: OverlapAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      newComplaintId: newComplaint.id || 'C-NEW',
      matchedComplaintId: existing.id,
      institutionId: existing.institutionId,
      institutionName: existing.institutionName,
      aictePermanentId: existing.aictePermanentId,
      overallScore: totalScore,
      level1CoActivity,
      level2RelatedIssue,
      level3ActionConflict,
      breakdown: {
        institutionScore,
        semanticScore,
        categoryScore,
        proximityScore,
        evidenceScore
      },
      classification,
      explanation,
      sharedKeywords: sharedTerms,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };

    if (totalScore > maxScore && totalScore >= 50) {
      maxScore = totalScore;
      highestAlert = alert;
    }
  }

  return highestAlert;
}

/**
 * Headline Innovation: Pre-Action Check
 * Evaluates whether an intended action (e.g. Notice, Document Request, Inspection)
 * duplicates or conflicts with actions already recorded by other Bureaus on the same institution.
 */
export function checkPreActionAdvisory(
  targetAction: ActionVocabulary,
  targetComplaint: Complaint,
  allComplaints: Complaint[]
): PreActionCheckAdvisory | null {
  const institutionComplaints = allComplaints.filter(c => 
    c.institutionId === targetComplaint.institutionId && c.id !== targetComplaint.id
  );

  for (const existing of institutionComplaints) {
    if (targetAction === 'Documents Requested' && existing.lastActionType === 'Documents Requested') {
      return {
        hasConflict: true,
        severity: 'Warning',
        targetAction,
        conflictingBureau: existing.receivingBureau,
        conflictingCaseId: existing.id,
        message: `${existing.receivingBureau} already requested fee ledgers and deposit receipts on ${existing.lastActionDate} under case ${existing.id}.`,
        priorActionDate: existing.lastActionDate,
        recommendedAction: 'Coordinate request via Shared Document Registry to ask the institution only once.'
      };
    }

    if (targetAction === 'Notice Issued' && existing.lastActionType === 'Notice Issued') {
      return {
        hasConflict: true,
        severity: 'High Risk',
        targetAction,
        conflictingBureau: existing.receivingBureau,
        conflictingCaseId: existing.id,
        message: `A formal Show Cause Notice was already dispatched by ${existing.receivingBureau} on ${existing.lastActionDate}.`,
        priorActionDate: existing.lastActionDate,
        recommendedAction: 'Consolidate allegations into Regulation Bureau formal hearing docket rather than issuing parallel notice.'
      };
    }

    if (targetAction === 'Inspection Ordered' && existing.lastActionType === 'Inspection Ordered') {
      return {
        hasConflict: true,
        severity: 'Warning',
        targetAction,
        conflictingBureau: existing.receivingBureau,
        conflictingCaseId: existing.id,
        message: `Physical surprise inspection was recently authorized by ${existing.receivingBureau}.`,
        priorActionDate: existing.lastActionDate,
        recommendedAction: 'Depute joint nominee to existing inspection team from Regional Office.'
      };
    }
  }

  return null;
}
