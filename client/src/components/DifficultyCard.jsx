import React from 'react';
import { Users, FileSearch, HelpCircle, Award, CheckCircle2 } from 'lucide-react';

const DIFFICULTY_DATA = {
  easy: {
    title: 'Easy',
    subtitle: 'Rookie Detective',
    description: 'A focused investigation with clear evidence trails. Ideal for beginners.',
    suspects: 3,
    clues: 5,
    hints: 2,
    basePoints: 100,
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  },
  medium: {
    title: 'Medium',
    subtitle: 'Seasoned Inspector',
    description: 'Balanced mystery with intertwined motives, conflicting alibis, and subtle clues.',
    suspects: 4,
    clues: 7,
    hints: 3,
    basePoints: 150,
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
  },
  hard: {
    title: 'Hard',
    subtitle: 'Master Sleuth',
    description: 'Complex web of deception, multiple red herrings, and strict logical deduction.',
    suspects: 5,
    clues: 9,
    hints: 3,
    basePoints: 200,
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
  },
};

export default function DifficultyCard({ difficultyKey, selected, onSelect, disabled = false }) {
  const data = DIFFICULTY_DATA[difficultyKey] || DIFFICULTY_DATA.medium;

  return (
    <div
      onClick={() => !disabled && onSelect(difficultyKey)}
      className={`relative rounded-xl p-5 sm:p-6 transition-all duration-300 cursor-pointer border text-left ${
        selected
          ? 'bg-[#17191F] border-amber-400 shadow-[0_0_25px_rgba(245,197,66,0.25)] scale-[1.02]'
          : 'bg-[#101216] border-neutral-800 hover:border-amber-500/40 hover:bg-[#141620]'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {/* Selected Indicator */}
      {selected && (
        <div className="absolute top-4 right-4 text-amber-400">
          <CheckCircle2 className="w-5 h-5 fill-amber-400/20" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl font-bold text-white tracking-wide">{data.title}</span>
        <span className={`text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded-full border ${data.badgeColor}`}>
          {data.subtitle}
        </span>
      </div>

      <p className="text-xs text-neutral-400 leading-relaxed mb-5 min-h-[36px]">
        {data.description}
      </p>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="flex items-center gap-2 bg-[#08090C] px-3 py-2 rounded-lg border border-neutral-800/80">
          <Users className="w-3.5 h-3.5 text-amber-400/80" />
          <span className="text-neutral-300 font-medium">{data.suspects} Suspects</span>
        </div>
        <div className="flex items-center gap-2 bg-[#08090C] px-3 py-2 rounded-lg border border-neutral-800/80">
          <FileSearch className="w-3.5 h-3.5 text-amber-400/80" />
          <span className="text-neutral-300 font-medium">{data.clues} Clues</span>
        </div>
        <div className="flex items-center gap-2 bg-[#08090C] px-3 py-2 rounded-lg border border-neutral-800/80">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400/80" />
          <span className="text-neutral-300 font-medium">{data.hints} Hints</span>
        </div>
        <div className="flex items-center gap-2 bg-[#08090C] px-3 py-2 rounded-lg border border-amber-500/25">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold">{data.basePoints} Base Pts</span>
        </div>
      </div>
    </div>
  );
}
