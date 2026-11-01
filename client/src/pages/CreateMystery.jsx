import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileText, Compass, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';
import DifficultyCard from '../components/DifficultyCard';
import LoadingScreen from '../components/LoadingScreen';

const EXAMPLE_PREMISES = [
  'A priceless antique chronometer vanished from the locked study during the countess’s annual storm gathering.',
  'During a billionaire tech gala, the prototype neural quantum chip was stolen from the high-security subterranean vault.',
  'An esteemed museum curator was found locked in the Renaissance gallery with a forged masterpiece replacing the original.',
  'A midnight express train arrived at the alpine terminus with one VIP compartment empty and signs of forced struggle.',
];

export default function CreateMystery() {
  const navigate = useNavigate();
  const [premise, setPremise] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!premise.trim() || premise.trim().length < 5) {
      setError('Please provide a mystery premise with at least 5 characters.');
      return;
    }

    try {
      setLoading(true);
      const response = await api.createCase(premise.trim(), difficulty);

      if (response.success && response.data?.id) {
        navigate(`/investigate/${response.data.id}`);
      } else {
        setError('Failed to generate mystery case. Please try again.');
      }
    } catch (err) {
      console.error('Case generation error:', err);
      setError(
        err.response?.data?.message || 'Server error occurred while synthesizing the case. Please verify connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Synthesizing Your Crime Scene Case..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>Case Commission Desk</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
          Commission a <span className="gold-gradient-text">New Mystery</span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
          Define the incident premise and select an investigation difficulty. Our Gemini AI engine will author an intricately woven crime scene with clues and alibis.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm flex items-start gap-3 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Investigation Initialization Failed</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Step 1: Premise Input */}
        <div className="bg-[#17191F] p-6 sm:p-8 rounded-2xl border border-neutral-800 hover:border-amber-500/25 shadow-xl transition-all">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="premise" className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs flex items-center justify-center font-mono">
                1
              </span>
              Incident Premise / Story Hook
            </label>
            <span className="text-xs text-neutral-500 font-mono">
              {premise.length} / 1000 chars
            </span>
          </div>
          <p className="text-xs text-neutral-400 mb-4">
            Describe the location, the nature of the crime, or key circumstances.
          </p>

          <textarea
            id="premise"
            rows={4}
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            placeholder="e.g., A locked-room theft of a legendary emerald during a black-tie gala at the waterfront penthouse..."
            className="w-full bg-[#08090C] border border-neutral-700/80 rounded-xl p-4 text-sm text-[#F8FAFC] placeholder-neutral-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all resize-none shadow-inner"
            maxLength={1000}
          />

          {/* Example Premise Chips */}
          <div className="mt-4">
            <span className="text-xs text-neutral-500 font-medium block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Quick Premise Inspirations (Click to use):
            </span>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PREMISES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPremise(sample)}
                  className="text-xs text-left bg-[#08090C] hover:bg-[#101216] text-neutral-300 hover:text-amber-300 border border-neutral-800 hover:border-amber-500/40 rounded-lg px-3 py-1.5 transition-all duration-200 cursor-pointer"
                >
                  "{sample.slice(0, 55)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Difficulty Selection */}
        <div className="bg-[#17191F] p-6 sm:p-8 rounded-2xl border border-neutral-800 hover:border-amber-500/25 shadow-xl transition-all">
          <div className="mb-4">
            <label className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs flex items-center justify-center font-mono">
                2
              </span>
              Select Investigation Difficulty
            </label>
            <p className="text-xs text-neutral-400 mt-1">
              Controls the suspect roster size, available forensics, hint limit, and base score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DifficultyCard
              difficultyKey="easy"
              selected={difficulty === 'easy'}
              onSelect={setDifficulty}
            />
            <DifficultyCard
              difficultyKey="medium"
              selected={difficulty === 'medium'}
              onSelect={setDifficulty}
            />
            <DifficultyCard
              difficultyKey="hard"
              selected={difficulty === 'hard'}
              onSelect={setDifficulty}
            />
          </div>
        </div>

        {/* Submission Action */}
        <div className="text-center pt-2">
          <Button
            type="submit"
            size="lg"
            icon={ArrowRight}
            className="w-full sm:w-auto px-10 shadow-[0_0_30px_rgba(245,158,11,0.25)]"
          >
            Generate Case & Enter Investigation Room
          </Button>
          <p className="text-xs text-neutral-500 mt-3">
            AI synthesis takes ~3-8 seconds depending on neural model latency.
          </p>
        </div>
      </form>
    </div>
  );
}
