import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Shield,
  Brain,
  HelpCircle,
  FileCheck2,
  Users,
  Compass,
  ArrowRight,
  Fingerprint,
} from 'lucide-react';
import Button from '../components/Button';
import DifficultyCard from '../components/DifficultyCard';

export default function Home() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-12 text-center max-w-5xl mx-auto px-4 sm:px-6">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Detective Investigation Room</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Every Mystery Has a Secret.{' '}
          <span className="gold-gradient-text block mt-1">Can You Find It?</span>
        </h1>

        <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Step into the shoes of a lead investigator. Enter any mystery premise and let Google Gemini construct a dynamic, logically consistent crime scene with verified suspects, forensic clues, and sealed solutions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/create">
            <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto px-8">
              Start Investigation
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="lg" icon={Compass} className="w-full sm:w-auto">
              How It Works
            </Button>
          </a>
        </div>

        {/* Quick Stats Banner */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#101216]/90 border border-amber-500/25 shadow-2xl backdrop-blur-md max-w-4xl mx-auto">
          <div className="p-3 text-center border-r border-neutral-800/80 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">100%</div>
            <div className="text-xs text-neutral-400 font-medium mt-1">AI-Powered Cases</div>
          </div>
          <div className="p-3 text-center sm:border-r border-neutral-800/80 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">Server-Side</div>
            <div className="text-xs text-neutral-400 font-medium mt-1">Tamper-Proof Scoring</div>
          </div>
          <div className="p-3 text-center border-r border-neutral-800/80 last:border-none">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">Zero Leak</div>
            <div className="text-xs text-neutral-400 font-medium mt-1">Encrypted Solution DTO</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">3 Tiers</div>
            <div className="text-xs text-neutral-400 font-medium mt-1">Adaptive Difficulties</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-semibold">
            Operational Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
            How The Investigation Unfolds
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            A methodical four-phase protocol designed to challenge your inductive reasoning and logical deduction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#17191F] p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,197,66,0.12)] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-5 font-mono font-bold text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Set The Premise</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Describe a theft, poisoning, heist, or disappearance. Or select from curated scenarios to kickstart your case.
            </p>
          </div>

          <div className="bg-[#17191F] p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,197,66,0.12)] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-5 font-mono font-bold text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Synthesizes Case</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Gemini generates unique suspects with verifiable motives, conflicting alibis, forensic clues, and a single guilty party.
            </p>
          </div>

          <div className="bg-[#17191F] p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,197,66,0.12)] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-5 font-mono font-bold text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Inspect & Deduce</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Examine physical evidence, unlock forensics for bonus score, and request subtle hints if the trails run cold.
            </p>
          </div>

          <div className="bg-[#17191F] p-6 rounded-2xl border border-neutral-800 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,197,66,0.12)] transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-5 font-mono font-bold text-lg">
              04
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Submit Accusation</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Make your one final accusation. The backend server reveals the verdict, comprehensive explanation, and verified score.
            </p>
          </div>
        </div>
      </section>

      {/* Difficulty Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400/90 font-semibold">
            Choose Your Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
            Investigation Difficulty Tiers
          </h2>
          <p className="text-sm sm:text-base text-neutral-400">
            Higher difficulties feature more suspects, extensive clues, and richer score ceilings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DifficultyCard difficultyKey="easy" selected={false} onSelect={() => {}} disabled={true} />
          <DifficultyCard difficultyKey="medium" selected={true} onSelect={() => {}} disabled={true} />
          <DifficultyCard difficultyKey="hard" selected={false} onSelect={() => {}} disabled={true} />
        </div>

        <div className="mt-8 text-center">
          <Link to="/create">
            <Button size="md" icon={ArrowRight}>
              Choose Difficulty & Launch
            </Button>
          </Link>
        </div>
      </section>

      {/* Security & Features Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#17191F] via-[#101216] to-[#08090C] border border-amber-500/30 p-8 sm:p-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
                Integrity & Engineering
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-4">
                Engineered for Authentic Investigation
              </h2>
              <p className="text-sm text-neutral-300 leading-relaxed mb-6">
                Unlike simple quiz applications, AI Mystery Room enforces complete server-side isolation. The culprit's identity and proof never touch the player's browser until the accusation is locked in.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Zero-Knowledge Solution Privacy</h4>
                    <p className="text-xs text-neutral-400">
                      The active case API completely strips culpritId, explanation, and supporting evidence using secure backend serializers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Strict Server-Side Scoring</h4>
                    <p className="text-xs text-neutral-400">
                      Official scores are calculated on the backend: Base Points + (Clues × 5) - (Hints × 10), preventing tampering and duplicate bonuses.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <Brain className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Zod-Validated AI Output</h4>
                    <p className="text-xs text-neutral-400">
                      Every generated case is strictly validated with Zod schema checks to guarantee logical coherence and valid IDs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#090a0f] rounded-2xl border border-neutral-800 p-6 font-mono text-xs text-neutral-300 space-y-3 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-500">
                <span>TERMINAL://BUREAU_LOGS</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  ONLINE
                </span>
              </div>
              <p className="text-neutral-500">// Scoring Formula</p>
              <p className="text-amber-300">
                Final Score = max(0, Base + (Clues × 5) - (Hints × 10))
              </p>
              <div className="pt-2 text-neutral-400 space-y-1">
                <p>• Correct Accusation: Full calculated score</p>
                <p>• Incorrect Accusation: 0 Points</p>
                <p>• Single Accusation Limit: Enforced</p>
                <p>• Redundant Clue Bonus: Prevented</p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-800/80">
                <Link to="/create">
                  <Button variant="primary" size="sm" className="w-full">
                    Initialize New Investigation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
