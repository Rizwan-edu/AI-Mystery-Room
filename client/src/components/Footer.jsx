import React from 'react';
import { Search, Shield, Cpu, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-amber-500/20 bg-[#08090C] py-12 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white tracking-wider">AI MYSTERY ROOM</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              An interactive detective investigation platform generating dynamic, logically solvable mystery cases powered by Google Gemini AI.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400/90 mb-3">
              Investigation Protocol
            </h4>
            <ul className="text-sm space-y-2 text-neutral-400">
              <li>• Inspect suspect statements and discover forensic clues</li>
              <li>• Unlocked clues earn +5 bonus points</li>
              <li>• Hints carry a -10 point calculation deduction</li>
              <li>• Only one official accusation permitted per case</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400/90 mb-3">
              Workshop Project
            </h4>
            <p className="text-sm text-neutral-400 leading-relaxed mb-2">
              Developed for the <span className="text-white font-medium">NxtWave Build Your Own AI Investigation Room</span> workshop.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/5 px-3 py-1.5 rounded border border-amber-500/10">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Full-Stack Architecture: React 19 + Node.js + Express + Gemini</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} AI Mystery Room. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Confidential Investigation Record</span>
            <span>•</span>
            <span className="text-amber-500/80">Case File Encrypted</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
