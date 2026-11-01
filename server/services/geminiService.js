import { GoogleGenAI } from '@google/genai';
import { geminiMysteryResponseSchema } from '../validators/caseValidator.js';
import { DIFFICULTY_CONFIG } from '../utils/scoring.js';

/**
 * Fallback mystery generator for local development or when API key is missing
 */
function generateProceduralMystery(premise, difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const numSuspects = config.suspectCount;
  const numClues = config.clueCount;
  const numHints = config.maxHints;

  const themes = [
    {
      title: 'The Enigma of the Vanished Sovereign',
      story: `A midnight thunderstorm swept across the estate as guests gathered for an exclusive exhibition. Within the premise: "${premise}". Just past 2:00 AM, the security alert blared. The central artifact had vanished, leaving behind only shattered glass and conflicting testimonies.`,
      suspectTemplates: [
        { name: 'Arthur Vance', role: 'Chief Curator', motive: 'Desperate to cover up mounting gallery debts', alibi: 'Claims he was cataloging archives in the basement during the blackout' },
        { name: 'Elena Rostova', role: 'Visiting Art Historian', motive: 'Believes the relic rightfully belongs to her family heritage', alibi: 'Insists she was resting in guest suite 4B' },
        { name: 'Marcus Kane', role: 'Head of Private Security', motive: 'Received an offshore payment transfer the night before', alibi: 'Logged his hourly rounds on the north balcony' },
        { name: 'Dr. Evelyn Cross', role: 'Lead Restorer', motive: 'Discovered the artifact was scheduled to be moved to a rival museum', alibi: 'Was seen preparing preservation chemicals in lab 2' },
        { name: 'Julian Drake', role: 'Eccentric Collector', motive: 'Obsessed with acquiring the final piece to his forbidden antiquities collection', alibi: 'Claims his car broke down two miles from the main gate' },
      ],
      cluesTemplates: [
        { title: 'Shattered Glass Residue', description: 'Glass fragments were found pointing outwards, suggesting the case was breached from within or tampered with before the shatter.' },
        { title: 'Security Passcard Log', description: 'A master keycard stamped at 01:54 AM, seconds before the power sub-station was tripped.' },
        { title: 'Scorched Fabric Thread', description: 'A frayed thread of violet velvet caught on the display latch.' },
        { title: 'Torn Ledger Page', description: 'Handwritten figures matching the exact estimated black-market value of the artifact.' },
        { title: 'Sub-Station Fuse Box Tampering', description: 'The circuit breaker was bypassed using specialized electrical pliers marked with initials.' },
        { title: 'Footprint with Red Clay', description: 'Muddy traces leading toward the greenhouse emergency fire escape.' },
        { title: 'Encrypted Message Device', description: 'A disposable phone discovered in the courtyard trash with an incoming text: "Target secured. Awaiting rendezvous."' },
        { title: 'CCTV Blind Spot Map', description: 'A hand-drawn blueprint highlighting the single unmonitored corridor connecting the vault to the service lift.' },
        { title: 'Wax Seal Fragment', description: 'A stamp bearing a signet ring impression left on the velvet display cushion.' },
      ],
      hintsTemplates: [
        'Pay close attention to who had intimate knowledge of the security bypass and fuse box.',
        'The physical evidence on the display latch directly contradicts one suspect’s stated attire and alibi.',
        'Review the passcard timestamps alongside the physical evidence discovered near the service exit.',
      ],
    },
    {
      title: 'Midnight Shadow at the Grand Manor',
      story: `Deep inside the secluded estate, an unexpected crisis unfolded around: "${premise}". Whispers of blackmail, rivalry, and betrayal echo through the dimly lit halls as detectives take control of the crime scene.`,
      suspectTemplates: [
        { name: 'Victor Sterling', role: 'Business Partner', motive: 'Facing immediate ruin if financial audits expose company embezzlement', alibi: 'States he was asleep in the library study' },
        { name: 'Clarissa Finch', role: 'Private Secretary', motive: 'Passed over for promotion despite orchestrating key acquisitions', alibi: 'Working on confidential briefs in the east wing' },
        { name: 'Gabriel Stone', role: 'Estranged Heir', motive: 'Cut out of the family testament under an amendment made earlier that evening', alibi: 'Was drinking at the parlor bar' },
        { name: 'Nurse Beatrice Lee', role: 'Private Caregiver', motive: 'Blackmailed over a fraudulent license from a past hospital post', alibi: 'Administering nighttime medications' },
        { name: 'Chef Henri Moreau', role: 'Executive Chef', motive: 'Owed substantial gambling markers to underworld loan sharks', alibi: 'Cleaning the kitchen pantry after service' },
      ],
      cluesTemplates: [
        { title: 'Altered Will Draft', description: 'A recently modified legal document signed just hours before the incident.' },
        { title: 'Smoldering Letter in Hearth', description: 'A half-burned note referencing an ultimatum expiring at midnight.' },
        { title: 'Broken Pocket Watch', description: 'Stopped precisely at 11:42 PM with a dent on the antique gold casing.' },
        { title: 'Monogrammed Fountain Pen', description: 'Found discarded behind the leather armchair with traces of blue ink on the nib.' },
        { title: 'Stained Linen Napkin', description: 'Tested positive for traces of a fast-acting sedative.' },
        { title: 'Service Door Deadbolt Scratches', description: 'Scrape marks indicating someone picked the secondary lock from inside.' },
        { title: 'Pawn Ticket dated Yesterday', description: 'A receipt for valuable heirloom silverware issued under a false alias.' },
        { title: 'Mud-Caked Leather Gloves', description: 'Discarded hastily inside the umbrella stand near the back garden entrance.' },
        { title: 'Audio Dictaphone Tape', description: 'A background hum capturing a heated argument minutes prior to the silence.' },
      ],
      hintsTemplates: [
        'Notice which suspect had direct access to the sedatives and altered documents.',
        'The broken pocket watch establishes a timeline that invalidates an alibi.',
        'Check who had the strongest financial motive compounded by the ultimatum letter.',
      ],
    },
  ];

  const chosenTheme = themes[Math.floor(Math.random() * themes.length)];

  // Slice suspects based on difficulty requirement
  const suspects = chosenTheme.suspectTemplates.slice(0, numSuspects).map((s, idx) => ({
    id: `suspect_${idx + 1}`,
    name: s.name,
    description: `${s.name} (${s.role}).`,
    motive: s.motive,
    alibi: s.alibi,
  }));

  // Choose the culprit (e.g. suspect 1 or 2)
  const culpritIndex = 1 % suspects.length;
  const culprit = suspects[culpritIndex];

  // Slice clues
  const clues = chosenTheme.cluesTemplates.slice(0, numClues).map((c, idx) => ({
    id: `clue_${idx + 1}`,
    title: c.title,
    description: c.description,
  }));

  // Slice hints
  const hints = chosenTheme.hintsTemplates.slice(0, numHints);

  return {
    title: chosenTheme.title,
    story: chosenTheme.story,
    difficulty,
    suspects,
    clues,
    hints,
    culpritId: culprit.id,
    solutionExplanation: `The true perpetrator was ${culprit.name}. Their claimed alibi ("${culprit.alibi}") collapsed under scrutiny. Forensic evidence and timestamps matched their specific access patterns and motive (${culprit.motive}), definitively disproving their claims.`,
    supportingEvidence: [
      `Keycard and timeline contradictions directly tied ${culprit.name} to the breach.`,
      `Physical traces matching ${culprit.name}'s tools and attire were recovered at the scene.`,
      `Their alibi was unsubstantiated by witness statements or physical logs.`,
    ],
  };
}

/**
 * Generates an AI mystery using Gemini SDK, validated with Zod
 */
export async function generateMysteryFromGemini(premise, difficulty = 'medium') {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

  const isPlaceholderKey = !apiKey || apiKey.includes('your_gemini_api_key') || apiKey.trim() === '';

  if (isPlaceholderKey) {
    console.info('ℹ️  GEMINI_API_KEY is not configured. Utilizing resilient dynamic mystery generator.');
    return generateProceduralMystery(premise, difficulty);
  }

  const prompt = `You are a master detective mystery author for an interactive investigation room game.
Create a compelling, logically consistent, and solvable mystery case based on this user premise:
"${premise}"

Difficulty Level: "${difficulty.toUpperCase()}"
Requirements for this difficulty:
- Suspect count: EXACTLY ${config.suspectCount} suspects.
- Clue count: EXACTLY ${config.clueCount} clues.
- Hint count: EXACTLY ${config.maxHints} progressive hints (hint 1 is subtle, hint 2 more direct, hint 3 narrows down without directly naming).
- Exactly ONE culprit among the suspects.
- Logical consistency: The culprit's alibi must have a flaw detectable through the clues.
- The clues must definitively point to the culprit without ambiguity.
- Every suspect must have a unique ID ("suspect_1", "suspect_2", etc.), full name, detailed description, motive, and alibi.
- Every clue must have a unique ID ("clue_1", "clue_2", etc.), title, and descriptive text.
- culpritId must match the exact id of the guilty suspect (e.g. "suspect_1").
- Provide a clear solutionExplanation detailing how the evidence proves guilt.
- Provide supportingEvidence as an array of 2-4 key forensic or logical points.

Respond ONLY with a valid JSON object matching this schema:
{
  "title": "Title of the Case",
  "story": "Detailed mystery background and scenario text (at least 2 paragraphs)",
  "difficulty": "${difficulty}",
  "suspects": [
    {
      "id": "suspect_1",
      "name": "Full Name",
      "description": "Background, personality, occupation",
      "motive": "Why they might have done it",
      "alibi": "Their claimed whereabouts and statement"
    }
  ],
  "clues": [
    {
      "id": "clue_1",
      "title": "Clue Title",
      "description": "Specific evidence discovered"
    }
  ],
  "hints": [
    "Subtle hint 1",
    "Direct hint 2"
  ],
  "culpritId": "suspect_1",
  "solutionExplanation": "How the clues prove this suspect did it",
  "supportingEvidence": [
    "Point 1",
    "Point 2"
  ]
}`;

  const candidateModels = Array.from(
    new Set([modelName, 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.5-flash'].filter(Boolean))
  );

  let attempt = 0;
  while (attempt < candidateModels.length) {
    const currentModel = candidateModels[attempt];
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: currentModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response received from Gemini API');
      }

      // Parse JSON safely
      const cleanJson = responseText.trim().replace(/^```json/i, '').replace(/```$/i, '').trim();
      const parsedData = JSON.parse(cleanJson);

      // Validate with Zod
      const validated = geminiMysteryResponseSchema.parse(parsedData);

      // Validate culprit exists in suspects
      const culpritExists = validated.suspects.some((s) => s.id === validated.culpritId);
      if (!culpritExists) {
        throw new Error(`Culprit ID ${validated.culpritId} does not match any suspect in the case`);
      }

      console.log(`✅ Mystery synthesized successfully using Gemini model: ${currentModel}`);
      return validated;
    } catch (err) {
      console.warn(`Gemini generation attempt with model ${currentModel} failed:`, err.message);
      attempt += 1;
      if (attempt >= candidateModels.length) {
        console.warn('Falling back to high-fidelity procedural mystery generator.');
        return generateProceduralMystery(premise, difficulty);
      }
    }
  }

  return generateProceduralMystery(premise, difficulty);
}
