import React from 'react';
import { User, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import Button from './Button';

export default function SuspectCard({
  suspect,
  onAccuse,
  isSelected = false,
  isSelectable = false,
  onSelect,
  isAccused = false,
  isActualCulprit = false,
  showResult = false,
}) {
  return (
    <div
      onClick={() => isSelectable && onSelect && onSelect(suspect.id)}
      className={`relative rounded-xl p-5 border transition-all duration-300 flex flex-col justify-between ${
        showResult
          ? isActualCulprit
            ? 'bg-red-950/30 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.25)]'
            : isAccused
            ? 'bg-[#17191F] border-amber-500/40'
            : 'bg-[#101216] border-neutral-800 opacity-70'
          : isSelected
          ? 'bg-[#17191F] border-amber-400 shadow-[0_0_20px_rgba(245,197,66,0.25)] ring-1 ring-amber-400'
          : 'bg-[#17191F] border-neutral-800 hover:border-amber-500/40 hover:bg-[#1C1F26]'
      } ${isSelectable ? 'cursor-pointer' : ''}`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#08090C] border border-neutral-700 flex items-center justify-center text-neutral-400 shadow-inner">
              <User className="w-6 h-6 text-amber-400/80" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-500/80">
                DOSSIER • {suspect.id}
              </span>
              <h3 className="text-lg font-bold text-white tracking-wide">{suspect.name}</h3>
            </div>
          </div>

          {/* Status Badge */}
          {showResult ? (
            isActualCulprit ? (
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 text-[11px] font-bold tracking-wider uppercase">
                TRUE CULPRIT
              </span>
            ) : isAccused ? (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-bold tracking-wider uppercase">
                YOUR ACCUSATION
              </span>
            ) : null
          ) : (
            <span className="px-2 py-0.5 rounded bg-[#08090C] text-neutral-400 border border-neutral-700 text-[10px] font-mono uppercase">
              PERSON OF INTEREST
            </span>
          )}
        </div>

        {/* Profile Description */}
        <p className="text-xs text-neutral-300 leading-relaxed mb-4 pb-3 border-b border-neutral-800/80">
          {suspect.description}
        </p>

        {/* Motive & Alibi Blocks */}
        <div className="space-y-3 mb-5">
          <div className="bg-[#08090C] p-3 rounded-lg border border-neutral-800/80">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Alleged Motive</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">{suspect.motive}</p>
          </div>

          <div className="bg-[#08090C] p-3 rounded-lg border border-neutral-800/80">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-400/90 uppercase tracking-wider mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Claimed Alibi</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">{suspect.alibi}</p>
          </div>
        </div>
      </div>

      {/* Action Area */}
      {onAccuse && !showResult && (
        <div className="pt-2">
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAccuse(suspect);
            }}
            className="w-full"
            icon={ShieldAlert}
          >
            Accuse {suspect.name.split(' ')[0]}
          </Button>
        </div>
      )}
    </div>
  );
}
