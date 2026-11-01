import React, { useState, useEffect } from 'react';
import { Search, Sparkles } from 'lucide-react';

const LOADING_STEPS = [
  'Consulting Neural Investigation Archives...',
  'Interrogating witness testimonies and alibis...',
  'Synthesizing forensic clues and crime scene evidence...',
  'Establishing timeline consistency with Gemini AI...',
  'Finalizing case dossier for detective deployment...',
];

export default function LoadingScreen({ message = 'Generating Mystery Case...' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        {/* Glowing rings */}
        <div className="w-24 h-24 rounded-full border border-amber-500/20 animate-ping absolute inset-0"></div>
        <div className="w-24 h-24 rounded-full border-2 border-amber-500/40 flex items-center justify-center bg-[#10121a] shadow-[0_0_35px_rgba(212,175,55,0.25)] relative">
          <Search className="w-10 h-10 text-amber-400 animate-pulse" />
        </div>
      </div>

      <h3 className="text-2xl font-extrabold text-white tracking-wide mb-3">
        {message}
      </h3>

      <div className="flex items-center justify-center gap-2 text-sm text-amber-400/90 font-medium mb-6 min-h-[24px]">
        <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
        <span>{LOADING_STEPS[currentStepIndex]}</span>
      </div>

      <div className="w-64 h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
        <div className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 animate-[pulse_1.5s_ease-in-out_infinite] w-full"></div>
      </div>

      <p className="text-xs text-neutral-500 mt-4 tracking-wide">
        Generating custom suspects, logical alibis, and verifiable forensic evidence.
      </p>
    </div>
  );
}
