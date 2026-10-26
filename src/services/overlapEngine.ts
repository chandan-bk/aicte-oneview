import { Complaint, Institution, OverlapAlert, OverlapBreakdown, OverlapClassification } from '../types';

// Stopwords for text normalization
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can', 'did', 'do',
  'does', 'doing', 'don', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into',
  'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of',
  'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she',
  'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your'
]);

// Semantic term expansion dictionary for technical education complaints
const SYNONYM_MAP: Record<string, string[]> = {
  'fee': ['fees', 'charges', 'money', 'tuition', 'capitation', 'cost', 'funds', 'receipt', 'payment', 'collection', 'amount', 'amounts', 'financial'],
  'unauthorized': ['unapproved', 'illegal', 'illicit', 'excessive', 'beyond', 'extortion', 'overcharging', 'unwarranted', 'exorbitant'],
  'faculty': ['teachers', 'staff', 'professors', 'instructors', 'educators', 'lecturers', 'cadre'],
  'infrastructure': ['facilities', 'building', 'equipment', 'lab', 'laboratories', 'library', 'campus'],
  'shortage': ['deficiency', 'lack', 'inadequate', 'vacant', 'unfilled', 'absent'],
  'refund': ['return', 'reimbursement', 'deposit', 'caution'],
  'ragging': ['harassment', 'bullying', 'mental', 'physical', 'abuse'],
  'admission': ['intake', 'quota', 'management', 'counseling', 'seats', 'enrollment']
};

/**
 * Tokenize and normalize text into meaningful lemma/word stems
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOPWORDS.has(word));
}

/**
 * Calculates semantic text similarity using term expansion and Cosine N-gram overlap
 */
export function calculateSemanticSimilarity(text1: string, text2: string): { score: number; sharedTerms: string[] } {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);

  if (tokens1.length === 0 || tokens2.length === 0) {
    return { score: 0, sharedTerms: [] };
  }

  // Count frequencies
  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};
  tokens1.forEach(t => freq1[t] = (freq1[t] || 0) + 1);
  tokens2.forEach(t => freq2[t] = (freq2[t] || 0) + 1);

  // Expand with synonyms
  const expanded1 = new Set(tokens1);
  const expanded2 = new Set(tokens2);

  tokens1.forEach(t => {
    Object.entries(SYNONYM_MAP).forEach(([root, syns]) => {
      if (t === root || syns.includes(t)) {
        expanded1.add(root);
        syns.forEach(s => expanded1.add(s));
      }
    });
  });

  tokens2.forEach(t => {
    Object.entries(SYNONYM_MAP).forEach(([root, syns]) => {
      if (t === root || syns.includes(t)) {
        expanded2.add(root);
        syns.forEach(s => expanded2.add(s));
      }
    });
  });

  // Calculate overlap
  const shared: string[] = [];
  expanded1.forEach(term => {
    if (expanded2.has(term) && !STOPWORDS.has(term)) {
      shared.push(term);
    }
  });

  // Unique tokens ratio
  const union = new Set([...tokens1, ...tokens2]);
  const directOverlap = tokens1.filter(t => tokens2.includes(t));
  const uniqueDirect = Array.from(new Set(directOverlap));

  // Blend direct word overlap + expanded semantic overlap
  const directScore = uniqueDirect.length / Math.sqrt(tokens1.length * tokens2.length);
  const semanticOverlapScore = shared.length / (Math.max(expanded1.size, expanded2.size) * 0.7);

  const rawScore = (directScore * 0.4) + (semanticOverlapScore * 0.6);
  const normalizedScore = Math.min(1.0, Math.max(0.0, rawScore * 1.35));

  return {
    score: normalizedScore,
    sharedTerms: Array.from(new Set([...uniqueDirect, ...shared])).slice(0, 8)
  };
}

/**
 * Checks potential overlap between a candidate complaint and existing complaints
 */
export function evaluateComplaintOverlap(
  newComplaint: Partial<Complaint>,
  existingComplaints: Complaint[],
  selectedInstitution?: Institution
): OverlapAlert | null {
  if (!newComplaint.description || existingComplaints.length === 0) return null;

  let highestAlert: OverlapAlert | null = null;
  let maxScore = -1;

  for (const existing of existingComplaints) {
    // Cannot overlap with oneself
    if (newComplaint.id && newComplaint.id === existing.id) continue;

    // Component 1: Institution Identity (Max 40.0 pts)
    let institutionScore = 0;
    const sameAicteId = newComplaint.aictePermanentId && existing.aictePermanentId && 
                        newComplaint.aictePermanentId === existing.aictePermanentId;
    const sameInstId = newComplaint.institutionId && existing.institutionId && 
                       newComplaint.institutionId === existing.institutionId;

    if (sameAicteId) {
      institutionScore = 40.0;
    } else if (sameInstId) {
      institutionScore = 38.0;
    } else if (newComplaint.institutionName && existing.institutionName) {
      const nameSim = calculateSemanticSimilarity(newComplaint.institutionName, existing.institutionName);
      if (nameSim.score > 0.7) {
        institutionScore = 25.0; // Partial / uncertain match
      }
    }

    // If completely different institution, score is negligible
    if (institutionScore < 20) {
      continue;
    }

    // Component 2: Complaint Description Semantic Similarity (Max 30.0 pts)
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
        // Related categories (e.g. fees and deposits)
        const feeCats = ['Unauthorized Fees / Capitation', 'Non-Refund of Caution Deposit'];
        if (feeCats.includes(newComplaint.category) && feeCats.includes(existing.category)) {
          categoryScore = 10.0;
        } else {
          categoryScore = 3.0;
        }
      }
    }

    // Component 4: Temporal / Date Proximity (Max 10.0 pts)
    let proximityScore = 5.0; // default medium proximity
    if (newComplaint.dateOfReceipt && existing.dateOfReceipt) {
      const date1 = new Date(newComplaint.dateOfReceipt).getTime();
      const date2 = new Date(existing.dateOfReceipt).getTime();
      const diffDays = Math.abs(date1 - date2) / (1000 * 3600 * 24);

      if (diffDays <= 30) {
        proximityScore = 10.0;
      } else if (diffDays <= 90) {
        proximityScore = 8.0;
      } else if (diffDays <= 180) {
        proximityScore = 5.0;
      } else {
        proximityScore = 2.0;
      }
    }

    // Component 5: Evidence / Reference Similarity (Max 5.0 pts)
    const evidenceScore = (newComplaint.supportingDocsCount && newComplaint.supportingDocsCount > 0) ? 3.0 : 0.0;

    const totalScore = Math.min(100, Math.round(
      institutionScore + semanticScore + categoryScore + proximityScore + evidenceScore
    ));

    // Determine Classification
    let classification: OverlapClassification = 'Unrelated Same Institution';
    if (institutionScore < 30) {
      classification = 'Uncertain Institution Match';
    } else if (totalScore >= 80) {
      classification = 'Related Complaints (Coordination Required)';
    } else if (totalScore >= 55) {
      classification = 'Related Complaints (Coordination Required)';
    } else {
      classification = 'Unrelated Same Institution';
    }

    // Generate Explainable Signals
    const explanation: string[] = [];
    if (sameAicteId) {
      explanation.push(`Verified AICTE Permanent ID match: ${existing.aictePermanentId} (40.0 pts)`);
    } else if (institutionScore > 0) {
      explanation.push(`Institution name match with ${institutionScore.toFixed(1)} confidence points`);
    }

    explanation.push(
      `Semantic allegation similarity: ${(simScore * 100).toFixed(1)}% match based on shared concepts [${sharedTerms.slice(0, 5).join(', ')}] (${semanticScore.toFixed(1)} pts)`
    );

    if (categoryScore === 15.0) {
      explanation.push(`Identical AICTE grievance category: "${existing.category}" (15.0 pts)`);
    } else if (categoryScore > 0) {
      explanation.push(`Related grievance domain: "${newComplaint.category}" vs "${existing.category}" (${categoryScore.toFixed(1)} pts)`);
    }

    explanation.push(`Temporal proximity score: (${proximityScore.toFixed(1)} pts)`);

    const alert: OverlapAlert = {
      id: `ALT-${Date.now().toString().slice(-4)}`,
      newComplaintId: newComplaint.id || 'C-NEW',
      matchedComplaintId: existing.id,
      institutionId: existing.institutionId,
      institutionName: existing.institutionName,
      aictePermanentId: existing.aictePermanentId,
      overallScore: totalScore,
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
