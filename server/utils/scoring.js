/**
 * Scoring system configuration and calculation logic
 */

export const DIFFICULTY_CONFIG = {
  easy: {
    name: 'Easy',
    suspectCount: 3,
    clueCount: 5,
    maxHints: 2,
    basePoints: 100,
  },
  medium: {
    name: 'Medium',
    suspectCount: 4,
    clueCount: 7,
    maxHints: 3,
    basePoints: 150,
  },
  hard: {
    name: 'Hard',
    suspectCount: 5,
    clueCount: 9,
    maxHints: 3,
    basePoints: 200,
  },
};

export const CLUE_DISCOVERY_POINTS = 5;
export const HINT_PENALTY_POINTS = 10;

/**
 * Calculates final score for an investigation
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @param {number} discoveredCluesCount - number of unique discovered clues
 * @param {number} hintsUsedCount - number of hints used
 * @param {boolean} isCorrect - whether the accusation was correct
 * @returns {number}
 */
export function calculateFinalScore(difficulty, discoveredCluesCount, hintsUsedCount, isCorrect) {
  if (!isCorrect) {
    return 0;
  }

  const normalizedDifficulty = (difficulty || 'medium').toLowerCase();
  const config = DIFFICULTY_CONFIG[normalizedDifficulty] || DIFFICULTY_CONFIG.medium;
  const basePoints = config.basePoints;

  const rawScore = basePoints + (discoveredCluesCount * CLUE_DISCOVERY_POINTS) - (hintsUsedCount * HINT_PENALTY_POINTS);
  return Math.max(0, rawScore);
}
