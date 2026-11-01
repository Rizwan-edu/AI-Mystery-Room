import { CaseRepository } from '../models/Case.js';
import { generateMysteryFromGemini } from '../services/geminiService.js';
import { createCaseSchema, accuseSchema } from '../validators/caseValidator.js';
import { calculateFinalScore, DIFFICULTY_CONFIG } from '../utils/scoring.js';

/**
 * DTO Serializer for Active Case:
 * Strips culpritId, solutionExplanation, and supportingEvidence to prevent cheating
 */
export function serializeActiveCase(caseDoc) {
  const raw = typeof caseDoc.toObject === 'function' ? caseDoc.toObject() : caseDoc;
  const config = DIFFICULTY_CONFIG[raw.difficulty] || DIFFICULTY_CONFIG.medium;
  const discoveredSet = new Set(raw.discoveredClueIds || []);

  return {
    id: raw._id || raw.id,
    title: raw.title,
    premise: raw.premise,
    story: raw.story,
    difficulty: raw.difficulty,
    suspects: raw.suspects.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      motive: s.motive,
      alibi: s.alibi,
    })),
    clues: raw.clues.map((c) => ({
      id: c.id,
      title: c.title,
      description: discoveredSet.has(c.id) ? c.description : null,
      isDiscovered: discoveredSet.has(c.id),
    })),
    discoveredClueIds: Array.from(discoveredSet),
    hintsUsed: raw.hintsUsed || 0,
    maxHints: config.maxHints,
    hints: (raw.hints || []).slice(0, raw.hintsUsed || 0),
    status: raw.status || 'active',
    accusationId: raw.accusationId || null,
    createdAt: raw.createdAt,
  };
}

/**
 * DTO Serializer for Completed Case:
 * Reveals culprit, solution explanation, and final score
 */
export function serializeCompletedCase(caseDoc) {
  const raw = typeof caseDoc.toObject === 'function' ? caseDoc.toObject() : caseDoc;
  const culprit = raw.suspects.find((s) => s.id === raw.culpritId) || null;
  const isCorrect = raw.accusationId === raw.culpritId;

  return {
    id: raw._id || raw.id,
    title: raw.title,
    premise: raw.premise,
    story: raw.story,
    difficulty: raw.difficulty,
    suspects: raw.suspects,
    clues: raw.clues.map((c) => ({
      ...c,
      isDiscovered: (raw.discoveredClueIds || []).includes(c.id),
    })),
    hints: raw.hints || [],
    discoveredClueIds: raw.discoveredClueIds || [],
    hintsUsed: raw.hintsUsed || 0,
    status: raw.status,
    accusationId: raw.accusationId,
    culpritId: raw.culpritId,
    culprit: culprit ? { id: culprit.id, name: culprit.name, description: culprit.description } : null,
    isCorrect,
    solutionExplanation: raw.solutionExplanation,
    supportingEvidence: raw.supportingEvidence,
    finalScore: raw.finalScore,
    createdAt: raw.createdAt,
  };
}

export const createCase = async (req, res, next) => {
  try {
    const validatedBody = createCaseSchema.parse(req.body);
    const { premise, difficulty } = validatedBody;

    const generatedMystery = await generateMysteryFromGemini(premise, difficulty);

    const newCase = await CaseRepository.create({
      title: generatedMystery.title,
      premise,
      story: generatedMystery.story,
      difficulty,
      suspects: generatedMystery.suspects,
      clues: generatedMystery.clues,
      hints: generatedMystery.hints,
      culpritId: generatedMystery.culpritId,
      solutionExplanation: generatedMystery.solutionExplanation,
      supportingEvidence: generatedMystery.supportingEvidence,
      discoveredClueIds: [],
      hintsUsed: 0,
      accusationId: null,
      finalScore: null,
      status: 'active',
    });

    res.status(201).json({
      success: true,
      data: serializeActiveCase(newCase),
    });
  } catch (error) {
    next(error);
  }
};

export const getCaseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const caseDoc = await CaseRepository.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (caseDoc.status === 'active') {
      return res.status(200).json({ success: true, data: serializeActiveCase(caseDoc) });
    }

    return res.status(200).json({ success: true, data: serializeCompletedCase(caseDoc) });
  } catch (error) {
    next(error);
  }
};

export const discoverClue = async (req, res, next) => {
  try {
    const { id, clueId } = req.params;
    const caseDoc = await CaseRepository.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (caseDoc.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Cannot discover clues on a closed case' });
    }

    const clue = caseDoc.clues.find((c) => c.id === clueId);
    if (!clue) {
      return res.status(404).json({ success: false, message: 'Clue not found in this case' });
    }

    if (!caseDoc.discoveredClueIds.includes(clueId)) {
      caseDoc.discoveredClueIds.push(clueId);
      await caseDoc.save();
    }

    res.status(200).json({
      success: true,
      message: 'Clue discovered successfully',
      data: {
        clue: {
          id: clue.id,
          title: clue.title,
          description: clue.description,
          isDiscovered: true,
        },
        discoveredClueIds: caseDoc.discoveredClueIds,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const requestHint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const caseDoc = await CaseRepository.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (caseDoc.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Cannot request hints on a closed case' });
    }

    const config = DIFFICULTY_CONFIG[caseDoc.difficulty] || DIFFICULTY_CONFIG.medium;
    if (caseDoc.hintsUsed >= config.maxHints || caseDoc.hintsUsed >= caseDoc.hints.length) {
      return res.status(400).json({
        success: false,
        message: 'No hints remaining for this difficulty level',
      });
    }

    caseDoc.hintsUsed += 1;
    await caseDoc.save();

    const unlockedHints = caseDoc.hints.slice(0, caseDoc.hintsUsed);
    const latestHint = caseDoc.hints[caseDoc.hintsUsed - 1];

    res.status(200).json({
      success: true,
      message: 'Hint unlocked (-10 score penalty upon final calculation)',
      data: {
        latestHint,
        unlockedHints,
        hintsUsed: caseDoc.hintsUsed,
        maxHints: config.maxHints,
        remainingHints: config.maxHints - caseDoc.hintsUsed,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const submitAccusation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validatedBody = accuseSchema.parse(req.body);
    const { suspectId } = validatedBody;

    const caseDoc = await CaseRepository.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (caseDoc.status !== 'active' || caseDoc.accusationId) {
      return res.status(400).json({
        success: false,
        message: 'An accusation has already been submitted for this case. Repeated accusations are prevented.',
      });
    }

    const suspect = caseDoc.suspects.find((s) => s.id === suspectId);
    if (!suspect) {
      return res.status(400).json({ success: false, message: 'Selected suspect does not exist in this case' });
    }

    const isCorrect = suspectId === caseDoc.culpritId;
    const score = calculateFinalScore(
      caseDoc.difficulty,
      caseDoc.discoveredClueIds.length,
      caseDoc.hintsUsed,
      isCorrect
    );

    caseDoc.accusationId = suspectId;
    caseDoc.finalScore = score;
    caseDoc.status = isCorrect ? 'solved' : 'failed';
    await caseDoc.save();

    res.status(200).json({
      success: true,
      message: isCorrect ? 'Accusation correct! Case solved.' : 'Accusation incorrect! The suspect is innocent.',
      data: serializeCompletedCase(caseDoc),
    });
  } catch (error) {
    next(error);
  }
};

export const getCaseResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const caseDoc = await CaseRepository.findById(id);

    if (!caseDoc) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    if (caseDoc.status === 'active') {
      return res.status(403).json({
        success: false,
        message: 'Investigation is still active. Accusation must be submitted before viewing results.',
      });
    }

    res.status(200).json({
      success: true,
      data: serializeCompletedCase(caseDoc),
    });
  } catch (error) {
    next(error);
  }
};
