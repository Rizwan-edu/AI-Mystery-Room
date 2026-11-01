import { z } from 'zod';

export const createCaseSchema = z.object({
  premise: z.string().min(5, 'Mystery premise must be at least 5 characters long').max(1000, 'Premise is too long'),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    errorMap: () => ({ message: 'Difficulty must be easy, medium, or hard' }),
  }),
});

export const accuseSchema = z.object({
  suspectId: z.string().min(1, 'Suspect ID is required'),
});

export const suspectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  motive: z.string().min(1),
  alibi: z.string().min(1),
});

export const clueSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const geminiMysteryResponseSchema = z.object({
  title: z.string().min(1),
  story: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  suspects: z.array(suspectSchema).min(3),
  clues: z.array(clueSchema).min(3),
  hints: z.array(z.string().min(1)).min(1),
  culpritId: z.string().min(1),
  solutionExplanation: z.string().min(1),
  supportingEvidence: z.union([z.array(z.string()), z.string()]),
});
