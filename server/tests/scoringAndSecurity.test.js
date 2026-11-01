import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateFinalScore, DIFFICULTY_CONFIG } from '../utils/scoring.js';
import { serializeActiveCase, serializeCompletedCase } from '../controllers/caseController.js';
import { createCaseSchema, accuseSchema } from '../validators/caseValidator.js';

describe('Scoring System & Difficulty Rules', () => {
  test('Difficulty configs match required specs', () => {
    // Easy: 3 suspects, 5 clues, 2 hints, 100 base points
    assert.strictEqual(DIFFICULTY_CONFIG.easy.suspectCount, 3);
    assert.strictEqual(DIFFICULTY_CONFIG.easy.clueCount, 5);
    assert.strictEqual(DIFFICULTY_CONFIG.easy.maxHints, 2);
    assert.strictEqual(DIFFICULTY_CONFIG.easy.basePoints, 100);

    // Medium: 4 suspects, 7 clues, 3 hints, 150 base points
    assert.strictEqual(DIFFICULTY_CONFIG.medium.suspectCount, 4);
    assert.strictEqual(DIFFICULTY_CONFIG.medium.clueCount, 7);
    assert.strictEqual(DIFFICULTY_CONFIG.medium.maxHints, 3);
    assert.strictEqual(DIFFICULTY_CONFIG.medium.basePoints, 150);

    // Hard: 5 suspects, 9 clues, 3 hints, 200 base points
    assert.strictEqual(DIFFICULTY_CONFIG.hard.suspectCount, 5);
    assert.strictEqual(DIFFICULTY_CONFIG.hard.clueCount, 9);
    assert.strictEqual(DIFFICULTY_CONFIG.hard.maxHints, 3);
    assert.strictEqual(DIFFICULTY_CONFIG.hard.basePoints, 200);
  });

  test('Correct accusation calculates accurate score', () => {
    // Medium: 150 base + 4 clues * 5 (20) - 1 hint * 10 (10) = 160
    const score = calculateFinalScore('medium', 4, 1, true);
    assert.strictEqual(score, 160);
  });

  test('Incorrect accusation receives exactly 0 points', () => {
    const score = calculateFinalScore('hard', 9, 0, false);
    assert.strictEqual(score, 0);
  });

  test('Score is floored at 0 and cannot be negative', () => {
    // Easy: 100 base + 0 clues - 15 hints * 10 = -50 -> floored to 0
    const score = calculateFinalScore('easy', 0, 15, true);
    assert.strictEqual(score, 0);
  });
});

describe('Security & Solution Privacy DTOs', () => {
  const mockCase = {
    _id: 'case_123',
    title: 'The Vault Mystery',
    premise: 'Someone stole the diamond.',
    story: 'Long story text.',
    difficulty: 'medium',
    suspects: [
      { id: 'suspect_1', name: 'Alice', description: 'Curator', motive: 'Greed', alibi: 'At home' },
      { id: 'suspect_2', name: 'Bob', description: 'Guard', motive: 'Debt', alibi: 'On duty' },
    ],
    clues: [
      { id: 'clue_1', title: 'Fingerprint', description: 'Clear thumbprint on glass' },
      { id: 'clue_2', title: 'Torn Cloth', description: 'Silk scrap' },
    ],
    hints: ['Check the prints', 'Look at the shift log'],
    culpritId: 'suspect_2',
    solutionExplanation: 'Bob disabled the alarm at 2am.',
    supportingEvidence: ['Fingerprint matches Bob', 'Keycard log'],
    discoveredClueIds: ['clue_1'],
    hintsUsed: 1,
    status: 'active',
    accusationId: null,
    finalScore: null,
  };

  test('Active case serializer NEVER exposes culpritId, solutionExplanation, or supportingEvidence', () => {
    const activeDTO = serializeActiveCase(mockCase);

    assert.strictEqual(activeDTO.culpritId, undefined, 'culpritId must NOT be in active case response');
    assert.strictEqual(activeDTO.solutionExplanation, undefined, 'solutionExplanation must NOT be in active case response');
    assert.strictEqual(activeDTO.supportingEvidence, undefined, 'supportingEvidence must NOT be in active case response');

    // Only discovered clue description is visible
    const clue1 = activeDTO.clues.find((c) => c.id === 'clue_1');
    const clue2 = activeDTO.clues.find((c) => c.id === 'clue_2');
    assert.strictEqual(clue1.isDiscovered, true);
    assert.strictEqual(clue1.description, 'Clear thumbprint on glass');
    assert.strictEqual(clue2.isDiscovered, false);
    assert.strictEqual(clue2.description, null, 'Undiscovered clue description must remain redacted');

    // Only unlocked hints are revealed
    assert.strictEqual(activeDTO.hints.length, 1);
    assert.strictEqual(activeDTO.hints[0], 'Check the prints');
  });

  test('Completed case serializer exposes verdict, solution, and score', () => {
    const completedCase = {
      ...mockCase,
      status: 'solved',
      accusationId: 'suspect_2',
      finalScore: 145,
    };

    const completedDTO = serializeCompletedCase(completedCase);
    assert.strictEqual(completedDTO.culpritId, 'suspect_2');
    assert.strictEqual(completedDTO.isCorrect, true);
    assert.strictEqual(completedDTO.finalScore, 145);
    assert.ok(completedDTO.solutionExplanation);
    assert.ok(completedDTO.supportingEvidence);
  });
});

describe('Input Validation with Zod', () => {
  test('Validates premise and difficulty correctly', () => {
    const valid = createCaseSchema.safeParse({ premise: 'A museum ruby heist during storm', difficulty: 'easy' });
    assert.strictEqual(valid.success, true);

    const invalidDiff = createCaseSchema.safeParse({ premise: 'A museum ruby heist during storm', difficulty: 'extreme' });
    assert.strictEqual(invalidDiff.success, false);

    const shortPremise = createCaseSchema.safeParse({ premise: 'abc', difficulty: 'easy' });
    assert.strictEqual(shortPremise.success, false);
  });

  test('Validates accusation suspect ID', () => {
    const valid = accuseSchema.safeParse({ suspectId: 'suspect_1' });
    assert.strictEqual(valid.success, true);

    const empty = accuseSchema.safeParse({ suspectId: '' });
    assert.strictEqual(empty.success, false);
  });
});
