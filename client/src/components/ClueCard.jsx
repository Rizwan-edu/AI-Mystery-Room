import React from 'react';
import { Eye, Lock, FileSearch, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from './Button';

export default function ClueCard({ clue, onDiscover, isDiscovering = false }) {
  const isDiscovered = clue.isDiscovered;

  return (
    <div
      className={`relative rounded-xl p-5 border transition-all duration-300 flex flex-col justify-between ${
        isDiscovered
          ? 'bg-[#17191F] border-amber-500/30 shadow-[0_0_15px_rgba(245,197,66,0.12)]'
          : 'bg-[#101216] border-neutral-800 hover:border-amber-500/25'
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                isDiscovered
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-[#08090C] border-neutral-800 text-neutral-500'
              }`}
            >
              {isDiscovered ? (
                <FileSearch className="w-4 h-4 text-amber-400" />
              ) : (
                <Lock className="w-4 h-4 text-neutral-500" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-500">
                EVIDENCE ITEM • {clue.id}
              </span>
              <h4 className="text-base font-bold text-white tracking-wide">{clue.title}</h4>
            </div>
          </div>

          {isDiscovered ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              +5 Pts
            </span>
          ) : (
            <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-[#08090C] text-neutral-400 border border-neutral-700/60">
              CLASSIFIED
            </span>
          )}
        </div>

        {/* Content Area */}
        {isDiscovered ? (
          <p className="text-xs text-neutral-300 leading-relaxed bg-[#08090C] p-3 rounded-lg border border-neutral-800/80 mb-4">
            {clue.description}
          </p>
        ) : (
          <div className="bg-[#08090C] p-3 rounded-lg border border-neutral-800/60 mb-4 text-center">
            <p className="text-xs text-neutral-500 italic mb-2">
              Evidence item sealed in forensics vault. Inspect to analyze details.
            </p>
            <div className="h-2 w-3/4 bg-neutral-800 rounded mx-auto mb-1.5 opacity-60"></div>
            <div className="h-2 w-1/2 bg-neutral-800 rounded mx-auto opacity-40"></div>
          </div>
        )}
      </div>

      {/* Action Area */}
      {!isDiscovered && onDiscover && (
        <div className="pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onDiscover(clue.id)}
            loading={isDiscovering}
            className="w-full text-xs"
            icon={Eye}
          >
            Inspect & Discover Evidence
          </Button>
        </div>
      )}
    </div>
  );
}
