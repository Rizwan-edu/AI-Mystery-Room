import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Users,
  FileSearch,
  HelpCircle,
  ShieldAlert,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';
import SuspectCard from '../components/SuspectCard';
import ClueCard from '../components/ClueCard';
import LoadingScreen from '../components/LoadingScreen';
import ProtectedError from '../components/ProtectedError';

export default function InvestigationRoom() {
  const { caseId } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Interaction states
  const [discoveringClueId, setDiscoveringClueId] = useState(null);
  const [requestingHint, setRequestingHint] = useState(false);
  const [hintMessage, setHintMessage] = useState(null);

  // Accusation modal states
  const [isAccuseModalOpen, setIsAccuseModalOpen] = useState(false);
  const [selectedSuspectId, setSelectedSuspectId] = useState(null);
  const [submittingAccusation, setSubmittingAccusation] = useState(false);
  const [accusationError, setAccusationError] = useState(null);

  // Story accordion toggle
  const [isStoryExpanded, setIsStoryExpanded] = useState(true);

  // Load case from backend
  const fetchCase = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCase(caseId);

      if (res.success && res.data) {
        // If case is already completed, route directly to results
        if (res.data.status !== 'active') {
          navigate(`/results/${caseId}`, { replace: true });
          return;
        }
        setCaseData(res.data);
      } else {
        setError('Case record could not be loaded.');
      }
    } catch (err) {
      console.error('Error loading case:', err);
      setError(err.response?.data?.message || 'Failed to connect to Bureau servers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseId) {
      fetchCase();
    }
  }, [caseId]);

  // Discover Clue Handler
  const handleDiscoverClue = async (clueId) => {
    try {
      setDiscoveringClueId(clueId);
      const res = await api.discoverClue(caseId, clueId);

      if (res.success && res.data) {
        setCaseData((prev) => ({
          ...prev,
          discoveredClueIds: res.data.discoveredClueIds,
          clues: prev.clues.map((c) =>
            c.id === clueId ? { ...c, ...res.data.clue, isDiscovered: true } : c
          ),
        }));
      }
    } catch (err) {
      console.error('Error discovering clue:', err);
      alert(err.response?.data?.message || 'Failed to inspect evidence item.');
    } finally {
      setDiscoveringClueId(null);
    }
  };

  // Request Hint Handler
  const handleRequestHint = async () => {
    try {
      setRequestingHint(true);
      setHintMessage(null);
      const res = await api.requestHint(caseId);

      if (res.success && res.data) {
        setCaseData((prev) => ({
          ...prev,
          hintsUsed: res.data.hintsUsed,
          hints: res.data.unlockedHints,
        }));
        setHintMessage(`New hint unlocked! (-10 points upon final score)`);
      }
    } catch (err) {
      console.error('Error requesting hint:', err);
      alert(err.response?.data?.message || 'No remaining hints available.');
    } finally {
      setRequestingHint(false);
    }
  };

  // Accusation Handlers
  const handleOpenAccuseModal = (suspect = null) => {
    if (suspect) {
      setSelectedSuspectId(suspect.id);
    }
    setIsAccuseModalOpen(true);
    setAccusationError(null);
  };

  const handleSubmitAccusation = async () => {
    if (!selectedSuspectId) {
      setAccusationError('Please select a suspect to accuse.');
      return;
    }

    try {
      setSubmittingAccusation(true);
      setAccusationError(null);
      const res = await api.submitAccusation(caseId, selectedSuspectId);

      if (res.success) {
        // Accusation recorded, navigate to results page
        navigate(`/results/${caseId}`);
      } else {
        setAccusationError('Accusation submission rejected by server.');
      }
    } catch (err) {
      console.error('Error submitting accusation:', err);
      setAccusationError(err.response?.data?.message || 'Failed to submit accusation.');
    } finally {
      setSubmittingAccusation(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Retrieving Active Case Files..." />;
  }

  if (error || !caseData) {
    return (
      <ProtectedError
        title="Case File Inaccessible"
        message={error || 'Unable to load investigation room.'}
        onRetry={fetchCase}
      />
    );
  }

  const discoveredCount = caseData.discoveredClueIds?.length || 0;
  const totalClues = caseData.clues?.length || 0;
  const maxHints = caseData.maxHints || 3;
  const remainingHints = Math.max(0, maxHints - (caseData.hintsUsed || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Case Header & Status Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#17191F] via-[#101216] to-[#17191F] border border-amber-500/25 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-xs font-mono tracking-widest uppercase px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                ACTIVE CASE #{caseData.id?.slice(-6).toUpperCase()}
              </span>
              <span className="text-xs font-semibold tracking-wider px-2.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase">
                DIFFICULTY: {caseData.difficulty}
              </span>
              <span className="text-xs font-mono text-neutral-500">
                Opened: {new Date(caseData.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {caseData.title}
            </h1>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <Button
              variant="danger"
              size="md"
              onClick={() => handleOpenAccuseModal()}
              icon={ShieldAlert}
              className="shadow-[0_0_20px_rgba(239,68,68,0.25)]"
            >
              Issue Final Accusation
            </Button>
          </div>
        </div>

        {/* Progress Metrics Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800/80">
          <div className="bg-[#08090C] p-3.5 rounded-xl border border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <FileSearch className="w-3.5 h-3.5 text-amber-400" />
              <span>Evidence Found</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {discoveredCount} / {totalClues}
              <span className="text-xs text-emerald-400 font-normal ml-2">
                (+{discoveredCount * 5} pts)
              </span>
            </div>
          </div>

          <div className="bg-[#08090C] p-3.5 rounded-xl border border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Hints Available</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {remainingHints} / {maxHints}
              {caseData.hintsUsed > 0 && (
                <span className="text-xs text-red-400 font-normal ml-2">
                  (-{caseData.hintsUsed * 10} pts)
                </span>
              )}
            </div>
          </div>

          <div className="bg-[#08090C] p-3.5 rounded-xl border border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Suspect Roster</span>
            </div>
            <div className="text-xl font-bold text-white font-mono">
              {caseData.suspects?.length || 0} Persons
            </div>
          </div>

          <div className="bg-[#08090C] p-3.5 rounded-xl border border-amber-500/25">
            <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Verdict Status</span>
            </div>
            <div className="text-sm font-bold text-amber-300 tracking-wide mt-1">
              SEALED IN VAULT
            </div>
          </div>
        </div>
      </div>

      {/* Case Dossier / Story Accordion */}
      <div className="bg-[#17191F] rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={() => setIsStoryExpanded(!isStoryExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between text-left bg-[#101216] hover:bg-[#141620] border-b border-neutral-800 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Case Briefing & Crime Scene Incident Report
            </h2>
          </div>
          <span className="text-neutral-400">
            {isStoryExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </span>
        </button>

        {isStoryExpanded && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="bg-[#08090C] p-4 rounded-xl border border-neutral-800 text-xs text-amber-300/90 font-mono">
              PREMISE SUMMARY: "{caseData.premise}"
            </div>
            <div className="text-sm text-neutral-300 leading-relaxed space-y-3 whitespace-pre-line">
              {caseData.story}
            </div>
          </div>
        )}
      </div>

      {/* Progressive Hints Bureau */}
      <div className="bg-[#17191F] p-6 sm:p-8 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">Bureau Hint Dispatch</h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Need guidance? Request progressive insights. Each unlocked hint deducts 10 points upon accusation.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRequestHint}
            loading={requestingHint}
            disabled={remainingHints === 0}
            icon={HelpCircle}
          >
            {remainingHints > 0 ? `Unlock Next Hint (${remainingHints} left)` : 'No Hints Remaining'}
          </Button>
        </div>

        {hintMessage && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{hintMessage}</span>
          </div>
        )}

        {/* Unlocked Hints List */}
        {caseData.hints && caseData.hints.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {caseData.hints.map((hintText, idx) => (
              <div
                key={idx}
                className="bg-[#08090C] p-4 rounded-xl border border-amber-500/25 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hint #{idx + 1}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">{hintText}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-500 italic py-2">
            No hints requested yet. Rely on your raw deductive reasoning to maximize your final score!
          </p>
        )}
      </div>

      {/* Suspects Roster Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Suspects Under Investigation
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Cross-reference motives and alibis against physical clues to locate logical contradictions.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            {caseData.suspects?.length} Suspects Logged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseData.suspects?.map((suspect) => (
            <SuspectCard
              key={suspect.id}
              suspect={suspect}
              onAccuse={handleOpenAccuseModal}
            />
          ))}
        </div>
      </section>

      {/* Clues & Physical Evidence Board */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSearch className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white tracking-wide">
                Forensic Clues & Evidence Board
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Inspect classified evidence to unseal details. Each discovered clue contributes +5 bonus points.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            {discoveredCount} of {totalClues} Discovered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseData.clues?.map((clue) => (
            <ClueCard
              key={clue.id}
              clue={clue}
              onDiscover={handleDiscoverClue}
              isDiscovering={discoveringClueId === clue.id}
            />
          ))}
        </div>
      </section>

      {/* Bottom Floating Accusation Bar */}
      <div className="sticky bottom-6 z-40 bg-[#101216]/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-[0_0_35px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            Ready to close the investigation?
          </span>
          <p className="text-xs text-neutral-300">
            Review all discovered evidence before submitting your final accusation.
          </p>
        </div>
        <Button
          variant="danger"
          size="lg"
          onClick={() => handleOpenAccuseModal()}
          icon={ShieldAlert}
          className="w-full sm:w-auto px-8"
        >
          Submit Official Accusation
        </Button>
      </div>

      {/* Accusation Confirmation Modal */}
      {isAccuseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#17191F] border border-red-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.25)] relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-6 pb-4 border-b border-neutral-800">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white tracking-wide">
                  Official Bureau Accusation
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Select the primary suspect responsible for this crime. You cannot change your accusation once submitted.
                </p>
              </div>
            </div>

            {/* Warning Callout */}
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Crucial Warning:</span>
                <span>
                  A correct accusation earns your full calculated score. An incorrect accusation yields 0 points and case closure.
                </span>
              </div>
            </div>

            {accusationError && (
              <div className="p-3 rounded-lg bg-red-900/40 border border-red-500 text-red-200 text-xs mb-4">
                {accusationError}
              </div>
            )}

            {/* Suspect Selection Radio Cards */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
                Choose Suspect:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {caseData.suspects?.map((suspect) => (
                  <div
                    key={suspect.id}
                    onClick={() => setSelectedSuspectId(suspect.id)}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      selectedSuspectId === suspect.id
                        ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'bg-[#08090C] border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{suspect.name}</span>
                      <span className="text-[10px] font-mono text-neutral-500 uppercase">
                        {suspect.id}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 line-clamp-2">{suspect.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsAccuseModalOpen(false)}
                disabled={submittingAccusation}
                className="w-full sm:w-auto"
              >
                Cancel & Review Clues
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={handleSubmitAccusation}
                loading={submittingAccusation}
                disabled={!selectedSuspectId}
                icon={ShieldAlert}
                className="w-full sm:w-auto px-6"
              >
                Confirm Accusation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
