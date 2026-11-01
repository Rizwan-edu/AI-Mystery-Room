import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Shield,
  FileText,
  User,
  HelpCircle,
  FileSearch,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';
import SuspectCard from '../components/SuspectCard';
import LoadingScreen from '../components/LoadingScreen';
import ProtectedError from '../components/ProtectedError';

export default function Results() {
  const { caseId } = useParams();
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResult = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCaseResult(caseId);

      if (res.success && res.data) {
        setResultData(res.data);
      } else {
        setError('Could not retrieve final case verdict.');
      }
    } catch (err) {
      console.error('Error fetching result:', err);
      if (err.response?.status === 403) {
        setError(
          'Investigation is still active. You must submit your official accusation before viewing the results!'
        );
      } else {
        setError(err.response?.data?.message || 'Failed to load case outcome.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) {
      fetchResult();
    }
  }, [caseId]);

  if (loading) {
    return <LoadingScreen message="Unsealing Bureau Case Verdict..." />;
  }

  if (error || !resultData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <ProtectedError
          title="Case Verdict Unavailable"
          message={error || 'Verdict not accessible.'}
          onRetry={fetchResult}
        />
        {error?.includes('still active') && (
          <div className="mt-4">
            <Link to={`/investigate/${caseId}`}>
              <Button variant="primary" size="md" icon={ArrowRight}>
                Return to Investigation Room
              </Button>
            </Link>
          </div>
        )}
      </div>
    );
  }

  const isCorrect = resultData.isCorrect;
  const accusedSuspect = resultData.suspects?.find((s) => s.id === resultData.accusationId);
  const actualCulprit = resultData.suspects?.find((s) => s.id === resultData.culpritId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Verdict Hero Banner */}
      <div
        className={`rounded-3xl p-8 sm:p-12 border text-center relative overflow-hidden shadow-2xl ${
          isCorrect
            ? 'bg-gradient-to-b from-[#16261c] via-[#0f1712] to-[#0a0d0b] border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.15)]'
            : 'bg-gradient-to-b from-[#261616] via-[#1a0f0f] to-[#0d0a0a] border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.15)]'
        }`}
      >
        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Verdict Icon */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border ${
              isCorrect
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                : 'bg-red-500/20 border-red-500/50 text-red-400'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-10 h-10" />
            ) : (
              <XCircle className="w-10 h-10" />
            )}
          </div>

          <span
            className={`text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-4 inline-block ${
              isCorrect
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}
          >
            OFFICIAL BUREAU VERDICT
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            {isCorrect ? 'Case Solved: Master Deduction!' : 'Accusation Flawed: Case Closed'}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-8">
            {isCorrect
              ? `Outstanding forensic reasoning, Detective. Your accusation against ${actualCulprit?.name} was substantiated by physical evidence and broken alibis.`
              : `Your accusation against ${accusedSuspect?.name} was incorrect. The true perpetrator was ${actualCulprit?.name}. Review the solution below to see where the evidence pointed.`}
          </p>

          {/* Final Score Pill */}
          <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-[#101216]/95 border border-amber-500/30 shadow-2xl">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">
              OFFICIAL FINAL SCORE
            </span>
            <div className="text-4xl sm:text-6xl font-extrabold text-amber-400 font-mono">
              {resultData.finalScore}{' '}
              <span className="text-lg sm:text-2xl text-amber-500 font-sans">PTS</span>
            </div>
            <span className="text-xs text-neutral-400 mt-2">
              Difficulty: <span className="text-white uppercase font-semibold">{resultData.difficulty}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Score Calculation Audit Card */}
      <div className="bg-[#17191F] p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xl">
        <h3 className="text-lg font-bold text-white tracking-wide mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Server-Side Score Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-[#08090C] p-4 rounded-xl border border-neutral-800">
            <span className="text-neutral-500 block mb-1">BASE DIFFICULTY</span>
            <span className="text-lg font-bold text-white">
              {resultData.difficulty === 'easy' ? '100' : resultData.difficulty === 'hard' ? '200' : '150'} Pts
            </span>
          </div>

          <div className="bg-[#08090C] p-4 rounded-xl border border-neutral-800">
            <span className="text-neutral-500 block mb-1">CLUES DISCOVERED</span>
            <span className="text-lg font-bold text-emerald-400">
              +{resultData.discoveredClueIds?.length * 5} Pts
            </span>
            <span className="text-neutral-400 block mt-0.5">
              ({resultData.discoveredClueIds?.length} × 5)
            </span>
          </div>

          <div className="bg-[#08090C] p-4 rounded-xl border border-neutral-800">
            <span className="text-neutral-500 block mb-1">HINTS USED</span>
            <span className="text-lg font-bold text-red-400">
              -{resultData.hintsUsed * 10} Pts
            </span>
            <span className="text-neutral-400 block mt-0.5">
              ({resultData.hintsUsed} × 10)
            </span>
          </div>

          <div className="bg-[#08090C] p-4 rounded-xl border border-amber-500/30">
            <span className="text-amber-400 font-semibold block mb-1">VERDICT MULTIPLIER</span>
            <span className="text-lg font-bold text-amber-300">
              {isCorrect ? '× 1.0 (Valid)' : '× 0.0 (Failed)'}
            </span>
          </div>
        </div>
      </div>

      {/* Culprit Identity & Explanation */}
      <div className="bg-[#17191F] p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xl space-y-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            FORENSIC DEBRIEF
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            The Truth Revealed: How the Mystery Was Solved
          </h2>
        </div>

        {/* Perpetrator Highlight Card */}
        {actualCulprit && (
          <div className="bg-[#08090C] border border-red-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-red-400 uppercase">
                  TRUE GUILTY PARTY
                </span>
                <h4 className="text-lg font-bold text-white">{actualCulprit.name}</h4>
                <p className="text-xs text-neutral-400">{actualCulprit.description}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-mono font-semibold uppercase">
              CULPRIT ID: {actualCulprit.id}
            </span>
          </div>
        )}

        {/* Logical Solution Explanation */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Logical Deduction Analysis</span>
          </h4>
          <p className="text-sm text-neutral-300 leading-relaxed bg-[#08090C] p-5 rounded-xl border border-neutral-800/80 whitespace-pre-line">
            {resultData.solutionExplanation}
          </p>
        </div>

        {/* Supporting Evidence Breakdown */}
        {resultData.supportingEvidence && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
              <FileSearch className="w-4 h-4 text-amber-400" />
              <span>Forensic Evidence Supporting The Solution</span>
            </h4>
            <div className="space-y-2">
              {Array.isArray(resultData.supportingEvidence) ? (
                resultData.supportingEvidence.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-[#08090C] p-3.5 rounded-lg border border-neutral-800 text-xs text-neutral-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))
              ) : (
                <div className="bg-[#08090C] p-3.5 rounded-lg border border-neutral-800 text-xs text-neutral-300">
                  {resultData.supportingEvidence}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Suspect Roster Review */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white tracking-wide">
          Suspect Roster Retrospective
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultData.suspects?.map((suspect) => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              showResult={true}
              isActualCulprit={suspect.id === resultData.culpritId}
              isAccused={suspect.id === resultData.accusationId}
            />
          ))}
        </div>
      </div>

      {/* Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Link to="/create">
          <Button size="lg" icon={RotateCcw} className="w-full sm:w-auto px-8">
            Investigate Another Mystery
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            Return to Bureau Headquarters
          </Button>
        </Link>
      </div>
    </div>
  );
}
